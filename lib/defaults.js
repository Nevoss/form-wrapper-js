"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/**
 * Default options that provide to Form instance
 */
var _default = {
  successfulSubmission: {
    clearErrors: true,
    resetData: true
  },
  validation: {
    onSubmission: true,
    defaultMessage: function defaultMessage(_ref) {
      var label = _ref.label;
      return "".concat(label, " is invalid.");
    }
  }
};
exports.default = _default;