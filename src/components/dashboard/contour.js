import * as d3 from 'd3'

export const contour = () => {
    let data,
        dimensions;
    const my = (selection) => {
        const { w, h, margin } = dimensions;
        const x = d3.scaleLinear()
            .domain(d3.extent(data.map(d => d.x)))
            .range([0, w])
        const xAxis = d3.axisBottom(x)
        const y = d3.scaleLinear()
            .domain(d3.extent(data.map(d => d.y)))
            .range([h, 0])
        const yAxis = d3.axisLeft(y)

        
        let contours = d3.contourDensity()
            .x(d => x(d.x))
            .y(d => y(d.y))
            .size([w,h])
            .bandwidth(7)
            .thresholds(30)
            (data)
        
        const colorScale = d3.scaleSequential(d3.extent(contours, d => d.value), d3.interpolateInferno)
        
        const positionContours = (paths) => {
            paths.attr('d', d3.geoPath())
        }
        const initializeColor = (paths) => {
            paths.attr('opacity', 0)
            .attr('fill', colorScale(0))
        }
        const rampColor = (paths) => {
            paths.attr('opacity', 1)
            .attr('fill', d => colorScale(d.value))
        }
        const t = d3.transition().duration(1000)

        const g = selection
        .selectAll('.contours')
        .data([null])
        .join('g')
        .attr('class', 'contours')
        .attr('transform', `translate(${margin.left},${margin.top})`)

        const paths = g.selectAll('path')
        .data(contours)
        .join(
            (enter) => 
                enter
                .append('path')
                .attr('class', 'contour')
                .call(positionContours)     // get to position
                .call(initializeColor)      // start transparent
                .transition(t)
                .call(rampColor),           // ramp up to accurate color
            (update) => 
                update.call((update) =>
                update
                    .transition(t)
                    .call(positionContours) // transition to pos
                    .call(rampColor)        // ramp to color
                ),
            (exit) => 
                exit
                .transition(t)
                .duration(t.duration() / 2)
                .attr('opacity', 0)
                .remove()
        )

        selection.selectAll('.xAxis')
        .data([null])
        .join('g')
        .attr('class', 'xAxis')
        .attr('transform', `translate(${margin.left},${margin.top + h})`)
        .transition(t)
        .call(xAxis)

        selection.selectAll('.yAxis')
        .data([null])
        .join('g')
        .attr('class', 'yAxis')
        .attr('transform', `translate(${margin.left},${margin.top})`)
        .transition(t)
        .call(yAxis)
    }

    my.data = function (_) {
        return arguments.length ? (data = _, my) : data;
    }
    my.dimensions = function (_) {
        return arguments.length ? (dimensions = _, my) : dimensions;
    }

    return my;
}