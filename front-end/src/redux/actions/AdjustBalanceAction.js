import { ADJUST_BALANCE_ACTION } from "../types";
import axios from "axios";

export default function (input) {
  const axiosPromise = axios({
    url: `${window.apiHost}${input.path}`,
    method: "POST",
    data: input,
  });
  return {
    type: ADJUST_BALANCE_ACTION,
    payload: axiosPromise,
  };
}
