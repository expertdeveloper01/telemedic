import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import TextField from "@mui/material/TextField";
import DatePicker from "@mui/lab/DatePicker";
import Box from "@mui/material/Box";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import Grid from "@mui/material/Grid";
import { Button } from "react-bootstrap";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import { validations } from "../../util";
import { Autocomplete, Chip } from "@mui/material";
import {
  FormHelperText,
  InputLabel,
  MenuItem,
  Typography,
} from "@mui/material";
import { Timezonechoices } from "../../redux/actions/TimezoneAction";
import {
  getUserDetails,
  updateUserProfile,
} from "../../redux/actions/AuthAction";
import { statechoice } from "../../constants/otherConstants";
import { getTreatmentArea } from "../../redux/actions/treatmentAreaAction";
// import moment from "moment";
const Profile = ({ history, match }) => {
  /**
   * Set State
   */
  const dispatch = useDispatch();
  const { timezone } = useSelector((state) => state.TimezoneReducer);
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const { userType } = userInfo;
  const Treat = useSelector((state) => state.treatmentAreaReducer);
  const { treatmentarea } = Treat;
  console.log("userInfooooooo", userInfo);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNo] = useState("");
  const [country, setCountry] = useState("US");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [dob, setDob] = useState(null);
  const [speciality, setSpeciality] = useState("");
  const [qualification, setQualification] = useState("");
  const [submittedDialogOpen, setSubmittedDialogOpen] = useState(false);
  const [timeZone, setTimeZone] = useState("");
  const [gender, setGender] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [occupation, setOccupation] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [treatmentArea, setTreatmentArea] = useState([]);
  // const [license, setLicense] = useState("");
  const [errors, setErrors] = useState({
    firstName: null,
    lastName: null,
    email: null,
    phoneNumber: null,
    city: null,
    country: null,
    dob: null,
    timeZone: null,
    expertise: null,
    qualification: null,
    speciality: null,
    password: null,
    bloodGroup: null,
    height: null,
    weight: null,
    state: null,
    // license: null,
    confirmPassword: null,
    message: null,
    gender: null,
    treatmentArea: null,
  });
  const genderchoice = ["Male", "Female", "Others"];
  useEffect(() => {
    if (!userInfo) return;
    setFirstName(userInfo.firstName);
    setLastName(userInfo.lastName);
    setEmail(userInfo.email);
    setPhoneNo(userInfo.phoneNumber);
    setGender(userInfo.gender);
    setCountry(userInfo.country);
    setState(userInfo.state);
    setTimeZone(userInfo.timeZone);
    setDob(userInfo.dob);
    setCity(userInfo.city);
    setZipCode(userInfo.zipCode);
    setHeight(userInfo.height ?? []);
    setWeight(userInfo.weight ?? []);
    setOccupation(userInfo.occupation ?? []);
    setBloodGroup(userInfo.bloodGroup ?? []);
    setSpeciality(userInfo.speciality ?? []);
    // setTreatmentArea(userInfo.treatmentArea ?? []);
    setTreatmentArea(userInfo.treatmentArea?.map((data) => data));
    setQualification(userInfo.qualification ?? []);
  }, [userInfo]);
  console.log(
    "gggggg",
    userInfo.treatmentArea?.map((data) => data)
  );
  useEffect(() => {
    dispatch(getTreatmentArea());
    dispatch(getUserDetails(userInfo.id));
    dispatch(Timezonechoices());
    console.log(".....getuserdetails", getUserDetails());
  }, [dispatch]);
  const submitHandler = async () => {
    const status = await dispatch(
      updateUserProfile({
        id: userInfo.id,
        firstName: firstName,
        lastName: lastName,
        email: email,
        phoneNumber: phoneNumber,
        country: country,
        state: state,
        city: city,
        timeZone: timeZone,
        gender: gender,
        zipCode: zipCode,
        dob: dob,
        bloodGroup: bloodGroup,
        occupation: occupation,
        height: height,
        weight: weight,
        speciality: speciality,
        qualification: qualification,
        treatmentArea: treatmentArea,
        // license: license,
        // password: password,
      })
    );
    if (status) {
      setSubmittedDialogOpen(true);
    }
  };
  const validateSubmit = (e) => {
    e.preventDefault();
    const tempErrors = {
      firstName: validations.firstName(firstName),
      lastName: validations.lastName(lastName),
      email: validations.email(email),
      city: validations.city(city),
      timeZone: validations.ustime_zone(timeZone),
      gender: validations.gender(gender),
      phoneNumber: validations.phoneNumber(phoneNumber),
      state: validations.state(state),
      zipCode: validations.ZipCode(zipCode),
      dob: validations.dateOfBirth(dob),
      bloodGroup:
        userType === "doctor" ? null : validations.bloodGroup(bloodGroup),
      occupation:
        userType === "doctor" ? null : validations.occupation(occupation),
      treatmentArea:
        userType === "patient"
          ? null
          : validations.treatmentArea(treatmentArea),
      height: userType === "doctor" ? null : validations.height(height),
      weight: userType === "doctor" ? null : validations.weight(weight),
      speciality:
        userType === "patient" ? null : validations.speciality(speciality),
      qualification:
        userType === "patient"
          ? null
          : validations.qualification(qualification),
      // license: userType === "patient" ? null : validations.license(license),
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
  const specialityChoice = [
    "Cardiologist",
    "Audiologist",
    "Dentist",
    "ENT",
    "Gynaecologist",
    "Orthopaedic surgeon",
    "Paediatrician",
  ];
  const RequiredLabel = ({ label }) => (
    <Typography>
      {label}
      <Typography style={{ color: "red", fontSize: "20px" }} component="span">
        {" "}
        *
      </Typography>
    </Typography>
  );
  return (
    <Grid container spacing={0} alignItems="center" justifyContent="center">
      <Grid item md={7}>
        <Dialog
          open={submittedDialogOpen}
          onClose={() => setSubmittedDialogOpen(false)}
        >
          <DialogTitle>Your profile has been updated successfully.</DialogTitle>
          <DialogActions>
            <Button onClick={() => setSubmittedDialogOpen(false)}>Ok</Button>
          </DialogActions>
        </Dialog>
        <form onSubmit={validateSubmit} autoComplete="off">
          <h5 style={{ color: "orange", marginBottom: "20px" }}>
            BASIC INFROMATION
          </h5>
          <Grid container spacing={4}>
            <Grid item md={6}>
              <TextField
                error={!!errors.firstName}
                helperText={errors.firstName}
                label="First Name"
                variant="standard"
                disabled
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
                disabled
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
                disabled
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
                disabled
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
                label={<RequiredLabel label="Gender" />}
                select
                fullWidth
                labelId="demo-simple-select-label"
                id="gender"
                value={gender}
                // value="Male"
                error={!!errors.gender}
                onChange={(e) => {
                  setErrors({ ...errors, gender: null });
                  setGender(e.target.value);
                }}
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

            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <h5 style={{ color: "orange", marginTop: "25px" }}>
              CONTACT DETAILS
            </h5>
            <Grid item md={12}>
              <TextField
                label="Country"
                variant="standard"
                value={country}
                disabled
                fullWidth
              />
            </Grid>
            <Grid item md={6}>
              <TextField
                label={<RequiredLabel label="State" />}
                select
                fullWidth
                labelId="demo-simple-select-label"
                id="state"
                value={state}
                error={!!errors.state}
                onChange={(e) => {
                  setErrors({ ...errors, state: null });
                  setState(e.target.value);
                }}
                variant="standard"
              >
                {statechoice.map((value, key) => (
                  <MenuItem key={value} value={value}>
                    {value}
                  </MenuItem>
                ))}
              </TextField>
              <FormHelperText className="error" style={{ color: "red" }}>
                {errors.state}
              </FormHelperText>
            </Grid>
            <Grid item md={6}>
              <TextField
                error={!!errors.city}
                helperText={errors.city}
                label={<RequiredLabel label="City" />}
                variant="standard"
                value={city}
                onChange={(e) => {
                  setErrors({ ...errors, city: null });
                  setCity(e.target.value);
                }}
                fullWidth
              />
            </Grid>
            <Grid item md={6}>
              <TextField
                error={!!errors.zipCode}
                helperText={errors.zipCode}
                label={<RequiredLabel label="Zip Code" />}
                variant="standard"
                value={zipCode}
                onChange={(e) => {
                  setErrors({ ...errors, zipCode: null });
                  setZipCode(e.target.value.replace(/[^0-9+]/g, ""));
                }}
                fullWidth
              />
            </Grid>
            <Grid item md={6}>
              <TextField
                label={<RequiredLabel label="Time zone" />}
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
              {/* {JSON.stringify(timezone)} */}
              <FormHelperText className="error" style={{ color: "red" }}>
                {errors.timeZone}
              </FormHelperText>
            </Grid>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <h5 style={{ marginTop: "25px", color: "orange" }}>
              OTHER DETAILS
            </h5>
            {/* If Patient */}
            {userInfo?.userType === "patient" && (
              <>
                <Grid item md={12}>
                  <TextField
                    error={!!errors.occupation}
                    helperText={errors.occupation}
                    label={<RequiredLabel label="Occupation" />}
                    variant="standard"
                    value={occupation}
                    onChange={(e) => {
                      setErrors({ ...errors, occupation: null });
                      setOccupation(e.target.value);
                    }}
                    fullWidth
                  />
                </Grid>
                <Grid item md={6}>
                  <TextField
                    label={<RequiredLabel label="Blood Group" />}
                    select
                    fullWidth
                    labelId="demo-simple-select-label"
                    id="bloodGroup"
                    value={bloodGroup}
                    error={!!errors.bloodGroup}
                    onChange={(e) => {
                      setErrors({ ...errors, bloodGroup: null });
                      setBloodGroup(e.target.value);
                    }}
                    variant="standard"
                  >
                    {bloodgroup.map((value, key) => (
                      <MenuItem key={value} value={value}>
                        {value}
                      </MenuItem>
                    ))}
                  </TextField>
                  <FormHelperText className="error" style={{ color: "red" }}>
                    {errors.bloodGroup}
                  </FormHelperText>
                </Grid>
                <Grid item md={3}>
                  <TextField
                    error={!!errors.height}
                    helperText={errors.height}
                    label={<RequiredLabel label="Height (cm)" />}
                    variant="standard"
                    value={height}
                    onChange={(e) => {
                      setErrors({ ...errors, height: null });
                      setHeight(e.target.value);
                    }}
                    fullWidth
                  />
                </Grid>
                <Grid item md={3}>
                  <TextField
                    error={!!errors.weight}
                    helperText={errors.weight}
                    label={<RequiredLabel label="Weight (kg)" />}
                    variant="standard"
                    value={weight}
                    onChange={(e) => {
                      setErrors({ ...errors, weight: null });
                      setWeight(e.target.value);
                    }}
                    fullWidth
                  />
                </Grid>
              </>
            )}
            {/* If doctor            */}
            {userInfo?.userType === "doctor" && (
              <>
                <Grid item md={12}>
                  <TextField
                    label={<RequiredLabel label="Speciality" />}
                    select
                    labelId="demo-simple-select-label"
                    id="speciality"
                    value={speciality}
                    onChange={(e) => {
                      setErrors({ ...errors, speciality: null });
                      setSpeciality(e.target.value);
                    }}
                    fullWidth
                    variant="standard"
                  >
                    {specialityChoice.map((value, key) => (
                      <MenuItem key={value} value={value}>
                        {value}
                      </MenuItem>
                    ))}
                  </TextField>
                  <FormHelperText className="error" style={{ color: "red" }}>
                    {errors.speciality}
                  </FormHelperText>
                </Grid>
                <Grid item md={12}>
                  <TextField
                    error={!!errors.qualification}
                    helperText={errors.qualification}
                    label={<RequiredLabel label="Qualification" />}
                    variant="standard"
                    value={qualification}
                    onChange={(e) => {
                      setErrors({ ...errors, qualification: null });
                      setQualification(e.target.value);
                    }}
                    fullWidth
                  />
                </Grid>
                <Grid item md={12}>
                  <Autocomplete
                    multiple
                    value={treatmentArea ?? []}
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
                  {/* {JSON.stringify(treatmentarea)} */}
                </Grid>
              </>
            )}
          </Grid>
          <Box style={{ marginTop: 40 }}>
            <Button type="submit" className="form-control" variant="success">
              Save Profile
            </Button>
          </Box>
        </form>
      </Grid>
    </Grid>
  );
};
export default Profile;

