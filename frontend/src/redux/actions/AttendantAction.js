import {
    ATTENDANT_REQUEST,
    ATTENDANT_SUCCESS,
    ATTENDANT_FAIL
} from '../../constants/attendantConstants'
import api from "../../util/api";

// Get Attendant Action
export const getAttendant = () => async (dispatch) => {
    try {
        const { data } = await api.get(`/attendant`);

        // Success
        dispatch({
            type: ATTENDANT_SUCCESS,
            payload: data,
        });
        return data;

        // Fail
    } catch (error) {
        dispatch({
            type: ATTENDANT_FAIL,
            payload:
                error.response && error.response.data.detail
                    ? error.response.data.detail
                    : error.message,
        });
    }
};

// Delete Attendant Action
export const deleteAttendant = (attendantId) => async (dispatch) => {
    try {
        dispatch({
            type: ATTENDANT_REQUEST,
        });

        const { data } = await api.delete(`/attendant/${attendantId}/`);

        // Success
        dispatch({
            type: ATTENDANT_SUCCESS,
            payload: data,
        });
        return data;

        // Fail
    } catch (error) {
        dispatch({
            type: ATTENDANT_FAIL,
            payload:
                error.response && error.response.data.detail
                    ? error.response.data.detail
                    : error.message,
        });
    }
};