import { GET_VENDORS_ACTION, GET_INVOICES_ACTION } from "../types";

const INITIAL_STATE = {
  //sample to show redux is hooked up:
  vendors: [
    {
      vendorId: "D1",
      vendorName: "Delmonte",
      creditBal: 600.0,
    },
    {
      vendorId: "T1",
      vendorName: "Target",
    },
    {
      vendorId: "W1",
      vendorName: "Walmart",
      creditBal: 12.25,
    },
    {
      vendorId: "G1",
      creditBal: 0.0,
    },
  ],
  invoices: [
    {
      invoiceId: 1234,
      vendorId: "G1",
      quantity: 20,
      product: "Apple",
      amountBal: 129.92,
      amountDue: 25.5,
      invoiceDate: "04 / 01 / 2020",
    },
    {
      invoiceId: 4578,
      vendorId: "D1",
      product: "B1",
      quantity: 500,
      amountBal: 1024.12,
      amountDue: 512.5,
      invoiceDate: "03 / 31 / 2020",
    },
    {
      invoiceId: 9999,
      vendorId: "W1",
      quantity: 1000,
      Product: "Napkin",
      amountBal: 12.25,
      amountDue: 12.25,
      invoiceDate: "03 / 31 / 2020",
    },
    {
      invoiceId: 1000,
      vendorId: "W1",
      quantity: 25,
      Product: "Sanitizer",
      amountBal: 25.0,
      amountDue: 12.25,
      invoiceDate: "03 / 31 / 2020",
    },
    {
      invoiceId: 1025,
      vendorId: "W1",
      quantity: 1000,
      Product: "Napkin",
      amountBal: 0,
      amountDue: 0,
      invoiceDate: "03 / 31 / 2020",
    },
  ],
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case GET_INVOICES_ACTION:
      return { ...state, invoices: action.payload };
    case GET_VENDORS_ACTION:
      return { ...state, vendors: action.payload };
    default:
      return state;
  }
}
