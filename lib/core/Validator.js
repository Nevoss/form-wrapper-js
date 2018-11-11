"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Validator = void 0;

var _utils = require("../utils");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Validator =
/*#__PURE__*/
function () {
  /**
   * fields rules
   *
   * @type {{}}
   */

  /**
   * validations options
   *
   * @type {{}}
   */

  /**
   * constructor
   *
   * @param rules
   * @param options
   */
  function Validator(rules, options) {
    _classCallCheck(this, Validator);

    _defineProperty(this, "$rules", {});

    _defineProperty(this, "$options", {});

    this.$options = Object.assign({}, options);

    this._buildRules(rules);
  }
  /**
   * building rules object
   *
   * @param rules
   * @private
   */


  _createClass(Validator, [{
    key: "_buildRules",
    value: function _buildRules(rules) {
      var _this = this;

      Object.keys(rules).forEach(function (key) {
        _this.$rules[key] = rules[key].map(function (rule) {
          var passes = rule;
          var message = _this.$options.defaultMessage;

          if ((0, _utils.isObject)(rule)) {
            passes = rule.passes;
            message = rule.message;
          }

          return {
            passes: passes,
            message: typeof message === 'function' ? message : function () {
              return message;
            }
          };
        });
      });
      return this;
    }
    /**
     * check if field has rules
     *
     * @param fieldKey
     * @returns {boolean}
     */

  }, {
    key: "has",
    value: function has(fieldKey) {
      return this.$rules.hasOwnProperty(fieldKey);
    }
    /**
     * get the rules of specific filedKey
     *
     * @param fieldKey
     * @returns {*}
     */

  }, {
    key: "get",
    value: function get(fieldKey) {
      return this.$rules[fieldKey];
    }
    /**
     * validate specific field.
     *
     * @param fieldObj
     * @param form
     * @returns {*}
     */

  }, {
    key: "validateField",
    value: function validateField(fieldObj, form) {
      var key = fieldObj.key;

      if (!this.has(key)) {
        return [];
      }

      var messages = [];
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.get(key)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var fieldRules = _step.value;

          if (fieldRules.passes(fieldObj, form)) {
            continue;
          }

          messages.push(fieldRules.message(fieldObj, form));

          if (this.$options.stopAfterFirstRuleFailed) {
            break;
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return messages;
    }
  }]);

  return Validator;
}();

exports.Validator = Validator;