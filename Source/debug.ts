import { log } from "console";
import { Expression } from "./math.expressions";
import { ADD, COS, DIV, EXP, LN, LOG, MUL, NEG, NUM, POW, SIN, SUB, TAN, TERMS, VAR } from "./math.constants";
import * as S from '../Source/math.expressions.simplification';

const expressionToString = (e: Expression) : string => {

    const unary = (s: string, e: Expression) : string => {
        return s + " ( " + expressionToString(e) + " ) ";
    }

    const binary = (s: string, e1: Expression, e2: Expression) : string => {
        return s + " ( " + expressionToString(e1) + ", " + expressionToString(e2) + " ) ";
    }

    switch(e.type) {
        case ADD:
            return binary("ADD", e.e1, e.e2);
        case SUB:
            return binary("SUB", e.e1, e.e2);
        case MUL:
            return binary("MUL", e.e1, e.e2);
        case DIV:
            return binary("DIV", e.e1, e.e2);
        case POW:
            return binary("POW", e.e1, e.e2);
        case COS:
            return unary("COS", e.e);
        case SIN:
            return unary("SIN", e.e);
        case TAN:
            return unary("TAN", e.e);
        case EXP:
            return unary("EXP", e.e);
        case LN:
            return unary("LN", e.e);
        case LOG:
            return unary("LOG", e.e);
        case NEG:
            return unary("NEG", e.e);
        case NUM:
            return e.n.toString();
        case VAR:
            return "'" + e.v + "'";
        case TERMS:
            return "[" + e.ts.map(expressionToString).join(", ") + "]";
        default:
            return "UNHANDLED TYPE";
        }
}

export const debug = (s: string) => {
    log(s);
}

export const debugExpression = (e: Expression) => {
    log(expressionToString(e));
}

export const explainCleanSteps = (e: Expression) => {
    log("Expression: " + expressionToString(e));
    let ex = S.test.simplify(e);
    log("simplify: " + expressionToString(ex));
    ex = S.test.termify(ex);
    log("termify: " + expressionToString(ex));
    ex = S.test.unNegTerms(ex);
    log("unNegTerms: " + expressionToString(ex));
    ex = S.test.sortTerms(ex);
    log("sortTerms: " + expressionToString(ex));
    ex = S.test.simplifyTermList(ex);
    log("simplifyTermList: " + expressionToString(ex));
    ex = S.test.unTermify(ex);
    log("unTermify: " + expressionToString(ex));
    ex = S.test.unNeg(ex);
    log("unNeg: " + expressionToString(ex));
    ex = S.test.simplify(ex);
    log("simplify: " + expressionToString(ex));
}