import * as d3 from 'd3';

export const scatterPlot = () => {
    let data,
        dimensions;
    const my = (selection) => {
        const { w, h, margin } = dimensions;

        let x = d3.scaleLinear()
            .domain(d3.extent(data.map(d => d.x)))
            .range([0, w])
        let xAxis = d3.axisBottom(x)
    
        let y = d3.scaleLinear()
            .domain(d3.extent(data.map(d => d.y)))
            .range([h, 0])
        let yAxis = d3.axisLeft(y)
    
        let g = selection
            .selectAll('.points')
            .data([null])
            .join('g')
            .attr('class', 'points')
            .attr('transform', `translate(${margin.left},${margin.top})`)
    
        const t = d3.transition().duration(750)
        const positionCircles = (circles) => {
            circles
            .attr('cx', d => x(d.x))
            .attr('cy', d => y(d.y))
        }
        const initializeRadius = (circles) => {
            circles.attr('r', 0)
        }
        const growRadius = (circles) => {
            circles.attr('r', 4)
        }
        const circles = g.selectAll('.eDot')
            .data(data)
            .join(
                (enter) =>
                    enter
                        .append('circle')
                        .attr('class', 'eDot')
                        .call(positionCircles)
                        .call(initializeRadius)
                        .transition(t)
                        .call(growRadius),
                (update) =>
                    update.call((update) =>
                        update
                        .transition(t)
                        .call(positionCircles)
                    ),
                (exit) => exit.remove()
            )
    
        selection
            .selectAll('.xAxis')
            .data([null])
            .join('g')
            .attr('class', 'xAxis')
            .attr('transform', `translate(${margin.left},${margin.top + h})`)
            .transition(t)
            .call(xAxis);
    
        selection
            .selectAll('.yAxis')
            .data([null])
            .join('g')
            .attr('class', 'yAxis')
            .attr('transform', `translate(${margin.left},${margin.top})`)
            .transition(t)
            .call(yAxis);
    };

    // modeled after the d3 axis source code
    my.data = function(_) {
        return arguments.length ? (data = _, my) : data;
    }
    my.dimensions = function(_) {
        return arguments.length ? (dimensions = _, my) : dimensions;
    }
    
    return my;
    
}