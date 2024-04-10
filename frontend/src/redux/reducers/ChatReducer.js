import {
  SET_SOCKET,
  CHAT_LIST_REQUEST,
  CHAT_LIST_SUCCESS,
  CHAT_LIST_FAIL,
  CHAT_LIST_RESET,
  CHAT_ADD,
} from "../../constants/userConstants";
// Chat list reducer

const initialState = {
  consult_id:null,
  chat: null,
  doctor: null,
  patient: null,
  socket: null,
};
export const chatListReducer = (state = initialState, action) => {
  switch (action.type) {
    case CHAT_LIST_REQUEST:
      // request
      return {
        ...state,
        chat: [],
        doctor: null,
        patient: null,
        loading: true,
        consult_id: action.payload
      };
    case SET_SOCKET:
      return { ...state, socket: action.payload };

    case CHAT_LIST_SUCCESS:
      // success
      return {
        ...state,
        loading: false,
        chat: action.payload.chats,
        doctor: action.payload.doctor,
        patient: action.payload.patient,
      };
    case CHAT_ADD:
      if(action.payload.consult_id === state.consult_id) {
        return { ...state, chat: [...state.chat, action.payload] };
      }
      return state;
    case CHAT_LIST_FAIL:
      // fail
      return { ...state, loading: false, error: action.payload };
    case CHAT_LIST_RESET:
      // reset
      return {
        ...state,
        chat: null,
        doctor: null,
        patient: null,
        loading: false,
        consult_id:null,
      };
    default:
      return state;
  }
};
