import userReducer from "./slies/userSlice";
import authReducer from "./slies/authSlice";
import messageReducer from "./slies/messageSlice";
import carReducer from "./slies/carSlice";
import { combineReducers } from "redux";

const rootReducer = combineReducers({
  user: userReducer,
  auth: authReducer,
  message: messageReducer,
  car: carReducer,
});
export default rootReducer;
