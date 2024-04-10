import axios from "axios";
import {
  // Age User Components
  AGE_USER_REQUEST,
  AGE_USER_SUCCESS,
  AGE_USER_FAIL,
} from "../../constants/userConstants";

/***
 * Agegroup
 */

export const AgeGroup = () => async (dispatch) => {
  try {
    dispatch({
      type: AGE_USER_REQUEST,
    });

    const config = {
      headers: {
        "Content-type": "application/json",
      },
    };

    const { data } = await axios.get("/agegroup", config);

    dispatch({
      type: AGE_USER_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: AGE_USER_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};
