import { GET_CONFIG_ACTION } from "../types";

const INITIAL_STATE = {
  config: {},
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case GET_CONFIG_ACTION:
      return { ...state, config: action.payload.data };
    default:
      return state;
  }
}
