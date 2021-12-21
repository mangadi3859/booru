import * as readline from "readline";

class AnswerError extends Error {
    name = "AnswerError";
}

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

type Question = IQuestionBoolean | IQuestionInt | IQuestionString;

export default (questions: Question[]): Promise<any[]> =>
    new Promise(async (res, rej) => {
        let rl = readline.createInterface(process.stdin, process.stdout);
        let answers: any[] = [];
        loop: for (let q of questions) {
            if (!q.type) throw new TypeError(`Type is missing question at index ${questions.indexOf(q)}`);
            if (!q.question?.trim()) throw new TypeError(`Question is missing question at index ${questions.indexOf(q)}`);

            see: switch (q.type) {
                case "string": {
                    let answer = await ask(rl, q.question);
                    if (((<IQuestionString>q).limit || Infinity) < answer?.trim().length) throw new AnswerError(`The character is longer than ${<number>(<IQuestionString>q).limit}`);
                    answers.push(answer.trim());
                    break see;
                }
                case "number": {
                    let answer = await ask(rl, q.question);
                    if (!answer?.trim() || !Number(answer.trim())) throw new AnswerError(`Answer cannot undefined and must be a number`);
                    let [min, max] = (<IQuestionInt>q).range || [];
                    let ans = Number(answer);
                    if (min == null) {
                        min = -Infinity;
                        max = Infinity;
                    }

                    if (max == null) {
                        min = -Infinity;
                        max = min;
                    }

                    if (ans > max || ans < min) throw new AnswerError(`Answer cannot less than ${min} and greater than ${max}`);
                    answers.push(ans);
                    break see;
                }

                case "boolean": {
                    let answer = await ask(rl, q.question);
                    answers.push(answer?.trim().toLocaleLowerCase() === ((<IQuestionBoolean>q).truthy?.toLocaleLowerCase() || "yes"));
                    break see;
                }
            }
        }
        rl.close();
        return res(answers);
    });

function ask(rl: readline.Interface, q: string): Promise<string> {
    return new Promise((res) => {
        rl.question(q.trim() + " ", (answer) => {
            res(answer);
        });
    });
}
