import { useRef, useEffect } from "react";
import * as d3 from 'd3';

export default function Distance({ data, dimensions}) {

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
            .domain(d3.extent(data.map(d => d.a))).nice()
            .range([margin.left, w - margin.right])
        let xAxis = d3.axisBottom(x)

        let thresholds = x.ticks(100);
        let density = kde(epanechnikov(0.03), thresholds, data.map(d => d.a))

        let y = d3.scaleLinear()
            .domain([0, d3.max(density, d => d[1])])
            .range([h, margin.top])


        let line = d3.line()
            .curve(d3.curveBasis)
            .x(d => x(d[0]))
            .y(d => y(d[1]))

        svg.append("path")
            .datum(density)
            .attr("class", "line")
            .attr("stroke-linejoin", "round")
            .attr("d", line);

        let xAxis_g = svg.append('g')
            .attr('transform', `translate(0, ${h})`)
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
    <svg ref={ref} viewBox={`0 0 ${svgWidth} ${svgHeight}`} className='distancePlot' ></svg>
  )
}
