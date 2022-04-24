import React, { useRef, useState, useEffect } from 'react'
import * as d3 from 'd3';
import { legendColor } from 'd3-svg-legend';
import './hexBin.scss'
import { RingLoader } from 'react-spinners';
import { color } from 'd3';

export default function HexBin({ hexData, orbitData, dimensions }) {
    const svgRef = useRef(null);
    const { width, height, margin } = dimensions;
    
    //useEffect to handle D3 related side-effects (like DOM manipulation)
    useEffect(() => {

        // guard for initial render before csv has been parsed
        if(hexData == null || orbitData == null) return;

        let cw = d3.select('body').node().getBoundingClientRect().width;
        let ch = d3.select('body').node().getBoundingClientRect().height;

        const svgRefElement = d3.select(svgRef.current);
        svgRefElement.selectAll("*").remove()   //clear svg content before (re)drawing
        
        const maxCount = d3.max(hexData.map(d => d.count));
        const colorScale = d3.scaleSequential()
        .interpolator(d3.interpolateInferno)
        .domain([0, Math.log(maxCount)])
        
        const svg = svgRefElement
        .append("g")
        .attr('class', 'hexbin')
        .attr("transform", `translate(${margin.left},${margin.top})`);

        let colorLegend = legendColor()
        .cells(8)
        .scale(colorScale)
        .labels(function({i, generatedLabels}) { 
            return (+generatedLabels[i] > 1000 ? d3.format('.4~s')( Math.exp(+generatedLabels[i])) : d3.format('.2~s')(Math.exp(+generatedLabels[i])))
        })
        
        svg.append('g')
        .attr("transform", `translate(${width + 15},${0})`)
        .call(colorLegend)

        
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
        .data(hexData.filter(d => d.count > 0))
        .enter()
        .append('polygon')
        .attr('class', 'hex')
        .attr('points', d => getHex(d, 4))
        .attr('fill', d => colorScale(Math.log(d.count)))
        .on('mouseover', hover)
        .on('mouseout', exit)

        let planet_g = svg.selectAll('.planet')
        .data([
            {
                'id': 'earth', 
                'a': 35.71437892857143, 
                'e': 0.01671123, 
                'w': 100.46457166, 
                'b': 35.70939168862441, 
                'c': 0.5968312005827371
            },
            {
                'id': 'jupiter', 
                'a': 185.81739285714283, 
                'e': 0.04838624, 
                'w': 34.39644051, 
                'b': 185.5997449295388, 
                'c': 8.9910049669602
            },
            { 
                'id': 'saturn', 
                'a': 340.5955692857143, 
                'e': 0.05386179, 
                'w': 49.95424423, 
                'b': 340.10116083160074, 
                'c': 18.3450870277976 
            }
        ])
        .enter()
        .append('g')

        planet_g
        .enter()
        .append('ellipse')
        .attr('class', 'planet')
        .attr('cy', 500)
        .attr('fill', 'none')
        .style('pointer-events', 'none')
        .attr('stroke-width', '2px')
        .attr('cx', d => 500 - d.c)
        .attr('rx', d => d.a)
        .attr('ry', d => d.b)
        .attr('id', d => d.id)
        .attr('transform', d => `rotate(-${d.w} 500 500)`)
        .attr('opacity', 0)

        const tooltip = d3.selectAll('#tooltip')

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
            .attr('stroke', '#EEE')
            .attr('fill', 'none')
            .style('pointer-events', 'none')
            .attr('cx', d => 500 - d.c)
            .attr('rx', d => d.a)
            .attr('ry', d => d.b)
            .attr('id', d => d.id)
            .attr('transform', d => `rotate(-${d.w} 500 500)`)
            .attr('opacity', 0)
            .transition()
            .duration(400)
            .attr('opacity', 1 / ids.length + (ids.length > 15 ? 0.4 : 0.6))
            .ease(d3.easeBackIn)
            
            
            // if less orbits, remove them
            orbits.exit()
            .remove();
            
        }

        function drawTooltip(elem, hexData) {
            let x = hexData.x,
                y = 1000 - hexData.y;
            let m = (y - 500) / (x - 500);
            let offset = 20;

            tooltip.classed('hidden', false)
            let th = tooltip.node().getBoundingClientRect().height;

            tooltip.select('.value')
            .text(d3.format((hexData.count > 10000 ? '.4' : '.2') + '~s')(hexData.count))
            
            tooltip
            .style('inset',null)

            if(x >= 500) {
                if(m > 1) {
                    // bottom right
                    let overflow = (elem.y + offset + th) > ch

                    tooltip
                    .style('left', elem.x + (!overflow ? -offset : offset) + 'px')

                    if(!overflow) {
                        tooltip
                        .style('top', elem.y + offset + 'px')
                    } else {
                        tooltip
                        .style('bottom', 0)
                    }
                } else if(m > 0) {
                    // right bottom
                    let overflow = (elem.y - offset + th) > ch

                    tooltip
                    .style('left', elem.x + offset + 'px')

                    if(!overflow) {
                        tooltip
                        .style('top', elem.y - offset + 'px')
                    } else {
                        tooltip
                        .style('bottom', 0)
                    }
                } else if(m >= -1) {
                    // right top
                    let overflow = (elem.y + offset - th) < 0

                    tooltip
                    .style('left', elem.x + offset + 'px')

                    if(!overflow) {
                        tooltip
                        .style('bottom', ch - elem.y - offset + 'px')
                    } else {
                        tooltip
                        .style('top', 0)
                    }

                } else {
                    // top right
                    let overflow = (elem.y - offset - th) < 0

                    tooltip
                    .style('left', elem.x + (overflow ? offset : -offset) + 'px')
                    
                    if(!overflow) {
                        tooltip
                        .style('bottom', ch - elem.y + offset + 'px')
                    } else {
                        tooltip
                        .style('top', 0)
                    }

                }
            } else {
                if(m > 1) {
                    // top left
                    let overflow = (elem.y - offset - th) < 0

                    tooltip
                    .style('right', cw - elem.x + (overflow ? offset : -offset) + 'px')
                    
                    if(!overflow) {
                        tooltip
                        .style('bottom', ch - elem.y + offset + 'px')
                    } else {
                        tooltip
                        .style('top', 0)
                    }

                } else if(m > 0) {
                    // left top
                    let overflow = (elem.y + offset - th) < 0

                    tooltip
                    .style('right', cw - elem.x + offset + 'px')

                    if(!overflow) {
                        tooltip
                        .style('bottom', ch - elem.y - offset + 'px')
                    } else {
                        tooltip
                        .style('top', 0)
                    }
                } else if(m >= -1) {
                    // left bottom
                    let overflow = (elem.y - offset + th) > ch

                    tooltip
                    .style('right', cw - elem.x + offset + 'px')

                    if(!overflow) {
                        tooltip
                        .style('top', elem.y - offset + 'px')
                    } else {
                        tooltip
                        .style('bottom', 0)
                    }
                } else {
                    // bottom left
                    let overflow = (elem.y + offset + th) > ch

                    tooltip
                    .style('right', cw - elem.x + (!overflow ? -offset : offset) + 'px')

                    if(!overflow) {
                        tooltip
                        .style('top', elem.y + offset + 'px')
                    } else {
                        tooltip
                        .style('bottom', 0)
                    }
                    
                }
            }

            
        }
        
        // timer to draw ellipses, cleared when leaving a hex
        let ellipseTimer;
        let tooltipTimer;
        
        function hover(elem) {
            let ids = (d3.select(this).data())[0].ids
            
            // grab hovered hex
            let hex = d3.select(this);
            let planets = d3.selectAll('.planet')
            
            // move to front
            planets.raise()
            hex.raise();

            planets.attr('opacity', 1)

            // update stroke and make larger
            hex.classed('lightStroke', d => Math.log(d.count) / Math.log(maxCount) < 0.6)
            .transition()
            .delay(300)
                .duration(250)
                .attr('points', d => getHex(d, 8))


            if(ids.length === 0) return;

            tooltipTimer = setTimeout(function () {
                let hexData = hex.data()[0]
                drawTooltip(elem, hexData)
            }, 500)
            ellipseTimer = setTimeout(function () {
                drawEllipses(ids);
            }, 1000);

        }
        function exit(elem) {
            // clear the ellipses
            drawEllipses([])
            clearTimeout(ellipseTimer)
            clearTimeout(tooltipTimer)

            // return hex to normal size
            d3.select(this)
            .classed('lightStroke', false)
            .transition()
            .duration(100)
            .attr('points', d => getHex(d, 4))

            tooltip.classed('hidden', true)

            d3.selectAll('.planet').attr('opacity', 0)
        }

    }, [hexData, orbitData]); //redraw chart when data changes
    
    return (
        <div className="hexBin">
            <div className="hexWrapper">
                <div className="leftWrapper">
                    <h1>A bird's eye view</h1>
                    <p>
                        To the right you will see the orbital paths of roughly 1.2 million
                        asteroids mapped onto hexagonal bins.
                    </p>
                    <p>
                        The vast majority of asteroids lie between Mars and Jupiter in the asteroid belt. 
                        The asteroid belt likely contains hundreds of thousands more asteroids than currently identified.
                    </p>
                    <div className="about">
                        <h2>About the hexmap:</h2>
                        <hr />
                        <h3>Hover</h3>
                        <p>Hover to see how many orbital paths intersect the current hex.</p>
                        <h3>Long Hover</h3>
                        <p>Hold for 1s to reveal the orbital paths.</p>
                    </div>
                </div>
                <div className="svgWrapper">
                    { hexData && orbitData ?
                        <svg 
                            ref={svgRef} 
                            viewBox={`0 0 ${width + margin.left + margin.right} ${height + margin.bottom + margin.top}`}
                            id="hexBin"
                        /> :
                        <RingLoader color={'#EEE'} size={75} css={{minWidth: 100, minHeight: 100}} />
                    }
                    <div id='tooltip' className='hidden'>
                        <h1>Asteroids:</h1>
                        <p className='value'>100</p>
                    </div>
                </div>
                
            </div>
        </div>
    )
}
