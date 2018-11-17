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
/**
 * merging deep 2 objects
 *
 * @param target
 * @param source
 */
exports.mergeDeep = (target, source) => {
    let output = Object.assign({}, target);
    if (exports.isObject(target) && exports.isObject(source)) {
        Object.keys(source).forEach(key => {
            if (exports.isObject(source[key])) {
                if (!(key in target)) {
                    output = Object.assign({}, output, { [key]: source[key] });
                }
                else {
                    output[key] = exports.mergeDeep(target[key], source[key]);
                }
            }
            else {
                output = Object.assign({}, output, { [key]: source[key] });
            }
        });
    }
    return output;
};
//# sourceMappingURL=utils.js.map