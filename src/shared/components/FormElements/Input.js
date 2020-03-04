import React, { useReducer, useEffect } from 'react'
import { validate } from '../Util/Validator'

import './Input.css'

const inputReducer = (state, action) => {
    switch (action.type) {

        case 'CHANGE':
            // console.log(`From input.js -- is valid ${validate(action.val, action.validators)}`)
            return {
                // copies old state so we don't lose it
                ...state,

                // and then override properties
                value: action.val,
                isValid: validate(action.val, action.validators)
            }

        case 'TOUCH':
            return {
                // Copy of previous state
                ...state,
                // over ride necessary properties
                isTouched: true,

            }

        default:
            return state;

    }
}

/*
    Versatile Form Input Component 
    TODO  Research useReduce more
*/
const Input = props => {

    // Arguments in useReducer are a reducer function and an initial state
    // It returns the state and a dispatch function that is used to alter the state
    const [inputState, dispatch] = useReducer(inputReducer, {

        // If props value provided use it, otherwise it is empty
        value: props.initialValue || '',
        isValid: props.initialValid || false,
        isTouched: false,
    });


    // Get more specific values to use as dependancies for useEffect as to not run it to many times
    const { id, onInput } = props;
    const { value, isValid } = inputState;


    useEffect(() => {

        // Passed function will update the parent component state
        // console.log(`+++++IsValid being passed to state of form ${isValid}`)

        onInput(id, value, isValid)

    }, [id, onInput, value, isValid]) // Logic above will run whenever props or inputState changes

    // Dispatch arguments are passed as action to inputReducer in useReducer
    // To change state to match user input
    const changedHandler = event => {

        // Passes action object to reducer function
        dispatch({
            type: 'CHANGE',
            val: event.target.value,
            validators: props.validators
        })
    }

    // WHen user clicks input and then clicks something else, change state to make app aware it can now test input validation
    const touchHandler = () => {
        dispatch({ type: 'TOUCH' })
    }

    // Prop determines if input type will be text area or another input type
    const element = props.element === 'input' ? (

        <input
            id={props.id}
            type={props.type}
            placeholder={props.placeholder}
            onChange={changedHandler}

            // Blur is when user clicks input THEN clicks something else, 
            onBlur={touchHandler}
            value={inputState.value}

        />)
        : (
            <textarea
                id={props.id}
                rows={props.rowss || 3}
                onChange={changedHandler}
                onBlur={touchHandler}
                value={inputState.value}
            />
        );

    return (

        // If input state is invalid AND User had clicked input then clicked something else without passing validation , add invalid class
        <div className={`form-control ${!inputState.isValid && inputState.isTouched && 'form-control--invalid'}`}>

            {/* htmlFor os for attribute, links label to the input type so page focuses on input when user touches label */}
            <label htmlFor={props.id}> {props.label} </label>
            {element}

            {/* When input is invalid render error text */}
            {!inputState.isValid && inputState.isTouched && <p>{props.errorText}</p>}

        </div>
    )
}


export default Input
