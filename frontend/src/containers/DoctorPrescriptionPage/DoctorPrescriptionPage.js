import React, { useState, useEffect } from "react";
import FormHelperText from "@mui/material/FormHelperText";
import { Button } from "react-bootstrap";
import { resetMessages } from "../../redux/actions/AuthAction";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import { DialogActions } from "@mui/material";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Grid from "@mui/material/Grid";
import { useDispatch, useSelector } from "react-redux";
import { Typography } from "@mui/material";
import { Dialog } from "@mui/material";
import { Autocomplete } from "@mui/material";
import { createFilterOptions } from "@mui/material/Autocomplete";
import { styled } from "@mui/system";
import { OutlinedInput } from "@mui/material";
import { Input } from "@mui/material";
import swal from "sweetalert";
import { addPrescription } from "../../redux/actions/AppointmentAction";

// const useStyles = makeStyles((theme) => ({
//     root: {
//         "& .error": {
//             color: theme.palette.error.main,
//         },
//     },
// }));

function DoctorPrescriptionPage({ history, match }) {

  // Get UserInfo From Reducer
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (!userInfo) {
      history.push("/")
    }
  }, [history]);

  const appointmentId = match.params.appointmentId;

  console.log('appointmentId: ', appointmentId)

  const [value, setValue] = React.useState(null);

  const doctorPrescription = useSelector((state) => state.appointmentReducer);
  const { error, loading, message } = doctorPrescription;

  // Required field star mark
  const RequiredLabel = ({ label }) => (
    <Typography>
      {label}
      <Typography style={{ color: "red", fontSize: "100%" }} component="span">
        {" "}
        *
      </Typography>
    </Typography>
  );

  // Set the state
  const [medicineName, setMedicineName] = useState("");
  const [drugForm, setDrugForm] = useState("");
  const [doseQuantity, setDoseQuantity] = useState("");
  const [doseUnit, setDoseUnit] = useState("");
  const [doseDuration, setDoseDuration] = useState("");
  const [doseFrequency, setDoseFrequency] = useState("");
  const [doseDurationUnit, setDoseDurationUnit] = useState("");
  const [errors, setErrors] = useState({
    medicineName: null,
    drugForm: null,
    doseQuantity: null,
    doseUnit: null,
    doseDuration: null,
    doseFrequency: null,
    doseDurationUnit: null,
    // message: null,
  });

  const dispatch = useDispatch();

  // errors Validations all fields
  const validateSubmit = (e) => {
    e.preventDefault();

    const tempErrors = {
      medicineName: !medicineName ? "Medicine name is required" : null,
      drugForm: !drugForm ? "Drug form is required" : null,
      doseQuantity: !doseQuantity ? "Quantity of dose is required" : null,
      doseUnit: !doseUnit ? "Dose unit is required" : null,
      doseDuration: !doseDuration ? "Dose duration is required" : null,
      doseFrequency: !doseFrequency ? "Frequency of dose is required" : null,
      doseDurationUnit: !doseDurationUnit
        ? "Dose duration unit is required"
        : null,
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

  const submitHandler = async () => {
    const success = await dispatch(
      addPrescription({
        medicineName,
        drugForm,
        doseQuantity,
        doseUnit,
        doseDuration,
        doseFrequency,
        doseDurationUnit
      },
        appointmentId)
    );
    if (success) {
      swal("Success", "Prescription added successfully", "success", {
        button: "OK",
      })
      clearFields();
      history.push('/docappointmentlist')
    }
  };

  /***
   * ClearField
   *
   */
  const clearFields = () => {
    setMedicineName("");
    setDrugForm("");
    setDoseQuantity("");
    setDoseUnit("");
    setDoseDuration("");
    setDoseFrequency("");
    setDoseDurationUnit("");
  };

  const drugFormchoices = [
    "Tablet",
    "Syrup",
    "Suspension",
    "Capsule",
    "Injection",
  ];
  const doseUnitchoices = ["ml", "mg", "gm"];
  const doseFrequencychoices = [
    "Once a day",
    "Twice a day",
    "Thrice a day",
    "Four times a day",
    "As needed",
  ];
  const doseDurationUnitchoices = ["Days", "Weeks", "Months"];

  return (
    <Grid container spacing={0} alignItems="center" justifyContent="center">
      <Grid item md={6} my={6}>
        <h5 style={{ color: "orange" }}>ADD PRESCRIPTION</h5>

        <form onSubmit={validateSubmit} autoComplete="off">
          <Grid container spacing={4}>
            <Grid item md={8}>
              <TextField
                inputProps={{ maxLength: 40 }}
                label={<RequiredLabel label="Medicine Name" />}
                error={!!errors.medicineName}
                helperText={errors.medicineName}
                variant="standard"
                value={medicineName}
                // input={<Input notched label="Dose Name" />}
                onChange={(e) => {
                  setErrors({ ...errors, medicineName: null });
                  setMedicineName(e.target.value);
                }}
                fullWidth
              />
            </Grid>

            <Grid item md={4}>
              <TextField
                select
                fullWidth
                label={<RequiredLabel label="Drug Form" />}
                labelId="demo-simple-select-label"
                id="drugForm"
                value={drugForm}
                defaultValue="Tablet"
                error={!!errors.drugForm}
                onChange={(e) => {
                  setErrors({ ...errors, drugForm: null });
                  setDrugForm(e.target.value);
                }}
                // input={<OutlinedInput notched label="Dose Form+" />}
                variant="standard"
              >
                {drugFormchoices.map((value, key) => (
                  <MenuItem key={value} value={value}>
                    {value}
                  </MenuItem>
                ))}
              </TextField>
              <FormHelperText className="error" style={{ color: "#dc3545" }}>
                {errors.drugForm}
              </FormHelperText>
            </Grid>
          </Grid>

          <Grid container spacing={4}>
            <Grid item md={8} my={2}>
              <TextField
                inputProps={{ maxLength: 7 }}
                label={<RequiredLabel label="Quantity" />}
                error={!!errors.doseQuantity}
                helperText={errors.doseQuantity}
                variant="standard"
                value={doseQuantity}
                onChange={(e) => {
                  setErrors({ ...errors, doseQuantity: null });
                  setDoseQuantity(e.target.value.replace(/[^0-9+]/g, ""));
                }}
                fullWidth
              />
            </Grid>

            <Grid item md={4} my={2}>
              <TextField
                fullWidth
                select
                label={<RequiredLabel label="Dose Unit" />}
                labelId="demo-simple-select-label"
                id="doseUnit"
                defaultValue="ml"
                value={doseUnit}
                error={!!errors.doseUnit}
                onChange={(e) => {
                  setErrors({ ...errors, doseUnit: null });
                  setDoseUnit(e.target.value);
                }}
                variant="standard"
              // input={<OutlinedInput notched label="Dose Unit+" />}
              >
                {doseUnitchoices.map((value, key) => (
                  <MenuItem key={value} value={value}>
                    {value}
                  </MenuItem>
                ))}
              </TextField>
              <FormHelperText className="error" style={{ color: "#dc3545" }}>
                {errors.doseUnit}
              </FormHelperText>
            </Grid>
          </Grid>

          <Grid container spacing={4}>
            <Grid item md={12} my={2}>
              <TextField
                fullWidth
                label={<RequiredLabel label="Dose Frequency" />}
                select
                labelId="demo-simple-select-label"
                id="doseFrequency"
                value={doseFrequency}
                error={!!errors.doseFrequency}
                onChange={(e) => {
                  setErrors({ ...errors, doseFrequency: null });
                  setDoseFrequency(e.target.value);
                }}
                variant="standard"
              // input={<OutlinedInput notched label="Dose Frequency" />}
              >
                {doseFrequencychoices.map((value, key) => (
                  <MenuItem key={value} value={value}>
                    {value}
                  </MenuItem>
                ))}
              </TextField>
              <FormHelperText className="error" style={{ color: "#dc3545" }}>
                {errors.doseFrequency}
              </FormHelperText>
            </Grid>
          </Grid>

          <Grid container spacing={4}>
            <Grid item md={8} my={2}>
              <TextField
                inputProps={{ maxLength: 3 }}
                label={<RequiredLabel label="Dose Duration" />}
                error={!!errors.doseDuration}
                helperText={errors.doseDuration}
                variant="standard"
                value={doseDuration}
                onChange={(e) => {
                  setErrors({ ...errors, doseDuration: null });
                  setDoseDuration(e.target.value.replace(/[^0-9+]/g, ""));
                }}
                fullWidth
              />
            </Grid>

            <Grid item md={4} my={2}>
              <TextField
                label={<RequiredLabel label="Dose Duration Unit" />}
                fullWidth
                select
                labelId="demo-simple-select-label"
                id="doseDurationUnit"
                value={doseDurationUnit}
                error={!!errors.doseDurationUnit}
                onChange={(e) => {
                  setErrors({ ...errors, doseDurationUnit: null });
                  setDoseDurationUnit(e.target.value);
                }}
                variant="standard"
              // input={<OutlinedInput notched label="Dose Duration Unit+" />}
              >
                {doseDurationUnitchoices.map((value, key) => (
                  <MenuItem key={value} value={value}>
                    {value}
                  </MenuItem>
                ))}
              </TextField>
              {/* </FormControl> */}
              <FormHelperText className="error" style={{ color: "#dc3545" }}>
                {errors.doseDurationUnit}
              </FormHelperText>
            </Grid>
          </Grid>

          <Box style={{ marginTop: 40 }}>
            <Button type="submit" className="form-control" variant="success">
              Submit and notify patient
            </Button>
          </Box>
        </form>
      </Grid>
    </Grid>
  );
}
export default DoctorPrescriptionPage;
