import { GET_VENDORS_ACTION, GET_INVOICES_ACTION } from "../types";

const INITIAL_STATE = {
  vendors: [],
  invoices: [],
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case GET_INVOICES_ACTION:
      return { ...state, invoices: JSON.parse(action.payload.data) };
    case GET_VENDORS_ACTION:
      return { ...state, vendors: JSON.parse(action.payload.data) };
    default:
      return state;
  }
}
