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
  const [error, setError] = useState<string | null>(null);
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState({ width: 500, height: 300 });
  
  // Handle resize to make the map responsive
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const { width } = containerRef.current.getBoundingClientRect();
        // Maintain aspect ratio
        setDimensions({
          width: width - 20, // Padding
          height: (width - 20) * 0.6 // Maintain approximate US map aspect ratio
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
    setError(null);
    
    fetch('/us-states.json')
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to load map data: ${response.status} ${response.statusText}`);
        }
        return response.json();
      })
      .then(data => {
        setUsTopoJSON(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading US TopoJSON data:', error);
        setError(error.message || 'Failed to load map data');
        setLoading(false);
      });
  }, []);
  
  // Draw the map when all data is ready
  useEffect(() => {
    if (!loading && !error && usTopoJSON && mapRef.current) {
      drawMap();
    }
  }, [loading, error, usTopoJSON, mapData, dimensions]);
  
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
      setError('Failed to render map');
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 bg-blue-50 rounded-lg">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading map data...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex items-center justify-center h-64 bg-red-50 rounded-lg border border-red-200">
        <div className="text-center max-w-md px-4">
          <p className="text-red-500 font-medium mb-2">Error loading map</p>
          <p className="text-gray-600 text-sm">{error}</p>
          <p className="text-gray-500 text-xs mt-4">
            Please ensure the map data file (us-states.json) is available in the public folder
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="h-full" ref={containerRef}>
      <h2 className="text-xl font-medium mb-3 text-gray-800 border-b pb-2">
        Geographic Distribution
      </h2>
      <div className="relative">
        <svg 
          ref={mapRef} 
          width={dimensions.width} 
          height={dimensions.height} 
          viewBox={`0 0 ${dimensions.width} ${dimensions.height}`} 
          preserveAspectRatio="xMidYMid meet"
          className="bg-blue-50/30 rounded"
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