import { useEffect, useRef } from "react";
import * as d3 from 'd3';
import './violinPlot.scss';

export default function ViolinPlot({ data, dimensions }) {
    const svgRef = useRef(null);
    const { width, height, margin } = dimensions;
    const svgWidth = width + margin.left + margin.right;
    const svgHeight = height + margin.top + margin.bottom;

    useEffect(() => {
        const svgRefElement = d3.select(svgRef.current);
        svgRefElement.selectAll("*").remove()   //clear svg content before (re)drawing
        
        if(data == null) return;

        let xScale = d3.scaleLinear()
        .domain(d3.extent(data.map(d => d.bin)))
        .range([0, width])

        let yScale = d3.scaleLinear()
        .domain(d3.extent(data.map(d => d.count)))
        .range([0, height / 2])

        const svg = svgRefElement
        .append("g")
        .attr('class', 'violin')
        .attr("transform", `translate(${margin.left},${margin.top})`);

        let line = d3.line()
        .curve(d3.curveBasis)
        .x(d => xScale(d.bin))

        let container_g = svg.append('g')
        .attr('class', 'violinContainer')
        .attr('transform', `translate(0,${height / 2})`)
        
        container_g.append('path')
        .datum(data)
        .attr('class', 'bottom band')
        .attr('d', line.y(d => yScale(d.count)))

        container_g.append('path')
        .datum(data)
        .attr('class', 'top band')
        .attr('d', line.y(d => -yScale(d.count)))

        // container_g.selectAll('.bottom')
        // .data(data)
        // .enter()
        // .append('rect')
        // .attr('class', 'bottom bar')
        // .attr('x', d => xScale(d.bin))
        // .attr('y', 0)
        // .attr('width', width / data.length)
        // .attr('height', d => yScale(d.count))

        // container_g.selectAll('.top')
        // .data(data)
        // .enter()
        // .append('rect')
        // .attr('class', 'top bar')
        // .attr('x', d => xScale(d.bin))
        // .attr('y', d => 0 - yScale(d.count))
        // .attr('width', width / data.length)
        // .attr('height', d => yScale(d.count))

    }, [data])
    

    return (
        <svg ref={svgRef} width={svgWidth} height={svgHeight} id="violinPlot"/>
    )
}
