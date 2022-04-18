import * as d3 from 'd3'
import { interpolatePath } from 'd3-interpolate-path';

export const kernelDensity = () => {
    let data,
        dimensions,
        thresholds,
        bandwidth,
        xTitle;
    const my = (selection) => {
        const { w, h, margin } = dimensions;
        
        const x = d3.scaleLinear()
            .domain(d3.extent(data)).nice()
            .range([0, w])
        const xAxis = d3.axisBottom(x)

        let density = kde(epanechnikov(bandwidth), x.ticks(thresholds), data)
    
        const y = d3.scaleLinear()
            .domain([0, d3.max(density, d => d[1])]).nice()
            .range([h, 0])

        const line = d3.area()
            .curve(d3.curveBasis)
            .x(d => x(d[0]))
            .y0(y(0))
            .y1(d => y(d[1]))
            
        
        const drawLine = (paths) => {
            paths.attr('d', line)
        }
        const tweenLine = (paths) => {
            
            paths.attrTween('d', d => {
                let prev = g.selectAll('.line').attr('d');
                let curr = line(d)
                return interpolatePath(prev, curr)
            })

        }

        const t = d3.transition()
        .duration(500)
        .ease(d3.easeSin)

        const g = selection.selectAll('.densityGroup')
        .data([null])
        .join('g')
        .attr('class', 'densityGroup')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

        g.selectAll('.line')
            .data([null])
            .join('path')
            .attr('class', 'line')
            .datum(density)
            .join((enter) => 
                enter
                .transition(t)
                .call(drawLine),
                (update) =>
                    update.call(update => 
                        update.transition(t)
                        .call(tweenLine)    
                    ),
                (exit) => exit.remove()
            )
        

        selection.selectAll('.xAxis')
            .data([null])
            .join('g')
            .attr('transform', `translate(${margin.left}, ${h + margin.top})`)
            .attr('class', 'xAxis')
            .transition(t)
            .call(xAxis)

        selection.selectAll('.xTitle')
        .data([null])
        .join('text')
        .attr('class','axis xTitle')
        .attr('text-anchor', 'middle')
        .attr('x', margin.left + w / 2)
        .attr('y', h + margin.top + 40)
        .text(xTitle)

    }

    function kde(kernel, thresholds, data) {
        return thresholds.map(t => [t, d3.mean(data, d => kernel(t - d))]);
    }
    function epanechnikov(bandwidth) {
        return x => Math.abs(x /= bandwidth) <= 1 ? 0.75 * (1 - x * x) / bandwidth : 0;
    }

    my.data = function (_) {
        return arguments.length ? (data = _, my) : data;
    }
    my.dimensions = function (_) {
        return arguments.length ? (dimensions = _, my) : dimensions;
    }
    my.thresholds = function (_) {
        return arguments.length ? (thresholds = _, my) : thresholds;
    }
    my.bandwidth = function (_) {
        return arguments.length ? (bandwidth = _, my) : bandwidth;
    }
    my.xTitle = function (_) {
        return arguments.length ? (xTitle = _, my) : xTitle;
    }
    
    return my;
}