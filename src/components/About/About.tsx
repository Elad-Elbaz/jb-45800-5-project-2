import './About.css'
import dubi from '../../assets/dubi.jpeg'
export default function About() {
  return <div className="About">
    <h3>In this app you can find the relevent data about the 100 leading crypto coins</h3>
    <p>Please use 'Ai Recommends' for coin invest advice </p>
    <a>my Name is Elad and im FullStack student at Jon Bryce </a>
    <img src={dubi}></img>
  </div>
}
