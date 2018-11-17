"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
/**
 * Validator Class
 */
class Validator {
    /**
     * constructor
     *
     * @param rules
     * @param options
     */
    constructor(rules, options) {
        /**
         * Holds all the rules
         */
        this.$rules = {};
        this.$options = Object.assign({}, options);
        this.buildRules(rules);
    }
    /**
     * building rules object
     *
     * @param rules
     */
    buildRules(rules) {
        Object.keys(rules).forEach(key => {
            this.$rules[key] = rules[key].map(rule => {
                let passes = rule;
                let message = this.$options.defaultMessage;
                if (utils_1.isObject(rule)) {
                    passes = rule.passes;
                    message = rule.message;
                }
                return {
                    passes,
                    message: typeof message === 'function' ? message : () => message
                };
            });
        });
        return this;
    }
    /**
     * heck if field has rules
     *
     * @param fieldKey
     */
    has(fieldKey) {
        return this.$rules.hasOwnProperty(fieldKey);
    }
    /**
     * get the rules of specific filedKey
     *
     * @param fieldKey
     */
    get(fieldKey) {
        return this.$rules[fieldKey];
    }
    /**
     * validate specific field.
     *
     * @param field
     * @param form
     */
    validateField(field, form) {
        const { key } = field;
        if (!this.has(key)) {
            return [];
        }
        let messages = [];
        for (let fieldRules of this.get(key)) {
            if (fieldRules.passes(field, form)) {
                continue;
            }
            messages.push(fieldRules.message(field, form));
            if (this.$options.stopAfterFirstRuleFailed) {
                break;
            }
        }
        return messages;
    }
}
exports.Validator = Validator;
//# sourceMappingURL=Validator.js.map