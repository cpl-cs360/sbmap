import { useState, useEffect } from 'react';
import './app.scss'
import HexBin from './components/hexbin/HexBin';
import * as d3 from 'd3';
import Intro from './components/intro/Intro';
import Dashboard from './components/dashboard/Dashboard';

function App() {

  const [hexBinData, setHexBinData] = useState();
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

    const pathToHexData = 'https://gist.githubusercontent.com/colmpat/5a356e5e024c175d52b584ad42d34f29/raw/1846e9bde063af9ad4ec76887e4b2dc4bb055165/hex_bins_125.csv'
    // load in hexbin csv
    d3.csv(pathToHexData, d => {
      return {
        x: +d['x'],
        y: +d['y'],
        count: +d['count'],
      }
    }).then(data => {
      setHexBinData(data);
    })
  
  }, [])


  return (
    <div className="app">
      <Intro />
      <div className="sections">
        <HexBin data={ hexBinData } dimensions={ hexBinDims } className="hexBin" />
        <Dashboard />
      </div>
  </div>
  )
}

export default App
