import { useState, useEffect } from 'react';
import './app.scss'
import HexBin from './components/hexbin/HexBin';
import * as d3 from 'd3';
import Intro from './components/intro/Intro';
import Dashboard from './components/dashboard/Dashboard';
import stratify from '../data/dashboard/Stratify';

function App() {

  const [hexBinData, setHexBinData] = useState();
  const [orbitData, setOrbitData] = useState();
  const [dashboardData, setDashboardData] = useState();

  const hexBinDims = {
    width: 1000,
    height: 1000,
    margin: {
      top: 10,
      right: 10,
      bottom: 10,
      left: 10,
    }
  };

  const dashboardDims = {
    a: {
      w: 1140,
      h: 410,
      margin: {
        top: 10,
        right: 10,
        bottom: 30,
        left: 10,
      }
    },
    d: {
      w: 550,
      h: 410,
      margin: {
        top: 10,
        right: 10,
        bottom: 30,
        left: 10,
      }
    },
    e: {
      w: 540,
      h: 410,
      margin: {
        top: 10,
        right: 10,
        bottom: 30,
        left: 30,
      }
    }
    
  };

  useEffect(() => {

    const pathToHexData = 'https://gist.githubusercontent.com/colmpat/c904b44e2b9243c8c77006175a17b70d/raw/7769640a26f587eba49bd08cfd3acb356aac8b98/hex_bins_125_max_20.csv';
    // load in hexbin csv
    d3.csv(pathToHexData, d => {
      let idStr = d['ids'];
      idStr = idStr.slice(1, idStr.length - 1)  // prune []
      let idArr = idStr.length === 0 ? [] : [...idStr.split(',').map(s => parseFloat(s))] 
      
      return {
        x: +d['x'],
        y: +d['y'],
        count: +d['count'],
        ids: idArr
      }
    }).then(data => {
      setHexBinData(data);
    })

    const pathToOrbitData = 'https://gist.githubusercontent.com/colmpat/772ef248351979b9e25253a19ff692a5/raw/99f61ed7adf490a79d62d8fc36aa6f33ed4eb828/orbits_125_sampled.csv';
    //load orbit data
    d3.csv(pathToOrbitData, d => {
      return {
        id: +d['id'],
        a: +d['a'],
        b: +d['b'],
        c: +d['c'],
        e: +d['e'],
        w: +d['w']
      }
    }).then(data => {
      setOrbitData(data);
    })

    const pathToDashboardData = './data/dashboard/asteroid_a_e_diameter.csv';
    stratify(pathToDashboardData, 'a', 'e', 'diameter', 100, 30).then(data => {
      setDashboardData(data);
    })
    
  }, [])

  return (
    <div className="app">
      <div className="sections">
        <Intro />
        <HexBin hexData={ hexBinData } orbitData= { orbitData } dimensions={ hexBinDims } />
        <Dashboard data={ dashboardData } dimensions={ dashboardDims } />
      </div>
  </div>
  )
}

export default App
