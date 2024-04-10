import {
    PAYMENT_REQUEST,
    PAYMENT_LOADING_SUCCESS,
    PAYMENT_FAIL,
    CARD_DELETE_FAIL,
    CARD_DELETE_REQUEST,
    CARD_DELETE_SUCCESS,
} from "../../constants/paymentConstants";

// Payment Reducer

const initialState = {
    loading: false,
    paymentMethods: [],
    carddelete: [],
};

export const paymentReducer = (state = initialState, action) => {
    switch (action.type) {
        case PAYMENT_REQUEST:
            // request
            return { loading: true };

        case PAYMENT_LOADING_SUCCESS:
            // success
            return { loading: false, paymentMethods: action.payload };

        case PAYMENT_FAIL:
            // fail
            return { loading: false, error: action.payload };

        case CARD_DELETE_REQUEST:
            return { loading: true };

        // Success
        case CARD_DELETE_SUCCESS:
            return { loading: false, carddelete: action.payload };

        // Fail
        case CARD_DELETE_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};