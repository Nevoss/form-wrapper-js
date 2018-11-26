import { Errors } from "./Errors";
import { Validator } from "./Validator";
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
     * Holds all the labels of the fields
     */
    $labels: Object;
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
     * Init the form
     * fill all the data that should be filled (Validator, OriginalData etc..(
     *
     * @param data
     */
    private init;
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
     * build Field object
     *
     * @param fieldKey
     */
    private buildFieldObject;
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
}
