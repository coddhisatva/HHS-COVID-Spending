'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { feature } from 'topojson-client';
import { formatCurrency } from '@/utils/formatters';
import { useData } from '@/context/DataContext';

// Only import the types from d3 
import type { GeoPermissibleObjects } from 'd3-geo';

// Dynamic imports for D3 modules
const d3 = {
  select: null,
  geoPath: null,
  geoAlbersUsa: null,
  scaleLinear: null,
  max: null
};

interface USMapChartProps {
  width?: number;
  height?: number;
}

// Create a component that will only run on the client side
function USMapChart({ width = 800, height = 500 }: USMapChartProps) {
  const { state } = useData();
  const { mapData } = state;
  const mapRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [usTopoJSON, setUsTopoJSON] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  
  // Load D3 modules on client side only
  useEffect(() => {
    Promise.all([
      import('d3-selection').then(module => { d3.select = module.select }),
      import('d3-geo').then(module => {
        d3.geoPath = module.geoPath;
        d3.geoAlbersUsa = module.geoAlbersUsa;
      }),
      import('d3-scale').then(module => { d3.scaleLinear = module.scaleLinear }),
      import('d3-array').then(module => { d3.max = module.max }),
    ]).then(() => {
      setLoading(false);
    });
  }, []);
  
  // Load US map TopoJSON data
  useEffect(() => {
    fetch('/us-states.json')
      .then(response => response.json())
      .then(data => {
        setUsTopoJSON(data);
      })
      .catch(error => {
        console.error('Error loading US TopoJSON data:', error);
      });
  }, []);
  
  // Draw the map when all data is ready
  useEffect(() => {
    if (!loading && usTopoJSON && d3.select && mapRef.current) {
      drawMap();
    }
  }, [loading, usTopoJSON, mapData]);
  
  const drawMap = () => {
    if (!mapRef.current || !d3.select || !usTopoJSON) return;
    
    const svg = d3.select(mapRef.current);
    svg.selectAll('*').remove();
    
    // Convert TopoJSON to GeoJSON
    const us = feature(usTopoJSON, usTopoJSON.objects.states) as GeoPermissibleObjects;
    
    // Create a projection and path generator
    const projection = d3.geoAlbersUsa()
      .fitSize([width, height], us);
    
    const path = d3.geoPath()
      .projection(projection);
    
    // Calculate the maximum allocation for color scale
    const maxAllocation = d3.max(mapData, (d: any) => d.allocations) || 0;
    
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
        const stateData = mapData.find((state: any) => 
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
      .on('mouseover', function(event: MouseEvent, d: any) {
        const stateData = mapData.find((state: any) => 
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
      .on('mousemove', function(event: MouseEvent) {
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

// Export a dynamically loaded component with SSR disabled
export default dynamic(() => Promise.resolve(USMapChart), { ssr: false }); 