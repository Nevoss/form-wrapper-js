"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Touched {
    constructor() {
        /**
         * holds all the touched fields
         */
        this.$touched = [];
    }
    /**
     * returns all the touched fields
     */
    all() {
        return this.$touched;
    }
    /**
     * record fields keys on $touched array
     *
     * @param fieldsKeys
     */
    record(fieldsKeys = []) {
        this.$touched = [...fieldsKeys];
        return this;
    }
    /**
     * checks if field has been touched
     *
     * @param fieldKey
     */
    has(fieldKey) {
        return this.$touched.indexOf(fieldKey) > -1;
    }
    /**
     * push field to the touched array
     *
     * @param fieldKey
     */
    push(fieldKey) {
        if (this.$touched.indexOf(fieldKey) < 0) {
            this.$touched.push(fieldKey);
        }
        return this;
    }
    /**
     * Clear the $touched array
     */
    clear() {
        this.$touched = [];
        return this;
    }
    /**
     * checks if there is any touched fields
     */
    any() {
        return this.$touched.length > 0;
    }
    /**
     * remove field from the $touched array
     *
     * @param fieldKey
     */
    unset(fieldKey) {
        if (this.has(fieldKey)) {
            this.$touched = this.$touched.filter((touchedFieldKey) => touchedFieldKey !== fieldKey);
        }
        return this;
    }
}
exports.Touched = Touched;
