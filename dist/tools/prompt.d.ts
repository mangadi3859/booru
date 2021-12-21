interface IQuestionString {
    /**
     * Type string answer
     */
    type: "string";
    /**
     * Question
     */
    question: string;
    /**
     * Limit for how many characters can be catch
     */
    limit?: number;
}
interface IQuestionInt {
    /**
     * Type number answer
     */
    type: "number";
    /**
     * Question
     */
    question: string;
    /**
     * range of possible range
     */
    range?: [number, number?];
}
interface IQuestionBoolean {
    /**
     * Type boolean answer
     */
    type: "boolean";
    /**
     * Question
     */
    question: string;
    /**
     * Message that determines whether the answer is true.
     */
    truthy?: string;
}
declare type Question = IQuestionBoolean | IQuestionInt | IQuestionString;
declare const _default: (questions: Question[]) => Promise<any[]>;
export default _default;
