import {
    PHARMACY_REQUEST,
    PHARMACY_SUCCESS,
    PHARMACY_FAIL,

    PHARMACY_DELETE_SUCCESS,
    PHARMACY_DELETE_FAIL,
} from "../../constants/pharmacyConstants";
import api from "../../util/api";

/***
 * Get Pharmacy Action
 */
export const getPharmacy = () => async (dispatch) => {
    try {
        dispatch({
            type: PHARMACY_REQUEST,
        });
        const { data } = await api.get(`/pharmacy`);
        dispatch({
            type: PHARMACY_SUCCESS,
            payload: data,
        });
        return data;
    } catch (error) {
        dispatch({
            type: PHARMACY_FAIL,
            payload:
                error.response && error.response.data.detail
                    ? error.response.data.detail
                    : error.message,
        });
    }
};

// Delete Pharmacy Action
export const deletePharmacy = (pharmacyId) => async (dispatch) => {
    try {

        const { data } = await api.delete(`/pharmacy/${pharmacyId}/`);

        // success
        dispatch({
            type: PHARMACY_DELETE_SUCCESS,
            payload: data,
        });
        return data;

        // fail
    } catch (error) {
        dispatch({
            type: PHARMACY_DELETE_FAIL,
            payload:
                error.response && error.response.data.detail
                    ? error.response.data.detail
                    : error.message,
        });
    }
}