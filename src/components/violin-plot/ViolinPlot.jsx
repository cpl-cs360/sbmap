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

        let xAxis = d3.axisBottom(xScale)

        let yScale = d3.scaleLinear()
        .domain(d3.extent(data.map(d => d.count)))
        .range([0, height / 2])

        const svg = svgRefElement
        .append("g")
        .attr('class', 'violin')
        .attr("transform", `translate(${margin.left},${margin.top})`);

        let line = d3.area()
        .curve(d3.curveBasis)
        .x(d => xScale(d.bin))
        .y0(d => yScale(d.count))
        .y1(d => -yScale(d.count))

        let container_g = svg.append('g')
        .attr('class', 'violinContainer')
        .attr('transform', `translate(0,${height / 2})`)
        
        container_g.append('path')
        .datum(data)
        .attr('class', 'band')
        .attr('d',line)

        svg.append('g')
        .attr('transform', `translate(0, ${height})`)
        .call(xAxis)

        // sun
        let sun_g = svg.append('g')
        .attr('class', 'sun')
        .attr('transform', `translate(0,${height / 2})`)

        sun_g.append('circle')
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('r', 50)
        
        sun_g
        .append('text')
        .attr('x', 40)
        .attr('y', -40)
        .text("Sun")
        
        // mars
        let mars_g = svg.append('g')
        .attr('class', 'mars')
        .attr('transform', `translate(${xScale(1.524)},0)`)

        mars_g.append('line')
        .attr('x1', 0)
        .attr('y1', 60)
        .attr('x2', 0)
        .attr('y2', height - 20)

        mars_g.append('text')
        .attr('text-anchor', 'middle')
        .attr('x', 0)
        .attr('y', 45)
        .text('Mars')

        // jupiter
        let jupiter_g = svg.append('g')
        .attr('class', 'jupiter')
        .attr('transform', `translate(${xScale(5.2)},0)`)

        jupiter_g.append('line')
        .attr('x1', 0)
        .attr('y1', 60)
        .attr('x2', 0)
        .attr('y2', height - 20)

        jupiter_g.append('text')
        .attr('text-anchor', 'middle')
        .attr('x', 0)
        .attr('y', 45)
        .text('Jupiter')

        mars_g.lower()
        jupiter_g.lower()
        

    }, [data])
    

    return (
        <svg ref={svgRef} viewBox={`0 0 ${svgWidth} ${svgHeight}`} id="violinPlot"/>
    )
}
