import {
    ATTENDANT_REQUEST,
    ATTENDANT_SUCCESS,
    ATTENDANT_FAIL,
} from "../../constants/attendantConstants";

const initialState = {
    loading: false,
    attendantDetails: {},
    error: null
}

export const attendantReducer = (state = initialState, action) => {
    switch (action.type) {
        case ATTENDANT_REQUEST:
            // request
            return { ...state, loading: true };
        case ATTENDANT_SUCCESS:
            // success
            return { ...state, loading: false, attendantDetails: action.payload };
        case ATTENDANT_FAIL:
            // fail
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};