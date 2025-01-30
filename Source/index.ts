import { Expression } from "./math.expressions";//JS
import { clean } from "./math.expressions.simplification";//JS
import { diff } from "./math.differentiation";//JS
import Parser from "./math.parser";//JS
import Scanner from "./math.scanner";//JS
import { ADD, MUL, DIV, POW, COS, SIN, TAN, EXP, LN, LOG, NEG, TERMS, SUB, NUM, VAR } from "./math.constants";//JS
import { render } from "./render.js";

//-- mathjaxText returns a string representing the expression formatted for use with mathjax
const mathjaxText = (e: Expression) : string => {
    switch(e.type) {
        case ADD:
            return mathjaxText(e.e1) + "+" + mathjaxText(e.e2);
        case SUB:
            return mathjaxText(e.e1) + "-" + mathjaxText(e.e2);
        case MUL:
            return mathjaxText(e.e1) + "*" + mathjaxText(e.e2);
        case DIV:
            return "\\frac{" + mathjaxText(e.e1) + "}{" + mathjaxText(e.e2) + "}";
        case POW:
            return mathjaxText(e.e1) + "^{" + mathjaxText(e.e2) + "}";
        case COS:
            return "cos(" + mathjaxText(e.e) + ")"
        case SIN:
            return "sin(" + mathjaxText(e.e) + ")"
        case TAN:
            return "tan(" + mathjaxText(e.e) + ")"
        case EXP:
            return "exp(" + mathjaxText(e.e) + ")"
        case LN:
            return "ln(" + mathjaxText(e.e) + ")"
        case LOG:
            return "log(" + mathjaxText(e.e) + ")"
        case NEG:
            return "-" + mathjaxText(e.e)
        case NUM:
            return e.n.toString();
        case VAR:
            return e.v;
        default:
            return "";
    }
}

const presentError = (error: string) => {
    if (resultDiv != null) {
        (resultDiv as HTMLDivElement).innerText = error;
    }
}

const simplify = (expression: string) => {
    let parsed = parse(expression);
    if (typeof parsed === "string") {
        presentError(parsed);
    }
    else {
        render(mathjaxText(clean(parsed)), resultDiv);
    }
}

function differentiate(expression: string) {
    let parsed = parse(expression);
    if (typeof parsed === "string") {
        presentError(parsed);
    }
    else {
        render(mathjaxText(clean(diff(parsed, 'x'))), resultDiv);
    }
}

function parse(expression: string): Expression | string {
    let tokens = Array.from(new Scanner(expression).getTokens());
    let parser = new Parser(tokens);
    return parser.parse();
}

let expressionInput = document.querySelector("#expression_input");
let resultDiv = document.querySelector("#result_div");

document.querySelector("#simplify_button")?.addEventListener("click", () => { 
    simplify((expressionInput as HTMLInputElement)?.value);
});

document.querySelector("#differentiate_button")?.addEventListener("click", () => { 
    differentiate((expressionInput as HTMLInputElement)?.value);
});
