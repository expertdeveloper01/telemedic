import {
  // Timezone Components
  TREATMENTAREA_REQUEST,
  TREATMENTAREA_SUCCESS,
  TREATMENTAREA_FAIL,
} from "../../constants/userConstants";
import api from "../../util/api";
/***
 * Treatment area
 */
export const getTreatmentArea = () => async (dispatch) => {
  try {
    dispatch({
      type: TREATMENTAREA_REQUEST,
    });
    const { data } = await api.get("/treatmentarea");
    dispatch({
      type: TREATMENTAREA_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: TREATMENTAREA_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};