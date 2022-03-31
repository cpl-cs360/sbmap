import React, { useRef, useEffect } from 'react'
import * as d3 from 'd3';
import './hexBin.scss'
import { GridLoader } from 'react-spinners';

export default function HexBin({ hexData, orbitData, dimensions }) {
    const svgRef = useRef(null);
    const { width, height, margin } = dimensions;
    const svgWidth = width + margin.left + margin.right;
    const svgHeight = height + margin.top + margin.bottom;

    //useEffect to handle D3 related side-effects (like DOM manipulation)
    useEffect(() => {

        // guard for initial render before csv has been parsed
        if(hexData == null || orbitData == null) return;

        
        const svgRefElement = d3.select(svgRef.current);
        svgRefElement.selectAll("*").remove()   //clear svg content before (re)drawing
        
        const maxCount = d3.max(hexData.map(d => d.count));
        const colorScale = d3.interpolateInferno;
        
        const svg = svgRefElement
        .append("g")
        .attr('class', 'hexbin')
        .attr("transform", `translate(${margin.left},${margin.top})`);
        
        svg.selectAll('.hex')
        .data(hexData)
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
        .attr('fill', d => colorScale(Math.log(d.count) / Math.log(maxCount)))
        .on('mouseover', hover)
        .on('mouseout', exit)

        function drawEllipses(ids) {
            svg.selectAll('.orbit')
            .data(orbitData.filter(d => {
                for(let id of ids) {
                    if(d.id === id) {
                        return true
                    }
                }
                return false
            }))
            .enter()
            .append('ellipse')
            .attr('class', 'orbit')
            .attr('cy', 500)
            .attr('cx', d => 500 - d.c)
            .attr('rx', d => d.a)
            .attr('ry', d => d.b)
            .attr('id', d => d.id)
            .attr('transform', d => `rotate(-${d.w} 500 500)`)
            .attr('stroke', '#EEE')
            .attr('fill', 'none')
            .attr('opacity', 1 / ids.length + 0.25)
            .style('pointer-events', 'none')
        }

        function hover(elem) {
            let ids = (d3.select(this).data())[0].ids

            if(ids.length === 0) return;

            drawEllipses(ids);
        }
        function exit(elem) {
            d3.selectAll('.orbit').remove()
        }

        // function hover(elem) {
        //     let ids = (d3.select(this).data())[0].ids
        //     let filteredOrbits = d3.selectAll('.orbit').filter(d => ids.includes(d.id))
        //     filteredOrbits.attr('visibility', 'visibile')
        //     filteredOrbits.style('opacity', 1 / ids.length + 0.25)
        // }
        // function exit(elem) {
        //     let ids = (d3.select(this).data())[0].ids
        //     let filteredOrbits = d3.selectAll('.orbit').filter(d => ids.includes(d.id))
        //     filteredOrbits.attr('visibility', 'hidden')
        // }

    }, [hexData, orbitData]); //redraw chart when data changes
    
    return (
        <div className="hexBin">
            <div className="hexWrapper">
                {/* <div className="leftWrapper">
                    <h1>A bird's eye view</h1>
                    <p>To the right you will see the orbital paths of roughly 1.2 million asteroids in our solar system aggregated into hexagonal bins.</p>
                </div> */}
                <div className="svgWrapper">
                    { hexData || orbitData ?
                        <svg ref={svgRef} width={svgWidth} height={svgHeight} id="hexBin"/> :
                        <GridLoader color={'#EEE'} />
                    }
                </div>
            </div>
        </div>
    )
}
