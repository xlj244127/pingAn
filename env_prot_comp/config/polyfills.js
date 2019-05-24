require("@babel/polyfill");
// require("core-js");

Object.setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
  let _setPrototypeOf = function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
};

// if (!Function.prototype.bind) {
//   Function.prototype.bind = function (obj) {
//     var _self = this
//       , args = arguments;
//     return function () {
//       _self.apply(obj, Array.prototype.slice.call(args, 1));
//     }
//   }
// }