import { randIntFrom, randomFrom } from "./MathUtils"

export default class MathTest {
    constructor() {
        this.operations = ["add", "sub", "mult"];
        this.opConvert = { add: "+", sub: "-", mult: "*" };

        // Get this from the player's intelligence stat
        this.difficultyFactor = 1;
    }

    generateMathTest(){
        let exp = this.generateExpression();

        return {expression: this.expressionToString(exp), value: this.evaluateExpression(exp)}
    }

    generateExpression() {
        let difficultyFactor = 3 * this.difficultyFactor;
        let numOperations = Math.floor(Math.random() * difficultyFactor + 2);

        let expressionArray = [];

        for (let i = 0; i < numOperations; i++) {
            expressionArray.push(this.getRandomNumber());
            expressionArray.push(this.getRandomOperation());
        }

        expressionArray.push(this.getRandomNumber());

        return expressionArray;
    }

    evaluateExpression(exp) {
        let num1;
        let num2;
        let operation;

        for (let i = 0; i < exp.length; i++) {
            if (exp[i] === "mult") {
                num1 = exp[i - 1];
                num2 = exp[i + 1];

                exp.splice(i - 1, 3, this["mult"](num1, num2));

                i -= 2;
            }
        }

        num1 = exp.shift();

        for (let i = 0; i < exp.length; i += 2) {
            operation = exp[i];
            num2 = exp[i + 1];
            num1 = this[operation](num1, num2);
        }
        return num1;
    }

    expressionToString(exp) {
        let str = "";
        for (let i = 0; i < exp.length; i++) {
            if (i % 2 === 0) {
                str += exp[i];
            } else {
                str += this.opConvert[exp[i]];
            }
        }
        return str;
    }

    getRandomNumber() {
        return randIntFrom(1, 10);
    }

    getRandomOperation() {
        return randomFrom(this.operations);
    }

    add(x, y) {
        return x + y;
    }

    sub(x, y) {
        return x - y;
    }

    mult(x, y) {
        return x * y;
    }

    div(x, y) {
        return x / y;
    }
}
    


    