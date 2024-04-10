import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import TextField from "@mui/material/TextField";
import DateTimePicker from "@mui/lab/DateTimePicker";
import DatePicker from "@mui/lab/DatePicker";
import Box from "@mui/material/Box";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import Grid from "@mui/material/Grid";
import { Button } from "react-bootstrap";
import { Autocomplete, Chip } from "@mui/material";
import { validations } from "../../util";
import {
    FormHelperText,
    MenuItem,
    Typography,
} from "@mui/material";
import { formatInTimeZone, zonedTimeToUtc } from "date-fns-tz";
import {
    createAppointment,
} from "../../redux/actions/AppointmentAction";
import moment from "moment";


const Step1BookAppointment = ({ history, setStep }) => {

    /**
     * Set State
     */
    const [appointmentId, setAppointmentId] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNo] = useState("");
    const [dob, setDob] = useState(null);
    // const [timeZone, setTimeZone] = useState("");
    const [gender, setGender] = useState("");
    const [bloodGroup, setBloodGroup] = useState("");
    const [height, setHeight] = useState("");
    const [weight, setWeight] = useState("");
    const [appointmentDateTime, setAppointmentDateTime] = useState(new Date());
    const [treatmentArea, setTreatmentArea] = useState([]);
    const [errors, setErrors] = useState({
        firstName: null,
        lastName: null,
        email: null,
        phoneNumber: null,
        dob: null,
        // timeZone: null,
        appointmentDateTime: null,
        bloodGroup: null,
        height: null,
        weight: null,
        // treatmentArea:
        gender: null,
    });

    const dispatch = useDispatch();

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    // const { timezone } = useSelector((state) => state.TimezoneReducer);

    const Treat = useSelector((state) => state.treatmentAreaReducer);
    const { treatmentarea } = Treat;

    const appointmentInfo = useSelector((state) => state.incompleteappointmentsReducer);
    const { incompleteAppointments } = appointmentInfo;

    useEffect(async () => {

        let data = incompleteAppointments;
        if (!data) {
            data = userInfo;
        }

        if (incompleteAppointments) {
            setAppointmentId(data._id);
        }
        setFirstName(data.firstName);
        setLastName(data.lastName);
        setEmail(data.email);
        setPhoneNo(data.phoneNumber);
        setGender(data.gender);
        setDob(data.dob);
        // setTimeZone(data.timeZone);
        setBloodGroup(data.bloodGroup);
        setHeight(data.height);
        setWeight(data.weight);
        setTreatmentArea(data?.treatmentArea ?? []);
    }, [dispatch, history, userInfo, incompleteAppointments]);

    const submitHandler = async () => {
        const utcPreferredTime = formatInTimeZone(
            zonedTimeToUtc(appointmentDateTime, userInfo?.timezoneData?.abbrevation),
            "UTC",
            "yyyy-MM-dd HH:mm"
        );
        console.log("..utcPreferredTime", utcPreferredTime);
        // formatInTimeZone(
        //   getIncompleteAppointments.appointmentDateTime,
        //   userInfo?.ustime_zone_names?.abbrevation,
        //   "yyyy-MM-dd hh:mm a"
        // );
        const success = await dispatch(
            createAppointment({
                step: 0,
                // _id: appointmentId,
                appointmentId: appointmentId,
                firstName: firstName,
                lastName: lastName,
                email: email,
                phoneNumber: phoneNumber,
                // timeZone: timeZone,
                gender: gender,
                bloodGroup: bloodGroup,
                height: height,
                weight: weight,
                dob: moment(dob).format("YYYY-MM-DD"),
                appointmentDateTime: utcPreferredTime,
                treatmentArea: treatmentArea,
            })
        );
        if (success) {
            setStep(1)
        }
    };

    const genderchoice = ["Male", "Female", "Others"];

    const validateSubmit = (e) => {
        e.preventDefault();
        const tempErrors = {
            firstName: validations.firstName(firstName),
            lastName: validations.lastName(lastName),
            email: validations.email(email),
            // timezone: validations.ustime_zone(timezone),
            gender: validations.gender(gender),
            phoneNumber: validations.phoneNumber(phoneNumber),
            dob: validations.Age(dob),
            bloodGroup: validations.bloodGroup(bloodGroup),
            height: validations.height(height),
            weight: validations.weight(weight),
            appointmentDateTime: validations.prefferedDateTime(appointmentDateTime),
            treatmentArea: validations.treatmentArea(treatmentArea),
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

    const bloodgroup = ["A+", "B+", "O+", "AB+", "A-", "B-", "O-", "AB-"];

    const RequiredLabel = ({ label }) => (
        <Typography>
            {label}
            <Typography style={{ color: "red", fontSize: "20px" }} component="span">
                {" "}
                *
            </Typography>
        </Typography>
    );

    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: 250,
            },
        },
    };

    return (
        <>
            {/* {loading ? (
                <Loader />
            ) : ( */}
            <div>
                {/* <AppointmentSteps step1 /> */}
                <Grid
                    container
                    spacing={0}
                    alignItems="center"
                    justifyContent="center"
                >
                    <Grid item md={7}>
                        <form onSubmit={validateSubmit} autoComplete="off">
                            <h5 style={{ color: "orange" }}>BOOK AN APPOINTMENT</h5>

                            <hr />

                            <Grid container spacing={4}>
                                <Grid item md={6}>
                                    <TextField
                                        error={!!errors.firstName}
                                        helperText={errors.firstName}
                                        label="First Name"
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
                                        label="Email"
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
                                        label="Phone Number"
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
                                        label="Gender"
                                        labelId="demo-simple-select-label"
                                        id="gender"
                                        value={gender}
                                        select
                                        error={!!errors.gender}
                                        onChange={(e) => {
                                            setErrors({ ...errors, gender: null });
                                            setGender(e.target.value);
                                        }}
                                        fullWidth
                                        variant="standard"
                                    >
                                        {genderchoice.map((value, key) => (
                                            <MenuItem key={value} value={value}>
                                                {value}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                    <FormHelperText className="error" style={{ color: "red" }}>
                                        {errors.gender}
                                    </FormHelperText>
                                </Grid>
                                <Grid item md={6}>
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <DatePicker
                                            label="Date of birth"
                                            value={dob}
                                            inputFormat="dd-MM-yyyy"
                                            maxDate={new Date()}
                                            onChange={(newValue) => {
                                                setErrors({ ...errors, dob: null });
                                                setDob(newValue);
                                            }}
                                            renderInput={(params) => (
                                                <TextField variant="standard" fullWidth {...params} />
                                            )}
                                        />
                                    </LocalizationProvider>
                                    <FormHelperText className="error" style={{ color: "red" }}>
                                        {errors.dob}
                                    </FormHelperText>
                                </Grid>
                                {/* <Grid item md={6}>
                                    <TextField
                                        select
                                        labelId="demo-simple-select-label"
                                        id="ustime_zone"
                                        value={timeZone}
                                        error={!!errors.timeZone}
                                        label="timeZone"
                                        onChange={(e) => {
                                            setErrors({ ...errors, timeZone: null });
                                            const timezoneObj = timezone.find(
                                                (obj) => obj.timezone_id === e.target.value
                                            );
                                            setTimeZone(timezoneObj);
                                        }}
                                        fullWidth
                                        variant="standard"
                                    >
                                        {timezone?.map((value, key) => (
                                            <MenuItem key={value._id} value={value._id}>
                                                {value.timezoneName}
                                                {/* {userInfo?.ustime_zone_names?.timezone_name}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                    <FormHelperText className="error">
                                        {errors.timeZone}
                                    </FormHelperText>
                                </Grid> */}

                                {/* {JSON.stringify(timeZone)} */}
                                <Grid item md={6}>
                                    <TextField
                                        label="Blood Group"
                                        labelId="demo-simple-select-label"
                                        id="bloodGroup"
                                        value={bloodGroup}
                                        error={!!errors.bloodGroup}
                                        onChange={(e) => {
                                            setErrors({ ...errors, bloodGroup: null });
                                            setBloodGroup(e.target.value);
                                        }}
                                        variant="standard"
                                        fullWidth
                                        select
                                    >
                                        {bloodgroup.map((value) => (
                                            <MenuItem key={value} value={value}>
                                                {value}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                    <FormHelperText className="error" style={{ color: "red" }}>
                                        {errors.bloodGroup}
                                    </FormHelperText>
                                </Grid>
                                <Grid item md={6}>
                                    <TextField
                                        error={!!errors.height}
                                        helperText={errors.height}
                                        label="Height (cm)"
                                        variant="standard"
                                        value={height}
                                        onChange={(e) => {
                                            setErrors({ ...errors, height: null });
                                            setHeight(e.target.value);
                                        }}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item md={6}>
                                    <TextField
                                        error={!!errors.weight}
                                        helperText={errors.weight}
                                        label="Weight (kg)"
                                        variant="standard"
                                        value={weight}
                                        onChange={(e) => {
                                            setErrors({ ...errors, weight: null });
                                            setWeight(e.target.value);
                                        }}
                                        fullWidth
                                    />
                                </Grid>

                                {/* {JSON.stringify(userInfo.timezoneData[0].abbrevation)} */}
                                <Grid item md={6}>
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <DateTimePicker
                                            label="Appointment Date & Time"
                                            value={appointmentDateTime}
                                            inputFormat="dd-MM-yyyy hh:mm a"
                                            minDateTime={
                                                new Date(
                                                    formatInTimeZone(
                                                        new Date(),
                                                        userInfo?.timezoneData[0]?.abbrevation,
                                                        "dd-MM-yyyy HH:mm "
                                                    )
                                                )
                                            }
                                            onChange={(newValue) => {
                                                setErrors({ ...errors, appointmentDateTime: null });
                                                setAppointmentDateTime(newValue);
                                            }}
                                            renderInput={(params) => (
                                                <TextField
                                                    variant="standard"
                                                    error={!!errors.appointmentDateTime}
                                                    helperText={errors.appointmentDateTime}
                                                    fullWidth
                                                    {...params}
                                                />
                                            )}
                                        />
                                    </LocalizationProvider>
                                    <FormHelperText className="error" style={{ color: "red" }}>
                                        {errors.appointmentDateTime}
                                    </FormHelperText>
                                </Grid>

                                <Grid item md={12}>
                                    <Autocomplete
                                        multiple
                                        value={treatmentArea}
                                        id="tags-standard"
                                        renderTags={(value, getTagProps) =>
                                            value.map((option, index) => (
                                                <Chip
                                                    key={option}
                                                    value={option}
                                                    variant="outlined"
                                                    label={option.treatmentArea}
                                                    {...getTagProps({ index })}
                                                />
                                            ))
                                        }
                                        onChange={(e, newValue) => {
                                            if (newValue) {
                                                // console.log("..newvalue", newValue);
                                                setTreatmentArea(newValue);
                                                setErrors({ ...errors, treatmentArea: null });
                                            } else {
                                            }
                                        }}
                                        getOptionLabel={(option) => option.treatmentArea}
                                        options={treatmentarea ?? []}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                error={!!errors.treatmentArea}
                                                helperText={errors.treatmentArea}
                                                variant="standard"
                                                label={<RequiredLabel label="Treatment Area" />}
                                                fullWidth
                                                id="treatmentArea"
                                                value={treatmentArea}
                                            />
                                        )}
                                    />
                                    {/* {JSON.stringify(treatmentArea)} */}
                                </Grid>
                            </Grid>


                            {/* <Link to="/add-pharmacy"> */}
                            <Box style={{ marginTop: 40 }}>
                                <Button
                                    type="submit"
                                    className="form-control"
                                    variant="success"
                                >
                                    NEXT
                                </Button>
                            </Box>
                            {/* </Link> */}
                        </form>
                    </Grid>
                </Grid>
            </div>
            {/* )} */}
        </>
    );
};
export default Step1BookAppointment;