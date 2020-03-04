import React, { useRef, useEffect } from 'react'

import './Map.css'

/*
    Component that displays Google Map
*/
const Map = props => {

    // TODO Ref React
    const mapRef = useRef();

    // Get center and zoom value from props
    const { center, zoom } = props;

    // TODO useEffect : Registers a logic/function when certain inputs change
    // first param is logic, second is array of dependancies that if triggered will start logic
    useEffect(() => {

        // Imported gooogle maps in index.html which is now accessed through window (global variable)
        // Second Argument is 
        const map = new window.google.maps.Map(mapRef.current,
            {
                center: center,
                zoom: zoom
            })

        new window.google.maps.Marker({ position: center, map: map })

        // When center or zoom are changed, trigger function
    }, [center, zoom])

    return (
        <div
            // 
            ref={mapRef}
            className={`map ${props.className}`}
            style={props.style}

        >

        </div>
    )
}

export default Map
