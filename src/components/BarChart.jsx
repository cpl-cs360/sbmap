import React, { useRef, useEffect } from 'react'
import * as d3 from 'd3';
import "./barChart.scss";

export default function BarChart({ data, dimensions }) {
    const svgRef = useRef(null);
    const { width, height, margin } = dimensions;
    const svgWidth = width + margin.left + margin.right;
    const svgHeight = height + margin.top + margin.bottom;

    //useEffect to handle D3 related side-effects (like DOM manipulation)
    useEffect(() => {
        const svgRefElement = d3.select(svgRef.current);
        svgRefElement.selectAll("*").remove()   //clear svg content before (re)drawing
        
        const colorScale = d3.interpolateInferno;

        const svg = svgRefElement
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);
        
        svg.selectAll(".circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("r", 10)
            .attr("cx", d => 20 + d * 20)
            .attr("cy", 100)
            .attr("fill", "white");
            

    }, [data]); //redraw chart when data changes
    
    return (
        <svg ref={svgRef} width={svgWidth} height={svgHeight} className="barChart"/>
    )
}
