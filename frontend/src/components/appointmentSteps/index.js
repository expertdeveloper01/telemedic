import React from "react";
import { Button } from '@mui/material'
import { Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
const activeSteps = {
  color: "black",
  padding: "2px",
  marginLeft: "22px",
  textDecoration: "none",
};
const disableSteps = {
  color: "grey",
  padding: "2px",
  marginLeft: "22px",
  textDecoration: "none",
};

// Appointment Steps
function AppointmentSteps({ step, setStep }) {

  // const userLogin = useSelector((state) => state.userLogin);
  // const { userInfo } = userLogin;

  // const { userType } = userInfo;

  return (
    <Nav className="justify-content-center mb-4">
      <Nav.Item>
        {step >= 1 ? (
          <Button onClick={() => setStep(1)} style={activeSteps}>
            Book Appointment
          </Button>
        ) : (
          <Button onClick={() => setStep(1)} style={disableSteps}>
            Book Appointment
          </Button>
        )}
      </Nav.Item>
      <Nav.Item>
        {step >= 2 ? (
          <Button
            onClick={() => setStep(2)}
            style={activeSteps}>
            Add pharmacy
          </Button>
        ) : (
          <Button onClick={() => setStep(2)} disabled style={disableSteps}>
            Add pharmacy
          </Button>
        )}
      </Nav.Item>
      <Nav.Item>
        {step >= 3 ? (
          <Button
            onClick={() => setStep(3)}
            style={activeSteps}>
            Add Attendant (Optional)
          </Button>
        ) : (
          <Button onClick={() => setStep(3)} disabled style={disableSteps}>
            Add Attendant (Optional)
          </Button>
        )}
      </Nav.Item>
      <Nav.Item>
        {step >= 4 ? (
          <Button
            onClick={() => setStep(4)}
            style={activeSteps}>
            Appointment Details
          </Button>
        ) : (
          <Button onClick={() => setStep(4)} disabled style={disableSteps}>
            Appointment Details
          </Button>
        )}
      </Nav.Item>
      <Nav.Item>
        {step === 5 ? (
          <Button
            onClick={() => setStep(5)}
            style={activeSteps}>
            Payment Method
          </Button>
        ) : (
          <Button onClick={() => setStep(5)} disabled style={disableSteps}>
            Payment Method
          </Button>
        )}
      </Nav.Item>
    </Nav>
  );
}
export default AppointmentSteps;