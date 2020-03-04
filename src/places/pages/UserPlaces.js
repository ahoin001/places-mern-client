import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useHttpClient } from '../../shared/components/hooks/http-hook'

import PlaceList from '../components/PlaceList'
import ErrorModal from '../../shared/components/UIElements/ErrorModal'
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner'

/*
    Page component that contains components that list places
*/
const UserPlaces = (props) => {

    const [loadedPlaces, setLoadedPlaces] = useState()
    const { isLoading, error, sendRequest, clearError } = useHttpClient();

    // TO READ ROUTE PARAMETER
    // Gets whatver is provided in :userId of navlink url
    const userID = useParams().userId;

    // Check Users.js for comments on why written this way 
    useEffect(() => {

        const fetchPlaces = async () => {

            try {

                const responseData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/places/user/${userID}`);

                // Save returned list of places to state
                setLoadedPlaces(responseData.places)

            } catch (error) { }

        };

        fetchPlaces();

    }, [sendRequest, userID]);


    const placeDeletedHandler = (deletedPlaceId) => {

        // using previous state, filter out the place that we deleted by it's id, then rerender
        setLoadedPlaces(prevPlaces =>
            prevPlaces.filter(place => place.id !== deletedPlaceId))
    }

    console.log(`LOADED PLACES LIST`, loadedPlaces)

    return (

        <React.Fragment>

            <ErrorModal error={error} onClear={clearError} />

            {isLoading && <div className='center'> <LoadingSpinner /> </div>}

            {!isLoading && loadedPlaces && <PlaceList items={loadedPlaces} onDeletePlace={placeDeletedHandler} />}

        </React.Fragment>

    )
}

export default UserPlaces;