import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Container, Link } from "@mui/material";
import Toolbar from "@mui/material/Toolbar";
import { useHistory } from "react-router-dom";
import { NavDropdown } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/actions/AuthAction";

const drawerWidth = 240;

function Header() {
  // Used For Action Calling
  const dispatch = useDispatch();

  // Get UserInfo From Reducer
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const history = useHistory();

  const [anchorElNav, setAnchorElNav] = React.useState(null);

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  // Action For Logout
  const logoutHandler = () => {
    dispatch(logout());
  };

  const MenuItem = ({ children, path, onClick }) => {
    return (
      <Box sx={{ display: "flex" }}>
        <Button
          onClick={() => {
            handleCloseNavMenu();

            if (path) {
              history.push(path);
            }
            if (onClick) {
              onClick();
            }
          }}
          sx={{ my: 2, color: "white", display: "block" }}
        >
          {children}
        </Button>
      </Box>
    );
  };
  return (

      <AppBar position="static" style={{ backgroundColor: "grey" }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <a href="/" className="navbar-brand">
              <img src="/static/images/free12.png" width="30%" alt="" />
            </a>


                <Link to="/patappointmentlist" style={{ textDecoration: "none" }}>
                  <MenuItem path="/patappointmentlist">Appointment List </MenuItem>
                </Link>
                <Link to="/book-appointment" style={{ textDecoration: "none" }}>
                  <MenuItem path="/book-appointment">Book An Appointment </MenuItem>
                </Link>


                <Link to="/docappointmentlist" style={{ textDecoration: "none" }}>
                  <MenuItem path="/docappointmentlist">Appointment List </MenuItem>
                </Link>
                <Link to="/revenue" style={{ textDecoration: "none" }}>
                  <MenuItem path="/revenue">Earnings </MenuItem>
                </Link>


             <Link
              to="/doctorPrescription/:appointmentId"
              style={{ textDecoration: "none" }}
            >
              <MenuItem path="/doctorPrescription/:appointmentId">
                Prescription
              </MenuItem>
            </Link>

              <MenuItem path="/cancel/:appointmentId">
                Cancel Appointment
              </MenuItem>


                <MenuItem>
                  <NavDropdown
                    title={<span className="text-white">account</span>}
                  >
                    <NavDropdown.Item href="/update-profile">
                      PROFILE
                    </NavDropdown.Item>
                    <NavDropdown.Item href="/change-password">
                      CHANGE PASSWORD
                    </NavDropdown.Item>
                    <NavDropdown.Item onClick={logoutHandler}>
                      LOGOUT
                    </NavDropdown.Item>
                  </NavDropdown>
                </MenuItem>
          </Toolbar>
        </Container>
      </AppBar>

  );
}

export default Header;
