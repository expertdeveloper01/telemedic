import React from "react";
import { Grid, CardContent, Typography, Button } from "@mui/material";
import { Card } from "@mui/material";
const revenue = () => {
  return (
    <Grid container spacing={0} alignItems="center" justifyContent="center">
      <Grid item md={2}>
        <Card sx={{ minWidth: 300 }}>
          <CardContent>
            <Typography variant="h5" component="div">
              <center>
                {" "}
                <h4 style={{ color: "#1974D2" }}> MY EARNINGS</h4>
              </center>
            </Typography>
            <hr />

            <Typography sx={{ mb: 2.5 }} color="text.secondary">
              <div className="row">
                <div className="col-md-3" style={{ color: "orange" }}>
                  Patient:
                </div>
                <div className="col-md-9" style={{ color: "black" }}>
                  Abrahim Wani | 25 | Male
                </div>
              </div>
              <br />

              <div className="row">
                <div className="col-md-6">Date</div>
                <div className="col-md-6" style={{ color: "#1974D2" }}>
                  27-08-2022
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">Time</div>
                <div className="col-md-6" style={{ color: "#1974D2" }}>
                  {" "}
                  04:00 PM
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">Call</div>
                <div className="col-md-6" style={{ color: "#1974D2" }}>
                  {" "}
                  Video Call
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">Initial Consult</div>
                <div className="col-md-6" style={{ color: "#1974D2" }}>
                  {" "}
                  ₹ 500
                </div>
              </div>
              <div className="row">
                <div className="col-md-4">Trx ID </div>
                <div className="col-md-6" style={{ color: "#1974D2" }}>
                  {" "}
                  pay_FB29kdHGzrjda0{" "}
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <a href="" style={{ color: "orange", marginLeft: "230px" }}>
                    copy
                  </a>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <Button
                    style={{ color: "red", marginLeft: "180px" }}
                    variant="outlined"
                    color="error"
                  >
                    Refund
                  </Button>
                </div>
              </div>
              <div className="row">
                <div className="col-md-5" style={{ color: "orange" }}>
                  Net Earnings:
                </div>
                <div className="col-md-4" style={{ color: "black" }}>
                  ₹500
                </div>
              </div>
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default revenue;
