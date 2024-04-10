import {
  // Doctor Consult List Constants
  DOC_CONSULT_LIST_REQUEST,
  DOC_CONSULT_LIST_SUCCESS,
  DOC_CONSULT_LIST_FAIL,

  // Patient Consult List Constants
  PAT_CONSULT_LIST_REQUEST,
  PAT_CONSULT_LIST_SUCCESS,
  PAT_CONSULT_LIST_FAIL,

  // ConsultForm Constants
  CONSULT_FORM_REQUEST,
  CONSULT_FORM_SUCCESS,
  CONSULT_FORM_FAIL,

  // Message Count Constants
  MESSAGE_COUNT_REQUEST,
  MESSAGE_COUNT_SUCCESS,
  MESSAGE_COUNT_FAIL,

  // append changes for both patient and doctor
  LIST_ADD,

  // patient withdraw constants
  PAT_CONSULT_WITHDRAW_REQUEST,
  PAT_CONSULT_WITHDRAW_SUCCESS,
  PAT_CONSULT_WITHDRAW_FAIL,
  PATIENT_MESSAGE_COUNT_SUCCESS,

  DOC_CONSULT_ACCEPT_REQUEST,
  DOC_CONSULT_ACCEPT_SUCCESS,
  DOC_CONSULT_ACCEPT_FAIL,

  DOC_CONSULT_WITHDRAW_REQUEST,
  DOC_CONSULT_WITHDRAW_SUCCESS,
  DOC_CONSULT_WITHDRAW_FAIL,


} from "../../constants/userConstants";

import axios from "axios";

// List DoctorConsult Action
export const listDocConsults =
  ({ sortBy, sortOrder, page }) =>
  async (dispatch, getState) => {
    try {
      // request
      dispatch({
        type: DOC_CONSULT_LIST_REQUEST,
      });

      // get userInfo from localStorage
      const {
        userLogin: { userInfo },
      } = getState();

      // send token with request
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
        // params passed with the request
        params: {
          sortBy,
          sortOrder,
          page,
        },
      };
      // set data variable for data coming from backend
      const { data } = await axios.get(`/doctor/consultlist/`, config);

      dispatch({
        // success
        type: DOC_CONSULT_LIST_SUCCESS,
        payload: data,
      });
    } catch (error) {
      // error handling
      dispatch({
        type: DOC_CONSULT_LIST_FAIL,
        payload:
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message,
      });
    }
  };

// append changes for both patient and doctor
export const modifyList = (consult) => async (dispatch, getState) => {
  dispatch({
    type: LIST_ADD,
    payload: consult,
  });
};

// Patient Consults List
export const listPatConsults =
  ({ sortBy, sortOrder, page }) =>
  async (dispatch, getState) => {
    try {
      // request
      dispatch({
        type: PAT_CONSULT_LIST_REQUEST,
      });

      // get userInfo from localStorage
      const {
        userLogin: { userInfo },
      } = getState();

      // send token with request
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
        // params passed with the request
        params: {
          sortBy,
          sortOrder,
          page,
        },
      };
      // set data variable for data coming from backend
      const { data } = await axios.get(`/`, config);

      dispatch({
        // success
        type: PAT_CONSULT_LIST_SUCCESS,
        payload: data,
      });
    } catch (error) {
      // error handling
      dispatch({
        type: PAT_CONSULT_LIST_FAIL,
        payload:
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message,
      });
    }
  };

// Patient Consults List
export const patConsultWithdraw =
  (consult_id) => async (dispatch, getState) => {
    try {
      // request
      dispatch({
        type: PAT_CONSULT_WITHDRAW_REQUEST,
      });

      // get userInfo from localStorage
      const {
        userLogin: { userInfo },
      } = getState();

      // send token with request
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
        // params passed with the request
        params: {},
      };
      // set data variable for data coming from backend
      const { data } = await axios.put(
        `/patientwithdraw/${consult_id}/`,
        config
      );

      dispatch({
        // success
        type: PAT_CONSULT_WITHDRAW_SUCCESS,
        payload: data,
      });
    } catch (error) {
      // error handling
      dispatch({
        type: PAT_CONSULT_WITHDRAW_FAIL,
        payload:
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message,
      });
    }
  };

export const consultForm = (params) => async (dispatch, getState) => {
  try {
    dispatch({
      type: CONSULT_FORM_REQUEST,
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

    const { data } = await axios.post(`/consult/form`, params, config);

    dispatch({
      type: CONSULT_FORM_SUCCESS,
      payload: data,
    });
    return true;
  } catch (error) {
    dispatch({
      type: CONSULT_FORM_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

// Messages Count

export const messageCount = (consult_id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: MESSAGE_COUNT_REQUEST,
    });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
      params: {
        consult_id,
      },
    };

    const { data } = await axios.get(`/messages/count`, config);

    dispatch({
      type:
        userInfo.user_type === "Doctor"
          ? MESSAGE_COUNT_SUCCESS
          : PATIENT_MESSAGE_COUNT_SUCCESS,
      payload: { count: data, consult_id },
    });
  } catch (error) {
    dispatch({
      type: MESSAGE_COUNT_FAIL,
      payload:
        error.response && error.response.data
          ? error.response.data
          : error.message,
    });
  }
};

export const readMessage = (consult_id) => async (dispatch, getState) => {
  const {
    userLogin: { userInfo },
  } = getState();
  try {
    const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };
    await axios.put(`/read_message/${consult_id}`, {}, config);
  } catch (error) {
    console.error("bsh", error);
  }
};

export const consultAcceptDoc = (consult_id, params) => async (dispatch, getState) => {
  try {
    dispatch({
      type: DOC_CONSULT_ACCEPT_REQUEST,
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
    const { data } = await axios.put(`/doctoraccept/${consult_id}/`, params, config);
    dispatch({
      type: DOC_CONSULT_ACCEPT_SUCCESS,
      payload: data,
    });
    return true;
  } catch (error) {
    dispatch({
      type: DOC_CONSULT_ACCEPT_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};
export const consultRejectDoc = (consult_id, params) => async (dispatch, getState) => {
  try {
    dispatch({
      type: DOC_CONSULT_WITHDRAW_REQUEST,
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
    const { data } = await axios.put(`/doctorwithdraw/${consult_id}/`, params, config);
    dispatch({
      type: DOC_CONSULT_WITHDRAW_SUCCESS,
      payload: data,
    });
    return true;
  } catch (error) {
    dispatch({
      type: DOC_CONSULT_WITHDRAW_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};
