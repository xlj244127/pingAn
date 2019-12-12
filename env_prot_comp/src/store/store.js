import { createStore, combineReducers } from "redux";
import * as UI from "./UI/reducer";
import { User } from "./user/reducer";
let store = createStore(
  combineReducers({ ...UI, User }),
);

export default store;

