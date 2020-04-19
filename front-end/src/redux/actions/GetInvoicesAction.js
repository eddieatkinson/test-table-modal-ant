import { GET_INVOICES_ACTION } from "../types";
import axios from "axios";

export default function () {
  const url = `${window.apiHost}/invoices`;
  const axiosPromise = axios.get(url);
  return {
    type: GET_INVOICES_ACTION,
    payload: axiosPromise,
  };
}
