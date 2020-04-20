import { ADJUST_CREDIT_ACTION } from "../types";
import axios from "axios";

export default function (input) {
  const axiosPromise = axios({
    url: `${window.apiHost}${input.path}`,
    method: "POST",
    data: input,
  });
  return {
    type: ADJUST_CREDIT_ACTION,
    payload: axiosPromise,
  };
}
