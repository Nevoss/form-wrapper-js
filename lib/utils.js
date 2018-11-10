"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mergeDeep = exports.isObject = void 0;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/**
 * check if value is an object and only object
 *
 * @param value
 * @returns {boolean}
 */
var isObject = function isObject(value) {
  return value !== null && _typeof(value) === 'object' && !Array.isArray(value);
};
/**
 * merging deep 2 objects
 *
 * @param target
 * @param source
 * @returns {*}
 */


exports.isObject = isObject;

var mergeDeep = function mergeDeep(target, source) {
  var output = Object.assign({}, target);

  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(function (key) {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, _defineProperty({}, key, source[key]));
        } else {
          output[key] = mergeDeep(target[key], source[key]);
        }
      } else {
        Object.assign(output, _defineProperty({}, key, source[key]));
      }
    });
  }

  return output;
};

exports.mergeDeep = mergeDeep;