import { Box, Grid, Typography } from "@mui/material";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import React, { useCallback, useEffect, useState } from "react";
import {
    addPaymentMethod,
    deleteCard,
    getPaymentMethods,
} from "../../redux/actions/PaymentAction";
import {
    createAppointment,
} from "../../redux/actions/AppointmentAction";
import swal from "sweetalert";
import Loader from "../../components/Loader/loader";

const Step5Payment = ({ history }) => {

    const dispatch = useDispatch();

    const [appointmentId, setAppointmentId] = useState("")

    const { paymentMethods, carddelete, loading } = useSelector(
        (state) => state.paymentReducer
    );

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const appointmentInfo = useSelector((state) => state.incompleteappointmentsReducer);
    const { incompleteAppointments } = appointmentInfo;

    const stripe = useStripe();
    const elements = useElements();

    useEffect(() => {
        if (incompleteAppointments) {
            setAppointmentId(incompleteAppointments._id)
        }

        dispatch(getPaymentMethods());
    }, []);

    const handleSubmit = useCallback(async () => {
        if (!!elements && !!stripe && !!userInfo) {
            const stripeElement = elements.getElement(CardElement);
            if (stripeElement) {
                const { token } = await stripe.createToken(stripeElement);
                const tokenId = token?.id || "";
                const payload = {
                    tokenId,
                    user: {
                        email: userInfo.email,
                        fullName: `${userInfo.firstName} ${userInfo.lastName}`,
                    },
                };

                if (token) {
                    dispatch(addPaymentMethod(payload));
                    dispatch(createAppointment())
                }

                // if (stripeElement) {
                //     return
                // }
                //connectPaymentCard(payload);
                // dispatch(createAppointment())
            }
        }
    }, [elements, stripe, userInfo]);

    const handleDelete = (item) => {
        console.log("Payment card: ", item);
        dispatch(deleteCard(userInfo["stripeCustomerId"]));
    };

    const bookHandler = async () => {
        const status = await dispatch(
            createAppointment({
                step: 3,
                appointmentId: appointmentId
            }))

        if (status) {
            swal({
                title: "Successful",
                text: "Appointment Booked Successfully",
                icon: "success",
                button: "Go to Appointment List",
            }).then((value) => {
                if (value) {
                    history.push('/patappointmentlist')
                } else {
                    return
                }
            });

        }
    }

    // if (!stripe || !elements || isLoading) return <PopularCard />;

    return (
        <>
            {loading
                ? (<Loader />)
                : (
                    <Grid container spacing={0} alignItems="center" justifyContent="center">
                        <Grid item md={6}>
                            <h5 style={{ color: "orange", marginTop: "40px" }}>
                                {" "}
                                * Your payment account will be used to make payments after completed sessions
                            </h5>
                            {/* {JSON.stringify(userInfo["stripeCustomerId"])} */}
                            {paymentMethods?.length ? (
                                <>
                                    <Grid my={4} md={12} container>
                                        {paymentMethods.map((item, index) => (
                                            <>
                                                <Grid container alignItems="center" justifyContent="center">
                                                    <Grid item md={12}>
                                                        {/* <Card> */}
                                                        <React.Fragment>
                                                            {/* <Grid item display="flex" alignItems="center" justifyContent="center" xs={8}> */}
                                                            <Typography>{userInfo.firstName}</Typography>
                                                            <Typography>
                                                                **** **** **** {item.card.last4}
                                                            </Typography>
                                                            <Typography>{`exp: ${`0${item.card.exp_month
                                                                .toString()
                                                                .slice(-2)}`}/${item.card.exp_year
                                                                    .toString()
                                                                    .substring(2)}`}</Typography>
                                                            {/* </Grid>
                                                <Grid item xs={4}> */}
                                                            <Button
                                                                onClick={() => handleDelete(item)}
                                                                variant="danger"
                                                            >
                                                                <h6>Remove</h6>
                                                            </Button>
                                                            {/* </Grid> */}
                                                        </React.Fragment>
                                                        {/* </Card> */}
                                                    </Grid>
                                                    <Grid item md={6}>
                                                        <Box style={{ marginTop: 40 }}>
                                                            <Button
                                                                className="form-control"
                                                                variant="success"
                                                                type="submit"
                                                                onClick={bookHandler}
                                                            >
                                                                Book Appointment
                                                            </Button>
                                                        </Box>
                                                    </Grid>
                                                </Grid>
                                            </>
                                        ))}
                                    </Grid>
                                </>
                            ) : (
                                <Grid spacing={1} container>
                                    <Grid item xs={8} display="flex" alignItems="center">
                                        <Box sx={{ width: "100%" }}>
                                            <CardElement />
                                        </Box>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Button sx={{ ml: 4 }} onClick={handleSubmit} variant="success">
                                            <h6>Add</h6>
                                        </Button>
                                    </Grid>
                                </Grid>
                            )}
                        </Grid>
                    </Grid>
                )
            }
        </>
    );
};

export default Step5Payment;