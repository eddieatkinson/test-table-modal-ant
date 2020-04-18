import { GET_CONFIG_ACTION } from "../types";
import axios from "axios";

export default function () {
  const url = `${window.apiHost}/app/config`;
  const axiosPromise = axios.get(url);
  return {
    type: GET_CONFIG_ACTION,
    payload: axiosPromise,
  };
}
