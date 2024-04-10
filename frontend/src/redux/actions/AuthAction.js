import {
  // Login User Components
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAIL,
  USER_LOGOUT,

  // Regiter  User Components
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_REGISTER_FAIL,
  RESET_MESSAGES,

  // User Details Components
  USER_DETAILS_FAIL,
  USER_DETAILS_RESET,

  // UpdateProfile  Components
  USER_UPDATE_PROFILE_REQUEST,
  USER_UPDATE_PROFILE_FAIL,

  // PasswordReset  Components
  PASSWORD_RESET_CONFIRM_FAIL,
  PASSWORD_RESET_REQUEST,
  PASSWORD_RESET_SUCCESS,
  PASSWORD_RESET_FAIL,
  PASSWORD_RESET_CONFIRM_SUCCESS,
} from "../../constants/userConstants";

import api from "../../util/api";

/**USER ACTIONS */

// User Register Action
export const register = (params) => async (dispatch) => {
  try {
    dispatch({
      type: USER_REGISTER_REQUEST,
    });

    const { data } = await api.post("/mongo_auth/signup/", params);

    dispatch({
      type: USER_REGISTER_SUCCESS,
      payload: data.detail,
    });

    //For clearfields
    return true;
    // dispatch({
    //     type: USER_LOGIN_SUCCESS,
    //     payload: data
    // })

    // localStorage.setItem('userInfo', JSON.stringify(data))
  } catch (error) {
    dispatch({
      type: USER_REGISTER_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

// Login Action
export const login = (email, password, userType) => async (dispatch) => {
  try {
    dispatch({
      type: USER_LOGIN_REQUEST,
    });

    // save 'data' variable for data coming from backend
    const { data } = await api.post(
      "/users/login/",
      // set username to email and password to password
      { email, password, userType },
    );

    // if success
    dispatch({
      type: USER_LOGIN_SUCCESS,
      payload: data,
    });

    // localStorage set item
    localStorage.setItem("userInfo", JSON.stringify(data));
    console.log(".....data", data);
  } catch (error) {
    if (error?.response?.data) {
      // error handling
      dispatch({
        type: USER_LOGIN_FAIL,
        // payload: error?.response?.data || (error.response && error.response.data.detail ? error.response.data.detail : error.message),
        payload:
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.response.data,
      });
    }
  }
};

// Logout Action
export const logout = () => (dispatch) => {
  // remove items from local storage when the user logs out
  localStorage.removeItem("userInfo");
  dispatch({ type: USER_LOGOUT });
  dispatch({ type: USER_DETAILS_RESET });
};

/***
 * Get UserDetails
 */
export const getUserDetails = (id) => async (dispatch, getState) => {
  try {
    const {
      userLogin: { userInfo },
    } = getState();
    console.log("..userInfo", userInfo);
    const { data } = await api.get(`/users/user/${id}/`);
    console.log("<<<data", data);
    dispatch({
      type: USER_LOGIN_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: USER_DETAILS_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};
/**
 * Update user Profile
 */
export const updateUserProfile = (user) => async (dispatch, getState) => {
  try {
    dispatch({
      type: USER_UPDATE_PROFILE_REQUEST,
    });
    const { data } = await api.put(`/users/update/profile`, user);
    dispatch({
      type: USER_LOGIN_SUCCESS,
      payload: data,
    });
    console.log("......dataaa", data);
    localStorage.setItem("userInfo", JSON.stringify(data));

    return data;
  } catch (error) {
    console.log("object", error);
    dispatch({
      type: USER_UPDATE_PROFILE_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

// Reset Password
export const reset_password = (email) => async (dispatch) => {
  try {
    dispatch({
      type: PASSWORD_RESET_REQUEST,
    });

    const { data } = await api.post(`/users/resetpassword`, { email });
    dispatch({
      type: PASSWORD_RESET_SUCCESS,
      payload: data.message,
    });
  } catch (error) {
    dispatch({
      type: PASSWORD_RESET_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

// Reset Confirm Password
export const reset_password_confirm =
  (uid, new_password) => async (dispatch) => {
    try {
      const { data } = await api.post(`/users/verifyresetpassword`, {
        uid,
        new_password,
      });
      dispatch({
        type: PASSWORD_RESET_CONFIRM_SUCCESS,
        payload: data,
      });
      console.log("resetsucess", data)
      return data;
    } catch (err) {
      dispatch({
        type: PASSWORD_RESET_CONFIRM_FAIL,
        payload: err?.response?.data || "Something went wrong",
      });
    }
  };

export const activateAccount = (uid) => async (dispatch) => {
  try {
    const { data } = await api.post(`/users/activate/`, { uid });

    return data;
  } catch (err) { }
};

export const resendAccount = (email) => async (dispatch) => {
  try {
    const { data } = await api.post(`/users/resendmail`, { email });

    return data;
  } catch (err) { }
};

export const resetMessages = () => async (dispatch) => {
  console.log("resetmessages", resetMessages);
  dispatch({
    type: RESET_MESSAGES,
  });
};
