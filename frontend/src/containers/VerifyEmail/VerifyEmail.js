// This is the Success Message Page After Activate the Account
import { React, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSearchParam } from "react-use";
import { useDispatch } from "react-redux";
import { activateAccount } from "../../redux/actions/AuthAction";
import { makeStyles } from "@mui/styles";
import Grid from "@mui/material/Grid";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .error": {
      color: theme.palette.error.main,
    },
  },
}));

const VerifyEmail = ({ match }) => {

  const classes = useStyles();

  const userType = useSearchParam("user");

  const dispatch = useDispatch();

  const uid = useSearchParam("uid");

  const message1 = "Success";

  useEffect(() => {
    console.log('userType:', userType)
    console.log('uid:', uid)
    if (uid) {
      console.log('userType:', userType)
      dispatch(activateAccount(uid));
      return message1;
    }
  }, []);

  return (
    <Grid
      className={classes.root}
      container
      spacing={0}
      // alignItems="center"
      justifyContent="center"
      style={{ minHeight: "100vh" }}
    >
      <Grid item md={6} my={6}>
        <h4>
          Your Account has been activated at <i style={{ color: "orange" }}>Telemedic</i>.<br /><br /><br />
          <Link to={`/userlogin/${userType}`}>Click here to login</Link><br />
        </h4>
        <span style={{ color: "grey" }}>Thank You for using Telemedic. Keeping you well.</span>
      </Grid>
    </Grid>
  );
};
export default VerifyEmail;
