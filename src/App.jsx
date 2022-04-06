import { useState, useEffect } from 'react';
import './app.scss'
import HexBin from './components/hexbin/HexBin';
import * as d3 from 'd3';
import Intro from './components/intro/Intro';
import Dashboard from './components/dashboard/Dashboard';

function App() {

  const [hexBinData, setHexBinData] = useState();
  const [orbitData, setOrbitData] = useState();
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

  useEffect(() => {

    const pathToHexData = 'https://gist.githubusercontent.com/colmpat/664cc3da3ee6b99432753ab0d25f1f72/raw/ff877ac39201a3dd7dff5e8673060044577f6b8b/hex_bins_125_max_15.csv';
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

    const pathToOrbitData = 'https://gist.githubusercontent.com/colmpat/f0f4a7924da4941d8d5a0aed401dcdf3/raw/cedd5c4771df295cd399605d98fdad610e769d32/orbits_125_150.csv';
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
      console.log('# orbits', data.length)
      setOrbitData(data);
    })
  
  }, [])

  return (
    <div className="app">
      <div className="sections">
        <Intro />
        <HexBin hexData={ hexBinData } orbitData= { orbitData } dimensions={ hexBinDims } />
        <Dashboard />
      </div>
  </div>
  )
}

export default App
