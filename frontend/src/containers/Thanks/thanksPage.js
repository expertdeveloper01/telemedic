import React from "react";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Grid } from "@mui/material";

const thanksPage = () => {
  return (
    <Grid container spacing={0} alignItems="center" justifyContent="center">
      <Grid item md={2}>
        <Card>
          <CardContent>
            <Typography variant="body2">
              Thank you for activating your Account!
              <br />
              Please complete your Profile to Continue.
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small" href="/profile">
              Continue
            </Button>
          </CardActions>
        </Card>
      </Grid>
    </Grid>
  );
};

export default thanksPage;
