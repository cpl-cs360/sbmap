import { useState, useEffect } from 'react';
import './app.scss'
import HexBin from './components/hexbin/HexBin';
import * as d3 from 'd3';

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
    <>
      <div className="app">
        <h1>The Small Body Map for the Average Person</h1>
        <h2><em>SBMAP</em>. CS360 Final Project</h2>
        <h3>Colm Lang</h3>
        <p>Welcome to SBMAP,<br/>I hope this interactive visualization will teach you something about our solar system. It is my goal to bridge the gap between Astrophysicists and <em>the rest of us</em>. You can find the dataset that I used <a href='https://ssd.jpl.nasa.gov/tools/sbdb_query.html'>here</a>.</p>
      </div>
      <HexBin data={ hexBinData } dimensions={ hexBinDims } className="hexBin" />
    </>
  )
}

export default App
