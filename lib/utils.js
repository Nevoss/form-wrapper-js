"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * check if value is an object and only object
 *
 * @param value
 */
exports.isObject = (value) => {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
};
