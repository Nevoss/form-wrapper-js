"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * generate default label for field
 *
 * @param fieldKey
 */
exports.default = (fieldKey) => {
    return fieldKey
        .replace(/_/g, ' ')
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/\b([A-Z]+)([A-Z])([a-z])/, '$1 $2$3')
        .replace(/([A-Z])/g, str => str.toLowerCase())
        .replace(/^./, str => str.toUpperCase());
};
//# sourceMappingURL=generateDefaultLabel.js.map