export declare class Touched {
    /**
     * holds all the touched fields
     */
    $touched: string[];
    /**
     * returns all the touched fields
     */
    all(): string[];
    /**
     * record fields keys on $touched array
     *
     * @param fieldsKeys
     */
    record(fieldsKeys?: string[]): Touched;
    /**
     * checks if field has been touched
     *
     * @param fieldKey
     */
    has(fieldKey: string): boolean;
    /**
     * push field to the touched array
     *
     * @param fieldKey
     */
    push(fieldKey: string): Touched;
    /**
     * Clear the $touched array
     */
    clear(): Touched;
    /**
     * checks if there is any touched fields
     */
    any(): boolean;
    /**
     * remove field from the $touched array
     *
     * @param fieldKey
     */
    unset(fieldKey: string): Touched;
}
