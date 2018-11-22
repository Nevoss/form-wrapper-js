"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const defaults = {
    successfulSubmission: {
        clearErrors: true,
        resetData: true,
    },
    validation: {
        stopAfterFirstRuleFailed: true,
        onSubmission: true,
        defaultMessage: ({ label }) => `${label} is invalid.`
    }
};
exports.default = defaults;
