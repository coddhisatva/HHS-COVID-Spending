'use client';

import { useEffect, useRef, useState } from 'react';
import { feature } from 'topojson-client';
import { formatCurrency } from '@/utils/formatters';
import { useData } from '@/context/DataContext';
import * as d3 from 'd3';

// Only import the types from d3-geo for type checking
import type { GeoPermissibleObjects } from 'd3-geo';

interface USMapChartProps {
  width?: number;
  height?: number;
}

interface StateData {
  stateAbbr: string;
  stateName: string;
  allocations: number;
  deallocations: number;
}

export default function USMapChart({ width = 900, height = 500 }: USMapChartProps) {
  const { state } = useData();
  // Use stateData as a fallback if mapData doesn't exist
  const stateData = state.chartData?.stateData || [];
  const mapData: StateData[] = state.chartData?.mapData || 
    // Transform stateData to match mapData structure if necessary
    stateData.map(item => ({
      stateAbbr: item.state,
      stateName: '',
      allocations: item.amount,
      deallocations: 0
    }));
  
  const mapRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [usTopoJSON, setUsTopoJSON] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState({ width: 900, height: 500 });
  
  // Handle resize to make the map responsive
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const { width } = containerRef.current.getBoundingClientRect();
        // Maintain aspect ratio
        setDimensions({
          width: width,
          height: width * 0.55 // Maintain approximate US map aspect ratio
        });
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize(); // Call once to set initial size
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Load US map TopoJSON data
  useEffect(() => {
    setLoading(true);
    
    fetch('/us-states.json')
      .then(response => response.json())
      .then(data => {
        setUsTopoJSON(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading US TopoJSON data:', error);
        setLoading(false);
      });
  }, []);
  
  // Draw the map when all data is ready
  useEffect(() => {
    if (!loading && usTopoJSON && mapRef.current) {
      drawMap();
    }
  }, [loading, usTopoJSON, mapData, dimensions]);
  
  const drawMap = () => {
    if (!mapRef.current || !usTopoJSON) return;
    
    const svg = d3.select(mapRef.current);
    svg.selectAll('*').remove();
    
    try {
      // Convert TopoJSON to GeoJSON
      const us = feature(usTopoJSON, usTopoJSON.objects.states) as GeoPermissibleObjects;
      
      // Create a projection and path generator
      const projection = d3.geoAlbersUsa()
        .fitSize([dimensions.width, dimensions.height], us);
      
      const path = d3.geoPath()
        .projection(projection);
      
      // Calculate the maximum allocation for color scale
      const maxAllocation = d3.max(mapData, (d: StateData) => d.allocations) || 0;
      
      // Create a color scale - using blue shades which look more professional
      const colorScale = d3.scaleLinear<string>()
        .domain([0, maxAllocation / 2, maxAllocation])
        .range(['#e0f2fe', '#60a5fa', '#2563eb']);
      
      // Create a group for the states
      const g = svg.append('g');
      
      // Add state paths to the map
      g.selectAll('path')
        .data((us as any).features)
        .enter()
        .append('path')
        .attr('d', path as any)
        .attr('fill', (d: any) => {
          const stateData = mapData.find((state: StateData) => 
            state.stateAbbr === d.properties.abbr ||
            state.stateName === d.properties.name
          );
          return stateData 
            ? colorScale(stateData.allocations) 
            : '#f1f5f9';
        })
        .attr('stroke', '#fff')
        .attr('stroke-width', 0.5)
        .attr('cursor', 'pointer')
        .on('mouseover', function(event: any, d: any) {
          const stateData = mapData.find((state: StateData) => 
            state.stateAbbr === d.properties.abbr ||
            state.stateName === d.properties.name
          );
          
          setHoveredState(d.properties.name);
          
          if (tooltipRef.current) {
            const tooltip = tooltipRef.current;
            tooltip.style.display = 'block';
            tooltip.style.left = `${event.pageX + 10}px`;
            tooltip.style.top = `${event.pageY - 30}px`;
            
            tooltip.innerHTML = `
              <div class="font-semibold">${d.properties.name}</div>
              <div>Allocations: ${formatCurrency(stateData?.allocations || 0)}</div>
              <div>Deallocations: ${formatCurrency(stateData?.deallocations || 0)}</div>
              <div>Net: ${formatCurrency((stateData?.allocations || 0) - (stateData?.deallocations || 0))}</div>
            `;
          }
          
          d3.select(this)
            .attr('stroke', '#000')
            .attr('stroke-width', 1.5);
        })
        .on('mousemove', function(event: any) {
          if (tooltipRef.current) {
            tooltipRef.current.style.left = `${event.pageX + 10}px`;
            tooltipRef.current.style.top = `${event.pageY - 30}px`;
          }
        })
        .on('mouseout', function() {
          setHoveredState(null);
          
          if (tooltipRef.current) {
            tooltipRef.current.style.display = 'none';
          }
          
          d3.select(this)
            .attr('stroke', '#fff')
            .attr('stroke-width', 0.5);
        });
        
      // Add a legend
      const legendWidth = 200;
      const legendHeight = 15;
      const legendX = dimensions.width - legendWidth - 20;
      const legendY = dimensions.height - 30;
      
      const legend = svg.append('g')
        .attr('transform', `translate(${legendX}, ${legendY})`);
      
      // Create gradient for legend
      const legendGradient = legend.append('defs')
        .append('linearGradient')
        .attr('id', 'legend-gradient')
        .attr('x1', '0%')
        .attr('y1', '0%')
        .attr('x2', '100%')
        .attr('y2', '0%');
        
      legendGradient.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', colorScale(0));
        
      legendGradient.append('stop')
        .attr('offset', '50%')
        .attr('stop-color', colorScale(maxAllocation / 2));
        
      legendGradient.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', colorScale(maxAllocation));
      
      // Draw legend rectangle
      legend.append('rect')
        .attr('width', legendWidth)
        .attr('height', legendHeight)
        .style('fill', 'url(#legend-gradient)')
        .style('stroke', '#ccc')
        .style('stroke-width', 0.5);
      
      // Add legend labels
      legend.append('text')
        .attr('x', 0)
        .attr('y', -5)
        .style('text-anchor', 'start')
        .style('font-size', '10px')
        .style('fill', '#666')
        .text('$0');
      
      legend.append('text')
        .attr('x', legendWidth)
        .attr('y', -5)
        .style('text-anchor', 'end')
        .style('font-size', '10px')
        .style('fill', '#666')
        .text(formatCurrency(maxAllocation));
        
      legend.append('text')
        .attr('x', legendWidth / 2)
        .attr('y', -5)
        .style('text-anchor', 'middle')
        .style('font-size', '10px')
        .style('fill', '#666')
        .text(formatCurrency(maxAllocation / 2));
        
      // Add legend title
      legend.append('text')
        .attr('x', legendWidth / 2)
        .attr('y', -20)
        .style('text-anchor', 'middle')
        .style('font-size', '12px')
        .style('font-weight', 'bold')
        .style('fill', '#444')
        .text('Allocation Amount');
    } catch (err) {
      console.error('Error drawing map:', err);
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading map data...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="relative h-full" ref={containerRef}>
      <h2 className="text-xl font-medium mb-4 text-gray-800 flex items-center">
        <span className="inline-flex w-5 h-5 mr-2 text-blue-600">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
        </span>
        Geographic Distribution
      </h2>
      <div className="h-[400px] md:h-[500px] relative">
        <svg 
          ref={mapRef} 
          width={dimensions.width} 
          height={dimensions.height} 
          viewBox={`0 0 ${dimensions.width} ${dimensions.height}`} 
          preserveAspectRatio="xMidYMid meet"
          className="mx-auto"
        />
        <div 
          ref={tooltipRef} 
          className="absolute hidden z-10 bg-white p-3 rounded-md shadow-lg border border-gray-200 text-sm"
          style={{ display: 'none' }}
        />
      </div>
      
      {hoveredState && (
        <div className="text-center mt-2 text-sm text-gray-600 font-medium">
          {hoveredState}
        </div>
      )}
    </div>
  );
} 