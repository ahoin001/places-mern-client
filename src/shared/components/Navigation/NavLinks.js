import React, { useContext } from 'react'

// NavLink is Different from Link in that it allows more style options
import { NavLink } from "react-router-dom";
import AuthContext from "../context/auth-context"
import './NavLinks.css'

const NavLinks = props => {

    // To use context, import and assign it
    const auth = useContext(AuthContext)

    return (
        <ul className='nav-links'>

            <li>
                {/* exact here tells to only mark this as active when we are on this exact url, not just on any route that starts with / */}
                <NavLink to='/' exact>ALL USERS</NavLink>
            </li>

            {/* Only show these items when Logged in */}
            {auth.isLoggedIn && (
                <li>
                    <NavLink to={`/${auth.userId}/places`}>MY PLACES</NavLink>
                </li>
            )}

            {auth.isLoggedIn && (
                <li>
                    <NavLink to='/places/newplace'>ADD PLACE </NavLink>
                </li>
            )}

            {!auth.isLoggedIn && (
                <li>
                    <NavLink to='/auth'>AUTHENTICATE</NavLink>
                </li>
            )}

            {auth.isLoggedIn && (
                <li>
                    <button onClick= {auth.logout}>LOGOUT</button>
                </li>
            )}

        </ul>
    )
}

export default NavLinks
