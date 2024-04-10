/**
 * This is the login Page
 */

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import TextField from "@mui/material/TextField";
import { Grid } from "@mui/material";
import { Box } from "@mui/system";
import {
  activateAccount,
  login,
  resendAccount,
} from "../../redux/actions/AuthAction";
import { validations } from "../../util";
import Loader from "../../components/Loader/loader";

import { useSearchParam } from "react-use";

function LoginScreen({ location, history, match }) {
  const userType = match.params.user;

  // constant initialization for email and password
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({
    email: null,
    password: null,
  });

  // dispatch used for action calling
  const dispatch = useDispatch();

  // get error and loading info from state
  const userLogin = useSelector((state) => state.userLogin);
  const { error, loading } = userLogin;

  // submit button handler
  const submitHandler = () => {
    dispatch(login(email, password, userType));
  };

  const uid = useSearchParam("uid");
  const message1 = "Success";

  useEffect(() => {
    if (uid) {
      dispatch(activateAccount(uid));
      return message1;
    }
  }, []);

  const handleResend = () => {
    dispatch(resendAccount(email));
  };

  const validateSubmit = (e) => {
    e.preventDefault();

    const tempErrors = {
      email: validations.email(email),

      password: !password ? "Password is required" : null,
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
  return (
    <Grid container spacing={0} alignItems="center" justifyContent="center">
      <Grid item md={4} my={6}>
        <h5 style={{ color: "orange" }}>LOG IN</h5>

        {/* Loading */}
        {loading && <Loader />}
        {/* Error */}
        {error && (
          <>
            <div>
              <h6 style={{ color: "red" }}>
                {error.message ? error.message : error}
              </h6>
              {error.status === "Activation Pending" && (
                <button onClick={handleResend}>
                  click here to resend your activation link
                </button>
              )}
            </div>
          </>
        )}
        <form onSubmit={validateSubmit} autoComplete="off">
          <Grid container spacing={1}>
            <Grid item md={12}>
              <TextField
                label="Email"
                error={!!errors.email}
                helperText={errors.email}
                variant="standard"
                value={email}
                type="email"
                onChange={(e) => {
                  setErrors({ ...errors, email: null });
                  setEmail(e.target.value);
                }}
                fullWidth
              />
            </Grid>

            <Grid item md={12}>
              <TextField
                label="Password"
                error={!!errors.password}
                helperText={errors.password}
                variant="standard"
                type="password"
                onChange={(e) => {
                  setErrors({ ...errors, password: null });
                  setPassword(e.target.value);
                }}
                fullWidth
              />
            </Grid>
            <Grid item md={12}>
              <Box display="flex" justifyContent="flex-end">
                <Link to="/forgotpassword" style={{ color: "orange" }}>
                  Forgot Password
                </Link>
              </Box>
            </Grid>
          </Grid>

          <Box style={{ marginTop: 40 }}>
            <Button type="submit" className="form-control" variant="success">
              LOG IN
            </Button>
          </Box>
          {/* <Box style={{ marginTop: 40 }} justifyContent="flex-center">
            New user? <Link to="/user/registration">Register here</Link>
          </Box> */}
        </form>
      </Grid>
    </Grid>
  );
}

export default LoginScreen;
