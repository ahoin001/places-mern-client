import React from 'react'

// Wraps and renders a anchor tag, and blocks default link logic (redirecting to page , now we will re render through router)
import { Link } from "react-router-dom";

import Avatar from "../../shared/components/UIElements/Avatar";
import Card from "../../shared/components/UIElements/Card";

import './UsersItem.css'

/*
    Component that is user item with user info to be displayed on list
*/

const UsersItems = (props) => {


    return (

        <li className='user-item'>

            <Card className='user-item__content'>

                {/* Dynamic Link, the unique userID will be used to go to specific user pages */}
                <Link to={`/${props.id}/places`}>

                    <div className='user-item__image'>

                        {/* Avatar component handles mutation of image */}
                        {/* Using Multer I stored images locally, front end prepends the path and back end provides the relative path  */}
                        <Avatar image={`${process.env.REACT_APP_ASSET_URL}/${props.image}`} alt={props.name} />

                        {/* <img src={props.image} alt={props.name} /> */}

                    </div>

                    <div className='user-item__info'>

                        <h2>{props.name}</h2>

                        {/* Conditional text if single or plural places */}
                        <h3>{props.placeCount} {props.placeCount === 1 ? 'Place' : 'Places'}</h3>

                    </div>

                </Link>

            </Card>

        </li>

    )

}

export default UsersItems