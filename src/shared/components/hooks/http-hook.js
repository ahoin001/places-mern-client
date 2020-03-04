import { useState, useRef, useCallback, useEffect } from 'react'

/*
Custom hook created to prevent repeating fetch requests and setting states in components
*/
export const useHttpClient = () => {

    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState()

    // Using useRef to store data across rerender cycles
    // Will be storing one instance of abortController to persist rerenders
    const activeHttpRequests = useRef([])

    // useCallback prevents the needless/infinite recreation of function on rerender (unless a dependancy is given)
    // Ex/ A component using this hook rerenders, w/o useCalllback this would run our hook again and create a new instance of everything (causing loop with useEffect)
    const sendRequest = useCallback(async (

        url,
        method = 'GET',
        body = null,
        headers = {}

    ) => {

        setIsLoading(true)

        // AbortController provided by browser, signal property 
        const httpAbortController = new AbortController();

        // Add it to array initialzied in useRef, so it will not be destroyed/recreated
        activeHttpRequests.current.push(httpAbortController)

        try {

            const response = await fetch(url, {
                method,
                headers,
                body,
                signal: httpAbortController.signal //Connects to our Abort controller
            })

            // Response won't be in json format so we parse it to be usable
            const responseData = await response.json()

            // After finishing async tasks, remove the instance of httbabortconrtoller from our array of requests
            // So, clear abrtctrls that belong to completed requests, To prevent cancelling requests that are already completed
            activeHttpRequests.current = activeHttpRequests.current.filter(requestController =>
                requestController !== httpAbortController)

            // TODO NOTE* Fetch will not go to catch block even when response contains 404 or 500's error
            // So manually throw error if response has an error attatched, checked by .ok property
            if (!response.ok) {

                // Create error with errror message from the response ( In backend the response has .message property with error description)
                // Error has message property that will read this value in catch
                throw new Error(responseData.message)

            }

            setIsLoading(false)
            return responseData;

        } catch (error) {
            setError(error.message)
            setIsLoading(false)

            // Will Throw error to component using the hook
            throw error;
        }

    }, []);

    const clearError = () => {
        setError(null)
    }

    // useEffect replaces lifecycle methods
    useEffect(() => {

        // returning  a function will act as a "cleanup function" that occurs when the component unmounts
        return () => {

            // On unmount,in ref array, iterate httprequetsts and abort the active request(s)
            // and abort them by calling abort method on all abrtCtrl's created by any pending requests
            activeHttpRequests.current.forEach(abortController => {
                abortController.abort()
            });

        }

    }, [])

    return { isLoading, error, sendRequest, clearError }

}
