import {
  USER_NOTIFICATION_REQUEST,
  USER_NOTIFICATION_SUCCESS,
  USER_NOTIFICATION_FAIL,
  SET_SOCKET,
  USER_NOTIFICATION_COUNT_SUCCESS,
  USER_NOTIFICATION_COUNT_REQUEST,
  USER_NOTIFICATION_COUNT_FAIL,
  // NOTIFICATION_ADD,
} from "../../constants/userConstants";

// Notification Reducer

export const NotificationReducer = (
  state = {
    notification: null,
    notificationsocket: null,
    countnotification: 0,
  },
  action
) => {
  switch (action.type) {
    case USER_NOTIFICATION_REQUEST:
      // request
      return { loading: true };
    case USER_NOTIFICATION_COUNT_SUCCESS:
      return {
        ...state,
        countnotification: action.payload,
      };

    case SET_SOCKET:
      return { ...state, socket: action.payload };
    case USER_NOTIFICATION_SUCCESS:
      // success

      return {
        ...state,
        loading: false,
        notification: action.payload,
      };

    case USER_NOTIFICATION_FAIL:
      // fail
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export const notificationcountReducer = (state = { notif: [] }, action) => {
  switch (action.type) {
    case USER_NOTIFICATION_COUNT_REQUEST:
      // request
      return { loading: true };

    case USER_NOTIFICATION_COUNT_SUCCESS:
      return {
        ...state,
        countnotification: action.payload,
      };

    case USER_NOTIFICATION_COUNT_FAIL:
      // fail
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
