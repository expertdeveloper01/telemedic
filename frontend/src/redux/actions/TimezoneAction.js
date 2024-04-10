import {
  // Timezone Components
  TIMEZONE_REQUEST,
  TIMEZONE_SUCCESS,
  TIMEZONE_FAIL,
} from "../../constants/userConstants";
import api from "../../util/api";
/***
 * Timezone
 */
export const Timezonechoices = () => async (dispatch) => {
  try {
    dispatch({
      type: TIMEZONE_REQUEST,
    });
    const { data } = await api.get("/timezone");
    dispatch({
      type: TIMEZONE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: TIMEZONE_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};














