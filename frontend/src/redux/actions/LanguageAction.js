import {
  // Languages Components
  LANGUAGE_USER_REQUEST,
  LANGUAGE_USER_SUCCESS,
  LANGUAGE_USER_FAIL,
} from "../../constants/userConstants";
import axios from "axios";

/***
 * Languages
 */

export const language1 = () => async (dispatch) => {
  try {
    dispatch({
      type: LANGUAGE_USER_REQUEST,
    });

    const config = {
      headers: {
        "Content-type": "application/json",
      },
    };

    const { data } = await axios.get("/language", config);

    dispatch({
      type: LANGUAGE_USER_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: LANGUAGE_USER_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};
