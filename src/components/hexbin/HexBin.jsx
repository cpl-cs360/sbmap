import React, { useRef, useEffect } from 'react'
import * as d3 from 'd3';
import './hexBin.scss'
import { GridLoader } from 'react-spinners';

export default function HexBin({ data, dimensions }) {
    const svgRef = useRef(null);
    const { width, height, margin } = dimensions;
    const svgWidth = width + margin.left + margin.right;
    const svgHeight = height + margin.top + margin.bottom;

    //useEffect to handle D3 related side-effects (like DOM manipulation)
    useEffect(() => {

        // guard for initial render before csv has been parsed
        if(data == null) return;


        const svgRefElement = d3.select(svgRef.current);
        svgRefElement.selectAll("*").remove()   //clear svg content before (re)drawing
        
        const maxCount = d3.max(data.map(d => d.count));
        const colorScale = d3.interpolateInferno;

        const svg = svgRefElement
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);
        
        svg.selectAll('circle')
            .data(data)
            .enter()
            .append('polygon')
            .attr('class', 'hex')
            .attr('points', d => {
                // given a radius of 4 pixels, a hexagon can be thought of as a function of its 30 60 90 triangle
                // if b = 4, then a = b / root3, and c = 2a
                let b = 4;
                let a = b / Math.sqrt(3);
                let c = 2 * a;
                let y = height - d.y;
                return [
                    { x: d.x + b, y: y + a},      // top right
                    { x: d.x + b, y: y - a},      // bottom right
                    { x: d.x, y: y - c},          // bottom center
                    { x: d.x - b, y: y - a},      // bottom left
                    { x: d.x - b, y: y + a},      // top left
                    { x: d.x, y: y + c},          // top center
                ].map(p => `${ p.x }, ${ p.y }`).join(' ')
            })
            .attr('fill', d => colorScale(Math.log(d.count) / Math.log(maxCount)));
            
    }, [data]); //redraw chart when data changes
    
    return (
            
        <div className='wrapper'>
            { data ?
                <svg ref={svgRef} width={svgWidth} height={svgHeight} className="hexBin"/> :
                <GridLoader color={'#EEE'} />
            }
            
        </div>
        
        
    )
}
