import React, { useEffect, useState } from 'react'
import UsersList from '../components/UsersList'
import ErrorModal from '../../shared/components/UIElements/ErrorModal'
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner'
import { useHttpClient } from '../../shared/components/hooks/http-hook'

/*
    Page that displays list of users
*/

const Users = () => {

    const [loadedUsers, setLoadedUsers] = useState()

    const { sendRequest, isLoading, error, clearError } = useHttpClient()

    // TODO useEffect async properly with callback 
    // set useEffect in a way that it will only run one time per visit and not on every rerender
    // useEffect DOES NOT want a function that returns a promise, so cant use async/await directly 
    useEffect(() => {

        // use IIFE (Immediately Invoked Function Expression) and apply async for async task
        const fetchUsers = async () => {

            try {

                // By default fetch is get request, and does not requre headers or data to post 
                const responseData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/users`);

                // Can check response from backend for why we picked users property in response
                setLoadedUsers(responseData.users)

            } catch (error) {

            }

        }

        fetchUsers();

    }, [sendRequest]) //Because of useCallback on custom hook, the same reference/instance of this function is always used and prevents infinite loop

    return (

        <React.Fragment>

            <ErrorModal error={error} onClear={clearError} />
            {isLoading && (
                <div className="center">

                    <LoadingSpinner />

                </div>
            )}

            {/* Render User When we have users from fetch request */}
            {loadedUsers && <UsersList
                items={loadedUsers}
            />}

        </React.Fragment>

    )
}

export default Users