import { useEffect, useReducer } from 'react';
import './app.scss'
import HexBin from './components/hexbin/HexBin';
import * as d3 from 'd3';
import Intro from './components/intro/Intro';
import ViolinPlot from './components/violin-plot/ViolinPlot';
import Dashboard from './components/dashboard/Dashboard';
import stratify from '../data/dashboard/Stratify';
import CometScrollama from './components/scrollama/CometScrollama';

function App() {

  const dataReducer = (state, action) => {
    return {...state, [action.type]: action.payload }
  }

  const [data, dispatch] = useReducer(
    dataReducer,
    {
      violin: null,
      hexbin: null,
      orbit: null,
      dashboard: null
    }
  )
  
  const violinPlotDims = {
    width: 700,
    height: 400,
    margin: {
      top: 10,
      right: 10,
      bottom: 60,
      left: 10
    }
  }
  const hexBinDims = {
    width: 1000,
    height: 1000,
    margin: {
      top: 10,
      right: 90,
      bottom: 10,
      left: 10,
    }
  };

  const dashboardDims = {
    a: {
      w: 1140,
      h: 390,
      margin: {
        top: 10,
        right: 10,
        bottom: 50,
        left: 10,
      }
    },
    d: {
      w: 550,
      h: 390,
      margin: {
        top: 10,
        right: 10,
        bottom: 50,
        left: 10,
      }
    },
    e: {
      w: 500,
      h: 390,
      margin: {
        top: 10,
        right: 10,
        bottom: 50,
        left: 60,
      }
    }
    
  };

  const scrollamaDims = {
    w: 600,
    h: 400,
    margin: {
      top: 10,
      right: 10,
      bottom: 10,
      left: 10,
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
      dispatch({ type: 'hexbin', payload: data })
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
      dispatch({ type: 'orbit', payload: data })
    })

    const pathToDashboardData = 'https://gist.githubusercontent.com/colmpat/d2c7e60946a1ec2931c8e8fcd9a30277/raw/d052fd8bb80d36218cbdfc37b03d309ab6bb476a/dashboard_data.csv';
    stratify(pathToDashboardData, 'a', 'e', 'diameter', 100, 30).then(data => {
      dispatch({ type: 'dashboard', payload: data })
      dispatch({ type: 'violin', payload: data.map(d => d.a) })
    })
    
  }, [])

  return (
    <div className="app">
      <div className="sections">
        <Intro />
        <ViolinPlot data={ data.violin } dimensions={ violinPlotDims }/>
        <HexBin hexData={ data.hexbin } orbitData= { data.orbit } dimensions={ hexBinDims } />
        <Dashboard data={ data.dashboard } dimensions={ dashboardDims } />
        <CometScrollama dimensions={ scrollamaDims }/>
      </div>
  </div>
  )
}

export default App
