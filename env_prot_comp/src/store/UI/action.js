import * as UI from "./action-type";

export const changeRootFont = (value) => {
  return {
    type: UI.CHANGE_ROOT_FONT,
    value
  };
};
export const changeFace = (faceIndex) => {
  return {
    type: UI.CHANGE_FACE,
    faceIndex
  };
};

