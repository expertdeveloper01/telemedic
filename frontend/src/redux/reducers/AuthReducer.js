import {
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAIL,
  PASSWORD_RESET_CONFIRM_FAIL,
  PASSWORD_RESET_SUCCESS,
  PASSWORD_RESET_FAIL,
  PASSWORD_RESET_CONFIRM_SUCCESS,
  USER_LOGOUT,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_REGISTER_FAIL,
  USER_DETAILS_REQUEST,
  USER_DETAILS_SUCCESS,
  USER_DETAILS_FAIL,
  USER_DETAILS_RESET,
  USER_UPDATE_PROFILE_REQUEST,
  USER_UPDATE_PROFILE_SUCCESS,
  USER_UPDATE_PROFILE_FAIL,
  USER_UPDATE_PROFILE_RESET,
  RESET_MESSAGES,
  PASSWORD_RESET_REQUEST,
} from "../../constants/userConstants";
import { resetMessages } from "../actions/AuthAction";

/**USER REDUCERS */

// Login Reducer
export const userLoginReducer = (state = {}, action) => {
  console.log("..type", action.type);
  switch (action.type) {
    // Request
    case USER_REGISTER_REQUEST:
      return { ...state, loading: true };

    // Register
    case USER_REGISTER_SUCCESS:
      return { ...state, loading: false, message: action.payload };

    // Register fail
    case USER_REGISTER_FAIL:
      return { ...state, loading: false, error: action.payload };
    // Error Message Show

    case RESET_MESSAGES:
      console.log("message", resetMessages());
      return { ...state, message: null, error: null };

    case USER_DETAILS_REQUEST:
      return { ...state, loading: true };

    case USER_DETAILS_SUCCESS:
      return { ...state, loading: false, user: action.payload };

    case USER_DETAILS_FAIL:
      return { ...state, loading: false, error: action.payload };

    case USER_DETAILS_RESET:
      return { ...state, user: {} };

    case USER_LOGIN_REQUEST:
      // request
      return { ...state, loading: true };

    case USER_LOGIN_SUCCESS:
      // success
      return {
        ...state,
        loading: false,
        userInfo: { ...state.userInfo, ...action.payload },
      };

    case USER_UPDATE_PROFILE_REQUEST:
      return { ...state, loading: false };

    case USER_UPDATE_PROFILE_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
        userInfo: { ...state.userInfo, ...action.payload },
      };

    case USER_UPDATE_PROFILE_FAIL:
      return { ...state, loading: false, error: action.payload };

    case USER_UPDATE_PROFILE_RESET:
      return { ...state };

    case USER_LOGIN_FAIL:
      // fail
      return { ...state, loading: false, error: action.payload };
    case PASSWORD_RESET_SUCCESS:
      // success
      return { ...state, loading: false, message: action.payload };
    case PASSWORD_RESET_FAIL:
      // fail
      return { ...state, loading: false, error: action.payload };
    case PASSWORD_RESET_CONFIRM_SUCCESS:
      // success
      return { ...state, loading: false, resetnewpassword: action.payload };
    case PASSWORD_RESET_CONFIRM_FAIL:
      // fail
      return { ...state, loading: false, error: action.payload };
    case PASSWORD_RESET_REQUEST:
      return { ...state, loading: true, ...state, message: null, error: null };

    case USER_LOGOUT:
      // reset
      return {};

    default:
      return state;
  }
};
