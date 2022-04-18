import { useRef, useState, useEffect } from "react";
import * as d3 from 'd3';
import { kernelDensity } from "./kernelDensity";


export default function Distance({ data, ids, dimensions, groups }) {

    // orbit distance ref
    const ref = useRef(null);
    const { w, h, margin } = dimensions

    const svgWidth = w + margin.left + margin.right;
    const svgHeight = h + margin.top + margin.bottom;

    let plot = kernelDensity()
    .dimensions(dimensions)
    .thresholds(30)
    .bandwidth(0.005)
    .xTitle('Orbit Distance (au)')

    const [filteredData, setFilteredData] = useState([])
    
    // When filtered data changes, update plot
    useEffect(() => {

        if(data == null) return;

        plot.data(filteredData)
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

        const marks = newData.map(d => d.a)
        setFilteredData(marks)
    }, [data, ids])
    

  return (
    <svg ref={ref} viewBox={`0 0 ${svgWidth} ${svgHeight}`} className='distancePlot'></svg>
  )
}
