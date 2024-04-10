import {
  AGE_USER_REQUEST,
  AGE_USER_SUCCESS,
  AGE_USER_FAIL,
} from "../../constants/userConstants";

// Age Reducer
export const AgeReducer = (state = { agegroup: [] }, action) => {
  switch (action.type) {
    case AGE_USER_REQUEST:
      // request
      return { loading: true };

    case AGE_USER_SUCCESS:
      // success
      return { loading: false, age: action.payload };

    case AGE_USER_FAIL:
      // fail
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
