import React, { useContext } from 'react'
import { useHistory } from 'react-router-dom'

import Input from '../../shared/components/FormElements/Input'
import Button from '../../shared/components/FormElements/Button';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ImageUpload from '../../shared/components/FormElements/ImageUpload'


import {
    VALIDATOR_REQUIRE,
    VALIDATOR_MINLENGTH
} from "../../shared/components/Util/Validator"

import useForm from '../../shared/components/hooks/form-hook'
import { useHttpClient } from '../../shared/components/hooks/http-hook'

import AuthContext from '../../shared/components/context/auth-context'

import './PlaceForm.css'

/*
    Page component where user can fill out form and add a new place
*/
const NewPlace = () => {

    // Get Access to information in our custom context
    const auth = useContext(AuthContext);

    const { sendRequest, isLoading, error, clearError } = useHttpClient()

    // Custom Hook needs object of inputs, and initial form validity
    const [formState, inputHandler] = useForm({

        // isValids are initially false because when creating new place fields should be empty(which fails validation)

        title: {
            value: '',
            isValid: false
        },
        description: {
            value: '',
            isValid: false
        },
        address: {
            value: '',
            isValid: false
        },
        image: {
            value: null,
            isValid: false
        }

    },
        false
    )

    //  hook returns history object that can be used to redirect and go back and forth visited links
    const history = useHistory()

    const placeSubmitHandler = async event => {

        // Prevent form from refreshing page which would ruin react render
        event.preventDefault();

        try {

            const formData = new FormData();
            formData.append('title', formState.inputs.title.value)
            formData.append('description', formState.inputs.description.value)
            formData.append('address', formState.inputs.address.value)
            formData.append('image', formState.inputs.image.value)

            await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/places/`,
                'POST',
                formData,
                {   // Attatch Authorization header 
                    Authorization: `Bearer ` + auth.token
                }
            )

            // redirect user to home page
            history.push('/')

        } catch (error) {
            // errors handled in hook using send request
        }

    }


    return (

        <React.Fragment>

            <ErrorModal error={error} onClear={clearError} />>

            {isLoading && <LoadingSpinner asOverlay />}

            <form className="place-form" onSubmit={placeSubmitHandler}>

                {/* All Inputs change different properties of the same state */}

                <Input
                    id='title'
                    element='input'
                    type='text'
                    label='Title'
                    // VALIDATOR CHECKS IF INPUT IS EMPTY 
                    validators={[VALIDATOR_REQUIRE()]}
                    onInput={inputHandler}
                    errorText='Please Enter a valid title'
                />

                <Input
                    id='description'
                    element='textarea'
                    label='Description'
                    // VALIDATOR CHECKS IF INPUT IS EMPTY 
                    validators={[VALIDATOR_MINLENGTH(5)]}
                    errorText='Please Enter a valid description(at least 5 characters).'
                    onInput={inputHandler}
                />

                <Input
                    id='address'
                    element='input'
                    type='text'
                    label='Adress'
                    // VALIDATOR CHECKS IF INPUT IS EMPTY 
                    validators={[VALIDATOR_REQUIRE()]}
                    onInput={inputHandler}
                    errorText='Please Enter a valid address'
                />

                <ImageUpload
                    id='image'
                    onInput={inputHandler}
                // errorText='Please provide an image'

                />

                <Button type='submit' disabled={!formState.isValid}>
                    ADD PLACE
                </Button>

            </form>

        </React.Fragment>

    )

}

export default NewPlace