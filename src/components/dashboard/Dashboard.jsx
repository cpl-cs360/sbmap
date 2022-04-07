import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import './dashboard.scss';

export default function Dashboard({ data }) {
    const distanceRef = useRef(null);

    const w = 800, h = 400;
    
    useEffect(() => {

        // guard for initial render before csv has been parsed
        if(data == null) return;
        
        const distanceSvgRefElement = d3.select(distanceRef.current);
        distanceSvgRefElement.selectAll("*").remove()   //clear svg content before (re)drawing
        
        const distanceSvg = distanceSvgRefElement
        .append("g");

        
        const ids = ['hun','main','hild','troj'];
        const thresholds = [
            [1.7,2],
            [2.3,3.3],
            [3.7,4.2],
            [5.05, 5.4]
        ];

        data= data.filter(d => d.bin >= 1.5 && d.bin <= 5.5)
        const xScale = d3.scaleLinear()
        .domain([1.5, 5.5])
        .range([0, w]);

        const yScale = d3.scaleLinear()
        .domain([0, d3.max(data.map(d => d.count))])
        .range([0, h]);

        const line = d3.line()
        .curve(d3.curveBasis)
        .x(d => xScale(d.bin))
        .y(d => yScale(d.count))

        // const binGroups = distanceSvg.selectAll('path')
        // .data(data)
        // .enter()
        // .append('rect')
        // .attr('class', d => {
        //     let id = getId(d.bin);
        //     return 'distancePath ' + id && id
        // })
        // .attr('x', d => xScale(d.bin))
        // .attr('y', d => h - yScale(d.count))
        // .attr('width', w / data.length)
        // .attr('height', d => yScale(d.count))


        function getId(a) {
            for(let i = 0; i < thresholds.length; i++) {
                let edges = thresholds.at(i);
                if(a >= edges[0] && a <= edges[1]) {
                    return ids[i];
                }
            }
            return null;
        }

    }, [data])

    return (
    <div className="dashboard">
        <div className="topbar">
            <h1>The Asteroid Dashboard</h1>
            <div className="toggles">
                <span>Hungaria Group</span>
                <span>Main Belt</span>
                <span>Hilda Group</span>
                <span>Trojan Group</span>
            </div>
        </div>
        <div className="top">
            <svg ref={distanceRef} viewBox={`0 0 ${w} ${h}`} className='distancePlot' ></svg>
        </div>
        <div className="bottom">
            <div className="left">

            </div>
            <div className="right">

            </div>
        </div>
    </div>
  )
}
