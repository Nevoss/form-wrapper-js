"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const defaults = {
    successfulSubmission: {
        clearErrors: true,
        clearTouched: true,
        resetData: true,
    },
    validation: {
        onFieldBlurred: false,
        onFieldChanged: false,
        onSubmission: true,
        unsetFieldErrorsOnFieldChange: false,
        stopAfterFirstRuleFailed: true,
        defaultMessage: ({ label }) => `${label} is invalid.`,
    },
};
exports.default = defaults;
