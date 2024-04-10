import React, { useState, useEffect } from "react";
import AppointmentSteps from '../../components/appointmentSteps'
import { useDispatch } from "react-redux";
import { getTreatmentArea } from "../../redux/actions/treatmentAreaAction";
import { Timezonechoices } from "../../redux/actions/TimezoneAction";
import {
    getIncompleteAppointments,
} from "../../redux/actions/AppointmentAction";
import {
    getAttendant,
} from "../../redux/actions/AttendantAction";
import {
    getPharmacy,
} from "../../redux/actions/PharmacyAction";
import Step1BookAppointment from './Step1BookAppointment'
import Step2Pharmacy from "./Step2Pharmacy";
import Step3Attendant from "./Step3Attendant";
import Step4AppointmentView from "./Step4AppointmentView";
import Step5Payment from './Step5Payment'

// Main Appointment Function 
function Appointment({ history }) {

    /**
     * Set State
     */
    const dispatch = useDispatch();

    const [step, setStep] = useState(0);

    useEffect(() => {
        (async () => {
            dispatch(Timezonechoices());
            dispatch(getTreatmentArea());
            const data = await dispatch(getIncompleteAppointments());
            setStep(data.step ?? 0);
            dispatch(getPharmacy());
            dispatch(getAttendant());
        })();
    }, [history, dispatch]);

    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: 250,
            },
        },
    };

    return (
        <>
            {/* {loading ? (
                <Loader />
            ) : ( */}
            <div>
                <AppointmentSteps step={step + 1} setStep={step => setStep(step - 1)} />
                {/* {step} */}
                {step === 0 && (
                    <Step1BookAppointment setStep={setStep} />
                )}
                {step === 1 && (
                    <Step2Pharmacy setStep={setStep} />
                )}

                {step === 2 && (
                    <Step3Attendant setStep={setStep} />
                )}

                {step === 3 && (
                    <Step4AppointmentView setStep={setStep} />
                )}

                {step === 4 && (
                    <Step5Payment setStep={setStep} />
                )}
            </div>
            {/* )} */}
        </>
    )
}

export default Appointment