import { NavLink } from 'react-router-dom'
import './Header.css'
import { setSearch } from '../../../services/redux/searchSlice'
import { useAppDispatch } from '../../../services/redux/hooks'

export default function Header() {
    const dispatch = useAppDispatch()
    return (
        <header className='header'>

            <div>
                <NavLink to="/Home">Home</NavLink>
                | <NavLink to="/Graphs">Graphs</NavLink>
                | <NavLink to="/Ai">Ai Recommends</NavLink>
                | <NavLink to="/About">About</NavLink>
               
                    <input  className='search' onChange={(e) => dispatch(setSearch(e.target.value))} type="text" placeholder='search' />
                
            </div>

        </header>
    )
}