"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Form = void 0;

var _Errors = require("./Errors");

var _Validator = require("./Validator");

var _generateDefaultLabel = _interopRequireDefault(require("../helpers/generateDefaultLabel"));

var _utils = require("../utils");

var _defaults = _interopRequireDefault(require("../defaults"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Form =
/*#__PURE__*/
function () {
  /**
   * determine if the form is on submitting mode
   *
   * @type {boolean}
   */

  /**
   * Errors class
   *
   * @type {null|Errors}
   */

  /**
   * Validator class
   *
   * @type {null|Validator}
   */

  /**
   * labels of the fields
   *
   * @type {{}}
   */

  /**
   * hold the original data that inject to the Form instance
   *
   * @type {Object}
   */

  /**
   * options
   *
   * @type {Object}
   */

  /**
   * constructor
   *
   * @param data
   * @param options
   */
  function Form(data, options) {
    _classCallCheck(this, Form);

    _defineProperty(this, "$submitting", false);

    _defineProperty(this, "$errors", null);

    _defineProperty(this, "$validator", null);

    _defineProperty(this, "$labels", {});

    _defineProperty(this, "$originalData", {});

    _defineProperty(this, "$options", _defaults.default);

    this.assignOptions(options)._init(data).reset();
  }
  /**
   * init the bare bones of the Form class
   *
   * @param data
   * @returns {Form}
   * @private
   */


  _createClass(Form, [{
    key: "_init",
    value: function _init(data) {
      var rules = {};
      var originalData = {};
      var labels = {};
      Object.keys(data).forEach(function (key) {
        if ((0, _utils.isObject)(data[key])) {
          originalData[key] = data[key].value;

          if (data[key].hasOwnProperty('rules')) {
            rules[key] = data[key].rules;
          }

          if (data[key].hasOwnProperty('label')) {
            labels[key] = data[key].label;
          }
        }

        labels[key] = key in labels ? labels[key] : (0, _generateDefaultLabel.default)(key);
        originalData[key] = key in originalData ? originalData[key] : data[key];
      });
      this.$originalData = originalData;
      this.$labels = labels;
      this.$validator = new _Validator.Validator(rules, this.$options.validation);
      this.$errors = new _Errors.Errors();
      return this;
    }
    /**
     * reset the form
     * set all the fields value same as $originalData fields value
     *
     * @returns {Form}
     */

  }, {
    key: "reset",
    value: function reset() {
      for (var fieldName in this.$originalData) {
        if (this.$originalData.hasOwnProperty(fieldName)) {
          this[fieldName] = this.$originalData[fieldName];
        }
      }

      return this;
    }
    /**
     * get all the data of the form
     *
     * @returns {Object}
     */

  }, {
    key: "data",
    value: function data() {
      var _this = this;

      return Object.assign.apply(Object, [{}].concat(_toConsumableArray(Object.keys(this.$originalData).map(function (key) {
        return _this.hasOwnProperty(key) ? _defineProperty({}, key, _this[key]) : {};
      }))));
    }
    /**
     * fill Form with an object of data
     *
     * @param newData
     * @returns {Form}
     */

  }, {
    key: "fill",
    value: function fill(newData) {
      for (var fieldName in newData) {
        if (newData.hasOwnProperty(fieldName) && this.$originalData.hasOwnProperty(fieldName)) {
          this[fieldName] = newData[fieldName];
        }
      }

      return this;
    }
    /**
     * validate field of all form data
     *
     * @param fieldKey
     * @returns {boolean}
     */

  }, {
    key: "validate",
    value: function validate() {
      var fieldKey = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      return fieldKey ? this.validateField(fieldKey) : this.validateAll();
    }
    /**
     * validate one field
     *
     * @param fieldKey
     * @returns {boolean}
     */

  }, {
    key: "validateField",
    value: function validateField(fieldKey) {
      if (!this.hasOwnProperty(fieldKey)) {
        return true;
      }

      this.$errors.delete(fieldKey);
      var errors = this.$validator.validateField(this._buildFieldObject(fieldKey), this);

      if (errors.length > 0) {
        this.$errors.append(_defineProperty({}, fieldKey, errors));
      }

      return errors.length === 0;
    }
    /**
     * validate all form data
     *
     * @returns {boolean}
     */

  }, {
    key: "validateAll",
    value: function validateAll() {
      var _this2 = this;

      var isValid = true;
      Object.keys(this.data()).forEach(function (fieldKey) {
        if (!_this2.validateField(fieldKey)) {
          isValid = false;
        }
      });
      return isValid;
    }
    /**
     * must be a callback that returns a promise determine
     * if the submit went successfully or not
     *
     * @param callback
     * @returns {Promise<T | never>}
     */

  }, {
    key: "submit",
    value: function submit(callback) {
      if (this.$options.validation.onSubmission && !this.validate()) {
        return Promise.reject({
          message: 'Form is not valid'
        });
      }

      this.$submitting = true;
      return callback(this).then(this._successfulSubmission.bind(this)).catch(this._unSuccessfulSubmission.bind(this));
    }
    /**
     * Successful Submission
     *
     * @param response
     * @returns {Promise<any>}
     * @private
     */

  }, {
    key: "_successfulSubmission",
    value: function _successfulSubmission(response) {
      this.$submitting = false;

      if (this.$options.successfulSubmission.clearErrors) {
        this.$errors.clear();
      }

      if (this.$options.successfulSubmission.resetData) {
        this.reset();
      }

      return Form.successfulSubmissionHook(response, this);
    }
    /**
     * UnSuccessful submission
     *
     * @param error
     * @returns {Promise<never>}
     * @private
     */

  }, {
    key: "_unSuccessfulSubmission",
    value: function _unSuccessfulSubmission(error) {
      this.$submitting = false;
      return Form.unSuccessfulSubmissionHook(error, this);
    }
    /**
     * assign options to $options object
     *
     * @param options
     * @returns {Form}
     */

  }, {
    key: "assignOptions",
    value: function assignOptions(options) {
      this.$options = (0, _utils.mergeDeep)(this.$options, options);
      return this;
    }
    /**
     * create field object
     *
     * @param fieldKey
     * @returns {{key: *, value: *, label: *}}
     * @private
     */

  }, {
    key: "_buildFieldObject",
    value: function _buildFieldObject(fieldKey) {
      return {
        key: fieldKey,
        value: this[fieldKey],
        label: this.$labels[fieldKey]
      };
    }
    /**
     * Hook for successful submission
     * use Form.successfulSubmissionHook = () => {};
     * for extending the successful submission handling
     *
     * @param response
     * @param form
     * @returns {Promise<any>}
     */

  }], [{
    key: "successfulSubmissionHook",
    value: function successfulSubmissionHook(response, form) {
      return Promise.resolve(response);
    }
    /**
     * Hook for un successful submission
     * use Form.unSuccessfulSubmissionHook = () => {};
     * for extending the un successful submission handling
     *
     * @param error
     * @param form
     * @returns {Promise<never>}
     */

  }, {
    key: "unSuccessfulSubmissionHook",
    value: function unSuccessfulSubmissionHook(error, form) {
      return Promise.reject(error);
    }
  }]);

  return Form;
}();

exports.Form = Form;