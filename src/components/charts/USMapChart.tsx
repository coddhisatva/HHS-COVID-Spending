'use client';

import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { feature, mesh } from 'topojson-client';
import { useData } from '@/context/DataContext';
import { formatCurrency } from '@/utils/formatters';
import { GeometryCollection, Topology } from 'topojson-specification';

const US_STATES_URL = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json';

// Component to display a tooltip
const Tooltip = ({ x, y, content }: { x: number; y: number; content: React.ReactNode }) => {
  return (
    <div
      className="absolute bg-white p-2 shadow-md rounded border border-gray-200 z-10 pointer-events-none"
      style={{
        left: `${x + 10}px`,
        top: `${y - 40}px`,
        transform: 'translate(-50%, -100%)',
        minWidth: '150px',
      }}
    >
      {content}
    </div>
  );
};

interface StateData {
  state: string;
  amount: number;
}

interface StateProperties {
  name: string;
  code: string;
  [key: string]: any;
}

interface StateFeature {
  type: string;
  id: number;
  properties: StateProperties;
  geometry: any;
}

export default function USMapChart() {
  const { state, dispatch } = useData();
  const { chartData } = state;
  const svgRef = useRef<SVGSVGElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const [tooltipContent, setTooltipContent] = useState<React.ReactNode | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [selectedState, setSelectedState] = useState<string | null>(null);
  
  // Load and render US map
  useEffect(() => {
    const svg = d3.select(svgRef.current);
    
    // Clear any existing content
    svg.selectAll('*').remove();
    
    // Create a color scale for the map
    const colorScale = d3.scaleSequential(d3.interpolateBlues)
      .domain([0, d3.max(chartData.stateData, d => d.amount) || 0]);
    
    const width = svgRef.current?.clientWidth || 600;
    const height = svgRef.current?.clientHeight || 400;
    
    // Create a projection
    const projection = d3.geoAlbersUsa()
      .translate([width / 2, height / 2])
      .scale(width);
    
    // Create a path generator
    const path = d3.geoPath().projection(projection);
    
    // Create a group for the map
    const mapGroup = svg.append('g');
    
    // Function to handle state hover/click
    const handleStateMouseOver = (event: MouseEvent, d: StateFeature) => {
      const stateData = chartData.stateData.find(sd => sd.state === d.properties.code);
      
      if (stateData) {
        setTooltipContent(
          <div>
            <p className="font-semibold">{d.properties.name}</p>
            <p>{formatCurrency(stateData.amount)}</p>
          </div>
        );
        setTooltipPos({ x: event.pageX, y: event.pageY });
      }
    };
    
    const handleStateMouseOut = () => {
      setTooltipContent(null);
    };
    
    const handleStateClick = (event: MouseEvent, d: StateFeature) => {
      const stateCode = d.properties.code;
      
      // Toggle selection
      if (selectedState === stateCode) {
        setSelectedState(null);
        dispatch({
          type: 'SET_FILTER',
          payload: { selectedState: null }
        });
      } else {
        setSelectedState(stateCode);
        dispatch({
          type: 'SET_FILTER',
          payload: { selectedState: stateCode }
        });
      }
    };
    
    // Fetch and render US states
    d3.json<Topology>(US_STATES_URL).then((us) => {
      if (!us) return;
      
      // Type assertion to help TypeScript understand the structure
      const statesObject = us.objects.states as GeometryCollection;
      const states = feature(us, statesObject);
      
      // Add state properties
      states.features.forEach((state: any) => {
        const geometries = statesObject.geometries;
        const stateGeom = geometries.find((s) => s.id === state.id);
        
        // Use type assertion to access properties object safely
        const stateProps = stateGeom?.properties as Record<string, string> || {};
        const stateName = stateProps.name;
        const stateCode = stateProps.code;
        
        state.properties = {
          ...state.properties,
          name: stateName,
          code: stateCode
        };
      });
      
      // Draw states
      mapGroup
        .selectAll('path')
        .data(states.features as StateFeature[])
        .enter()
        .append('path')
        .attr('d', path as any)
        .attr('fill', (d: StateFeature) => {
          const stateData = chartData.stateData.find(sd => sd.state === d.properties.code);
          return stateData ? colorScale(stateData.amount) : '#eee';
        })
        .attr('stroke', '#fff')
        .attr('stroke-width', 0.5)
        .attr('class', 'cursor-pointer hover:opacity-80')
        .attr('data-state', (d: StateFeature) => d.properties.code)
        .on('mouseover', function(event, d) {
          handleStateMouseOver(event, d);
          d3.select(this).attr('stroke-width', 1.5);
        })
        .on('mouseout', function() {
          handleStateMouseOut();
          d3.select(this).attr('stroke-width', 0.5);
        })
        .on('click', handleStateClick);
      
      // Add state borders
      mapGroup.append('path')
        .datum(mesh(us, statesObject, (a, b) => a !== b))
        .attr('fill', 'none')
        .attr('stroke', '#fff')
        .attr('stroke-width', 0.5)
        .attr('d', path as any);
    });
    
    // Add legend
    const legend = svg.append('g')
      .attr('transform', `translate(20, ${height - 70})`);
    
    const legendTitle = legend.append('text')
      .attr('class', 'text-sm font-medium text-gray-700')
      .attr('x', 0)
      .attr('y', -10)
      .text('Funding Amount');
    
    const legendWidth = 200;
    const legendHeight = 10;
    
    // Create gradient for legend
    const defs = svg.append('defs');
    const linearGradient = defs.append('linearGradient')
      .attr('id', 'legend-gradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '100%')
      .attr('y2', '0%');
    
    // Add color stops
    linearGradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', colorScale(0));
    
    linearGradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', colorScale(d3.max(chartData.stateData, d => d.amount) || 0));
    
    // Draw legend rectangle
    legend.append('rect')
      .attr('width', legendWidth)
      .attr('height', legendHeight)
      .style('fill', 'url(#legend-gradient)');
    
    // Add legend ticks
    const legendScale = d3.scaleLinear()
      .domain([0, d3.max(chartData.stateData, d => d.amount) || 0])
      .range([0, legendWidth]);
    
    const legendAxis = d3.axisBottom(legendScale)
      .ticks(3)
      .tickFormat(d => formatCurrency(d as number));
    
    legend.append('g')
      .attr('transform', `translate(0, ${legendHeight})`)
      .call(legendAxis)
      .attr('font-size', '10px');
    
    // Cleanup
    return () => {
      svg.selectAll('*').remove();
    };
  }, [chartData.stateData, dispatch, selectedState]);
  
  return (
    <div className="relative h-full">
      <h2 className="text-lg font-medium mb-4">Geographic Distribution</h2>
      <div className="h-96 relative border border-gray-200 rounded-lg overflow-hidden bg-sky-50">
        <svg ref={svgRef} width="100%" height="100%" />
        {tooltipContent && (
          <Tooltip x={tooltipPos.x} y={tooltipPos.y} content={tooltipContent} />
        )}
      </div>
    </div>
  );
} 