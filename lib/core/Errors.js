"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Errors = void 0;

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Errors =
/*#__PURE__*/
function () {
  /**
   * hold all the errors
   *
   * @type {Object}
   */

  /**
   * constructor
   *
   * @param errors
   */
  function Errors() {
    var errors = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Errors);

    _defineProperty(this, "$errors", {});

    this.record(errors);
  }
  /**
   * record errors in the $errors object
   *
   * @param errors
   * @returns {Errors}
   */


  _createClass(Errors, [{
    key: "record",
    value: function record(errors) {
      this.$errors = Object.assign({}, errors);
      return this;
    }
    /**
     * append some errors to the errors array
     *
     * @param errors
     * @returns {Errors}
     */

  }, {
    key: "append",
    value: function append(errors) {
      this.$errors = _objectSpread({}, this.$errors, errors);
      return this;
    }
    /**
     * returns array of errors for specific field
     *
     * @param fieldName
     * @param defaultValue
     * @returns {*}
     */

  }, {
    key: "get",
    value: function get(fieldName) {
      var defaultValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

      if (!this.has(fieldName)) {
        return defaultValue;
      }

      return this.$errors[fieldName];
    }
    /**
     * returns first error of specific field
     *
     * @param fieldName
     * @param defaultValue
     * @returns {*}
     */

  }, {
    key: "getFirst",
    value: function getFirst(fieldName) {
      var defaultValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var errors = this.get(fieldName);
      return errors.length <= 0 ? defaultValue : errors[0];
    }
    /**
     * returns all the errors array
     *
     * @returns {Object}
     */

  }, {
    key: "all",
    value: function all() {
      return this.$errors;
    }
    /**
     * delete a key from rhe $errors object
     *
     * @param fieldName
     * @returns {Errors}
     */

  }, {
    key: "delete",
    value: function _delete(fieldName) {
      if (this.has(fieldName)) {
        delete this.$errors[fieldName];
        this.$errors = Object.assign({}, this.$errors);
      }

      return this;
    }
    /**
     * check if field error exists in the $errors object
     *
     * @param fieldName
     * @returns {boolean}
     */

  }, {
    key: "has",
    value: function has(fieldName) {
      return this.$errors.hasOwnProperty(fieldName);
    }
    /**
     * checks if there is any errors in the $errors object
     *
     * @returns {boolean}
     */

  }, {
    key: "any",
    value: function any() {
      return Object.keys(this.$errors).length > 0;
    }
    /**
     * clear all the $errors object
     *
     * @returns {Errors}
     */

  }, {
    key: "clear",
    value: function clear() {
      this.$errors = {};
      return this;
    }
  }]);

  return Errors;
}();

exports.Errors = Errors;