import * as d3 from 'd3';
import { interpolatePath } from 'd3-interpolate-path';

export const density = () => {
    let data,
        dimensions,
        thresholds;

    const my = (selection) => {
        const { w, h, margin } = dimensions;

        const x = d3.scaleLinear()
            .domain(d3.extent(data)).nice()
            .range([0,w])
        // calculate bins
        let nthresholds = d3.thresholdScott(data, 0, d3.max(data))
        const bins = d3.bin()
        .domain(x.domain())
        .thresholds(d3.max([thresholds, nthresholds]))
        (data)


        const xAxis = d3.axisBottom(x)
        const Y = Array.from(bins, b => b.length);

        const y = d3.scaleLinear()
        .domain(d3.extent(Y)).nice()
        .range([0,h])

        const t = d3.transition()
        .duration(700)
        .ease(d3.easeSin)

        const g = selection.selectAll('.histogram')
        .data([null])
        .join('g')
        .attr('class', 'histogram')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

        
        const line = d3.area()
        .curve(d3.curveBasis)
        .x(d => x(d.x0))
        .y0(h)
        .y1(d => h - y(d.length))
        
        const tweenLine = (paths) => {
            
            paths.attrTween('d', d => {
                let prev = g.selectAll('.line').attr('d');
                let curr = line(d)
                return interpolatePath(prev, curr)
            })

        }

        g.selectAll('path')
        .data([null])
        .join('path')
        .attr('class', 'line')
        .datum(bins)
        .join(
            (enter) => {
                enter
                .attr('fill', 'gray')
                .attr('stroke', 'white')
                .transition(t)
                .attr('d', line)
            },
            (update) =>
                update.call(update =>
                    update
                    .transition(t)
                    .call(tweenLine)
                ),
            (exit) => exit
            .remove()
                
        )
        .raise()

        selection.selectAll('.xAxis')
        .data([null])
        .join('g')
        .attr('class', 'xAxis')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + h + ')')
        .transition(t)
        .call(xAxis)
    }

    my.data = function(_) {
        return arguments.length ? (data = _, my) : data;
    }
    my.dimensions = function(_) {
        return arguments.length ? (dimensions = _, my) : dimensions;
    }
    my.thresholds = function(_) {
        return arguments.length ? (thresholds = _, my) : thresholds;
    }
    return my;
}