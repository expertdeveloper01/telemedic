import {
  USER_NOTIFICATION_REQUEST,
  USER_NOTIFICATION_SUCCESS,
  USER_NOTIFICATION_FAIL,
  SET_SOCKET,
  RESET_NOTIFICATION,
  USER_NOTIFICATION_COUNT_REQUEST,
  USER_NOTIFICATION_COUNT_SUCCESS,
  USER_NOTIFICATION_COUNT_FAIL,
} from "../../constants/userConstants";
import store from "../../store";

import axios from "axios";

export const loadNotifications = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: USER_NOTIFICATION_REQUEST,
    });

    // get userInfo from localStorage
    const {
      userLogin: { userInfo },
    } = store.getState();
    

    // const config = {};
    const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.get("/notification/", config);
   

    dispatch({
      type: USER_NOTIFICATION_SUCCESS,
      payload: data,
    });
    // dispatch(readNotification());
  } catch (error) {
    dispatch({
      type: USER_NOTIFICATION_FAIL,
      payload:
        error.response && error.response.data ? error.response.data : error,
    });
  }
};
// Set socket 
export const setSocket = (notificationsocket) => async (dispatch, getState) => {
  dispatch({
    type: SET_SOCKET,
    payload: notificationsocket,
  });
};


// NOTIFICATION Count
export const notificationCount = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: USER_NOTIFICATION_COUNT_REQUEST,
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
    const { data } = await axios.get(`/countnotification`, config);
    dispatch({
      type: USER_NOTIFICATION_COUNT_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: USER_NOTIFICATION_COUNT_FAIL,
      payload:
        error.response && error.response.data
          ? error.response.data
          : error.message,
    });
  }
};
// Count unread Notifications

export const resetNotification = (receiver) => async (dispatch, getState) => {
  const {
    userLogin: { userInfo },
  } = getState();

  const config = {
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${userInfo.token}`,
    },
  };
  const { data } = await axios.put(
    `/read_notification/${receiver}`,
    {},
    config
  );

  dispatch({
    type: RESET_NOTIFICATION,
    payload: data,
  });
 
};

