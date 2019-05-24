import * as USER from "./action-type";

let defaultState = {
  user: JSON.parse(sessionStorage.getItem("user")),
  openId: null,
  info: {
    name: "",
    mobile: ""
  }
};

export const User = (state = defaultState, action = {}) => {
  switch (action.type) {
  case USER.SET_USER:
    return { ...state, ...{ user: action.value }};
  case USER.SET_OPENID:
    return { ...state, openId: action.value };
  case USER.SET_INFO:
    return { ...state, info: action.value };
  default:
    return state;
  }
};
