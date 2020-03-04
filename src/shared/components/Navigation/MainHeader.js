import React from 'react'

import './MainHeader.css'

const MainHeader = (props) => {
    return (
        <header className='main-header'>
            {/* Will accept anything inside opening and closing tags when this component is called */}
            {props.children}

        </header>
    )
}
export default MainHeader