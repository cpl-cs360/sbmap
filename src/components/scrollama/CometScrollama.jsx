import * as d3 from 'd3';
import { useRef, useState, useEffect } from "react";
import { Scrollama, Step } from "react-scrollama";
import { comet } from './comet';
import "./cometScrollama.scss";

export default function CometScrollama({ dimensions }) {
    const {w, h, margin} = dimensions;

    const graphStates = [
        {
            view: 'above'
        },
        {
            view: 'side'
        },
        // {
        //     view: 'size'
        // }
    ]
    const textStates = [
        'Unlinke the planets in our solar system, Halley\'s Comet (1P/Halley) has a highly eccentric orbit. The nearest point of Helley\s orbit comes between the earth and the sun while its greatest distance from the sun reaches beyond Neptune\'s orbit!',
        'While most of the planets orbit very close to the ecliptic plane, Halley\'s orbit lies on a plane that is tilted roughly 18 degrees.',
        // 'Halley\'s comet is about 9.3 by 5 miles across. Thats roughly the size of San Francisco!'
    ]
    
    const [currentStepIndex, setCurrentStepIndex] = useState(0)

    function onStepEnter({ data }) {
        setCurrentStepIndex(data);
    };

    const ref = useRef(null);
    let plot = comet().dimensions(dimensions)
    
    // useEffect(() => {
    //     const urls = {
    //         basemap: "https://data.sfgov.org/resource/xfcw-9evu.geojson",
    //         streets: "https://data.sfgov.org/resource/3psu-pn9h.geojson?$limit=20000",
    //     };
    //     d3.json(urls.basemap).then(json => {
    //         plot.basemapJSON(json)
    //     })
    //     d3.json(urls.streets).then(json => {
    //         plot.streetsJSON(json)
    //     })
    // });

    // When filtered data changes, update plot
    useEffect(() => {

        plot.view(graphStates[currentStepIndex].view)
        console.log(plot.view())

        const svgRefElement = d3.select(ref.current)
        svgRefElement.call(plot)
    }, [currentStepIndex])

    return (
        <div className='graphicContainer'>
            <div className='scrollWrapper'>
                <div className='scroller'>
                    <Scrollama
                        onStepEnter={onStepEnter}
                        offset={0.5}
                    >
                        {textStates.map((_, i) => {
                            return (
                                <Step key={i} data={i}>
                                    <div className={'step ' + (currentStepIndex === i && 'active')}>
                                        <p>{textStates[i]}</p>
                                    </div>
                                </Step>
                            )
                        })

                        }
                    </Scrollama>
                </div>
            </div>
            <div className='graphic'>
                <svg ref={ref} viewBox={`0 0 ${w + margin.left + margin.right} ${h + margin.top + margin.bottom}`} className='figure'></svg>
            </div>
            <h1 className='title'>Halley's Comet (1P/Halley)</h1>
        </div>
    )
}
