import React from 'react'

import UserItem from './UsersItem'
import Card from '../../shared/components/UIElements/Card'

import './UsersList.css'

/*
    Component that is a list that displays users
*/

export default function UsersList(props) {

    // If the user list is empty, then notify front end with div
    if (props.items.length === 0) {
        return (
            <div className="center">
                <Card>
                    <h2>No users found.</h2>
                </Card>
            </div>
        )
    }

    // Else If there is a list, retur a user item for each user on the list given user info
    return (
        <ul className='users-list'>
            {props.items.map(user => {
                return (

                    <UserItem
                        key={user.id}
                        id={user.id}
                        image={user.image}
                        name={user.name}
                        placeCount={user.places.length}
                    />

                )
            })}
        </ul>
    )
}
