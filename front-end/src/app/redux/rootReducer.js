import userReducer from "./slies/userSlice";
import authReducer from "./slies/authSlice";
import { combineReducers } from "redux";

const rootReducer = combineReducers({
  user: userReducer,
  auth: authReducer,
});
export default rootReducer;
