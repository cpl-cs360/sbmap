import { useState } from 'react';
import './app.scss'
import BarChart from './components/BarChart'

function App() {
  const data = [1, 2, 3, 4, 7, 10, 15, 16, 19];
  const barChartDimensions = {
    width: 400,
    height: 350,
    margin: {
      top: 100,
      right: 75,
      bottom: 100,
      left: 75
    }
  };

  return (
    <>
      <div className="app">
        <h1>The Small Body Map for the Average Person</h1>
        <h2><em>SBMAP</em>. CS360 Final Project</h2>
        <h3>Colm Lang</h3>
        <p>Welcome to SBMAP,<br/>I hope this interactive visualization will teach you something about our solar system. It is my goal to bridge the gap between Astrophysicists and <em>the rest of us</em>. You can find the dataset that i used <a href='www.google.com'>here</a>.</p>
      </div>
      <BarChart data={data} dimensions={barChartDimensions} />
    </>
  )
}

export default App
