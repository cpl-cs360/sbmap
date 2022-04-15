import { useRef, useEffect } from "react";
import * as d3 from 'd3';

export default function Diameter({ data, dimensions}) {

    // orbit distance ref
    const ref = useRef(null);
    const { w, h, margin } = dimensions

    const svgWidth = w + margin.left + margin.right;
    const svgHeight = h + margin.top + margin.bottom;

    useEffect(() => {
        // guard for initial render before csv has been parsed
        if (data == null) return;

        const svgRefElement = d3.select(ref.current);
        svgRefElement.selectAll("*").remove();   //clear svg content before (re)drawing

        const svg = svgRefElement
        .append("g");

        let x = d3.scaleLinear()
            .domain(d3.extent(data.map(d => d.diameter))).nice()
            .range([0, w])

        let thresholds = x.ticks(100);
        let density = kde(epanechnikov(3), thresholds, data.map(d => d.diameter))
        let firstZero = density.findIndex(d => d[1] === 0)

        // add beginning values to square off the start edge and cut all values after first zero to prevent long tail
        density = [[0, 0], [0, density[0][1]], ...density.slice(0, firstZero + 1)];

        // update xAxis domain
        x.domain(d3.extent(density.map(d => d[0]))).nice()


        let xAxis = d3.axisBottom(x)

        let y = d3.scaleLinear()
            .domain([0, d3.max(density, d => d[1])])
            .range([h, 0])

        let line = d3.line()
            .curve(d3.curveBasis)
            .x(d => x(d[0]))
            .y(d => y(d[1]))

        svg.append("path")
            .datum(density)
            .attr("class", "line")
            .attr("stroke-linejoin", "round")
            .attr('transform', `translate(${margin.left}, ${margin.top})`)
            .transition()
            .duration(500)
            .attr("d", line);

        let xAxis_g = svg.append('g')
            .attr('transform', `translate(${margin.left}, ${h + margin.top})`)
            .attr('class', 'axis')
            .call(xAxis)
            .raise()

        function kde(kernel, thresholds, data) {
            return thresholds.map(t => [t, d3.mean(data, d => kernel(t - d))]);
        }
        function epanechnikov(bandwidth) {
            return x => Math.abs(x /= bandwidth) <= 1 ? 0.75 * (1 - x * x) / bandwidth : 0;
        }

    }, [data])
    
  return (
    <svg ref={ref} viewBox={`0 0 ${svgWidth} ${svgHeight}`} className='diameterPlot' ></svg>
  )
}
