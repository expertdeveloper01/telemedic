import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import { userLoginReducer } from "./redux/reducers/AuthReducer";

import { TimezoneReducer } from "./redux/reducers/TimezoneReducer";
import {
  appointmentReducer,
  incompleteappointmentsReducer,
  DocAppointmentAcceptReducer
} from "./redux/reducers/AppointmentReducer";
import {
  pharmacyReducer
} from './redux/reducers/PharmacyReducer'
import {
  attendantReducer
} from './redux/reducers/AttendantReducer'
import { treatmentAreaReducer } from "./redux/reducers/treatmentAreaReducer";
import { paymentReducer } from "./redux/reducers/PaymentReducer";

// Initializing reducers

const reducer = combineReducers({
  // User Reducers
  userLogin: userLoginReducer,
  TimezoneReducer,

  // Appointment Reducers
  appointmentReducer,
  incompleteappointmentsReducer,
  treatmentAreaReducer,
  DocAppointmentAcceptReducer,

  // Attendant Reducer
  attendantReducer,

  // Pharmacy Reducer
  pharmacyReducer,

  // Payment Reducers
  paymentReducer

  // AgeReducer,
  // languageReducer,
  // chatListReducer,
  // NotificationReducer,
});

// get userInfo from localStorage
const userInfoFromStorage = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo"))
  : null;

// initialState
const initialState = {
  userLogin: { userInfo: userInfoFromStorage },
};
// middleware used thunk
const middleware = [thunk];

// store variable initialized
const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
