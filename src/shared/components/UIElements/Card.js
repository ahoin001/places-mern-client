import React from 'react';

import './Card.css';

/*
    Component thatacts as styled container
*/

const Card = props => {
  return (
    <div className={`card ${props.className}`} style={props.style}>
      {props.children}
    </div>
  );
};

export default Card;
