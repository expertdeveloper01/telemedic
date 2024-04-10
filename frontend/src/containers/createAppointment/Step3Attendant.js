import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { Button } from "react-bootstrap";
import { validations } from "../../util";
import { FormHelperText, MenuItem } from "@mui/material";
import {
    createAppointment,
} from "../../redux/actions/AppointmentAction";
import {
    deleteAttendant,
    getAttendant
} from "../../redux/actions/AttendantAction";
import { relationChoice } from "../../constants/otherConstants";
import swal from "sweetalert";

const Step3Attendant = ({ history, setStep }) => {
    /**
     * Set State
     */
    const [appointmentId, setAppointmentId] = useState("")
    const [attendantId, setAttendantId] = useState("")
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNo] = useState("");
    const [timeZone, setTimeZone] = useState("");
    const [relation, setRelation] = useState("");
    const [errors, setErrors] = useState({
        name: null,
        email: null,
        lastName: null,
        phoneNumber: null,
        timeZone: null,
        relation: null,
    });

    const { timezone } = useSelector((state) => state.TimezoneReducer);

    const dispatch = useDispatch();

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const appointmentInfo = useSelector((state) => state.incompleteappointmentsReducer);
    const { incompleteAppointments } = appointmentInfo;

    const { attendantDetails } = useSelector((state) => state.attendantReducer);

    useEffect(async () => {
        // Get userInfo From Reducer
        if (incompleteAppointments) {
            setAppointmentId(incompleteAppointments._id);
        }
        else {
            setAppointmentId()
        }
        if (attendantDetails) {
            setAttendantId(attendantDetails._id)
        }
        else {
            setAttendantId()
        }
        setFirstName(attendantDetails.firstName);
        setLastName(attendantDetails.lastName);
        setEmail(attendantDetails.email);
        setPhoneNo(attendantDetails.phoneNumber);
        setRelation(attendantDetails.relationWithPatient);
        setTimeZone(attendantDetails.timeZone);
    }, [dispatch, history, userInfo]);

    const submitHandler = async () => {
        const status = await dispatch(
            createAppointment({
                step: 2,
                appointmentId: appointmentId,
                attendantId: attendantId,
                firstName,
                lastName,
                email,
                phoneNumber,
                timeZone,
                relation,
            })
        );
        if (status) {
            setStep(3)
        }
    };

    const validateSubmit = (e) => {
        e.preventDefault();
        const tempErrors = {
            firstName: validations.firstName(firstName),
            lastName: validations.lastName(lastName),
            email: validations.pharmacyemail(email),
            phoneNumber: validations.pharmacyphoneNumber(phoneNumber),
            timeZone: validations.ustime_zone(timeZone),
            relation: validations.relation(relation),
        };
        setErrors(tempErrors);
        if (Object.values(tempErrors).filter((value) => value).length) {
            console.log(
                "..values",
                Object.values(tempErrors).filter((value) => value)
            );
            return;
        }
        submitHandler();
    };

    const attendantAddSkip = () => {
        setStep(3)
    }

    const deleteAttendantHandler = () => {
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover the attendant details",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    swal("Attendant Details Deleted", {
                        icon: "success",
                    });
                    dispatch(deleteAttendant(attendantDetails._id))
                    setFirstName("");
                    setLastName("");
                    setEmail("");
                    setPhoneNo("");
                    setRelation("");
                    setTimeZone("");
                    dispatch(getAttendant());
                } else {
                    //   swal("Your imaginary file is safe!");
                    return
                }
            });
    }


    return (
        <>
            {/* {loading ? (
                <Loader />
            ) : ( */}
            <div>
                {/* {JSON.stringify(attendantDetails)} */}
                {/* <AppointmentSteps step1 step2 step3 /> */}
                <Grid
                    container
                    spacing={0}
                    alignItems="center"
                    justifyContent="center"
                >
                    <Grid item md={7}>
                        <div style={{ textAlign: "right" }}>
                            {attendantDetails ? (
                                <Button
                                    onClick={() => deleteAttendantHandler()}
                                    variant="danger"
                                >
                                    Delete
                                </Button>
                            ) : (
                                <Button
                                    onClick={() => attendantAddSkip()}
                                    variant="success"
                                >
                                    Skip
                                </Button>
                            )}
                        </div>
                        <form onSubmit={validateSubmit} autoComplete="off">
                            <h5 style={{ color: "orange" }}>ATTENDANT DETAILS</h5>

                            <hr />

                            <Grid container spacing={4}>
                                <Grid item md={6}>
                                    <TextField
                                        error={!!errors.firstName}
                                        helperText={errors.firstName}
                                        // label={<RequiredLabel label="First Name" />}
                                        label=" First Name"
                                        variant="standard"
                                        value={firstName}
                                        onChange={(e) => {
                                            setErrors({ ...errors, firstName: null });
                                            setFirstName(e.target.value);
                                        }}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item md={6}>
                                    <TextField
                                        error={!!errors.lastName}
                                        helperText={errors.lastName}
                                        // label={<RequiredLabel label=" Last Name" />}
                                        label="Last Name"
                                        variant="standard"
                                        value={lastName}
                                        onChange={(e) => {
                                            setErrors({ ...errors, lastName: null });
                                            setLastName(e.target.value);
                                        }}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item md={6}>
                                    <TextField
                                        error={!!errors.email}
                                        helperText={errors.email}
                                        // label={<RequiredLabel label=" Email" />}
                                        label=" Email"
                                        type="text"
                                        variant="standard"
                                        value={email}
                                        onChange={(e) => {
                                            setErrors({ ...errors, email: null });
                                            setEmail(e.target.value);
                                        }}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item md={6}>
                                    <TextField
                                        error={!!errors.phoneNumber}
                                        helperText={errors.phoneNumber}
                                        // label={<RequiredLabel label=" Phone Number" />}
                                        label=" Phone Number"
                                        type="text"
                                        variant="standard"
                                        value={phoneNumber}
                                        onChange={(e) => {
                                            setErrors({ ...errors, phoneNumber: null });
                                            setPhoneNo(e.target.value.replace(/[^0-9+]/g, ""));
                                        }}
                                        fullWidth
                                    />
                                </Grid>

                                <Grid item md={6}>
                                    <TextField
                                        fullWidth
                                        select
                                        label="Relation"
                                        labelId="demo-simple-select-label"
                                        id="relation"
                                        value={relation}
                                        error={!!errors.relation}
                                        onChange={(e) => {
                                            setErrors({ ...errors, relation: null });
                                            setRelation(e.target.value);
                                        }}
                                        variant="standard"
                                    >
                                        {relationChoice.map((value, key) => (
                                            <MenuItem key={value} value={value}>
                                                {value}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                    <FormHelperText className="error" style={{ color: "red" }}>
                                        {errors.relation}
                                    </FormHelperText>
                                </Grid>
                                <Grid item md={6}>
                                    <TextField
                                        label="TimeZone"
                                        select
                                        labelId="demo-simple-select-label"
                                        id="timeZone"
                                        value={timeZone}
                                        error={!!errors.timeZone}
                                        onChange={(e) => {
                                            setErrors({ ...errors, timeZone: null });
                                            setTimeZone(e.target.value);
                                        }}
                                        fullWidth
                                        variant="standard"
                                    >
                                        {timezone?.map((value, key) => (
                                            <MenuItem key={value._id} value={value._id}>
                                                {value.timezoneName}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                    <FormHelperText className="error" style={{ color: "red" }}>
                                        {errors.timeZone}
                                    </FormHelperText>
                                </Grid>
                            </Grid>
                            <Box style={{ marginTop: 40 }}>
                                <Button
                                    type="submit"
                                    className="form-control"
                                    variant="success"
                                >
                                    NEXT
                                </Button>
                            </Box>
                        </form>
                    </Grid>
                </Grid>
            </div>
            {/* )} */}
        </>
    );
};
export default Step3Attendant;














