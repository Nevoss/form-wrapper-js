import { Field, Rule, RulesStack, ValidationOptions } from "../types";
import { Form } from "./Form";
/**
 * Validator Class
 */
export declare class Validator {
    /**
     * Holds all the rules
     */
    $rules: RulesStack;
    /**
     * Validations options
     */
    $options: ValidationOptions;
    /**
     * constructor
     *
     * @param rules
     * @param options
     */
    constructor(rules: Object, options: ValidationOptions);
    /**
     * building rules object
     *
     * @param rules
     */
    private buildRules;
    /**
     * check if field has rules
     *
     * @param fieldKey
     */
    has(fieldKey: string): boolean;
    /**
     * get the rules of specific filedKey
     *
     * @param fieldKey
     */
    get(fieldKey: string): Rule[];
    /**
     * validate specific field.
     *
     * @param field
     * @param form
     */
    validateField(field: Field, form: Form): string[];
}
