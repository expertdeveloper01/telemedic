import {
  TIMEZONE_REQUEST,
  TIMEZONE_SUCCESS,
  TIMEZONE_FAIL,
} from "../../constants/userConstants";

// Language Reducer

export const TimezoneReducer = (state = { timezone: [] }, action) => {
  switch (action.type) {
    case TIMEZONE_REQUEST:
      // request
      return { loading: true };

    case TIMEZONE_SUCCESS:
      // success
      return { loading: false, timezone: action.payload };

    case TIMEZONE_FAIL:
      // fail
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
