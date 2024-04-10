import { useDispatch, useSelector } from "react-redux";

import { useEffect } from "react";
import { addChat, setSocket } from "../redux/actions/ChatAction";
import { messageCount } from "../redux/actions/ConsultAction";
import store from '../store';
import { notificationCount } from "../redux/actions/NotificationActions";

let socket;

function Socket() {
  const dispatch = useDispatch();
  // const userLogin = useSelector((state) => state.userLogin);
  // const { userInfo } = userLogin;

  const setupSocket = () => {
    socket = new WebSocket(`wss://${window.location.hostname}:8001/ws/chat/room1/`);
    dispatch(setSocket(socket));

    socket.onopen = (e) => {
      console.log("..onopen", e);
    };
    socket.onerror = (e) => {
      console.log("..onerror", e);
    };
    // This is reciever side show message in real time...
    socket.onmessage = function (e) {
      const {userInfo} = store.getState()?.userLogin;
      if(!userInfo) {
        console.log('..Not Logged In');
        return;
      }

      const data = JSON.parse(e.data);
      console.log("data", data);
      switch (data.type) {
        case "chat_message":
          if (data.message.sender_id !== userInfo.id && data.message.recipient_id== userInfo.id) {
            dispatch(addChat(data.message));
            dispatch(messageCount(data.message.consult_id));
          }
          break;
        case "notification":
            dispatch(notificationCount())
          break;

      }
    };

    socket.onclose = function (e) {
      console.error("Chat socket closed unexpectedly");
    };
  };

  useEffect(() => {
    setupSocket();
  }, []);

  return <span />;
}

export default Socket;
