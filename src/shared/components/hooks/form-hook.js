import { useCallback, useReducer } from 'react'

const formReducer = (state, action) => {

    switch (action.type) {

        // Saves input changes in state
        case 'INPUT_CHANGE':
            let formIsValid = true;

            // iterate through each input property in state
            for (let inputId in state.inputs) {

                // skip this iteration of loop if the property is falsy ( or undefined)
                if (!state.inputs[inputId]) {
                    // skips this iteration of for loop
                    continue
                }

                // if a property from state matches inputId from dispatch (text,description etc)
                if (inputId === action.inputId) {

                    // console.log(`IN IF- THE INPUTID: ${inputId} and actionId: ${action.inputId}
                    // AND IS FORM VALID ${action.isValid}`)

                    // form is valid is true if formIsValid and action.isValid are true
                    formIsValid = formIsValid && action.isValid;

                    // console.log(formIsValid)

                }

                else {
                    // console.log(`IN ELSE- THE INPUTID: ${inputId} and actionId: ${action.inputId}
                    // AND IS FORM VALID ${action.isValid}`)

                    formIsValid = formIsValid && state.inputs[inputId].isValid;

                    // console.log(`FROM ELSE AFTER CECKING OOTHER INNPUT${formIsValid}`)
                }
            }

            return {

                ...state,

                // and then over ride necessary info
                inputs: {

                    // Copies Properties of inputs object
                    ...state.inputs,

                    // Over ride the inputs property (title or description) that sent action
                    // Will add new property if input is not already in state (ex/ Adress is not in original state)
                    [action.inputId]: { value: action.value, isValid: action.isValid }
                },

                // YOUR PROBLEM IS THIS NOT BEING TRUE WHEN IT IS SUPPOSED TO BE
                isValid: formIsValid

            }

        // 
        case 'SET_DATA':

            // We don't copy old state because we are replacing it entirely with new data
            return {

                inputs: action.inputs,
                isValid: action.formIsValid

            }


        default:
            return state;

    }
}

// Accept inputs and validity as arguments for a given form
const useForm = (initialInputs, initialFormValidity) => {

    // formState is second argument passed to usereducer
    // inputs keeps track of validity of multiple inputs provided as arguments
    // isValid for if overall form is valid
    const [formState, dispatch] = useReducer(formReducer, {
        inputs: initialInputs,
        isValid: initialFormValidity
    })

    // Recieves id to find, value to replace, and isValid to make sure its okay
    // useCallback make sure component reuses this function on rerender instead of causing infinite loop with useEffect in 
    const inputHandler = useCallback((id, value, isValid) => {

        // Passes action object to reducer function
        dispatch({
            type: 'INPUT_CHANGE',
            value: value,
            isValid: isValid,
            inputId: id
        })

    }, [])

    // Gets input data and checks form validity then saves change in state
    const setFormData = useCallback((inputData, formValidity) => {
        dispatch({
            type: 'SET_DATA',
            inputs: inputData,
            formIsValid: formValidity
        })

    }, [])

    // Can be recieved by destructuring in other components
    return [formState, inputHandler, setFormData];

}

export default useForm
