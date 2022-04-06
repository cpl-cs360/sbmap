import { useState, useEffect } from 'react';
import * as d3 from 'd3';
import './dashboard.scss';

export default function Dashboard() {

    const [distanceData, setDistanceData] = useState();

    // useEffect(() => {
    //     const pathToCsv = '../../../data/'
    //     d3.csv(pathToCsv, function (d) {
    //         return d;
    //     }).then(data => {
    //         setDistanceData(data);
    //     })
    // }, [])
    
    
    return (
    <div className="dashboard">
        <div className="topbar">
            <h1>The Asteroid Dashboard</h1>
            <div className="toggles">
                <span>Hungaria Group</span>
                <span>Main Belt</span>
                <span>Hilda Group</span>
                <span>Trojan Group</span>
            </div>
        </div>
        <div className="top">

        </div>
        <div className="bottom">
            <div className="left"></div>
            <div className="right"></div>
        </div>
    </div>
  )
}
