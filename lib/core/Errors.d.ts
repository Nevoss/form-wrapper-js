import { ErrorsStack } from "../types";
export declare class Errors {
    /**
     * Errors stack, holds all the form errors
     */
    $errors: ErrorsStack;
    /**
     * Construct the Errors class with errors
     *
     * @param errors
     */
    constructor(errors?: ErrorsStack);
    /**
     * Record errors to the ErrorsStack
     *
     * @param errors
     */
    record(errors: ErrorsStack): Errors;
    /**
     * Append errors to the ErrorsStack
     *
     * @param errors
     */
    append(errors: ErrorsStack): Errors;
    /**
     * checks if fieldKey exists in the ErrorsStack
     *
     * @param fieldKey
     */
    has(fieldKey: string): boolean;
    /**
     * Returns array of errors for specific field
     *
     * @param fieldKey
     * @param defaultValue
     */
    get(fieldKey: string, defaultValue?: any): string[];
    /**
     * returns first error of specific field key
     *
     * @param fieldKey
     * @param defaultValue
     */
    getFirst<T>(fieldKey: string, defaultValue?: T): T | string;
    /**
     * Returns all the ErrorsStack
     */
    all(): ErrorsStack;
    /**
     * delete a key from ErrorsStack
     *
     * @param fieldKey
     */
    clearField(fieldKey: string): Errors;
    /**
     * check if there is any error in the ErrorsStack
     */
    any(): boolean;
    /**
     * Clear the ErrorsStack object
     */
    clear(): Errors;
}
