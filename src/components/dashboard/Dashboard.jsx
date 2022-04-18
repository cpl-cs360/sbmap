import { useState } from 'react';
import * as d3 from 'd3';
import './dashboard.scss';
import Toggle from './Toggle';
import Distance from './Distance';
import Diameter from './Diameter';
import Eccentricity from './Eccentricity';

export default function Dashboard({ data, dimensions }) {

    let groups = [
        {
            name: 'Hungaria Group',
            color: 'pink',
            thresholds: [1.7, 2]
        },
        {
            name: 'Main Belt',
            color: 'purple',
            thresholds: [2.05, 3.3]
        },
        {
            name: 'Hilda Group',
            color: 'yellow',
            thresholds: [3.7, 4.2]
        },
        {
            name: 'Trojan Group',
            color: 'orange',
            thresholds: [5.05, 5.4]
        }
    ].map(g => {
        g.id = g.name.toLowerCase().slice(0,4)
        return g
    })

    const [ids, setIds] = useState(groups.map(g => g.id));

    return (
        <div className="dashboard">
            <div className="topbar">
                <h1>The Asteroid Dashboard</h1>
                <div className="toggles">
                    {
                        groups.map(g => {
                            return (
                                <Toggle key={g.id} color={g.color} name={g.name} id={g.id} ids={ids} setIds={setIds} />
                            )
                        })
                    }

                </div>
            </div>
            <div className="top">
                <Distance data={data} ids={ids} dimensions={dimensions.a} groups={groups} />
            </div>
            <div className="bottom">
                <div className="left">
                    <Diameter data={data} ids={ids} dimensions={dimensions.d} groups={groups} />
                </div>
                <div className="right">
                    <Eccentricity data={data} ids={ids} dimensions={dimensions.e} groups={groups} />
                </div>
            </div>
        </div>
    )

}
