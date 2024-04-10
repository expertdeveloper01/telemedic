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
import {
    createAppointment,
    getIncompleteAppointments,
} from "../../redux/actions/AppointmentAction";
import {
    deletePharmacy
} from '../../redux/actions/PharmacyAction'
import { validations } from "../../util";
import { statechoice } from "../../constants/otherConstants";
import swal from "sweetalert";


const Step2Pharmacy = ({ history, setStep }) => {

    const dispatch = useDispatch();

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const appointmentInfo = useSelector((state) => state.incompleteappointmentsReducer);
    const { incompleteAppointments } = appointmentInfo;

    const getPharmacy = useSelector((state) => state.pharmacyReducer);
    const { pharmacyDetails } = getPharmacy;

    /**
     * Set State
     */
    const [pharmacies, setPharmacies] = useState([])
    const [appointmentId, setAppointmentId] = useState("")
    const [pharmacyId, setPharmacyId] = useState("")
    const [errors, setErrors] = useState([]);

    /* Add new pharmacy */
    const addNewPharmacy = () => {
        const pharmacy = {
            pharmacyName: "",
            email: "",
            phoneNumber: "",
            country: "US",
            state: "",
            city: "",
            zipCode: "",
        }

        pharmacies.push(pharmacy)
        setPharmacies([...pharmacies])
    }

    useEffect(() => {
        if (incompleteAppointments) {
            setAppointmentId(incompleteAppointments?._id)
        }
        else {
            setAppointmentId()
        }
        if (pharmacyDetails) {
            setPharmacyId(pharmacyDetails?._id)
        }
        else {
            setPharmacyId()
        }
        console.log('pharmacyData', pharmacyDetails?._id)
        // setCity(pharmacyDetails?.city)
        // setName(pharmacyDetails?.pharmacyName)
        // setState(pharmacyDetails?.state)
        // setZipCode(pharmacyDetails?.zipCode)
        // setPhoneNo(pharmacyDetails?.phoneNumber)
        // setEmail(pharmacyDetails?.email)

        if (!pharmacyDetails.length && !pharmacies.length) {
            addNewPharmacy();
        }
        if (pharmacyDetails.length) {
            setPharmacies(pharmacyDetails)
        }

    }, [dispatch, history, userInfo, incompleteAppointments]);

    const inputChangeHandler = (name, input, index) => {
        pharmacies[index][name] = input;
        setPharmacies([...pharmacies])
    }

    const validateSubmit = (e) => {
        e.preventDefault();
        const tempErrors = [];

        let errorExists = false;
        for (let pharmacy of pharmacies) {
            const pharmacyErrors = {
                pharmacyName: validations.pharmacyName(pharmacy.pharmacyName),
                email: validations.pharmacyemail(pharmacy.email),
                city: validations.city(pharmacy.city),
                phoneNumber: validations.pharmacyphoneNumber(pharmacy.phoneNumber),
                state: validations.state(pharmacy.state),
                zipCode: validations.ZipCode(pharmacy.zipCode),
            };
            for (let e of Object.values(pharmacyErrors)) {
                if (e) { errorExists = true }
            }
            tempErrors.push(pharmacyErrors)
        }
        if (errorExists) {
            setErrors(tempErrors)
            return;
        } else {
            setErrors([]);
        }

        submitHandler();
    };

    const submitHandler = async () => {
        const status = await dispatch(
            createAppointment({
                step: 1,
                appointmentId: appointmentId,
                pharmacyId: pharmacyId,
                pharmacies
            })
        );
        if (status) {
            setStep(2)
        }
    };

    const removePharmacy = (index) => {
        if (!pharmacies[index]._id) {
            pharmacies.splice(index, 1);
            setPharmacies([...pharmacies])
        } else {
            console.log("delete", pharmacies[index]._id)
            swal({
                title: "Are you sure?",
                text: "Once deleted, you will not be able to recover the pharmacy details",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
                .then((willDelete) => {
                    if (willDelete) {
                        swal("Pharmacy Details Deleted", {
                            icon: "success",
                        });
                        dispatch(deletePharmacy(pharmacies[index]._id))
                        pharmacies.splice(index, 1);
                        setPharmacies([...pharmacies])
                    } else {
                        //   swal("Your imaginary file is safe!");
                        return
                    }
                });
        }
    }

    const RequiredLabel = ({ label }) => (
        <Typography>
            {label}
            <Typography style={{ color: "red", fontSize: "20px" }} component="span">
                {" "}
                *
            </Typography>
        </Typography>
    );

    return (
        <>
            {/* <AppointmentSteps step1 step2 /> */}
            <Grid container spacing={0} alignItems="center" justifyContent="center">
                <Grid item md={7}>
                    <form onSubmit={validateSubmit} autoComplete="off">
                        <h5 style={{ color: "orange" }}> PHARMACY DETAILS</h5>

                        {/* {JSON.stringify(pharmacies)} */}
                        <hr />

                        {pharmacies?.map((pharmacy, index) => (
                            <div key={index}>
                                <Grid container spacing={4} marginBottom={2}>
                                    <Grid item md={6}>
                                        <TextField
                                            error={errors?.length > index ? !!errors[index].pharmacyName : null}
                                            helperText={errors?.length > index ? errors[index].pharmacyName : null}
                                            label={<RequiredLabel label="Pharmacy Name" />}
                                            variant="standard"
                                            value={pharmacy.pharmacyName}
                                            onChange={(e) => {
                                                inputChangeHandler('pharmacyName', e.target.value, index);
                                            }}
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item md={6}>
                                        <TextField
                                            error={errors?.length > index ? !!errors[index].email : null}
                                            helperText={errors?.length > index ? errors[index].email : null}
                                            label={<RequiredLabel label="Pharmacy Email" />}
                                            type="text"
                                            variant="standard"
                                            value={pharmacy.email}
                                            onChange={(e) => {
                                                inputChangeHandler('email', e.target.value, index);
                                            }}
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item md={6}>
                                        <TextField
                                            error={errors?.length > index ? !!errors[index].phoneNumber : null}
                                            helperText={errors?.length > index ? errors[index].phoneNumber : null}
                                            label={<RequiredLabel label="Pharmacy phoneNumber" />}
                                            type="text"
                                            variant="standard"
                                            value={pharmacy.phoneNumber}
                                            onChange={(e) => {
                                                inputChangeHandler('phoneNumber', e.target.value, index);
                                            }}
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item md={6}>
                                        <TextField
                                            label="Country"
                                            variant="standard"
                                            value={pharmacy.country}
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
                                            error={errors?.length > index ? !!errors[index].state : null}
                                            value={pharmacy.state}
                                            onChange={(e) => {
                                                inputChangeHandler('state', e.target.value, index);
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
                                            {errors?.length > index ? errors[index].state : null}
                                        </FormHelperText>
                                    </Grid>
                                    <Grid item md={6}>
                                        <TextField
                                            error={errors?.length > index ? !!errors[index].city : null}
                                            helperText={errors?.length > index ? errors[index].city : null}
                                            label={<RequiredLabel label="City" />}
                                            variant="standard"
                                            value={pharmacy.city}
                                            onChange={(e) => {
                                                inputChangeHandler('city', e.target.value, index);
                                            }}
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item md={6}>
                                        <TextField
                                            error={errors?.length > index ? !!errors[index].zipCode : null}
                                            helperText={errors?.length > index ? errors[index].zipCode : null}
                                            label={<RequiredLabel label="Zip Code" />}
                                            variant="standard"
                                            value={pharmacy.zipCode}
                                            onChange={(e) => {
                                                inputChangeHandler('zipCode', e.target.value, index);
                                            }}
                                            fullWidth
                                        />
                                    </Grid>
                                    {/* {pharmacyDetails && ( */}
                                    {/* <> */}
                                    <Grid item md={12}>
                                        <Button
                                            variant="danger"
                                            style={{ paddingLeft: "50px", paddingRight: "50px" }}
                                            hidden={pharmacies?.length === 1}
                                            onClick={() => removePharmacy(index)}
                                        >
                                            Delete
                                        </Button>
                                    </Grid>

                                    <Grid item md={6}>
                                        <Grid item md={6}>
                                            <Button
                                                md={2}
                                                onClick={addNewPharmacy}
                                                style={{ paddingLeft: "50px", paddingRight: "50px", color: 'white' }}
                                                hidden={pharmacies?.length === 2}
                                                className="form-control"
                                                variant="info">
                                                Add More (Optional)
                                            </Button>
                                        </Grid>
                                    </Grid>
                                    {/* </> */}
                                    {/* )} */}
                                </Grid>
                            </div>
                        ))}
                        <Box>
                            <Button type="submit" className="form-control" variant="success">
                                NEXT
                            </Button>
                        </Box>

                    </form>
                </Grid>
            </Grid>
        </>
    );
};
export default Step2Pharmacy;
