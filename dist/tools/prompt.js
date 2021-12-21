"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const readline = __importStar(require("readline"));
class AnswerError extends Error {
    name = "AnswerError";
}
exports.default = (questions) => new Promise(async (res, rej) => {
    let rl = readline.createInterface(process.stdin, process.stdout);
    let answers = [];
    loop: for (let q of questions) {
        if (!q.type)
            throw new TypeError(`Type is missing question at index ${questions.indexOf(q)}`);
        if (!q.question?.trim())
            throw new TypeError(`Question is missing question at index ${questions.indexOf(q)}`);
        see: switch (q.type) {
            case "string": {
                let answer = await ask(rl, q.question);
                if ((q.limit || Infinity) < answer?.trim().length)
                    throw new AnswerError(`The character is longer than ${q.limit}`);
                answers.push(answer.trim());
                break see;
            }
            case "number": {
                let answer = await ask(rl, q.question);
                if (!answer?.trim() || !Number(answer.trim()))
                    throw new AnswerError(`Answer cannot undefined and must be a number`);
                let [min, max] = q.range || [];
                let ans = Number(answer);
                if (min == null) {
                    min = -Infinity;
                    max = Infinity;
                }
                if (max == null) {
                    min = -Infinity;
                    max = min;
                }
                if (ans > max || ans < min)
                    throw new AnswerError(`Answer cannot less than ${min} and greater than ${max}`);
                answers.push(ans);
                break see;
            }
            case "boolean": {
                let answer = await ask(rl, q.question);
                answers.push(answer?.trim().toLocaleLowerCase() === (q.truthy?.toLocaleLowerCase() || "yes"));
                break see;
            }
        }
    }
    rl.close();
    return res(answers);
});
function ask(rl, q) {
    return new Promise((res) => {
        rl.question(q.trim() + " ", (answer) => {
            res(answer);
        });
    });
}
