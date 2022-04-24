import { useState, useEffect } from 'react';
import * as d3 from 'd3';
import ViolinPlot from '../violin-plot/ViolinPlot';
import './intro.scss';

export default function Intro() {
  const [data, setData] = useState();
  const violinPlotDimensions = {
    width: 700,
    height: 400,
    margin: {
      top: 10,
      right: 10,
      bottom: 60,
      left: 10
    }
  }

  useEffect(() => {
    const pathToCsv = 'https://gist.githubusercontent.com/colmpat/ee0f174743f100247835465a03b4cd37/raw/837a7db1d4f8c40db229caad4247bdb64c9d204b/asteroid_a_bins_0.025.csv';
    // load in hexbin csv
    d3.csv(pathToCsv, d => {
      return {
        bin: +d['bin'],
        count: +d['count']
      }
    }).then(data => {
      setData(data);
    })

  }, [])
  

  return (
    <div className="intro">
      <div className="introWrapper">
        <div>
          <h1>The Small Body Map for the Average Person</h1>
          <h2><em>SBMAP</em>. CS360 Final Project</h2>
          <h3>Colm Lang</h3>
          <p>Welcome to SBMAP,<br/>I hope this interactive visualization will teach you something about our solar system. It is my goal to bridge the gap between Astrophysicists and <em>the rest of us</em>. You can find the dataset that I used <a href='https://ssd.jpl.nasa.gov/tools/sbdb_query.html'>here</a>.</p>
        </div>
        <ViolinPlot data={data} dimensions={violinPlotDimensions} />
      </div>
    </div>
  )
}