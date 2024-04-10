import {
  // Languages Components
  PAYMENT_REQUEST,
  PAYMENT_LOADING_SUCCESS,
  PAYMENT_FAIL,
  CARD_DELETE_FAIL,
  CARD_DELETE_REQUEST,
  CARD_DELETE_SUCCESS,
} from "../../constants/paymentConstants";
import api from "../../util/api";

export const getPaymentMethods = () => async (dispatch) => {
  try {
    dispatch({
      type: PAYMENT_REQUEST,
    });

    const { data } = await api.get("/payment/getpayment");

    dispatch({
      type: PAYMENT_LOADING_SUCCESS,
      payload: data.paymentMethods,
    });
  } catch (error) {
    console.error("...Error in getPaymentMethods", error);
    dispatch({
      type: PAYMENT_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

export const addPaymentMethod = (payload) => async (dispatch) => {
  try {
    dispatch({
      type: PAYMENT_REQUEST,
    });

    const { data } = await api.put("/payment/addpayment", payload);

    window.location.reload();
  } catch (error) {
    dispatch({
      type: PAYMENT_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

// Delete card Action
export const deleteCard = (stripeCustomerId) => async (dispatch) => {
  try {
    // request
    dispatch({
      type: CARD_DELETE_REQUEST,
    });

    const { data } = await api.put(`/payment/deletecard/${stripeCustomerId}/`);

    // success
    dispatch({
      type: CARD_DELETE_SUCCESS,
      payload: data,
    });
    return data;

    // fail
  } catch (error) {
    dispatch({
      type: CARD_DELETE_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};
