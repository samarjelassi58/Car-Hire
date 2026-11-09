import { combineReducers } from "redux";
import userReducer from "./slices/userSlice";
import authReducer from "./slices/authSlice";
import messageReducer from "./slices/messageSlice";
import carReducer from "./slices/carSlice";
import reservationReducer from "./slices/reservationSlice";

const rootReducer = combineReducers({
  user: userReducer,
  auth: authReducer,
  message: messageReducer,
  car: carReducer,
  reservation: reservationReducer,
});
export default rootReducer;
