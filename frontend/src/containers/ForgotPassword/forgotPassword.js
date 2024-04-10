/**
 * Reset Password page By the Email Id
 */

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { reset_password } from "../../redux/actions/AuthAction";
import { Grid } from "@mui/material";
import { TextField } from "@mui/material";
import { Box } from "@mui/system";
import { validations } from "../../util";
import Loader from "../../components/Loader/loader";
import { Button } from "react-bootstrap";

const Forgotpassword = () => {
  const dispatch = useDispatch();

  const reset = useSelector((state) => state.userLogin);
  const { message, error, loading } = reset;

  useEffect(() => { }, []);

  const [formData, setFormData] = useState({
    email: "",
  });
  const [errors, setErrors] = useState({
    email: null,
    message: null,
  });

  console.log("gg")

  const { email } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = () => {
    dispatch(reset_password(email));
  };

  const validateSubmit = (e) => {
    e.preventDefault();

    const tempErrors = {
      email: validations.email(email),
    };

    setErrors(tempErrors);

    if (Object.values(tempErrors).filter((value) => value).length) {
      console.log(
        "..values",
        Object.values(tempErrors).filter((value) => value)
      );
      return;
    }

    onSubmit();
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <Grid container spacing={0} alignItems="center" justifyContent="center">
          <Grid item md={4}>
            <form onSubmit={(e) => validateSubmit(e)} autoComplete="off">
              <h5 style={{ color: "orange" }}>REQUEST PASSWORD RESET</h5>
              <div>
                {message && <div style={{ color: "green" }}>{message}</div>}
                {error && (
                  <div style={{ color: "red" }}>Email address not found</div>
                )}
              </div>

              <Grid container spacing={1}>
                <Grid item md={12}>
                  <TextField
                    label="Email"
                    error={!!errors.email}
                    helperText={errors.email}
                    variant="standard"
                    value={email}
                    type="email"
                    name="email"
                    onChange={(e) => {
                      setErrors({ ...errors, email: null });
                      onChange(e);
                    }}
                    fullWidth
                  />
                </Grid>
                <Grid item md={12}>
                  <Box display="flex" justifyContent="flex-end">
                    <Button
                      type="submit"
                      className="form-control"
                      variant="success"
                    >
                      SEND
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </form>
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default Forgotpassword;
