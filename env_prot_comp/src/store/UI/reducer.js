import * as UI from "./action-type";

let defaultState = {
  rootFontSize: 10,
  faceIndex: 0
};

export const UIData = (state = defaultState, action = {}) => {
  switch (action.type) {
  case UI.CHANGE_ROOT_FONT:
    return { ...state, ...{ rootFontSize: action.value }};
  case UI.CHANGE_FACE:
    return { ...state, faceIndex: action.faceIndex };
  default:
    return state;
  }
};
