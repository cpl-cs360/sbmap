import './intro.scss';
import ArrowDownwardRoundedIcon from '@mui/icons-material/ArrowDownwardRounded';

export default function Intro() {
  return (
    <div className="intro">
      <div className="introWrapper">
        <h1>The Small Body Map for the Average Person</h1>
        <h2><em>SBMAP</em>. CS360 Final Project</h2>
        <h3>Colm Lang</h3>
        <hr/>
        <div className='bodyText'>
          <p>Welcome to SBMAP,</p>
          <p>SBMAP aims to provide a digestible, holistic representation of our solar system's many small bodies without sacrificing detail or accuracy. I hope this interactive visualization will teach you something about our solar system. It is my goal to bridge the gap between Astrophysicists and <em>the rest of us</em>.</p>
          <p>To see the methodology, please reference <a href="https://github.com/cpl-cs360/sbmap#sbmap" target='_blank'>the project report</a>.</p>
          <p><u>Note:</u> Best viewed on Opera or Firefox with resolution higher than 1280x800. You can find the dataset that I used <a href='https://ssd.jpl.nasa.gov/tools/sbdb_query.html' target='_blank'>here</a>.</p>
        </div>
      </div>
      <div className='arrow'>
        <ArrowDownwardRoundedIcon className='arrowIcon'/>
      </div>
      <div className='links'>
        <a href="https://github.com/cpl-cs360/sbmap" target='_blank' className='button'>Github</a>
        <a href="https://github.com/cpl-cs360/sbmap#user-manual" target='_blank' className='button'>User Manual</a>
        <a href="/sbmap/AlphaRelease.pdf" target='_blank' className='button'>Project Report</a>
      </div>
    </div>
  )
}
