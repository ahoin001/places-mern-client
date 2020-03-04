import React from 'react';
import ReactDOM from 'react-dom';

import './Backdrop.css';

// Takes up screen, when pressed, we change state in drawer.js with props.onClick

const Backdrop = props => {
  return ReactDOM.createPortal(

    <div className="backdrop" onClick={props.onClick}></div>,
    document.getElementById('backdrop-hook')

  );
};

export default Backdrop;
