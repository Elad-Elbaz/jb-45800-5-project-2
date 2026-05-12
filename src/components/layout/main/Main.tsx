import { Navigate, Route, Routes } from 'react-router-dom'
import About from '../../About/About'
import Ai from '../../Ai/Ai'
import Graphs from '../../Graphs/Graphs'
import Home from '../../Home/Home'

export default function Main() {
    return (
        <Routes>
            <Route path='/' element={<Navigate to="/Home" />} />
            <Route path='/Home' element={<Home />} />
            <Route path='/About' element={<About />} />
            <Route path='/Ai' element={<Ai />} />
            <Route path='/Graphs' element={<Graphs />} />
        </Routes>
    )
}