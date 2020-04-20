import {
  GET_VENDORS_ACTION,
  GET_INVOICES_ACTION,
  ADJUST_BALANCE_ACTION,
  ADJUST_CREDIT_ACTION,
} from "../types";

const INITIAL_STATE = {
  vendors: [],
  invoices: [],
  balanceMsg: "",
  creditMsg: "",
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case GET_INVOICES_ACTION:
      return { ...state, invoices: JSON.parse(action.payload.data) };
    case GET_VENDORS_ACTION:
      return { ...state, vendors: JSON.parse(action.payload.data) };
    case ADJUST_BALANCE_ACTION:
      return { ...state, balanceMsg: action.payload.data.msg };
    case ADJUST_CREDIT_ACTION:
      return { ...state, creditMsg: action.payload.data.msg };
    default:
      return state;
  }
}
