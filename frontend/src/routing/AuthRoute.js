// This is the AuthRouting Page

import React, { Component } from "react";
import { connect } from "react-redux";
import { Route, Redirect } from "react-router-dom";
/***
 * function to declare auth routing
 */

export class AuthRoute extends Component {
  render() {
    const {
      component: Component,
      userLogin,
      ...rest
    } = this.props;
    const { userInfo } = this.props.userLogin;

    return (
      <Route
        {...rest}
        render={(props) =>
          !userInfo ? (
            <Component {...props} />
          ) : !userInfo?.state ? (
            <Redirect to="/update-profile" />
          ) : userInfo?.userType === "doctor" ? (
            <Redirect to="/" />
          ) : (
            <Redirect to={"/"} />
          )
        }
      />
    );
  }
}

const mapStateToProps = (state) => ({
  userLogin: state.userLogin,
});

export default connect(mapStateToProps)(AuthRoute);