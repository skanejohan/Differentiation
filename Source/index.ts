import { Expression } from "./math.expressions"
import { clean } from "./math.expressions.simplification";
import { diff } from "./math.differentiation";
import Parser from "./math.parser";
import Scanner from "./math.scanner";
import { ADD, MUL, DIV, POW, COS, SIN, TAN, EXP, LN, LOG, NEG, TERMS, SUB, NUM, VAR } from "./math.constants";

//-- mathjax returns a string representing the expression formatted for use with MathJax
const mathjax = (e: Expression) : string => {
    switch(e.type) {
        case ADD:
            return mathjax(e.e1) + "+" + mathjax(e.e2);
        case SUB:
            return mathjax(e.e1) + "-" + mathjax(e.e2);
        case MUL:
            return mathjax(e.e1) + "*" + mathjax(e.e2);
        case DIV:
            return "\\frac{" + mathjax(e.e1) + "}{" + mathjax(e.e2) + "}";
        case POW:
            return mathjax(e.e1) + "^{" + mathjax(e.e2) + "}";
        case COS:
            return "cos(" + mathjax(e.e) + ")"
        case SIN:
            return "sin(" + mathjax(e.e) + ")"
        case TAN:
            return "tan(" + mathjax(e.e) + ")"
        case EXP:
            return "exp(" + mathjax(e.e) + ")"
        case LN:
            return "ln(" + mathjax(e.e) + ")"
        case LOG:
            return "log(" + mathjax(e.e) + ")"
        case NEG:
            return "-" + mathjax(e.e)
        case NUM:
            return e.n.toString();
        case VAR:
            return e.v;
        default:
            return "";
    }
}

export const simplify = (expression: string) => {
    let parsed = parse(expression);
    if (typeof parsed === "string") {
        console.log(parsed);
    }
    else {
        (resultDiv as HTMLDivElement)!.innerText = mathjax(clean(parsed));
    }
}

export function differentiate(expression: string) {
    let parsed = parse(expression);
    if (typeof parsed === "string") {
        console.log(parsed);
    }
    else {
        let simplified = clean(diff(parsed, 'x'));
        (resultDiv as HTMLDivElement)!.innerText = mathjax(clean(diff(parsed, 'x')));
    }
}

export function parse(expression: string): Expression | string {
    let tokens = Array.from(new Scanner(expression).getTokens());
    let parser = new Parser(tokens);
    return parser.parse();
}

let simplifyButton = document.querySelector("#simplify_button");
let differentiateButton = document.querySelector("#differentiate_button");
let expressionInput = document.querySelector("#expression_input");
let resultDiv = document.querySelector("#result_div");

simplifyButton?.addEventListener("click", () => { 
    simplify((expressionInput as HTMLInputElement)?.value);
});

differentiateButton?.addEventListener("click", () => { 
    differentiate((expressionInput as HTMLInputElement)?.value);
});
