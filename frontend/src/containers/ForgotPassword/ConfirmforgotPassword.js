/**
 * Confirm Reset password page
 */

import React, { useState } from "react";
import { useSelector } from "react-redux";
import { reset_password_confirm } from "../../redux/actions/AuthAction";
import { useDispatch } from "react-redux";
import { useSearchParam } from "react-use";
import { Grid } from "@mui/material";
import { TextField } from "@mui/material";
import { Box } from "@mui/system";
import { Button } from "react-bootstrap";
import { validations } from "../../util";
import { Dialog } from "@mui/material";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";

const ResetPasswordConfirm = ({ history }) => {
  const dispatch = useDispatch();

  const uid = useSearchParam("uid");
  const userType = useSearchParam("user");

  const [submittedDialogMessage, setSubmittedDialogMessage] = useState(null);

  const resetconfirm = useSelector((state) => state.userLogin);
  const { message, error } = resetconfirm;
  const [errors, setErrors] = useState({
    confirmPassword: null,
    message: null,
  });

  const [formData, setFormData] = useState({
    new_password: "",
    re_new_password: "",
  });
  const { new_password, re_new_password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async () => {

    const message = await dispatch(
      reset_password_confirm(uid, new_password, re_new_password)
    );
    if (message) {
      setSubmittedDialogMessage(true);
    }
  };

  const validateSubmit = (e) => {
    e.preventDefault();

    const tempErrors = {
      password: validations.password(formData.new_password),
      confirmPassword: validations.confirmPassword(
        formData.new_password,
        formData.re_new_password
      ),
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
    <Grid container spacing={0} alignItems="center" justifyContent="center">
      <Grid item md={4}>
        <form onSubmit={validateSubmit} autoComplete="off">
          <h5 style={{ color: "orange" }}>SET YOUR NEW PASSWORD</h5>
          {message && <div>{message}</div>}
          {error && <div style={{ color: "red" }}>{error}</div>}
          <Grid container spacing={1}>
            <Dialog
              open={!!submittedDialogMessage}
              onClose={() => {
                setSubmittedDialogMessage(null);
                history.push(`/userlogin/${userType}`);
              }}
            >
              <DialogTitle>
                Your password has been updated successfully.
              </DialogTitle>
              <DialogActions>
                <Button
                  onClick={() => {
                    setSubmittedDialogMessage(null);
                    history.push(`/userlogin/${userType}`);
                  }}
                >
                  Go to login
                </Button>
              </DialogActions>
            </Dialog>
            <Grid item md={12}>
              <TextField
                label="New Password"
                error={!!errors.password}
                helperText={errors.password}
                variant="standard"
                value={new_password}
                name="new_password"
                type="password"
                onChange={(e) => {
                  setErrors({ ...errors, password: null });
                  onChange(e);
                }}
                fullWidth
              />
            </Grid>
            <Grid item md={12}>
              <TextField
                label="Confirm Password"
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                variant="standard"
                value={re_new_password}
                name="re_new_password"
                type="password"
                onChange={(e) => {
                  setErrors({ ...errors, confirmPassword: null });
                  onChange(e);
                }}
                fullWidth
              />
            </Grid>
            <Grid item md={12}>
              <Box display="flex" justifyContent="flex-end">
                <Button type="submit" variant="success">
                  SUBMIT
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Grid>
    </Grid>
  );
};
export default ResetPasswordConfirm;
