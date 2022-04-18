import { useRef, useState, useEffect } from "react";
import * as d3 from 'd3';
import { scatterPlot } from "./scatterPlot";
import { contour } from "./contour";

export default function Eccentricity({ data, ids, dimensions, groups }) {

    // orbit distance ref
    const ref = useRef(null);
    const { w, h, margin } = dimensions

    const svgWidth = w + margin.left + margin.right;
    const svgHeight = h + margin.top + margin.bottom;

    let plot = contour()
    .dimensions(dimensions)
    .xTitle('Orbit Distance (au)')
    .yTitle('Eccentricty')

    const [filteredData, setFilteredData] = useState([])
    const [prevData, setPrevData] = useState([])
    
    // When filtered data changes, update plot
    useEffect(() => {
        plot.data(filteredData).prevData(prevData)
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

        const marks = newData.map(d => {
            return {
                x: d.a,
                y: d.e
            }
        })
        setPrevData(filteredData)
        setFilteredData(marks)
    }, [data, ids])
    

  return (
    <svg ref={ref} viewBox={`0 0 ${svgWidth} ${svgHeight}`} className='ePlot'></svg>
  )
}
