import api from "../../util/api";

import {
    DOC_PRESCRIPTION_REQUEST,
    DOC_PRESCRIPTION_SUCCESS,
    DOC_PRESCRIPTION_FAIL,

    CANCEL_APPOINTMENT_REQUEST,
    CANCEL_APPOINTMENT_SUCCESS,
    CANCEL_APPOINTMENT_FAIL,

    INCOMPLETE_APPOINTMENT_REQUEST,
    INCOMPLETE_APPOINTMENT_SUCCESS,
    INCOMPLETE_APPOINTMENT_FAIL,

    APPOINTMENTS_DOC_REQUEST,
    APPOINTMENTS_DOC_SUCCESS,
    APPOINTMENTS_DOC_FAIL,

    APPOINTMENTS_PAT_REQUEST,
    APPOINTMENTS_PAT_SUCCESS,
    APPOINTMENTS_PAT_FAIL,

    APPOINTMENT_FORM_REQUEST,
    APPOINTMENT_FORM_SUCCESS,
    APPOINTMENT_FORM_FAIL,

    DOC_APPOINTMENT_ACCEPT_REQUEST,
    DOC_APPOINTMENT_ACCEPT_SUCCESS,
    DOC_APPOINTMENT_ACCEPT_FAIL,
} from '../../constants/appointmentConstants'
// import {
//     getIncompleteAppointments,
// } from "../../redux/actions/AppointmentAction";
import {
    getAttendant,
} from "../../redux/actions/AttendantAction";
import {
    getPharmacy,
} from "../../redux/actions/PharmacyAction";

/***
 * Appointment Create Action
 */
export const createAppointment = (params) => async (dispatch, getState) => {
    try {
        dispatch({
            type: APPOINTMENT_FORM_REQUEST,
        });
        const {
            userLogin: { userInfo },
        } = getState();
        const config = {
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${userInfo.token}`,
            },
        };
        const { data } = await api.post(`/appointment/book_appointment`, params, config);
        dispatch({
            type: APPOINTMENT_FORM_SUCCESS,
            payload: data,
        });
        // localStorage.setItem("appointmentDetails", JSON.stringify(data));

        dispatch(getIncompleteAppointments())
        dispatch(getPharmacy());
        dispatch(getAttendant());
        return true;
    } catch (error) {
        dispatch({
            type: APPOINTMENT_FORM_FAIL,
            payload:
                error.response && error.response.data.detail
                    ? error.response.data.detail
                    : error.message,
        });
    }
};

// List DoctorAppointment Action
export const docAppointments = () => async (dispatch) => {
    try {
        dispatch({
            type: APPOINTMENTS_DOC_REQUEST,
        });

        const { data } = await api.get("/appointment/docappointment");

        dispatch({
            type: APPOINTMENTS_DOC_SUCCESS,
            payload: data,
        });
        console.log("dataaaaaa", data);
    } catch (error) {
        dispatch({
            type: APPOINTMENTS_DOC_FAIL,
            payload:
                error.response && error.response.data.detail
                    ? error.response.data.detail
                    : error.message,
        });
    }
};

// List Patient Appointment Action
export const patAppointments = () => async (dispatch) => {
    try {
        dispatch({
            type: APPOINTMENTS_PAT_REQUEST,
        });

        const { data } = await api.get("/appointment/patappointment");

        dispatch({
            type: APPOINTMENTS_PAT_SUCCESS,
            payload: data,
        });
        console.log("dataaaaaa", data);
    } catch (error) {
        dispatch({
            type: APPOINTMENTS_PAT_FAIL,
            payload:
                error.response && error.response.data.detail
                    ? error.response.data.detail
                    : error.message,
        });
    }
};

/***
 * Add Prescription
 */
export const addPrescription = (params, appointmentId) => async (dispatch, getState) => {
    try {
        dispatch({
            type: DOC_PRESCRIPTION_REQUEST,
        });

        const { data } = await api.post(`/prescription/${appointmentId}`, params);

        dispatch({
            type: DOC_PRESCRIPTION_SUCCESS,
            payload: { data: data },
        });
        return true;
    } catch (error) {
        dispatch({
            type: DOC_PRESCRIPTION_FAIL,
            payload:
                error.response && error.response.data.detail
                    ? error.response.data.detail
                    : error.message,
        });
    }
};

export const getIncompleteAppointments = () => async (dispatch) => {
    try {
        dispatch({
            type: INCOMPLETE_APPOINTMENT_REQUEST,
        });
        const { data } = await api.get(`/appointment/incomplete/appointment`);
        dispatch({
            type: INCOMPLETE_APPOINTMENT_SUCCESS,
            payload: data,
        });
        return data;
    } catch (error) {
        dispatch({
            type: INCOMPLETE_APPOINTMENT_FAIL,
            payload:
                error.response && error.response.data.detail
                    ? error.response.data.detail
                    : error.message,
        });
    }
};


export const cancelAppointmentAction = (params, appointmentId) => async (dispatch, getState) => {
    try {
        dispatch({
            type: CANCEL_APPOINTMENT_REQUEST,
        });
        const { data } = await api.post(`/appointment/cancelAppointment/${appointmentId}`, params);
        dispatch({
            type: CANCEL_APPOINTMENT_SUCCESS,
            payload: data,
        });
        return true;
    } catch (error) {
        dispatch({
            type: CANCEL_APPOINTMENT_FAIL,
            payload:
                error.response && error.response.data.detail
                    ? error.response.data.detail
                    : error.message,
        });
    }
};

export const appointmentAcceptDoc = (_id) => async (dispatch, getState) => {
    try {
        dispatch({
            type: DOC_APPOINTMENT_ACCEPT_REQUEST,
        });

        const { data } = await api.put(`/appointment/doctoraccept/${_id}/`);

        dispatch({
            type: DOC_APPOINTMENT_ACCEPT_SUCCESS,
            payload: data,
        });
        // return true;
        console.log("accepted data", data);
    } catch (error) {
        dispatch({
            type: DOC_APPOINTMENT_ACCEPT_FAIL,
            payload:
                error.response && error.response.data
                    ? error.response.data
                    : error.message,
        });
    }
};
