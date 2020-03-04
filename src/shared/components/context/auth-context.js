import { createContext } from 'react'

// Create a context that we will assign value to in App.js
// This object will keep track of values to be shared with listening components
const AuthContext = createContext({
    isLoggedIn: false,
    userId:null,
    token:null,
    login: () => { },
    logout: () => { }
})

export default AuthContext