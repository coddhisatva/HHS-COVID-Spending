'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
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

// Create a component that will only run on the client side
function USMapChart({ width = 800, height = 500 }: USMapChartProps) {
  const { state } = useData();
  // Use stateData as a fallback if mapData doesn't exist
  const stateData = state.chartData.stateData || [];
  const mapData: StateData[] = state.chartData.mapData || 
    // Transform stateData to match mapData structure if necessary
    stateData.map(item => ({
      stateAbbr: item.state,
      stateName: '',
      allocations: item.amount,
      deallocations: 0
    }));
  
  const mapRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [usTopoJSON, setUsTopoJSON] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  
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
  }, [loading, usTopoJSON, mapData]);
  
  const drawMap = () => {
    if (!mapRef.current || !usTopoJSON) return;
    
    const svg = d3.select(mapRef.current);
    svg.selectAll('*').remove();
    
    try {
      // Convert TopoJSON to GeoJSON
      const us = feature(usTopoJSON, usTopoJSON.objects.states) as GeoPermissibleObjects;
      
      // Create a projection and path generator
      const projection = d3.geoAlbersUsa()
        .fitSize([width, height], us);
      
      const path = d3.geoPath()
        .projection(projection);
      
      // Calculate the maximum allocation for color scale
      const maxAllocation = d3.max(mapData, (d: StateData) => d.allocations) || 0;
      
      // Create a color scale
      const colorScale = d3.scaleLinear<string>()
        .domain([0, maxAllocation])
        .range(['#e5f5e0', '#31a354']);
      
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
            : '#f0f0f0';
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
    } catch (err) {
      console.error('Error drawing map:', err);
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Loading map...</p>
      </div>
    );
  }
  
  return (
    <div className="relative h-full">
      <h2 className="text-lg font-medium mb-4">Geographic Distribution</h2>
      <div className="h-80 relative">
        <svg 
          ref={mapRef} 
          width="100%" 
          height="100%" 
          viewBox={`0 0 ${width} ${height}`} 
          preserveAspectRatio="xMidYMid meet"
        />
        <div 
          ref={tooltipRef} 
          className="absolute hidden bg-white p-2 rounded shadow-md border border-gray-200 z-10"
          style={{ display: 'none' }}
        />
      </div>
      
      {hoveredState && (
        <div className="text-center mt-2 text-sm text-gray-600">
          {hoveredState}
        </div>
      )}
    </div>
  );
}

// Use dynamic import only for the whole component
export default dynamic(() => Promise.resolve(USMapChart), { ssr: false }); 