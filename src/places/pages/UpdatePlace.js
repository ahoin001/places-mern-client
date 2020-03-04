import React, { useEffect, useState, useContext } from 'react'
import { useParams, useHistory } from 'react-router-dom'

import useForm from '../../shared/components/hooks/form-hook'
import { useHttpClient } from '../../shared/components/hooks/http-hook'
import AuthContext from '../../shared/components/context/auth-context'


import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH } from "../../shared/components/Util/Validator";
import Input from '../../shared/components/FormElements/Input'
import Button from '../../shared/components/FormElements/Button';
import Card from '../../shared/components/UIElements/Card';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';


import './PlaceForm.css'

const UpdatePlace = props => {

    const history = useHistory();

    const { sendRequest, clearError, error, isLoading } = useHttpClient();
    const [loadedPlace, setLoadedPlace] = useState()

    // Get the parameter/argument from :placeId in  /place/:placeId link
    const placeId = useParams().placeId

    const auth = useContext(AuthContext)

    // Form State will be returned state of this components form
    // Input Handler used to update state given to useFrom Hook
    // 
    const [formState, inputHandler, setFormData] = useForm(
        {
            title: {
                value: '',
                isValid: false
            },
            description: {
                value: '',
                isValid: false
            }
        },
        false
    );

    // Find the place the user wants to edit by ID
    useEffect(() => {

        const fetchPlace = async () => {

            try {

                const responseData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`);

                console.log(`RESPONSE#######:`, responseData.place)

                setLoadedPlace(responseData.place);

                setFormData(
                    {
                        title: {
                            value: responseData.place.title,
                            isValid: true
                        },
                        description: {
                            value: responseData.place.description,
                            isValid: true
                        }
                    },
                    true
                );

            } catch (error) {
                // Errors dealt with in hook
            }

        }

        fetchPlace();

    }, [sendRequest, placeId, setFormData])

    const placeUpdateSubmitHandler = async (e) => {

        e.preventDefault();

        try {

            await sendRequest(
                `${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`,
                'PATCH',
                JSON.stringify({
                    title: formState.inputs.title.value,
                    description: formState.inputs.description.value
                }),
                {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ` + auth.token // Requires token to be extracted in checkAuth to use routes
                }
            )

            history.push(`/${auth.userId}/places`)

        } catch (error) {
            // Errors dealt with in hook
        }

        console.log(formState.inputs)

    }

    if (isLoading) {
        return (

            <div className='center'>

                <LoadingSpinner />

            </div>

        )
    }

    if (!loadedPlace && !error) {

        return (
            <div className='center'>
                <Card>

                    <h2>COULD NOT FIND REQUESTED PLACE</h2>

                </Card>
            </div>
        )

    }

    // console.log(`LOADED PLACE: `, loadedPlace)

    return (

        <React.Fragment>

            <ErrorModal error={error} onClear={clearError} />

            {!isLoading && loadedPlace && (

                <form className="place-form" onSubmit={placeUpdateSubmitHandler}>

                    {/* All Inputs change different properties of the component state */}

                    <Input
                        id='title'
                        element='input'
                        type='text'
                        label='Title'
                        validators={[VALIDATOR_REQUIRE()]}
                        errorText='Please Enter a valid title'
                        onInput={inputHandler}
                        initialValue={loadedPlace.title}
                        initialValid={true}
                    />

                    <Input
                        id="description"
                        element='textarea'
                        type="text"
                        label="Description"
                        validators={[VALIDATOR_MINLENGTH(5)]}
                        onInput={inputHandler}
                        errorText="Please enter a valid description with at least 5 characters"
                        initialValue={loadedPlace.description}
                        initialValid={true}
                    />

                    <Button type="submit" disabled={!formState.isValid}>
                        UPDATE PLACE
          </Button>

                </form>

            )}

        </React.Fragment>



    );


}

export default UpdatePlace
