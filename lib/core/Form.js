"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Errors_1 = require("./Errors");
const Validator_1 = require("./Validator");
const Touched_1 = require("./Touched");
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
         * hold the input that is on focus right now
         */
        this.$onFocus = null;
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
            if (this.hasField(fieldKey)) {
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
        if (!this.hasField(fieldKey)) {
            return true;
        }
        this.$errors.unset(fieldKey);
        const errors = this.$validator.validateField(this.buildFieldObject(fieldKey), this);
        if (errors.length > 0) {
            this.$errors.push({ [fieldKey]: errors });
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
        if (!this.hasField(fieldKey)) {
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
     * checks if field exits or not in the form class
     *
     * @param fieldKey
     */
    hasField(fieldKey) {
        return this.hasOwnProperty(fieldKey);
    }
    /**
     * handle change/input on field
     *
     * @param fieldKey
     */
    fieldChanged(fieldKey) {
        if (!this.hasField(fieldKey)) {
            return this;
        }
        this.$options.validation.unsetFieldErrorsOnFieldChange && this.$errors.unset(fieldKey);
        this.$options.validation.onFieldChanged && this.validateField(fieldKey);
        return this;
    }
    /**
     * handle focus on field
     *
     * @param fieldKey
     */
    fieldFocused(fieldKey) {
        if (!this.hasField(fieldKey)) {
            return this;
        }
        this.$touched.push(fieldKey);
        this.$onFocus = fieldKey;
    }
    /**
     * handle blur on field
     *
     * @param fieldKey
     */
    fieldBlurred(fieldKey) {
        if (!this.hasField(fieldKey)) {
            return this;
        }
        if (this.$onFocus === fieldKey) {
            this.$onFocus = null;
        }
        this.$options.validation.onFieldBlurred && this.validateField(fieldKey);
        return this;
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
            let isKeyObject = utils_1.isObject(data[key]);
            originalData[key] = isKeyObject ? data[key].value : data[key];
            labels[key] = isKeyObject && data[key].hasOwnProperty('label') ? data[key].label : generateDefaultLabel_1.default(key);
            extra[key] = isKeyObject && data[key].hasOwnProperty('extra') ? data[key].extra : {};
            rules = Object.assign({}, rules, (isKeyObject && data[key].hasOwnProperty('label') && { [key]: data[key].rules }));
        });
        this.$originalData = originalData;
        this.$labels = labels;
        this.$extra = extra;
        this.$validator = new Validator_1.Validator(rules, this.$options.validation);
        this.$errors = new Errors_1.Errors();
        this.$touched = new Touched_1.Touched();
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
        this.$options.successfulSubmission.clearErrors && this.$errors.clear();
        this.$options.successfulSubmission.clearTouched && this.$touched.clear();
        this.$options.successfulSubmission.resetData && this.reset();
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
