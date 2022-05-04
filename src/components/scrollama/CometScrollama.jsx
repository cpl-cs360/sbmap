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
        }
    ]
    const textStates = [
        'Unlinke the planets in our solar system, Halley\'s Comet (1P/Halley) has a highly eccentric orbit. The nearest point of Helley\s orbit comes between the earth and the sun while its greatest distance distance from the sun reaches beyond Neptune\'s orbit!',
        'While most of the planets orbit on what is called the elliptic plane, Halley\s orbit lies on a plane that is tilted roughly 18 degrees.',
    ]
    
    const [currentStepIndex, setCurrentStepIndex] = useState(0)

    function onStepEnter({ data }) {
        setCurrentStepIndex(data);
    };

    const ref = useRef(null);
    let plot = comet().dimensions(dimensions)
    
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
        </div>
    )
}
