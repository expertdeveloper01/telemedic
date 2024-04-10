import {
    CardContent,
    Grid,
    Typography,
} from "@mui/material";
import { Card } from "react-bootstrap";
import { Box } from "@mui/system";
import { Button } from "react-bootstrap";
import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";

/**
 * Appointment View Page
 */
function Step4AppointmentView({ history, setStep }) {

    const [submittedDialogOpen, setSubmittedDialogOpen] = useState(false);
    const messagesEndRef = useRef(null)

    const dispatch = useDispatch();

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const { pharmacyDetails } = useSelector((state) => state.pharmacyReducer);

    const { attendantDetails } = useSelector((state) => state.attendantReducer);

    const appointmentInfo = useSelector((state) => state.incompleteappointmentsReducer);
    const { incompleteAppointments } = appointmentInfo;

    useEffect(() => {
        scrollToBottom()
    }, [incompleteAppointments, attendantDetails, pharmacyDetails, userInfo]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    const bookHandler = () => {
        setSubmittedDialogOpen(true);
        setStep(4)
    };

    return (
        <div>
            <Grid container spacing={0} alignItems="center" justifyContent="center">
                <Grid item md={6}>

                    {/* <Dialog
                        open={submittedDialogOpen}
                        onClose={() => history.push("/patappointmentlist")}
                    >
                        <DialogTitle>
                            Your appointment has been submitted successfully.
                        </DialogTitle>
                        <DialogActions>
                            <Button onClick={() => {
                                dispatch(resetMessages());
                                history.push("/patappointmentlist")
                            }}>
                                Go to appointment List
                            </Button>
                        </DialogActions>
                    </Dialog> */}

                    <h5 style={{ color: "orange", marginBottom: "25px" }}>
                        APPOINTMENT DETAILS
                    </h5>
                    <Card sx={{ minWidth: 275 }}>
                        <CardContent>
                            <Typography variant="h5" component="div">
                                Personal Details
                            </Typography>
                            <Typography sx={{ mb: 2.5 }} color="text.secondary">
                                First Name : {incompleteAppointments?.firstName} <br />
                                Last Name : {incompleteAppointments?.lastName} <br />
                                Email : {incompleteAppointments?.email} <br />
                                Phone Number :{incompleteAppointments?.phoneNumber} <br />
                                Blood Group : {incompleteAppointments?.bloodGroup} <br />
                            </Typography>
                        </CardContent>
                    </Card>

                    <br />

                    <Card sx={{ minWidth: 275 }}>
                        <CardContent>
                            <Typography variant="h5" component="div">
                                Pharmacy Details
                            </Typography>
                            {pharmacyDetails.map((pharma) => (
                                <Typography sx={{ mb: 2.5 }} color="text.secondary" key={pharma._id}>
                                    Pharmacy Name : {pharma['pharmacyName']} <br />
                                    Pharmacy Email : {pharma.email} <br />
                                    Pharmacy Phone Number : {pharma.phoneNumber}{" "} <br />
                                    State : {pharma.state} <br />
                                    City : {pharma.city} <br />
                                    Zip Code : {pharma.zipCode}
                                </Typography>

                            ))}
                        </CardContent>
                    </Card>

                    <br />

                    <Card sx={{ minWidth: 275 }}>
                        <CardContent>
                            <Typography variant="h5" component="div">
                                Attendant Details
                            </Typography>
                            {attendantDetails ? (
                                <>
                                    <Typography sx={{ mb: 2.5 }} color="text.secondary">
                                        First Name : {attendantDetails?.firstName} <br />
                                        Last Name : {attendantDetails?.lastName} <br />
                                        Email : {attendantDetails?.email} <br />
                                        Phone Number : {attendantDetails?.phoneNumber} <br />
                                        Relation : {attendantDetails?.relationWithPatient}
                                    </Typography>
                                </>
                            ) : (
                                <Typography sx={{ mb: 2.5 }} color="text.secondary">No Attendant Added</Typography>
                            )}
                        </CardContent>
                    </Card>

                    {/* {!userInfo?.userType === "doctor" && ( */}
                    <Box style={{ marginTop: 40 }}>
                        <Button
                            className="form-control"
                            variant="success"
                            type="submit"
                            onClick={bookHandler}
                        >
                            Next
                        </Button>
                    </Box>
                    {/* )} */}
                    <div ref={messagesEndRef} />
                </Grid>
            </Grid>
        </div>
    );
}
export default Step4AppointmentView;