import axios from "axios";
import {
  // ChatList Components
  CHAT_LIST_REQUEST,
  CHAT_LIST_SUCCESS,
  CHAT_LIST_FAIL,

  // ChatPost Components
  CHAT_POST_REQUEST,
  CHAT_POST_SUCCESS,
  CHAT_POST_FAIL,
  CHAT_ADD,
  SET_SOCKET,
  CHAT_LIST_RESET,
} from "../../constants/userConstants";
import store from "../../store";
import { readMessage } from "./ConsultAction";

// Chat Consult list
export const chatListConsults =
  (consult_id, unread_message) => async (dispatch, getState) => {
    try {
      dispatch({
        type: CHAT_LIST_REQUEST,payload: consult_id
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
          unread_message,
        },
      };
      const { data } = await axios.get(`/chat/`, config);
      dispatch({
        type: CHAT_LIST_SUCCESS,
        payload: data,
      });
      dispatch(readMessage(consult_id));
    } catch (error) {
      dispatch({
        type: CHAT_LIST_FAIL,
        payload:
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message,
      });
    }
  };

// ChatPost Consults
export const chatPostConsults = (params) => async (dispatch, getState) => {
  try {
    dispatch({
      type: CHAT_POST_REQUEST,
    });
    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.post(`/chat/`, params, config);
    dispatch({
      type: CHAT_POST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: CHAT_POST_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

export const addChat = (message) => async (dispatch, getState) => {
  const {
    chatListReducer: { chat },
  } = store.getState();

  if (chat) {
    dispatch({
      type: CHAT_ADD,
      payload: message,
    });
    dispatch(readMessage(message.consult_id));
  }
};

export const setSocket = (socket) => async (dispatch, getState) => {
  dispatch({
    type: SET_SOCKET,
    payload: socket,
  });
};

// export const messageCount = (unread_message) => async (dispatch, getState) => {
//   dispatch({
//     type: MESSAGE_COUNT,
//     payload: unread_message,
//   });
// };

export const resetChat = () => async (dispatch, getState) => {
  dispatch({
    type: CHAT_LIST_RESET
  });
};