"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Errors_1 = require("./Errors");
const Validator_1 = require("./Validator");
const utils_1 = require("../utils");
const generateDefaultLabel_1 = require("../helpers/generateDefaultLabel");
const generateOptions_1 = require("../helpers/generateOptions");
const defaults_1 = require("../defaults");
class Form {
    /**
     * constructor of the class
     *
     * @param data
     * @param options
     */
    constructor(data, options = {}) {
        /**
         * determine if the form is on submitting mode
         */
        this.$submitting = false;
        /**
         * Options of the Form
         */
        this.$options = Form.defaults;
        this.assignOptions(options)
            .init(data)
            .reset();
    }
    /**
     * Hook for successful submission
     * use Form.successfulSubmissionHook = () => {};
     * for extending the successful submission handling
     *
     * @param response
     * @param form
     */
    static successfulSubmissionHook(response, form) {
        return Promise.resolve(response);
    }
    /**
     * Hook for un successful submission
     * use Form.unSuccessfulSubmissionHook = () => {};
     * for extending the un successful submission handling
     *
     * @param error
     * @param form
     */
    static unSuccessfulSubmissionHook(error, form) {
        return Promise.reject(error);
    }
    /**
     * Set all the fields value same as $originalData fields value
     */
    reset() {
        for (let fieldName in this.$originalData) {
            if (this.$originalData.hasOwnProperty(fieldName)) {
                this[fieldName] = this.$originalData[fieldName];
            }
        }
        return this;
    }
    /**
     * get all the data of the form
     */
    data() {
        let dataObj = {};
        Object.keys(this.$originalData).forEach(fieldKey => {
            if (this.hasOwnProperty(fieldKey)) {
                dataObj[fieldKey] = this[fieldKey];
            }
        });
        return dataObj;
    }
    /**
     * fill the Form data with new data.
     * without remove another fields data.
     *
     * @param newData
     */
    fill(newData) {
        for (let fieldName in newData) {
            if (newData.hasOwnProperty(fieldName) && this.$originalData.hasOwnProperty(fieldName)) {
                this[fieldName] = newData[fieldName];
            }
        }
        return this;
    }
    /**
     * validate specific key or the whole form.
     *
     * @param fieldKey
     */
    validate(fieldKey = null) {
        return fieldKey ? this.validateField(fieldKey) : this.validateAll();
    }
    /**
     * validate specific field
     *
     * @param fieldKey
     */
    validateField(fieldKey) {
        if (!this.hasOwnProperty(fieldKey)) {
            return true;
        }
        this.$errors.clearField(fieldKey);
        const errors = this.$validator.validateField(this.buildFieldObject(fieldKey), this);
        if (errors.length > 0) {
            this.$errors.append({ [fieldKey]: errors });
        }
        return errors.length === 0;
    }
    /**
     * validate all the fields of the form
     */
    validateAll() {
        let isValid = true;
        Object.keys(this.data()).forEach(fieldKey => {
            if (!this.validateField(fieldKey)) {
                isValid = false;
            }
        });
        return isValid;
    }
    /**
     * its run isFieldDirty if "fieldKey" is passed
     * if not its check all the fields and if one is dirty the whole form
     * is dirty
     *
     * @param fieldKey
     */
    isDirty(fieldKey = null) {
        if (fieldKey) {
            return this.isFieldDirty(fieldKey);
        }
        let dirty = false;
        for (let originalFieldKey in this.$originalData) {
            if (this.isFieldDirty(originalFieldKey)) {
                dirty = true;
                break;
            }
        }
        return dirty;
    }
    /**
     * determine if field is dirty
     *
     * @param fieldKey
     */
    isFieldDirty(fieldKey) {
        if (!this.hasOwnProperty(fieldKey)) {
            return false;
        }
        return this[fieldKey] !== this.$originalData[fieldKey];
    }
    /**
     * assign options to Options object
     *
     * @param options
     */
    assignOptions(options) {
        this.$options = generateOptions_1.default(this.$options, options);
        return this;
    }
    /**
     * submit the form, this method received a callback that
     * will submit the form and must return a Promise.
     *
     * @param callback
     */
    submit(callback) {
        if (this.$options.validation.onSubmission && !this.validate()) {
            return Promise.reject({ message: 'Form is not valid' });
        }
        this.$submitting = true;
        return callback(this)
            .then(this.successfulSubmission.bind(this))
            .catch(this.unSuccessfulSubmission.bind(this));
    }
    /**
     * Init the form
     * fill all the data that should be filled (Validator, OriginalData etc..(
     *
     * @param data
     */
    init(data) {
        let rules = {};
        let originalData = {};
        let labels = {};
        let extra = {};
        Object.keys(data).forEach(key => {
            if (utils_1.isObject(data[key])) {
                originalData[key] = data[key].value;
                if (data[key].hasOwnProperty('rules')) {
                    rules[key] = data[key].rules;
                }
                if (data[key].hasOwnProperty('label')) {
                    labels[key] = data[key].label;
                }
                if (data[key].hasOwnProperty('extra')) {
                    extra[key] = data[key].extra;
                }
            }
            labels[key] = key in labels ? labels[key] : generateDefaultLabel_1.default(key);
            originalData[key] = key in originalData ? originalData[key] : data[key];
            extra[key] = key in extra ? extra[key] : {};
        });
        this.$originalData = originalData;
        this.$labels = labels;
        this.$extra = extra;
        this.$validator = new Validator_1.Validator(rules, this.$options.validation);
        this.$errors = new Errors_1.Errors();
        return this;
    }
    /**
     * build Field object
     *
     * @param fieldKey
     */
    buildFieldObject(fieldKey) {
        return {
            key: fieldKey,
            value: this[fieldKey],
            label: this.$labels[fieldKey]
        };
    }
    /**
     * Successful submission method
     *
     * @param response
     */
    successfulSubmission(response) {
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
     * UnSuccessful submission method
     *
     * @param error
     */
    unSuccessfulSubmission(error) {
        this.$submitting = false;
        return Form.unSuccessfulSubmissionHook(error, this);
    }
}
/**
 * Defaults options for the Form instance
 */
Form.defaults = defaults_1.default;
exports.Form = Form;
