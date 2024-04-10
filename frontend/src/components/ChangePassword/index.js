import React, { useState } from "react";
import { Grid, TextField, Box, Button } from "@mui/material";
import { Form } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { updateUserProfile } from "../../redux/actions/AuthAction";
import { validations } from "../../util";
import { Dialog } from "@mui/material";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";


const ChangePassword = ({ history }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submittedDialogOpen, setSubmittedDialogOpen] = useState(false);
  const [errors, setErrors] = useState({
    confirmPassword: null,
    message: null,
  });
  const dispatch = useDispatch();
  const submitHandler = async () => {
    const status = await dispatch(
      updateUserProfile({
        password: password,
      })
    );
    if (status) {
      setSubmittedDialogOpen(true);
    }
  };
  const validateSubmit = (e) => {
    e.preventDefault();
    const tempErrors = {
      password: validations.password(password),
      confirmPassword: validations.confirmPassword(password, confirmPassword),
    };
    setErrors(tempErrors);
    if (Object.values(errors).filter((value) => value).length) {
      console.log(
        "..values",
        Object.values(errors).filter((value) => value)
      );
      return;
    }
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
    <div>
      <Box maxWidth="740px" className="container">
        <Form onSubmit={validateSubmit}>
          <h5 style={{ color: "orange" }}>CHANGE YOUR PASSWORD</h5>
          <Grid item md={6}>
            <Dialog
              open={submittedDialogOpen}
              onClose={() => history.push("/")}
            >
              <DialogTitle>
                Your profile has been updated successfully.
              </DialogTitle>
              <DialogActions>
                <Button onClick={() => history.push("/")}>
                  Go to your home page
                </Button>
              </DialogActions>
            </Dialog>
            <TextField
              error={!!errors.password}
              helperText={errors.password}
              label="Password"
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
          <br />
          <Grid item md={6}>
            <TextField
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              label="Confirm Password"
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
          <br />
          <Grid md={6}>
            <Box display="flex " justifyContent="flex-end">
              <Button
                type="submit"
                variant="outlined"
                style={{ color: "green" }}
              >
                SUBMIT
              </Button>
            </Box>
          </Grid>
        </Form>
      </Box>
    </div>
  );
};
export default ChangePassword;