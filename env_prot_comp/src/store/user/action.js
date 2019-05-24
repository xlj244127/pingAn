import * as USER from "./action-type";

export const setUser = (value) => {
  return {
    type: USER.SET_USER,
    value
  };
};

export const setOpenId = (value) => {
  return {
    type: USER.SET_OPENID,
    value
  };
};

export const setInfo = (value) => {
  return {
    type: USER.SET_INFO,
    value
  };
};

