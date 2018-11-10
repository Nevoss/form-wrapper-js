"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/**
 * generate default label for field
 *
 * @param fieldKey
 * @returns {*|void|string}
 */
var _default = function _default(fieldKey) {
  return fieldKey.replace(/_/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2').replace(/\b([A-Z]+)([A-Z])([a-z])/, '$1 $2$3').replace(/([A-Z])/g, function (str) {
    return str.toLowerCase();
  }).replace(/^./, function (str) {
    return str.toUpperCase();
  });
};

exports.default = _default;