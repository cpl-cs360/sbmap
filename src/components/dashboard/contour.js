import * as d3 from 'd3'
import { interpolatePath } from 'd3-interpolate-path';

export const contour = () => {
    let data,
        prevData,
        dimensions,
        xTitle,
        yTitle;
    const my = (selection) => {
        const { w, h, margin } = dimensions;
        const x = d3.scaleLinear()
            .domain([1.5, 5.5])
            .range([0, w])
        const xAxis = d3.axisBottom(x)
        const y = d3.scaleLinear()
            .domain([0, 0.7])
            .range([h, 0])
        const yAxis = d3.axisLeft(y).ticks(8)

        let line = d3.geoPath()
        
        let contourFunc = d3.contourDensity()
            .x(d => x(d.x))
            .y(d => y(d.y))
            .size([w,h])
            .bandwidth(6)
            .thresholds(30)

        let contours = contourFunc(data)

    
        const colorScale = d3.scaleSequential()
            .domain(d3.extent(contours, d => d.value))
            .interpolator(d3.interpolateInferno)
        
        const positionContours = (paths) => {
            paths.attr('d', line)
        }

        const initializeColor = (paths) => {
            paths.attr('opacity', 0)
            .attr('fill', colorScale(0))
        }
        const setColor = (paths) => {
            paths.attr('fill', d => colorScale(d.value))
            .attr('stroke', '#eee')
            .attr('stroke-opacity', (_,i) => i % 5 === 0 ? 0.8 : 0.1)
        }
        const t = d3.transition().duration(700)

        const g = selection
        .selectAll('.contours')
        .data([null])
        .join('g')
        .attr('class', 'contours')
        .attr('transform', `translate(${margin.left},${margin.top})`)
        
        const entering = data.map(d => {
            return {
                ...d,
                entering: true
            }
        })
        const exiting = prevData.map(d => {
            return {
                ...d, 
                exiting: false
            }
        })

        // on (re)draw, tween point weights in
        d3.transition()
        .duration(500)
        .tween('points', _ => {

            return tweenValue => {
                const inverse = 1 - tweenValue
                
                // each data points weight shall approach 1 if entering and 0 if exiting
                contourFunc.weight(d => d.entering ? tweenValue : inverse)
                
                // get contours on all data points
                contours = contourFunc(entering.concat(exiting))

                // update color scale becuase the values will have changed
                colorScale.domain(d3.extent(contours, d => d.value)).nice()

                g.selectAll('.contour')
                .data(contours)
                .join(
                    (enter) => 
                        enter
                        .append('path')
                        .attr('class', 'contour')
                        .call(positionContours)     // get to position
                        .call(setColor),            // set to accurate color
                    (update) => 
                        update.call((update) => {
                            update
                            .call(positionContours)
                            .call(setColor)         // set to accurate color
                        }),
                    (exit) => 
                        exit
                        .remove()
                )
            }

        })
        .ease(d3.easeSin)

        selection.selectAll('.x')
        .data([null])
        .join('g')
        .attr('class', 'x axis')
        .attr('transform', `translate(${margin.left},${margin.top + h})`)
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

        selection.selectAll('.y')
        .data([null])
        .join('g')
        .attr('class', 'y axis')
        .attr('transform', `translate(${margin.left},${margin.top})`)
        .transition(t)
        .call(yAxis)

        selection.selectAll('.yTitle')
        .data([null])
        .join('text')
        .attr('class','axis yTitle')
        .attr('text-anchor', 'middle')
        .attr('transform', 'rotate(-90)')
        .attr('x', 0 - margin.top - h / 2)
        .attr('y', 24)
        .text(yTitle)
    }

    my.data = function (_) {
        return arguments.length ? (data = _, my) : data;
    }
    my.prevData = function (_) {
        return arguments.length ? (prevData = _, my) : prevData;
    }
    my.dimensions = function (_) {
        return arguments.length ? (dimensions = _, my) : dimensions;
    }
    my.xTitle = function (_) {
        return arguments.length ? (xTitle = _, my) : xTitle;
    }
    my.yTitle = function (_) {
        return arguments.length ? (yTitle = _, my) : yTitle;
    }

    return my;
}