import { Errors } from "./Errors";
import { Validator } from "./Validator";
import { Touched } from "./Touched";
import { Options, SubmitCallback } from "../types";
export declare class Form {
    /**
     * Defaults options for the Form instance
     */
    static defaults: Options;
    /**
     * determine if the form is on submitting mode
     */
    $submitting: boolean;
    /**
     * Errors class - handling all the errors of the fields
     */
    $errors: Errors;
    /**
     * Validator class - handling all the validations stuff
     */
    $validator: Validator;
    /**
     * Touched class - holds all the fields that was touched
     */
    $touched: Touched;
    /**
     * Holds all the labels of the fields
     */
    $labels: Object;
    /**
     * hold the input that is on focus right now
     */
    $onFocus: string | null;
    /**
     * The initiate data that was provide to the form
     */
    $originalData: Object;
    /**
     * all the extra data that provide in the construction of this class
     * will be hold here.
     */
    $extra: Object;
    /**
     * Options of the Form
     */
    $options: Options;
    /**
     * constructor of the class
     *
     * @param data
     * @param options
     */
    constructor(data: Object, options?: Options);
    /**
     * Hook for successful submission
     * use Form.successfulSubmissionHook = () => {};
     * for extending the successful submission handling
     *
     * @param response
     * @param form
     */
    static successfulSubmissionHook(response: any, form: Form): Promise<any>;
    /**
     * Hook for un successful submission
     * use Form.unSuccessfulSubmissionHook = () => {};
     * for extending the un successful submission handling
     *
     * @param error
     * @param form
     */
    static unSuccessfulSubmissionHook(error: any, form: Form): Promise<any>;
    /**
     * Set all the fields value same as $originalData fields value
     */
    reset(): Form;
    /**
     * get all the data of the form
     */
    data(): Object;
    /**
     * fill the Form data with new data.
     * without remove another fields data.
     *
     * @param newData
     */
    fill(newData: Object): Form;
    /**
     * validate specific key or the whole form.
     *
     * @param fieldKey
     */
    validate(fieldKey?: string | null): boolean;
    /**
     * validate specific field
     *
     * @param fieldKey
     */
    validateField(fieldKey: string): boolean;
    /**
     * validate all the fields of the form
     */
    validateAll(): boolean;
    /**
     * its run isFieldDirty if "fieldKey" is passed
     * if not its check all the fields and if one is dirty the whole form
     * is dirty
     *
     * @param fieldKey
     */
    isDirty(fieldKey?: string | null): boolean;
    /**
     * determine if field is dirty
     *
     * @param fieldKey
     */
    isFieldDirty(fieldKey: string): boolean;
    /**
     * assign options to Options object
     *
     * @param options
     */
    assignOptions(options: Options): this;
    /**
     * submit the form, this method received a callback that
     * will submit the form and must return a Promise.
     *
     * @param callback
     */
    submit(callback: SubmitCallback): Promise<any>;
    /**
     * Init the form
     * fill all the data that should be filled (Validator, OriginalData etc..(
     *
     * @param data
     */
    private init;
    /**
     * build Field object
     *
     * @param fieldKey
     */
    private buildFieldObject;
    /**
     * Successful submission method
     *
     * @param response
     */
    private successfulSubmission;
    /**
     * UnSuccessful submission method
     *
     * @param error
     */
    private unSuccessfulSubmission;
}
