import {
  TREATMENTAREA_REQUEST,
  TREATMENTAREA_SUCCESS,
  TREATMENTAREA_FAIL,
} from "../../constants/userConstants";

// Language Reducer

export const treatmentAreaReducer = (state = { treatmentarea: [] }, action) => {
  switch (action.type) {
    case TREATMENTAREA_REQUEST:
      // request
      return { loading: true };

    case TREATMENTAREA_SUCCESS:
      // success
      return { loading: false, treatmentarea: action.payload };

    case TREATMENTAREA_FAIL:
      // fail
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
