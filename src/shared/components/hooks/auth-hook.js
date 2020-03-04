import { useState, useCallback, useEffect } from 'react'

let logoutTimer;

const useAuth = () => {
    // console.log(`AUTH HOOK`)
    /*
   State to pass if user has jwt to any component that needs the info
  */

    const [token, setToken] = useState(false)
    const [tokenExpirationDateState, settokenExpirationDateState] = useState()

    // Will be used in context to keep track of unique users signed in
    const [userId, setUserId] = useState(false)

    const login = useCallback((uid, token, expirationDate) => {

        setToken(token);
        setUserId(uid);

        // When logging in, if a valid expiration date is given, keep it 
        // IF no expiration date is given, set one 1 hour from now
        const tokenExpirationDate = expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60)

        settokenExpirationDateState(tokenExpirationDate)

        // Use LocalStorage to storetoken, local storage is available globally from the browser
        // Only accepts string so stringify objects
        localStorage.setItem('userData', JSON.stringify(
            {
                userId: uid,
                token: token,
                expiration: tokenExpirationDate.toISOString() // Date object as string

            }))


    }, [])

    const logout = useCallback(() => {
        setToken(null)
        settokenExpirationDateState(null)
        setUserId(null);
        localStorage.removeItem('userData')
    }, []
    )

    // if changes in token or logout or expirationdate in state
    useEffect(() => {

        // check the users token expiration date to get time remaining, then call logout when that time is reached
        if (token && tokenExpirationDateState) {

            const remainingTimeUntilExpirationDate = tokenExpirationDateState.getTime() - new Date().getTime()

            // excecute logout function after expiration time, 
            logoutTimer = setTimeout(logout, remainingTimeUntilExpirationDate);

        } else {

            // Clear any ongoing timers (Situation where user logged out manually, so if they login again there is not multiple timers)
            clearTimeout(logoutTimer)

        }

    }, [token, logout, tokenExpirationDateState])

    // Check if browser still has user data, to log them in if thier token has not expired
    useEffect(() => {

        const storedData = JSON.parse(localStorage.getItem('userData'))

        if (storedData &&
            storedData.token &&
            new Date(storedData.expiration) > new Date() // If token still valid (expiration deadline is still ahead of current time)
        ) {

            // then token is still valid and user can be logged in
            login(storedData.userId, storedData.token, new Date(storedData.expiration))

        }

    }, [login])

    return { token, login, logout, userId }

}

export default useAuth
