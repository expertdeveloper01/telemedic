// This is the Patient Page


import React from 'react'
import { Route, Redirect } from 'react-router'
import { useSelector } from 'react-redux'

/**PATIENT ROUTE */

export default function PatientRoute({ component: Component, ...rest }) {

    // get userinfo from state
    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    return (
        <Route {...rest}
            // if user is Patient then redirect to the page he wants to go to
            render={props => userInfo?.userType === 'patient' ? (<Component {...props} />)
                // if the above condition does not match, then redirect the user to login page
                : <Redirect to='/' />} />)
}