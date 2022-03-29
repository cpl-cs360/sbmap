import { useState } from 'react';
import './dashboard.scss'
import Toggle from './Toggle';

export default function Dashboard() {
    const [hungariaOn, setHungeriaOn] = useState(true);
    const [floraOn, setFloraOn] = useState(true);
    const [mainOn, setMainOn] = useState(true);
    const [cybeleOn, setCybeleOn] = useState(true);
    const [hildaOn, setHildaOn] = useState(true);
    const [trojanOn, setTrojanOn] = useState(true);
    
   
    
    return (
    <div className="dashboard">
        <div className="topbar">
            <h1>The Asteroid Dashboard</h1>
            <div className="toggles">
                
            </div>
            
        </div>
        <div className="top">
            <div className="left"></div>
            <div className="right"></div>
        </div>
        <div className="bottom">

        </div>
    </div>
  )
}
