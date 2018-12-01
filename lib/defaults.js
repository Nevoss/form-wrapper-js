"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const defaults = {
    successfulSubmission: {
        clearErrors: true,
        resetData: true,
    },
    validation: {
        onSubmission: true,
        stopAfterFirstRuleFailed: true,
        defaultMessage: ({ label }) => `${label} is invalid.`
    }
};
exports.default = defaults;
