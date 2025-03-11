export interface PdsErrorMessage {
    /** 	If `html` is set, this is not required. Text to use within the error message. If `html` is provided, the `text` argument will be ignored.*/
    text?: string;

    /** Id attribute to add to the error message span tag.*/
    id?: string;

    /**	Classes to add to the error message span tag. */
    classes?:	string;

    /**	HTML attributes (for example data attributes) to add to the error message span tag.*/
    attributes?:	object;
}
