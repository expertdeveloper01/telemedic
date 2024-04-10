import {
  LANGUAGE_USER_REQUEST,
  LANGUAGE_USER_SUCCESS,
  LANGUAGE_USER_FAIL,
} from "../../constants/userConstants";

// Language Reducer

export const languageReducer = (state = { lang: [] }, action) => {
  switch (action.type) {
    case LANGUAGE_USER_REQUEST:
      // request
      return { loading: true };

    case LANGUAGE_USER_SUCCESS:
      // success
      return { loading: false, languages: action.payload };

    case LANGUAGE_USER_FAIL:
      // fail
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
