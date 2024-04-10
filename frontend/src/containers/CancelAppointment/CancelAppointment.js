import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import { makeStyles } from "@mui/styles";
import base64 from "base-64";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../../components/Loader/loader";
import Message from '../../components/Message/Message'
import { validations } from "../../util";
import { Button } from "react-bootstrap";
import { Box } from "@mui/material";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { cancelAppointmentAction } from '../../redux/actions/AppointmentAction'
import swal from "sweetalert";
import FormHelperText from "@mui/material/FormHelperText";


const useStyles = makeStyles((theme) => ({
  root: {
    "& .error": {
      color: theme.palette.error.main,
    },
  },
}));

function CancelAppointment({ history, match }) {
  // const appointmentId = base64.decode(match.params.appointmentId);
  const appointmentId = match.params.appointmentId;

  const classes = useStyles();

  // Dispatch used For Calling Action
  const dispatch = useDispatch();

  // initialize variables
  const [reasonToCancel, setReasonToCancel] = useState("");
  // const [otherReason, setOtherReason] = useState(null);

  const [errors, setErrors] = useState({
    reasonToCancel: null,
    // otherReason: null,
  });

  // Get Details From Reducer
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  // const AppointmentDoctor = useSelector((state) => state.AppointmentReducer);
  // const { error, loading, message } = AppointmentDoctor;

  useEffect(() => {
    if (!userInfo) {
      history.push("/");
    }
  }, []);

  // validate submit button
  const validateSubmit = (e) => {
    e.preventDefault();
    const tempErrors = {
      // if (reasonToCancel !== 'Other')
      reasonToCancel: validations.reasonToCancel(reasonToCancel),
      // otherReason: !otherReason ? "Please specify other reason" : null,
    };
    setErrors(tempErrors);
    if (Object.values(tempErrors).filter((value) => value).length) {
      console.log(
        "..values",
        Object.values(tempErrors).filter((value) => value)
      );
      return;
    }
    detailsSubmit();
  };

  // detail submit after validating
  const detailsSubmit = async () => {
    const success = await dispatch(cancelAppointmentAction({ reasonToCancel }, appointmentId))
    console.log(userInfo["userType"])

    if (success) {
      swal("Appointment Cancelled", "Your refund will initiate shortly", "info", {
        button: "OK",
      })
      // clearFields();
      userInfo["userType"] === 'doctor' ? (
        history.push('/docappointmentlist')
      ) : (
        history.push('/patappointmentlist')
      )
    }

    // if (appointmentId) {
    //   if (reasonToCancel) {
    //     dispatch(cancelAppointmentAction(appointmentId, reasonToCancel));
    //   }
    //   if (otherReason) {
    //     dispatch(cancelAppointmentAction(appointmentId, otherReason));
    //   }
    // }
    clearFields();
  };

  // ClearField
  const clearFields = () => {
    reasonToCancel(null);
  };

  return (
    <>
      {/* {loading ? ( */}
      {/* {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : message ? (
        <Message variant="info">{message}</Message>
      ) : ( */}
      <Grid container spacing={0} alignItems="center" justifyContent="center">
        <Grid item md={6} my={6}>
          <h5 style={{ color: "orange" }}>CANCEL APPOINTMENT</h5>
          <form onSubmit={validateSubmit} autoComplete="off">
            <Grid container spacing={4} my={1}>
              <Grid item md={12}>
                <FormControl>
                  <FormLabel id="demo-radio-buttons-group-label">
                    Reason For Cancelling
                  </FormLabel>
                  <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    defaultValue="Technical Problem"
                    name="radio-buttons-group"
                    onChange={(e) => setReasonToCancel(e.target.value)}
                    value={reasonToCancel}
                  >
                    <FormControlLabel
                      value="Technical Problem"
                      control={<Radio />}
                      label="Technical Problem"
                    />
                    <FormControlLabel
                      value="Busy Schedule"
                      control={<Radio />}
                      label="Busy Schedule"
                    />
                    {/* <FormControlLabel
                      value="Other"
                      control={<Radio />}
                      label="Other"
                    />

                    {reasonToCancel === "Other" && (
                      <Grid container spacing={4}>
                        <Grid item md={12}>
                          <TextField
                            error={
                              reasonToCancel === "Other" && !!errors.otherReason
                            }
                            helperText={
                              reasonToCancel === "Other" && errors.otherReason
                            }
                            variant="outlined"
                            value={otherReason}
                            onChange={(e) => {
                              setErrors({ ...errors, otherReason: null });
                              setOtherReason(e.target.value);
                            }}
                            fullWidth
                          />
                        </Grid>
                      </Grid>
                    )} */}
                  </RadioGroup>
                </FormControl>
                <FormHelperText className="error" style={{ color: 'red' }}>
                  {errors.reasonToCancel}
                </FormHelperText>
                {/* <TextField id="outlined-basic" label="Reason" variant="outlined" /> */}
                {/* <Grid item md={7}>
                                    <TextField id="outlined-basic" label="Reason" variant="outlined" />
                                </Grid> */}
              </Grid>
            </Grid>
            <Box style={{ marginTop: 40 }}>
              <Button type="submit" className="form-control" variant="success">
                Submit
              </Button>
            </Box>
          </form>
        </Grid>
      </Grid>
      {/* )} */}
    </>
  );
}

export default CancelAppointment;
