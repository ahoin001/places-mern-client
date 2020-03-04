import React, { useState, useContext } from 'react'

import AuthContext from "../../shared/components/context/auth-context"
import Input from '../../shared/components/FormElements/Input'
import useForm from '../../shared/components/hooks/form-hook'
import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH, VALIDATOR_EMAIL } from "../../shared/components/Util/Validator";
import Button from '../../shared/components/FormElements/Button';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import { useHttpClient } from '../../shared/components/hooks/http-hook';

import Card from '../../shared/components/UIElements/Card';
import ImageUpload from '../../shared/components/FormElements/ImageUpload';

import './Auth.css'
/*
    Page component where user Can sign up or sign in
*/
const Authenticate = props => {

    // Import our context then use it with hook
    const auth = useContext(AuthContext);

    // State to determine if in Login mode or not
    const [isLoginMode, setisLoginMode] = useState(true)

    const { isLoading, error, sendRequest, clearError } = useHttpClient();

    // Use custom hook for formHandling our custom Input components
    const [formState, inputHandler, setFormData] = useForm({
        email: {
            value: '',
            isValid: false
        },
        password: {
            value: '',
            isValid: false
        }

    },
        false)

    const authSubmitHandler = async event => {

        event.preventDefault();

        // console.log(formState.inputs)

        if (isLoginMode) {

            try {

                // console.log(`${process.env.REACT_APP_BACKEND_URL}`)
                // From hook, use fetch call to post data for login, if no errors, will proceed to login
                const responseData = await sendRequest(
                    `${process.env.REACT_APP_BACKEND_URL}/users/login`,
                    "POST",
                    JSON.stringify({ //format object to json for request

                        // Data expected by backend/api
                        email: formState.inputs.email.value,
                        password: formState.inputs.password.value

                    }),
                    {   //Header , Will tell backend what type of data it will recieve
                        'Content-Type': 'application/json'
                    }
                )

                console.log(`###RESPONSE DATA ON LOGIN UP: UID: ${responseData.userId} , Token: ${responseData.token}`)

                // Login using context so all components listening will know what user is signed in
                // Also save jwt to context
                auth.login(responseData.userId, responseData.token);

            } catch (error) {

            }

        } else {

            try {

                // Unlike login, sign up also accepts an image so first I need to change form data

                const formData = new FormData();
                formData.append('email', formState.inputs.email.value)
                formData.append('name', formState.inputs.name.value)
                formData.append('password', formState.inputs.password.value)
                formData.append('image', formState.inputs.image.value) // check user roues, used image here because 'image' key is expected in req.body

                // When using formData, fetch will send the appropiate headers
                const responseData = await sendRequest(
                    `${process.env.REACT_APP_BACKEND_URL}/users/signup`,
                    "POST",
                    formData
                )

                console.log(`###RESPONSE DATA ON SIGN UP: UID: ${responseData.userId} , Token: ${responseData.token}`)
                auth.login(responseData.userId, responseData.token);

            } catch (err) {

            }

        }

    }

    const switchModeHandler = () => {

        // If in sign up, before switching to login mode remove name from state
        // and make login form valid if email and password are already valid
        if (!isLoginMode) {

            setFormData(
                {
                    // Carry over inputs that were already made
                    ...formState.inputs,

                    // set to undefined to drop property from state
                    name: undefined,
                    image: undefined
                },
                formState.inputs.email.isValid && formState.inputs.password.isValid
            )

        }
        // from login to sign up, create a name property in state
        else {
            setFormData({
                ...formState.inputs,
                name: {
                    value: '',
                    isValid: false
                },
                image: {
                    value: null, // will be a file
                    isValid: false
                }
            },
                false)
        }

        // toggle loginMode
        setisLoginMode(prevMode => !prevMode)
    }

    return (

        <React.Fragment>

            {/* Error from state */}
            <ErrorModal error={error} onClear={clearError} />

            <Card className="authentication">

                {isLoading && <LoadingSpinner asOverlay />}

                <h2> Login Required</h2>
                <hr />

                <form onSubmit={authSubmitHandler}>

                    {!isLoginMode &&
                        <Input
                            id='name'
                            element='input'
                            type='text'
                            label='Name'
                            validators={[VALIDATOR_REQUIRE()]}
                            onInput={inputHandler}
                            errorText='Please Enter a name'
                        />}

                    <Input
                        id='email'
                        element='input'
                        type='email'
                        label='Email'
                        validators={[VALIDATOR_EMAIL()]}
                        onInput={inputHandler}
                        errorText='Please Enter a valid email'
                    />

                    <Input
                        id='password'
                        element='input'
                        type='text'
                        label='Password'
                        validators={[VALIDATOR_MINLENGTH(6)]}
                        onInput={inputHandler}
                        errorText='Please Enter a valid password: Must Be at least 6 characters'
                    />

                    {!isLoginMode && <ImageUpload id="image" center onInput={inputHandler} />}

                    <Button disabled={!formState.isValid}>
                        {isLoginMode ? 'LOGIN' : 'SIGN UP'}
                    </Button>

                </form>

                <Button inverse onClick={switchModeHandler}> SWITCH TO {isLoginMode ? 'SIGN UP' : 'LOGIN'} </Button>

            </Card>

        </React.Fragment>

    )

}

export default Authenticate
