import React, { useState } from 'react'
import { Link } from "react-router-dom";

import MainHeader from './MainHeader'
import NavLinks from './NavLinks'
import SideDrawer from "./SideDrawer";
import Backdrop from "../UIElements/Backdrop";

import './MainNavigation.css'

const MainNavigation = props => {

    const [drawerIsOpen, setDrawerIsOpen] = useState(false)

    // Use useState functions to open or close drawer
    const openDrawerHandler = () => {
        setDrawerIsOpen(true)
    }

    const closeDrawerHandler = () => {
        setDrawerIsOpen(false)
    }


    return (

        // Fragment used so we don't have to nest everything in a div, Fragment does not show up as DOM node
        <React.Fragment>

            {/* If drawer is open, render Background so if user toches outside of drawer the drawer will close */}
            {drawerIsOpen && <Backdrop onClick={closeDrawerHandler} />}

            {/* If drawer is open is true, drawer enter animation starts and exits when false */}
            <SideDrawer
                show={drawerIsOpen}
                onClick={closeDrawerHandler}
            >

                <nav className="main-navigation__drawer-nav">
                    <NavLinks />
                </nav>

            </SideDrawer>

            <MainHeader>

                {/* Responsive Hamburger Menu for Smaller screens */}
                <button
                    className="main-navigation__menu-btn"
                    onClick={openDrawerHandler}>
                    <span />
                    <span />
                    <span />
                </button>

                <h1 className="main-navigation__title">

                    {/* Link from react router DOM is handled in Switch in App.js */}
                    <Link to='/'> Your Places </Link>

                </h1>

                <nav className="main-navigation__header-nav">
                    <NavLinks />
                </nav>

            </MainHeader>

        </React.Fragment>
    )
}


export default MainNavigation
