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
        .domain([0, d3.max(data)]).nice()
        .range([0, width])

        let bins = d3.bin()
        .domain(xScale.domain())
        .thresholds(d3.thresholdFreedmanDiaconis)
        (data)

        let xAxis = d3.axisBottom(xScale)

        let yScale = d3.scaleLinear()
        .domain(d3.extent(bins, d => d.length))
        .range([0, height / 2])

        const svg = svgRefElement
        .append("g")
        .attr('class', 'violin')
        .attr("transform", `translate(${margin.left},${margin.top})`);

        let line = d3.area()
        .curve(d3.curveBasis)
        .x(d => xScale((d.x1 + d.x0) / 2))
        .y0(d => yScale(d.length))
        .y1(d => -yScale(d.length))

        let container_g = svg.append('g')
        .attr('class', 'violinContainer')
        .attr('transform', `translate(0,${height / 2})`)
        
        container_g.append('path')
        .datum(bins)
        .attr('class', 'band')
        .attr('d', line)

        let xAxis_g = svg.append('g')
        .attr('transform', `translate(0, ${height})`)
        
        xAxis_g.call(xAxis)
        
        xAxis_g
        .append('text')
        .attr('x', width / 2)
        .attr('y', 45)
        .text('Orbit Distance (au)')

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
        
        // earth
        let earth_g = svg.append('g')
        .attr('class', 'earth')
        .attr('transform', `translate(${xScale(1)},0)`)

        earth_g.append('line')
        .attr('x1', 0)
        .attr('y1', 60)
        .attr('x2', 0)
        .attr('y2', height - 20)

        earth_g.append('text')
        .attr('text-anchor', 'middle')
        .attr('x', 0)
        .attr('y', 45)
        .text('Earth')
        
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

        earth_g.lower()
        mars_g.lower()
        jupiter_g.lower()

    }, [data])
    

    return (
        <div className="violinPlot">
            <div className="violinWrapper">
                <div>
                    <h1>Where the asteroids lie</h1>
                    <p>Though the majority of asteroids are in the asteroid belt (2.2au - 3.2au), you can see the clusters of some of the smaller groups. Within the main belt, one can see the Kirkwood gaps. These gaps are caused by mean-motion resonances between an asteroid and Jupiter. For example, the 3:1 Kirkwood gap is located where the ratio of an asteroid's orbital period to that of Jupiter is 3/1 (the asteroid completes 3 orbits for every 1 orbit of Jupiter). The effect of these mean-motion resonances is a change in the asteroid's orbital elements (particularly semimajor axis) sufficient to create these gaps in semimajor axis space. (<a href="https://ssd.jpl.nasa.gov/diagrams/mb_hist.html" target="_blank">JPL.</a>)</p>
                </div>
                <svg ref={svgRef} viewBox={`0 0 ${svgWidth} ${svgHeight}`} id="violinPlot"/>
            </div>
        </div>
    )
}
