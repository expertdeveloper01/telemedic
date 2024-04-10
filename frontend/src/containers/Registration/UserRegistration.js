/**
 * User Registration Page
 */

import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "react-bootstrap";
import { register, resetMessages } from "../../redux/actions/AuthAction";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { DialogActions } from "@mui/material";
import { useSearchParam } from "react-use";
import Grid from "@mui/material/Grid";
import queryString from "querystring";
import { Dialog } from "@mui/material";
import DialogTitle from "@mui/material/DialogTitle";
import Loader from "../../components/Loader/loader";
import { validations } from "../../util";
import { makeStyles } from "@mui/styles";
import { Typography } from "@mui/material";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .error": {
      color: theme.palette.error.main,
    },
  },
}));

// Required field star mark
const RequiredLabel = ({ label }) => (
  <Typography>
    {label}
    <Typography style={{ color: "red", fontSize: "20px" }} component="span">
      {" "}
      *
    </Typography>
  </Typography>
);

function UserRegistration({ history, match }) {
  const classes = useStyles();
  // const userType = window.location;
  const userType = match.params.user;

  // Set the state
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone_number, setPhoneNo] = useState();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState({
    first_name: null,
    last_name: null,
    email: null,
    phone_number: null,
    password: null,
    confirmPassword: null,
    // message: null,
  });

  const dispatch = useDispatch();

  const userRegister = useSelector((state) => state.userLogin);
  const { error, loading, message } = userRegister;

  useEffect(() => {
    console.log("userType", userType);
  }, [history]);

  // errors Validations all fields
  const validateSubmit = (e) => {
    e.preventDefault();

    const tempErrors = {
      first_name: validations.firstName(first_name),
      last_name: validations.lastName(last_name),
      email: validations.email(email),
      phone_number: validations.phoneNumber(phone_number),
      password: validations.password(password),
      confirmPassword: validations.confirmPassword(password, confirmPassword),
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
    if (password !== confirmPassword) {
    } else {
      // Get User Details
      const success = await dispatch(
        register({
          firstName: first_name,
          lastName: last_name,
          email,
          phoneNumber: phone_number,
          password,
          userType,
        })
      );
      if (success) clearFields();
    }
  };

  /***
  * ClearField
  *
  */
  const clearFields = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhoneNo("");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <Grid
      className={classes.root}
      container
      spacing={0}
      // alignItems="center"
      justifyContent="center"
      style={{ minHeight: "100vh" }}
    >
      <Grid item md={7} my={6}>
        {loading ? (
          <Loader />
        ) : (
          <>
            <h5 style={{ color: "orange" }}>REGISTER</h5>
            <div>
              <Dialog
                open={message || error}
                onClose={() => dispatch(resetMessages())}
              >
                <DialogTitle>
                  {message && <p>{message}</p>}
                  {error && <p>{error}</p>}
                </DialogTitle>
                <DialogActions>
                  <Button
                    onClick={() => {
                      dispatch(resetMessages());
                      if (!error) {
                        history.push("/");
                      }
                    }}
                  >
                    ok
                  </Button>
                </DialogActions>
              </Dialog>
            </div>
            <form onSubmit={validateSubmit} autoComplete="off">
              <Grid container spacing={4}>
                <Grid item md={6}>
                  <TextField
                    label={<RequiredLabel label="First Name" />}
                    error={!!errors.first_name}
                    helperText={errors.first_name}
                    variant="standard"
                    value={first_name}
                    onChange={(e) => {
                      setErrors({ ...errors, first_name: null });
                      setFirstName(e.target.value.replace(/[^a-z+, ^A-Z+]/g, ""));
                    }}
                    fullWidth
                  />
                </Grid>

                <Grid item md={6}>
                  <TextField
                    label={<RequiredLabel label="Last Name" />}
                    error={!!errors.last_name}
                    helperText={errors.last_name}
                    variant="standard"
                    value={last_name}
                    onChange={(e) => {
                      setErrors({ ...errors, last_name: null });
                      setLastName(e.target.value.replace(/[^a-z+, ^A-Z+]/g, ""));
                    }}
                    fullWidth
                  />
                </Grid>

                <Grid item md={6}>
                  <TextField
                    label={<RequiredLabel label="Email" />}
                    error={!!errors.email}
                    helperText={errors.email}
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
                    label={<RequiredLabel label="Phone Number" />}
                    error={!!errors.phone_number}
                    helperText={errors.phone_number}
                    type="text"
                    variant="standard"
                    value={phone_number}
                    onChange={(e) => {
                      setErrors({ ...errors, phone_number: null });
                      setPhoneNo(e.target.value.replace(/[^0-9+]/g, ""));
                    }}
                    fullWidth
                  />
                </Grid>

                <Grid item md={6}>
                  <TextField
                    label={<RequiredLabel label="Password" />}
                    error={!!errors.password}
                    helperText={errors.password}
                    type="password"
                    variant="standard"
                    value={password}
                    onChange={(e) => {
                      setErrors({ ...errors, password: null });
                      setPassword(e.target.value);
                    }}
                    fullWidth
                  />
                </Grid>

                <Grid item md={6}>
                  <TextField
                    label={<RequiredLabel label="Confirm password" />}
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword}
                    type="password"
                    variant="standard"
                    value={confirmPassword}
                    onChange={(e) => {
                      setErrors({ ...errors, confirmPassword: null });
                      setConfirmPassword(e.target.value);
                    }}
                    fullWidth
                  />
                </Grid>
              </Grid>

              <Box style={{ marginTop: 40 }}>
                <Button
                  type="submit"
                  className="form-control"
                  variant="success"
                >
                  Register
                </Button>
              </Box>
            </form>
          </>
        )}
      </Grid>
    </Grid>
  );
}
export default UserRegistration;
