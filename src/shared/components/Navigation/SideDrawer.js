import React from 'react'
import ReactDOM from 'react-dom'

// TODO Learn this package better
import { CSSTransition } from "react-transition-group";

import './SideDrawer.css'

const SideDrawer = props => {

    const content = (

        <CSSTransition
            in={props.show}
            timeout={200}
            // classNames is Unique prop read by this component
            classNames='slide-in-left'
            mountOnEnter
            unmountOnExit>

            <aside 
            className="side-drawer"
            onClick={props.onClick}
            >
                {props.children}
            </aside>

        </CSSTransition>

    )

    // Portal takes our content and a node where we want to hook it
    return ReactDOM.createPortal(content, document.getElementById('drawer-hook'))
}


export default SideDrawer
