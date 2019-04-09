import { combineReducers } from "redux";
import errorReducer from "./errorReducer";
import dictReducer from "./dictReducer";

export default combineReducers({ errors: errorReducer, dictReducer });
