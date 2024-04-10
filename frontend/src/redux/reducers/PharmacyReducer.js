import {
    PHARMACY_REQUEST,
    PHARMACY_SUCCESS,
    PHARMACY_FAIL,

    PHARMACY_DELETE_REQUEST,
    PHARMACY_DELETE_SUCCESS,
    PHARMACY_DELETE_FAIL,
} from "../../constants/pharmacyConstants";

const initialState = {
    loading: false,
    pharmacyDetails: [],
    error: null
}

// Pharmacy Reducer
export const pharmacyReducer = (state = initialState, action) => {
    switch (action.type) {
        case PHARMACY_REQUEST:
            // request
            return { ...state, loading: true };
        case PHARMACY_SUCCESS:
            // success
            return { ...state, loading: false, pharmacyDetails: action.payload };
        case PHARMACY_FAIL:
            // fail
            return { ...state, loading: false, error: action.payload };
        case PHARMACY_DELETE_REQUEST:
            // fail
            return { ...state, loading: true };
        case PHARMACY_DELETE_SUCCESS:
            // fail
            return { ...state, loading: false, pharmacyDetails: action.payload };
        case PHARMACY_DELETE_FAIL:
            // fail
            return { ...state, loading: false, error: action.payload };



        default:
            return state;
    }
};

