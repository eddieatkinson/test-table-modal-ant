import { GET_VENDORS_ACTION } from "../types";
import axios from "axios";

export default function (path) {
  const url = `${window.apiHost}${path}`;
  const axiosPromise = axios.get(url);
  return {
    type: GET_VENDORS_ACTION,
    payload: axiosPromise,
  };
}
