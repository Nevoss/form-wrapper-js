"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Errors {
    /**
     * Construct the Errors class with errors
     *
     * @param errors
     */
    constructor(errors = {}) {
        this.record(errors);
    }
    /**
     * Record errors to the ErrorsStack
     *
     * @param errors
     */
    record(errors) {
        this.$errors = Object.assign({}, errors);
        return this;
    }
    /**
     * Append errors to the ErrorsStack
     *
     * @param errors
     */
    append(errors) {
        this.$errors = Object.assign({}, this.$errors, errors);
        return this;
    }
    /**
     * checks if fieldKey exists in the ErrorsStack
     *
     * @param fieldKey
     */
    has(fieldKey) {
        return this.$errors.hasOwnProperty(fieldKey);
    }
    /**
     * Returns array of errors for specific field
     *
     * @param fieldKey
     * @param defaultValue
     */
    get(fieldKey, defaultValue = []) {
        if (!this.has(fieldKey)) {
            return defaultValue;
        }
        return this.$errors[fieldKey];
    }
    /**
     * returns first error of specific field key
     *
     * @param fieldKey
     * @param defaultValue
     */
    getFirst(fieldKey, defaultValue = null) {
        const errors = this.get(fieldKey);
        return errors.length <= 0 ? defaultValue : errors[0];
    }
    /**
     * Returns all the ErrorsStack
     */
    all() {
        return this.$errors;
    }
    /**
     * delete a key from ErrorsStack
     *
     * @param fieldKey
     */
    delete(fieldKey) {
        if (this.has(fieldKey)) {
            delete this.$errors[fieldKey];
            this.$errors = Object.assign({}, this.$errors);
        }
        return this;
    }
    /**
     * check if there is any error in the ErrorsStack
     */
    any() {
        return Object.keys(this.$errors).length > 0;
    }
    /**
     * Clear the ErrorsStack object
     */
    clear() {
        this.$errors = {};
        return this;
    }
}
exports.Errors = Errors;
//# sourceMappingURL=Errors.js.map