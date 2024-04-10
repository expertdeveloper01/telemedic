import "./App.css";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Header from "./components/Header";
import HomePage from "./components/Home";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import "bootstrap/dist/css/bootstrap.min.css";
import Profile from "./containers/Profile";
import ChangePassword from "./components/ChangePassword";
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import AppointmentView from "./containers/patient/appointmentView";
import LoginScreen from "./containers/LoginScreen/LoginScreen";
import DoctorPrescriptionPage from "./containers/DoctorPrescriptionPage/DoctorPrescriptionPage";
import UserRegistration from "./containers/Registration/UserRegistration";
import CancelAppointment from "./containers/CancelAppointment/CancelAppointment";
import thanksPage from "./containers/Thanks/thanksPage";
import Forgotpassword from "./containers/ForgotPassword/forgotPassword";
import revenue from "./containers/Revenue/revenue";
import AuthRoute from "./routing/AuthRoute";
import VerifyEmail from './containers/VerifyEmail/VerifyEmail'
import DoctorRoute from './routing/DoctorRoute'
import PatientRoute from './routing/PatientRoute'
import Appointmentlist from "./containers/patient/appointmentList";
import PatAppointmentlist from "./containers/patient/patApppointmentlist";
import ResetPasswordConfirm from './containers/ForgotPassword/ConfirmforgotPassword'
import CommonRoute from "./routing/CommonRoute";
import Appointment from './containers/createAppointment/index'
import { getUserDetails } from "./redux/actions/AuthAction";
import {
    Elements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PageNotFound from './containers/pageNotFound/pageNotFound'

const theme = createTheme({});

function App({ history }) {

    const dispatch = useDispatch();
    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    useEffect(() => {
        if (userInfo) {
            setTimeout(() => {
                    dispatch(getUserDetails(userInfo.id))
                }, 1500)
                // if (!userInfo.state) {
                //   history.push('/update-profile')
                // }
        }

    }, [dispatch, getUserDetails])

    const stripePromise = loadStripe(
        " pk_test_51K51urSA1vcwncjwpY4IWAMJZfqGkdaFWZ8fcksVjetNyJ8uj8w4irYFhrFSz3htMLqidVJrMOIyf9ovpXYkiizw00QDRLWCtt"
    );

    return ( <
        Elements stripe = { stripePromise } >
        <
        ThemeProvider theme = { theme } >
        <
        div >
        <
        BrowserRouter >
        <
        Header / >
        <
        main className = "py-3" >
        <
        Switch >
        <
        Route exact path = "/"
        component = { HomePage }
        /> <
        Route exact path = "/docappointmentlist"
        component = { Appointmentlist }
        /> <
        Route path = ".profile"
        exact component = { Profile }
        /> <
        Route exact path = "/patappointmentlist"
        component = { PatAppointmentlist }
        /> <
        Route exact path = "/update-profile"
        component = { Profile }
        /> <
        Route path = "/change-password"
        exact component = { ChangePassword }
        /> <
        Route path = "/register/:user"
        exact component = { UserRegistration }
        /> <
        Route path = "/doctorPrescription/:appointmentId"
        exact component = { DoctorPrescriptionPage }
        /> <
        Route path = "/cancel/:appointmentId"
        exact component = { CancelAppointment }
        /> <
        Route path = "/userlogin/:user"
        exact component = { LoginScreen }
        /> <
        Route path = "/book-appointment"
        exact component = { Appointment }
        /> <
        Route path = "/revenue"
        exact component = { revenue }
        /> <
        Route path = "/thankspage"
        exact component = { thanksPage }
        /> <
        Route path = "/verified"
        exact component = { VerifyEmail }
        /> <
        Route path = "/forgotpassword"
        exact component = { Forgotpassword }
        /> <
        Route path = "/forgotpasswordconfirm"
        exact component = { ResetPasswordConfirm }
        />

        {
            /* <Route
                            path="/orderPay/:appointmentId"
                            exact
                            component={PaymentPage}
                          /> */
        }

        <
        Route path = "/appointment-details"
        exact component = { AppointmentView }
        />

        <
        Route component = { PageNotFound }
        />

        <
        /Switch> < /
        main > <
        /BrowserRouter> < /
        div > <
        /ThemeProvider> < /
        Elements >
    );
}

export default App;