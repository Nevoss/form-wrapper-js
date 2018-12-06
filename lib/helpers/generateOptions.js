"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
/**
 * generate Options base on the defaults Options and new options
 *
 * @param defaultOptions
 * @param overwriteOptions
 */
exports.default = (defaultOptions, overwriteOptions) => {
    return assignNewOptions(defaultOptions, overwriteOptions);
};
/**
 * recursive functions that overwrite the Options object
 *
 * @param originOptions
 * @param newOptions
 */
const assignNewOptions = (originOptions, newOptions) => {
    let options = {};
    Object.keys(originOptions).forEach(key => {
        if (!newOptions.hasOwnProperty(key)) {
            options[key] = originOptions[key];
            return;
        }
        if (utils_1.isObject(newOptions[key])) {
            options[key] = assignNewOptions(originOptions[key], newOptions[key]);
            return;
        }
        options[key] = newOptions[key];
    });
    return options;
};
