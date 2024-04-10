import {
  APPOINTMENT_FORM_REQUEST,
  APPOINTMENT_FORM_SUCCESS,
  APPOINTMENT_FORM_FAIL,


} from "../../constants/userConstants";

import {
  DOC_PRESCRIPTION_REQUEST,
  DOC_PRESCRIPTION_SUCCESS,
  DOC_PRESCRIPTION_FAIL,

  CANCEL_APPOINTMENT_REQUEST,
  CANCEL_APPOINTMENT_SUCCESS,
  CANCEL_APPOINTMENT_FAIL,

  // doc appointment list constants
  APPOINTMENTS_DOC_FAIL,
  APPOINTMENTS_DOC_REQUEST,
  APPOINTMENTS_DOC_SUCCESS,

  // pat appointment list constants
  APPOINTMENTS_PAT_FAIL,
  APPOINTMENTS_PAT_REQUEST,
  APPOINTMENTS_PAT_SUCCESS,

  INCOMPLETE_APPOINTMENT_REQUEST,
  INCOMPLETE_APPOINTMENT_SUCCESS,
  INCOMPLETE_APPOINTMENT_FAIL,

  DOC_APPOINTMENT_ACCEPT_REQUEST,
  DOC_APPOINTMENT_ACCEPT_SUCCESS,
  DOC_APPOINTMENT_ACCEPT_FAIL,
} from "../../constants/appointmentConstants";

const initialState = {
  loading: false,
  getAppointments: {},
  patappointments: [],
  docappointments: []
}

// Appointment create reducer
export const appointmentReducer = (
  state = initialState,
  action
) => {
  switch (action.type) {
    // Request
    case APPOINTMENT_FORM_REQUEST:
      return { ...state, loading: true };

    // Success
    case APPOINTMENT_FORM_SUCCESS:
      return { ...state, loading: false, getAppointments: { ...state.getAppointments, ...action.payload } };

    // Fail
    case APPOINTMENT_FORM_FAIL:
      return { ...state, loading: false, error: action.payload };

    // Request
    case APPOINTMENTS_PAT_REQUEST:
      return { loading: true };

    // Success
    case APPOINTMENTS_PAT_SUCCESS:
      return { loading: false, patappointments: action.payload };
    // userInfo: { ...state.userInfo, ...action.payload },
    // Fail
    case APPOINTMENTS_PAT_FAIL:
      return { loading: false, error: action.payload };

    // Request
    case APPOINTMENTS_DOC_REQUEST:
      return { loading: true };

    // Success
    case APPOINTMENTS_DOC_SUCCESS:
      return { loading: false, docappointments: action.payload };

    // Fail
    case APPOINTMENTS_DOC_FAIL:
      return { loading: false, error: action.payload };

    // Request
    case DOC_PRESCRIPTION_REQUEST:
      return { loading: true };

    // Success
    case DOC_PRESCRIPTION_SUCCESS:
      return { loading: false, message: action.payload };

    // Fail
    case DOC_PRESCRIPTION_FAIL:
      return { loading: false, error: action.payload };

    // Request
    case CANCEL_APPOINTMENT_REQUEST:
      return { loading: false, error: action.payload };

    // Success
    case CANCEL_APPOINTMENT_SUCCESS:
      return { loading: false, error: action.payload };

    // Fail
    case CANCEL_APPOINTMENT_FAIL:
      return { loading: false, error: action.payload };

    default:
      return state;
  }
};

// Incomplete Appointment Reducer
export const incompleteappointmentsReducer = (
  state = { incompleteAppointments: [] },
  action
) => {
  switch (action.type) {
    // Request
    case INCOMPLETE_APPOINTMENT_REQUEST:
      return { ...state, loading: true };

    // Success
    case INCOMPLETE_APPOINTMENT_SUCCESS:
      return { ...state, loading: false, incompleteAppointments: action.payload };

    // Fail
    case INCOMPLETE_APPOINTMENT_FAIL:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

// Appointment Accept by Doctor Reducer
export const DocAppointmentAcceptReducer = (
  state = { appointmentaccept: {} },
  action
) => {
  switch (action.type) {
    // Request
    case DOC_APPOINTMENT_ACCEPT_REQUEST:
      return { loading: true };

    // Success
    case DOC_APPOINTMENT_ACCEPT_SUCCESS:
      return { loading: false, appointmentaccept: action.payload };

    // fail
    case DOC_APPOINTMENT_ACCEPT_FAIL:
      return { loading: false, error: action.payload };

    default:
      return state;
  }
};
