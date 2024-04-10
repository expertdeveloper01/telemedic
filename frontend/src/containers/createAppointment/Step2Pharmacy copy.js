import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import { Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import {
    FormControl,
    FormHelperText,
    InputLabel,
    MenuItem,
    Select,
    Typography,
} from "@mui/material";
import AppointmentSteps from "../../components/appointmentSteps";
import { Link } from "react-router-dom";
// import {
//     addPharmacyDetails,
//     getAddpharmacy,
// } from "../../redux/actions/AppointmentAction";
import {
    createAppointment,
    getIncompleteAppointments,
} from "../../redux/actions/AppointmentAction";


const Step2Pharmacy = ({ history }) => {
    /**
     * Set State
     */
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNo] = useState("");
    const [country, setCountry] = useState("US");
    const [state, setState] = useState("");
    const [city, setCity] = useState("");
    const [zipCode, setZipCode] = useState("");
    // const [pharmacyId, setPharmacyId] = useState("");
    // const [inputList, setInputList] = useState([
    //     {
    //         name: "",
    //         email: "",
    //         phoneNumber: "",
    //         country: "",
    //         state: "",
    //         city: "",
    //         zipCode: "",
    //     },
    // ]);
    const [errors, setErrors] = useState({
        name: null,
        email: null,
        phoneNumber: null,
        city: null,
        country: null,
        state: null,
        zipCode: null,
    });

    const dispatch = useDispatch();

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    useEffect(async () => {
        // If No userInfo Redirect To Login page
        if (!userInfo) {
            history.push("/");
            // } else {
            //     let data = await dispatch(getAddpharmacy());
            //     console.log("dataaaa", data["city"], data);
            //     // Get userInfo From Reducer
            //     setPharmacyId(data._id);
            //     setInputList([
            //         {
            //             city: data["city"],
            //             name: data["pharmacyName"],
            //             email: data["pharmacyEmail"],
            //             phoneNumber: data["pharmacyphoneNumber"],
            //             state: data["state"],
            //             zipCode: data["zipCode"],
            //         },
            //     ]);
            // setFirstName(data.firstName);
            // setLastName(data.lastName);
            // setEmail(data.email);
            // setPhoneNo(data.phoneNumber);
            // setGender(data.gender);
            // setRelation(data.relation);
            // setTimeZone(data.timeZone);
        }
    }, [dispatch, history, userInfo]);

    const submitHandler = async () => {
        // const status = await dispatch(
        //     addPharmacyDetails(
        //         inputList,

        //     )
        // );
        const status = await dispatch(
            createAppointment({
                step: 1,
                name,
                email,
                phoneNumber,
                city,
                country,
                state,
                zipCode
            })
        );
        // history.push("/add-attendant");
        if (status) {
            // setSubmittedDialogOpen(true);
        }
    };

    const validateSubmit = (e) => {
        e.preventDefault();
        const tempErrors = {
            // inputList: validations.pharmacyName(inputList.length()),
            // email: validations.pharmacyemail(email),
            // city: validations.city(city),
            // phoneNumber: validations.pharmacyphoneNumber(phoneNumber),
            // state: validations.state(state),
            // zipCode: validations.ZipCode(zipCode),
        };
        setErrors(tempErrors);
        if (Object.values(tempErrors).filter((value) => value).length) {
            console.log(
                "..values",
                Object.values(tempErrors).filter((value) => value)
            );
            return;
        }
        submitHandler();
    };

    const statechoice = [
        "AK - Alaska",
        "AL - Alabama",
        "AR - Arkansas",
        "AS - American Samoa",
        "AZ - Arizona",
        "CA - California",
        "CO - Colorado",
        "CT - Connecticut",
        "DC - District of Columbia",
        "DE - Delaware",
        "FL - Florida",
        "GA - Georgia",
        "GU - Guam",
        "HI - Hawaii",
        "IA - Iowa",
        "ID - Idaho",
        "IL - Illinois",
        "IN - Indiana",
        "KS - Kansas",
        "KY - Kentucky",
        "LA - Louisiana",
        "MA - Massachusetts",
        "MD - Maryland",
        "ME - Maine",
        "MI - Michigan",
        "MN - Minnesota",
        "MO - Missouri",
        "MS - Mississippi",
        "MT - Montana",
        "NC - North Carolina",
        "ND - North Dakota",
        "NE - Nebraska",
        "NH - New Hampshire",
        "NJ - New Jersey",
        "NM - New Mexico",
        "NV - Nevada",
        "NY - New York",
        "OH - Ohio",
        "OK - Oklahoma",
        "OR - Oregon",
        "PA - Pennsylvania",
        "PR - Puerto Rico",
        "RI - Rhode Island",
        "SC - South Carolina",
        "SD - South Dakota",
        "TN - Tennessee",
        "TX - Texas",
        "UT - Utah",
        "VA - Virginia",
        "VI - Virgin Islands",
        "VT - Vermont",
        "WA - Washington",
        "WI - Wisconsin",
        "WV - West Virginia",
        "WY - Wyoming",
    ];

    const RequiredLabel = ({ label }) => (
        <Typography>
            {label}
            <Typography style={{ color: "red", fontSize: "20px" }} component="span">
                {" "}
                *
            </Typography>
        </Typography>
    );

    // handle click event of the Add button
    // const handleAddClick = () => {
    //     setInputList([
    //         ...inputList,
    //         {
    //             name: "",
    //             email: "",
    //             phoneNumber: "",
    //             country: "",
    //             state: "",
    //             city: "",
    //             zipCode: "",
    //         },
    //     ]);
    // };

    // handle click event of the Remove button
    // const handleRemoveClick = (index) => {
    //     const list = [...inputList];
    //     list.splice(index, 1);
    //     setInputList(list);
    // };

    return (
        <>
            {/* {JSON.stringify(data)} */}
            {/* <AppointmentSteps step1 step2 /> */}
            <Grid container spacing={0} alignItems="center" justifyContent="center">
                <Grid item md={7}>
                    <form onSubmit={validateSubmit} autoComplete="off">
                        <h5 style={{ color: "orange" }}> PHARMACY DETAILS</h5>
                        {/* {inputList?.map((x, index) => ( */}
                        <div key={index}>
                            <Grid container spacing={4}>
                                <Grid item md={6}>
                                    <TextField
                                        error={!!errors.inputList}
                                        helperText={errors.inputList}
                                        label={<RequiredLabel label="Pharmacy Name" />}
                                        // label="Pharmacy Name"
                                        variant="standard"
                                        // value={element.name || ""}
                                        // value={x.name}
                                        value={x.name}
                                        onChange={(e) => {
                                            // setErrors({ ...errors, name: null });
                                            // setName(e.target.value, index);
                                            inputList[index].name = e.target.value;
                                            setInputList([...inputList]);
                                        }}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item md={6}>
                                    <TextField
                                        error={!!errors.email}
                                        helperText={errors.email}
                                        label={<RequiredLabel label="Pharmacy Email" />}
                                        // label="Pharmacy Email"
                                        type="text"
                                        variant="standard"
                                        value={x.email}
                                        onChange={(e) => {
                                            // setErrors({ ...errors, name: null });
                                            // setName(e.target.value, index);
                                            inputList[index].email = e.target.value;
                                            setInputList([...inputList]);
                                        }}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item md={6}>
                                    <TextField
                                        error={!!errors.phoneNumber}
                                        helperText={errors.phoneNumber}
                                        label={<RequiredLabel label="Pharmacy phoneNumber" />}
                                        // label="Pharmacy phoneNumber"
                                        type="text"
                                        variant="standard"
                                        value={x.phoneNumber}
                                        onChange={(e) => {
                                            // setErrors({ ...errors, name: null });
                                            // setName(e.target.value, index);
                                            inputList[index].phoneNumber = e.target.value;
                                            setInputList([...inputList]);
                                        }}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item md={6}>
                                    <TextField
                                        label="Country"
                                        variant="standard"
                                        value={country}
                                        disabled
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item md={6}>
                                    <TextField
                                        select
                                        fullWidth
                                        label={<RequiredLabel label="State" />}
                                        labelId="demo-simple-select-label"
                                        id="state"
                                        error={!!errors.state}
                                        value={x.state}
                                        onChange={(e) => {
                                            // setErrors({ ...errors, name: null });
                                            // setName(e.target.value, index);
                                            inputList[index].state = e.target.value;
                                            setInputList([...inputList]);
                                        }}
                                        variant="standard"
                                    >
                                        {statechoice.map((value, key) => (
                                            <MenuItem key={value} value={value}>
                                                {value}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                    <FormHelperText className="error" style={{ color: "red" }}>
                                        {errors.state}
                                    </FormHelperText>
                                </Grid>
                                <Grid item md={6}>
                                    <TextField
                                        error={!!errors.city}
                                        helperText={errors.city}
                                        label={<RequiredLabel label="City" />}
                                        variant="standard"
                                        value={x.city}
                                        onChange={(e) => {
                                            // setErrors({ ...errors, name: null });
                                            // setName(e.target.value, index);
                                            inputList[index].city = e.target.value;
                                            setInputList([...inputList]);
                                        }}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item md={6}>
                                    <TextField
                                        error={!!errors.zipCode}
                                        helperText={errors.zipCode}
                                        label={<RequiredLabel label="Zip Code" />}
                                        variant="standard"
                                        value={x.zipCode}
                                        onChange={(e) => {
                                            // setErrors({ ...errors, name: null });
                                            // setName(e.target.value, index);
                                            inputList[index].zipCode = e.target.value;
                                            setInputList([...inputList]);
                                        }}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item md={6}>
                                    {inputList.length !== 1 && (
                                        <Button
                                            variant="danger"
                                            className="mr10"
                                            style={{ marginLeft: "420px" }}
                                            onClick={() => handleRemoveClick(index)}
                                        >
                                            Delete
                                        </Button>
                                    )}
                                </Grid>
                            </Grid>
                        </div>
                        ))}
                        {/* <Link to="/add-attendant"> */}
                        <Box style={{ marginTop: 40 }}>
                            <Button type="submit" className="form-control" variant="success">
                                NEXT
                            </Button>
                        </Box>
                        {/* </Link> */}
                        {/* <Grid
                            md={12}
                            style={{
                                color: "blue",
                                cursor: "pointer",
                            }}
                        >
                            {inputList?.length <= 1 && (
                                <Button
                                    style={{ marginTop: "5px" }}
                                    display="flex "
                                    justifyContent="flex-end"
                                    onClick={handleAddClick}
                                >
                                    ADD ONE (PHARMACY)
                                </Button>
                            )}
                        </Grid> */}
                    </form>
                </Grid>
            </Grid>
        </>
    );
};
export default Step2Pharmacy;

























