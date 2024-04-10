import React from "react";
// import AppBar from "@mui/material/AppBar";
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import MuiAppBar from '@mui/material/AppBar';
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
import { styled, useTheme } from '@mui/material/styles';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import CancelIcon from '@mui/icons-material/Cancel';
import ListAltIcon from '@mui/icons-material/ListAlt';
import AppBar from '@mui/material/AppBar';
import {
    //   useSelector,
    useDispatch,
} from "react-redux";
import { logout } from "../../redux/actions/AuthAction";

const drawerWidth = 240;

function Header(props) {
    const { window } = props;
    const [mobileOpen, setMobileOpen] = React.useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const drawer = (
        <div><List style={{ marginTop: '100px' }}>
            <ListItem button key="Home">
                <a href="/" style={{ textDecoration: 'none' }}>
                    <ListItemIcon>
                        <HomeIcon />
                        <ListItemText primary="HOME" style={{ paddingLeft: '20px' }} />
                    </ListItemIcon>
                </a>
            </ListItem>
            <Divider />

            {/* <ListItem button key="Appointment List" style={{ display: "none" }}> */}
            <ListItem button key="Appointment List">
                <a href="/appointment-list" style={{ textDecoration: 'none' }}>
                    <ListItemIcon>
                        <ListAltIcon />
                        <ListItemText primary="Appointment List" style={{ paddingLeft: '20px' }} />
                    </ListItemIcon>
                </a>
            </ListItem>

            <ListItem button key="Prescription">
                <a href="/doctorPrescription/:appointmentId" style={{ textDecoration: 'none' }}>
                    <ListItemIcon>
                        <MedicalServicesIcon />
                        <ListItemText primary="Prescription" style={{ paddingLeft: '20px' }} />
                    </ListItemIcon>
                </a>
            </ListItem>

            <ListItem button key="Cancel Appointment">
                <a href="/cancel/:appointmentId" style={{ textDecoration: 'none' }}>
                    <ListItemIcon>
                        <CancelIcon />
                        <ListItemText primary="Cancel Appointment" style={{ paddingLeft: '20px' }} />
                    </ListItemIcon>
                </a>
            </ListItem>

            <ListItem button key="Profile">
                <a href="/update-profile" style={{ textDecoration: 'none' }}>
                    <ListItemIcon>
                        <PersonIcon />
                        <ListItemText primary="Profile" style={{ paddingLeft: '20px' }} />
                    </ListItemIcon>
                </a>
            </ListItem>
        </List>
            <Divider />
        </div>
    )

    const container = window !== undefined ? () => window().document.body : undefined;

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

    const theme = useTheme();
    const [open, setOpen] = React.useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
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
            {/* <AppBar position="relative" style={{ backgroundColor: "grey", zIndex: 4 }} open={open}> */}
            <AppBar position="relative" style={{ backgroundColor: "grey", zIndex: 4 }}
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                }}>
                <Container maxWidth="xl">
                    {/* <Toolbar disableGutters> */}
                    {/* <Toolbar disableGutters> */}
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{ mr: 2, display: { sm: 'none' } }}
                        >
                            <MenuIcon />
                        </IconButton>
                        {/* <Typography variant="h6" noWrap component="div">
              Responsive drawer
            </Typography> */}
                        {/* </Toolbar> */}

                        <Link to="/" className="navbar-brand">
                            <img src="/static/images/free12.png" width="30%" alt="" />
                        </Link>

                        <Link to="/" style={{ textDecoration: "none" }}>
                            <MenuItem path="/">Home</MenuItem>
                        </Link>
                        <Link to="/about" style={{ textDecoration: "none" }}>
                            <MenuItem path="/about">About </MenuItem>
                        </Link>
                        {/* <Link to="/appointment-list" style={{ textDecoration: "none" }}>
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
            </Link> */}
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
                            <NavDropdown title={<span className="text-white">login</span>}>
                                <NavDropdown.Item href="/userlogin">
                                    patient
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
            <Drawer
                container={container}
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                    keepMounted: true, // Better open performance on mobile.
                }}
                sx={{
                    display: { xs: 'block', sm: 'none' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                }}
            >
                {drawer}
            </Drawer>
            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: 'none', sm: 'block' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                }}
                open
            >
                {drawer}
            </Drawer>
            {/* <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        // variant="persistent"
        variant="temporary"
        anchor="left"
        open={open}
        style={{ position: 'relative', zIndex: 3 }}
      >
        {/* <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader> */}
            {/* <Divider />
        <List style={{ marginTop: '100px' }}>
          <ListItem button key="Home">
            <a href="/" style={{ textDecoration: 'none' }}>
              <ListItemIcon>
                <HomeIcon />
                <ListItemText primary="HOME" style={{ paddingLeft: '20px' }} />
              </ListItemIcon>
            </a>
          </ListItem>
          <Divider />

          {/* <ListItem button key="Appointment List" style={{ display: "none" }}>
          <ListItem button key="Appointment List">
            <a href="/appointment-list" style={{ textDecoration: 'none' }}>
              <ListItemIcon>
                <ListAltIcon />
                <ListItemText primary="Appointment List" style={{ paddingLeft: '20px' }} />
              </ListItemIcon>
            </a>
          </ListItem>

          <ListItem button key="Prescription">
            <a href="/doctorPrescription/:appointmentId" style={{ textDecoration: 'none' }}>
              <ListItemIcon>
                <MedicalServicesIcon />
                <ListItemText primary="Prescription" style={{ paddingLeft: '20px' }} />
              </ListItemIcon>
            </a>
          </ListItem>

          <ListItem button key="Cancel Appointment">
            <a href="/cancel/:appointmentId" style={{ textDecoration: 'none' }}>
              <ListItemIcon>
                <CancelIcon />
                <ListItemText primary="Cancel Appointment" style={{ paddingLeft: '20px' }} />
              </ListItemIcon>
            </a>
          </ListItem>

          <ListItem button key="Profile">
            <a href="/update-profile" style={{ textDecoration: 'none' }}>
              <ListItemIcon>
                <PersonIcon />
                <ListItemText primary="Profile" style={{ paddingLeft: '20px' }} />
              </ListItemIcon>
            </a>
          </ListItem>
        </List>
        <Divider />
      </Drawer> */}
        </>
    );
}

export default Header;
