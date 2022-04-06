import React, { useRef, useEffect } from 'react'
import * as d3 from 'd3';
import './hexBin.scss'
import { GridLoader } from 'react-spinners';

export default function HexBin({ hexData, orbitData, dimensions }) {
    const svgRef = useRef(null);
    const { width, height, margin } = dimensions;
    
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
        

        function getHex(d, r) {
            // given a radius of 4 pixels, a hexagon can be thought of as a function of its 30 60 90 triangle
            // if b = 4, then a = b / root3, and c = 2a
            let b = r;
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
        }

        svg.selectAll('.hex')
        .data(hexData)
        .enter()
        .append('polygon')
        .attr('class', 'hex')
        .attr('points', d => getHex(d, 4))
        .attr('fill', d => colorScale(Math.log(d.count) / Math.log(maxCount)))
        .on('mouseover', hover)
        .on('mouseout', exit)

        function drawEllipses(ids) {
            let orbits = svg.selectAll('.orbit')
            .data(orbitData.filter(d => {
                for(let id of ids) {
                    if(d.id === id) {
                        return true
                    }
                }
                return false
            }))

            // if more orbits to add, append
            orbits.enter()
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
            .style('pointer-events', 'none')
            .attr('opacity', 0)
                .transition()
                .delay(1000)
                .duration(300)
                .attr('opacity', 1 / ids.length + (ids.length > 15 ? 0.4 : 0.6));
            
            // if less orbits, remove them
            orbits.exit()
            .remove();
        }

        function hover(elem) {
            let ids = (d3.select(this).data())[0].ids

            // grab hovered hex
            let hex = d3.select(this);

            // move to front
            hex.raise();
            
            // update stroke and make larger
            hex.classed('lightStroke', d => Math.log(d.count) / Math.log(maxCount) < 0.6)
            .transition()
                .duration(175)
                .attr('points', d => getHex(d, 10))
                .transition()
                    .duration(75)
                    .attr('points', d => getHex(d, 7))
                    .transition()
                        .duration(50)
                        .attr('points', d => getHex(d, 8))

            if(ids.length === 0) return;

            drawEllipses(ids);
        }
        function exit(elem) {
            // clear the ellipses
            drawEllipses([])

            // return hex to normal size
            d3.select(this)
            .classed('lightStroke', false)
            .transition()
            .duration(100)
            .attr('points', d => getHex(d, 4))
        }

    }, [hexData, orbitData]); //redraw chart when data changes
    
    return (
        <div className="hexBin">
            <div className="hexWrapper">
                {/* <div className="leftWrapper">
                    <h1>A bird's eye view</h1>
                    <p>To the right you will see the orbital paths of roughly 1.2 million asteroids in our solar system aggregated into hexagonal bins.</p>
                </div> */}
                <div className="svgWrapper" style={{width: ''}}>
                    { hexData && orbitData ?
                        <svg 
                            ref={svgRef} 
                            viewBox='0 0 1020 1020'
                            id="hexBin"
                        /> :
                        <GridLoader color={'#EEE'} />
                    }
                </div>
            </div>
        </div>
    )
}
