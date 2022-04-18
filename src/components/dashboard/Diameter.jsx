import { useRef, useState, useEffect } from "react";
import * as d3 from 'd3';
import { kernelDensity } from "./kernelDensity";


export default function Diameter({ data, ids, dimensions, groups }) {

    // orbit distance ref
    const ref = useRef(null);
    const { w, h, margin } = dimensions

    const svgWidth = w + margin.left + margin.right;
    const svgHeight = h + margin.top + margin.bottom;

    let plot = kernelDensity()
    .dimensions(dimensions)
    .bandwidth(1)
    .xTitle('Diameter (km)')

    const [filteredData, setFilteredData] = useState([])
    
    // When filtered data changes, update plot
    useEffect(() => {

        if(data == null) return;

        plot.data(filteredData.filter(d => d < 75)).thresholds(d3.thresholdScott(filteredData, 0, d3.max(filteredData)))

        const svgRefElement = d3.select(ref.current)
        svgRefElement.call(plot)
    }, [filteredData])

    // when data or ids change, update filtered data
    useEffect(() => {
        if(data == null || ids == null) return;
        let newData = !ids.length ? [] : data.filter(d => {
            for(let id of ids) {
                let gData = groups.find(g => g.id == id)
                let t = gData.thresholds;
                if(d.a >= t[0] && d.a <= t[1]) {
                    return true;
                }
            }
            return false
        });

        const marks = newData.map(d => d.diameter)
        setFilteredData(marks)

    }, [data, ids])
    

  return (
    <svg ref={ref} viewBox={`0 0 ${svgWidth} ${svgHeight}`} className='diameterPlot'></svg>
  )
}
