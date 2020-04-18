import { combineReducers } from "redux";
import DataReducer from "./DataReducer";
import ConfigReducer from "./ConfigReducer";

const rootReducer = combineReducers({
  data: DataReducer,
  config: ConfigReducer,
});

export default rootReducer;
