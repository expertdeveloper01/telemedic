import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Container, Link } from "@mui/material";
import Toolbar from "@mui/material/Toolbar";
import { useHistory } from "react-router-dom";
import { NavDropdown } from "react-bootstrap";
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import {
  //   useSelector,
  useDispatch,
} from "react-redux";
import { logout } from "../../redux/actions/AuthAction";

const drawerWidth = 240;

function Header() {
  // Used For Action Calling
  const dispatch = useDispatch();

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
    <>
      <AppBar position="static" style={{ backgroundColor: "grey" }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Link to="/" className="navbar-brand">
              <img src="/static/images/free12.png" width="30%" alt="" />
            </Link>

            <Link to="/" style={{ textDecoration: "none" }}>
              <MenuItem path="/">Home</MenuItem>
            </Link>
            <Link to="/about" style={{ textDecoration: "none" }}>
              <MenuItem path="/about">About </MenuItem>
            </Link>
            <Link to="/appointment-list" style={{ textDecoration: "none" }}>
              <MenuItem path="/appointment-list">Appointment </MenuItem>
            </Link>
            <Link
              to="/doctorPrescription/:appointmentId"
              style={{ textDecoration: "none" }}
            >
              <MenuItem path="/doctorPrescription/:appointmentId">
                Prescription
              </MenuItem>
            </Link>
            <Link to="/cancel/:appointmentId" style={{ textDecoration: "none" }}>
              <MenuItem path="/cancel/:appointmentId">
                Cancel Appointment
              </MenuItem>
            </Link>
            <MenuItem>
              <NavDropdown title={<span className="text-white">account</span>}>
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
            <MenuItem>
              {/* <Link to="/userlogin" style={{ textDecoration: "none" }}>
              <MenuItem>
                Login
              </MenuItem>
            </Link> */}
              <NavDropdown title={<span className="text-white">login</span>}>
                <NavDropdown.Item href="/userlogin">
                  patient
                  {/* <Link to="/register/patient" style={{ textDecoration: "none" }}>
                  <MenuItem path="/register/patient">patient
                  </MenuItem>
                </Link> */}
                </NavDropdown.Item>
                <NavDropdown.Item href="/userlogin">Doctor</NavDropdown.Item>
              </NavDropdown>
            </MenuItem>
            <MenuItem>
              <NavDropdown title={<span className="text-white">register</span>}>
                <NavDropdown.Item href="/register/patient">
                  patient
                </NavDropdown.Item>
                <NavDropdown.Item href="/register/doctor">
                  Doctor
                </NavDropdown.Item>
              </NavDropdown>
            </MenuItem>
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
}

export default Header;
