import React from 'react'
import ReactDOM from "react-dom";
import { CSSTransition } from 'react-transition-group'

import './Modal.css'
import Backdrop from './Backdrop';

/*
    Content of Modal
*/
const ModalOverlay = props => {

    const content = (

        //String interpolation here allows us flexobility of passing in our own class name and style object
        <div className={`modal ${props.className}`} style={props.style}>

            <header className={`modal__header ${props.headerClass}`}>
                <h2>{props.header}</h2>
            </header>

            {/* Form is used so I can use button in footer */}
            {/* If onsubmit function provided,use it, else prevent butttons from refreshing page onsubmit */}
            <form onSubmit={props.onSubmit ? props.onSubmit : event => event.preventDefault()}>

                <div className={`modal__content ${props.contentClass}`}>

                    {/* THIS IS WHERE CONTENT FROM CHILDREN IS USED */}
                    {/* So we can pass as much as we need to here we use children */}
                    {props.children}

                </div>

                <footer className={`footer ${props.footerClass}`}>
                    {props.footer}
                </footer>

            </form>

        </div>
    )

    return ReactDOM.createPortal(content, document.getElementById('modal-hook'));

}


/*
    Reusable Modal that has an animation and accepts children (used in Modal Overlay) to show content
*/
const Modal = props => {

    return (

        <React.Fragment>

            {/* If we have true for show prop meaning modal is showing, render Backdrop, & onClick handle cancellation for user to tap and leave  */}
            {props.show && <Backdrop onClick={props.onCancel} />}

            {/* Animation rules */}
            <CSSTransition
                // props.show true will make modal come in
                in={props.show}
                mountOnEnter
                unmountOnExit
                timeout={200}
                classNames='modal'
            >

                {/* Actual modal content from above component */}
                {/* ...props will take all props passed in to Modal will be given to Model Overlay as well */}
                <ModalOverlay {...props} />

            </CSSTransition>

        </React.Fragment>

    )

}

export default Modal
