import {
  // Doctor consult list Constants
  DOC_CONSULT_LIST_REQUEST,
  DOC_CONSULT_LIST_FAIL,
  DOC_CONSULT_LIST_RESET,
  DOC_CONSULT_LIST_SUCCESS,

  // Patient consult list Constants
  PAT_CONSULT_LIST_FAIL,
  PAT_CONSULT_LIST_REQUEST,
  // PAT_CONSULT_LIST_RESET,
  PAT_CONSULT_LIST_SUCCESS,

  // append changes for both patient and doctor
  LIST_ADD,

  // withdraw consult for patient
  PAT_CONSULT_WITHDRAW_REQUEST,
  PAT_CONSULT_WITHDRAW_SUCCESS,
  PAT_CONSULT_WITHDRAW_FAIL,
  PATIENT_MESSAGE_COUNT_SUCCESS,
  MESSAGE_COUNT_SUCCESS,

  CONSULT_FORM_REQUEST,
  CONSULT_FORM_SUCCESS,
  CONSULT_FORM_FAIL,

  DOC_CONSULT_ACCEPT_REQUEST,
  DOC_CONSULT_ACCEPT_SUCCESS,
  DOC_CONSULT_ACCEPT_FAIL,

} from "../../constants/userConstants";

// Consult List for doctor reducer

export const docConsultListReducer = (state = { consults: [] }, action) => {
  switch (action.type) {
    case DOC_CONSULT_LIST_REQUEST:
      // request
      return { loading: true };

    case DOC_CONSULT_LIST_SUCCESS:
      // success
      return {
        loading: false,
        consults: action.payload.consults,
        page: action.payload.page,
        pages: action.payload.pages,
      };

    case LIST_ADD:
      const consults = action.payload;
      const arrIndex = state.consults.findIndex(
        (obj) => obj.consult_id === consults.consult_id
      );

      const newConsults = [...state.consults];
      newConsults[arrIndex] = consults;

      // append changes for accept and reject for doctor
      return { ...state, consults: newConsults };

    case DOC_CONSULT_LIST_FAIL:
      // fail
      return { loading: false, error: action.payload };

    // Message Count
    case MESSAGE_COUNT_SUCCESS:
     
      const count = action.payload.count;
      const consult_id = Number(action.payload.consult_id);

      const consultObj = state.consults.find(
        (obj) => obj.consult_id === consult_id
      );
      
      consultObj.unread_message_count = count;

      return { ...state, consults: [...state.consults] };
    case DOC_CONSULT_LIST_RESET:
      // reset
      return { consults: [] };

    default:
      return state;
  }
};

// Consult List for patient reducer
export const patConsultListReducer = (state = { consults: [] }, action) => {
  switch (action.type) {
    case PAT_CONSULT_LIST_REQUEST:
      // request
      return { loading: true };

    case PAT_CONSULT_LIST_SUCCESS:
      // success
      return {
        loading: false,
        consults: action.payload.consults,

        page: action.payload.page,
        pages: action.payload.pages,
      };

    case LIST_ADD:
      // append changes for accept and reject for doctor
      // return { ...state, consults: [...state.consults, action.payload] };
      const consultObj = action.payload;
      const arrIndex = state.consults.findIndex(
        (obj) => obj.consult_id === consultObj.consult_id
      );

      const newConsults = [...state.consults];
      newConsults[arrIndex] = consultObj;

      // append changes for accept and reject for doctor
      return { ...state, consults: newConsults };

    case PAT_CONSULT_LIST_FAIL:
      // fail
      return { loading: false, error: action.payload };

    // case PAT_CONSULT_LIST_RESET:
    //   // reset
    //   break;

    case PATIENT_MESSAGE_COUNT_SUCCESS:
      console.log("messageCount", action.payload);
      const count = action.payload.count;
      const consult_id = Number(action.payload.consult_id);

      const objConsult = state.consults.find(
        (obj) => obj.consult_id === consult_id
      );
      console.log("..objConsult", objConsult);
      objConsult.unread_message_count = count;

      return { ...state, consults: [...state.consults] };

    default:
      return state;
  }
};

// Consult Withdraw for patient reducer
export const patConsultWithdrawReducer = (state = { consult: {} }, action) => {
  switch (action.type) {
    case PAT_CONSULT_WITHDRAW_REQUEST:
      // request
      return { ...state, loading: true };

    case PAT_CONSULT_WITHDRAW_SUCCESS:
      // success
      return {
        loading: false,
        consult: action.payload,
      };

    case PAT_CONSULT_WITHDRAW_FAIL:
      // fail
      return { loading: false, error: action.payload };

    default:
      return state;
  }
};

// Register Reducer
export const ConsultSubmitReducer = (state = { consultsubmit: {} }, action) => {
  switch (action.type) {
    // Request
    case CONSULT_FORM_REQUEST:
      return { loading: true };

    // Register
    case CONSULT_FORM_SUCCESS:
      return { loading: false, consultsubmit: action.payload };

    // Register fail
    case CONSULT_FORM_FAIL:
      return { loading: false, error: action.payload };

    default:
      return state;
  }
};


// Consult Accept by Doctor Reducer
export const DocConsultAcceptReducer = (state = { consultaccept: {} }, action) => {
  switch (action.type) {
    // Request
    case DOC_CONSULT_ACCEPT_REQUEST:
      return { loading: true };

    // Success
    case DOC_CONSULT_ACCEPT_SUCCESS:
      return { loading: false, consultaccept: action.payload };

    // fail
    case DOC_CONSULT_ACCEPT_FAIL:
      return { loading: false, error: action.payload };

    default:
      return state;
  }
};