import {
  CardContent,
  Dialog,
  DialogActions,
  DialogTitle,
  Grid,
  Typography,
} from "@mui/material";
import { Card } from "react-bootstrap";
import { Box } from "@mui/system";
import { Button } from "react-bootstrap";
import AppointmentSteps from "../../components/appointmentSteps";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getPharmacy,
} from "../../redux/actions/PharmacyAction";
import {
  getAttendant,
} from '../../redux/actions/AttendantAction'
function AppointmentView({ history }) {
  const [submittedDialogOpen, setSubmittedDialogOpen] = useState(false);
  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const { pharmacyDetails } = useSelector((state) => state.pharmacyReducer);
  const { attendantDetails } = useSelector((state) => state.attendantReducer);
  useEffect(() => {
    dispatch(getPharmacy());
    dispatch(getAttendant());
  }, [dispatch]);
  const bookHandler = () => {
    setSubmittedDialogOpen(true);
  };
  return (
    <div>
      {!userInfo?.userType === "doctor" && (
        <AppointmentSteps step1 step2 step3 step4 />
      )}
      <Grid container spacing={0} alignItems="center" justifyContent="center">
        <Grid item md={6}>
          <Dialog
            open={submittedDialogOpen}
            onClose={() => history.push("/patappointmentlist")}
          >
            <DialogTitle>
              Your appointment has been submitted successfully.
            </DialogTitle>
            <DialogActions>
              <Button onClick={() => history.push("/patappointmentlist")}>
                Go to appointment List
              </Button>
            </DialogActions>
          </Dialog>
          <h5 style={{ color: "orange", marginBottom: "25px" }}>
            APPOINTMENT DETAILS
          </h5>
          <Card sx={{ minWidth: 275 }}>
            <CardContent>
              <Typography variant="h5" component="div">
                Personal Details
              </Typography>
              <Typography sx={{ mb: 2.5 }} color="text.secondary">
                First Name : {userInfo.firstName} <br />
                Last Name : {userInfo.lastName} <br />
                Email : {userInfo.email} <br />
                Phone Number :{userInfo.phoneNumber} <br />
                Blood Group : {userInfo.bloodGroup} <br />
              </Typography>
            </CardContent>
          </Card>
          <br />
          <Card sx={{ minWidth: 275 }}>
            <CardContent>
              <Typography variant="h5" component="div">
                Pharmacy Details
              </Typography>
              <Typography sx={{ mb: 2.5 }} color="text.secondary">
                {/* {JSON.stringify(pharmacyDetails)} */}
                Pharmacy Name : {pharmacyDetails?.pharmacyName} <br />
                Pharmacy Email : {pharmacyDetails?.pharmacyEmail} <br />
                Pharmacy Phone Number : {
                  pharmacyDetails?.pharmacyphoneNumber
                }{" "}
                <br />
                State : {pharmacyDetails?.state}
                <br />
                City : {pharmacyDetails?.city}
                <br />
                Zip Code : {pharmacyDetails?.zipCode}
              </Typography>
            </CardContent>
          </Card>
          <br />
          <Card sx={{ minWidth: 275 }}>
            <CardContent>
              <Typography variant="h5" component="div">
                Attendant Details
              </Typography>
              <Typography sx={{ mb: 2.5 }} color="text.secondary">
                First Name : {attendantDetails?.firstName} <br />
                Last Name : {attendantDetails?.lastName} <br />
                Email : {attendantDetails?.email} <br />
                Phone Number : {attendantDetails?.phoneNumber} <br />
                Relation : {attendantDetails?.relation}
              </Typography>
            </CardContent>
          </Card>
          {!userInfo?.userType === "doctor" && (
            <Box style={{ marginTop: 40 }}>
              <Button
                className="form-control"
                variant="success"
                onClick={bookHandler}
              >
                BOOK APPOINTMENT
              </Button>
            </Box>
          )}
        </Grid>
      </Grid>
    </div>
  );
}
export default AppointmentView;