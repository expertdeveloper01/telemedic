// This is the CommonRoute Page for both doctor and patient
import React from "react";
import { Route, Redirect } from "react-router";
import { useSelector } from "react-redux";
// import Layout from './../components/Header'
export default function CommonRoute({ component: Component, ...rest }) {
  // get userinfo from state
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  return (
    <Route
      {...rest}
      // if user is Patient then redirect to the page he wants to go to
      render={(props) =>
        userInfo ? (
          <Component {...props} />
        ) : (
          // if the above condition does not match, then redirect the user to login page
          <Redirect to="/" />
        )
      }
    />
  );
}