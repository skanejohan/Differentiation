import { matchAdd, matchMulExprNum, matchMulNumExpr, matchMulNumPowVarNum, matchMulNumVar, matchNeg, matchNegMulNumExpr, matchNegNum, matchNum, matchPowVarNum, matchTerms, matchVar } from './math.expressions.matching';
import { _var, add, cos, div, exp, Expression, ln, log, mul, neg, num, pow, sin, sub, tan, terms } from "./math.expressions";
import { ADD, COS, DIV, EXP, LN, LOG, MUL, NEG, NUM, POW, SIN, SUB, TAN, TERMS, VAR } from './math.constants';

export const clean = (e: Expression) : Expression => {
    return simplify(unNeg(unTermify(simplifyTermList(sortTerms(unNegTerms(termify(simplify(e))))))));
}  

// Returns an expression tree where certain simplifications have been made
const simplify = (e: Expression) : Expression => {

    const simplify2 = (e: Expression) : Expression => {
        let m, m1, m2;
        switch(e.type) {
            case ADD:
                if ((m1 = matchNum(e.e1)) && m1.n == 0) { // 0 + expression = expression
                    return simplify2(e.e2);
                }
                if ((m1 = matchNum(e.e2)) && m1.n == 0) { // expression + 0 = expression
                    return simplify2(e.e1);
                }
                if ((m1 = matchNum(e.e1)) && (m2 = matchNum(e.e2))) { // n1 + n2 = their sum
                    return num(m1.n + m2.n);
                }
                if ((m1 = matchVar(e.e1)) && (m2 = matchVar(e.e2)) && m1 == m2) { // x + x = 2 * x
                    return mul(num(2), _var(m1));
                }
                if ((m1 = matchPowVarNum(e.e1)) && (m2 = matchPowVarNum(e.e2)) && m1.v == m2.v && m1.e == m2.e) { // x^3 + x^3 = 2 * x^3
                    return mul(num(2), e.e1);
                }
                if ((m1 = matchMulNumPowVarNum(e.e1)) && (m2 = matchPowVarNum(e.e2)) && m1.v == m2.v && m1.e == m2.e) { // 7*x^3 + x^3 = 8 * x^3
                    return mul(num(m1.n+1), e.e2);
                }
                if ((m1 = matchPowVarNum(e.e1)) && (m2 = matchMulNumPowVarNum(e.e2)) && m1.v == m2.v && m1.e == m2.e) { // x^3 + 7*x^3 = 8 * x^3
                    return mul(num(m2.n+1), e.e1);
                }
                if ((m1 = matchMulNumPowVarNum(e.e1)) && (m2 = matchMulNumPowVarNum(e.e2)) && m1.v == m2.v && m1.e == m2.e) { // 2*x^3 + 7*x^3 = 9 * x^3
                    return mul(num(m1.n+m2.n), pow(_var(m1.v), num(m1.e)));
                }
                if ((m1 = matchVar(e.e1)) && (m2 = matchMulNumVar(e.e2)) && m1 == m2.v) { // x + 3 * x = 4 * x
                    return mul(num(m2.n+1), e.e1);
                }
                if ((m1 = matchMulNumVar(e.e1)) && (m2 = matchVar(e.e2)) && m1.v == m2) { // 3 * x + x = 4 * x
                    return mul(num(m1.n+1), e.e2);
                }
                if ((m1 = matchMulNumVar(e.e1)) && (m2 = matchMulNumVar(e.e2)) && m1.v == m2.v) { // 3 * x + 5 * x = 8 * x
                    return mul(num(m1.n+m2.n), _var(m1.v));
                }
                if ((m1 = matchNum(e.e1)) && (m2 = matchVar(e.e2))) { // 3 + x -> x + 3
                    return add(e.e2, e.e1);
                }
                if ((m1 = matchNum(e.e1)) && (m2 = matchMulNumVar(e.e2))) { // 3 + 2 * x -> 2 * x + 3
                    return add(e.e2, e.e1);
                }
                if ((m1 = matchNum(e.e1)) && (m2 = matchPowVarNum(e.e2))) { // 3 + x^2 -> x^2 + 3
                    return add(e.e2, e.e1);
                }
                if ((m1 = matchNum(e.e1)) && (m2 = matchMulNumPowVarNum(e.e2))) { // 3 + 2 * x^3 -> 2 * x^3 + 3
                    return add(e.e2, e.e1);
                }
                if ((m1 = matchVar(e.e1)) && (m2 = matchPowVarNum(e.e2)) && m1 == m2.v) { // x + x^2 -> x^2 + x
                    return add(e.e2, e.e1);
                }
                if ((m1 = matchVar(e.e1)) && (m2 = matchMulNumPowVarNum(e.e2)) && m1 == m2.v) { // x + 2 * x^3 -> 2 * x^3 + x
                    return add(e.e2, e.e1);
                }
                if ((m1 = matchMulNumVar(e.e1)) && (m2 = matchPowVarNum(e.e2)) && m1.v == m2.v) { // 4 * x + x^2 -> x^2 + 4 * x
                    return add(e.e2, e.e1);
                }
                if ((m1 = matchMulNumVar(e.e1)) && (m2 = matchMulNumPowVarNum(e.e2)) && m1.v == m2.v) { // 4 * x + 3 * x^2 -> 3 * x^2 + 4 * x
                    return add(e.e2, e.e1);
                }
                if ((m1 = matchPowVarNum(e.e1)) && (m2 = matchPowVarNum(e.e2)) && m1.v == m2.v && m1.e < m2.e) { // x^2 + x^3 -> x^3 + x^2
                    return add(e.e2, e.e1);
                }
                if ((m1 = matchPowVarNum(e.e1)) && (m2 = matchMulNumPowVarNum(e.e2)) && m1.v == m2.v && m1.e < m2.e) { // x^2 + 2 * x^3 -> 2 * x^3 + x^2
                    return add(e.e2, e.e1);
                }
                if ((m1 = matchMulNumPowVarNum(e.e1)) && (m2 = matchPowVarNum(e.e2)) && m1.v == m2.v && m1.e < m2.e) { // 2 * x^2 + x^3 -> x^3 + 2 * x^2
                    return add(e.e2, e.e1);
                }
                if ((m1 = matchMulNumPowVarNum(e.e1)) && (m2 = matchMulNumPowVarNum(e.e2)) && m1.v == m2.v && m1.e < m2.e) { // 2 * x^2 + 2 * x^3 -> 2 * x^3 + 2 * x^2
                    return add(e.e2, e.e1);
                }
                return add(simplify2(e.e1), simplify2(e.e2)); //  for all others, just simplify the sub-expressions
            case SUB:
                if ((m1 = matchNum(e.e1)) && m1.n == 0) { // 0 - expression = -expression
                    return neg(simplify2(e.e2));
                }
                if ((m1 = matchNum(e.e2)) && m1.n == 0) { // expression - 0 = expression
                    return simplify2(e.e1);
                }
                if ((m1 = matchNum(e.e1)) && (m2 = matchNum(e.e2))) { // n1 - n2 = their difference
                    return num(m1.n - m2.n);
                }
                if (e.e1.type == VAR && e.e2.type == VAR && e.e1.v == e.e2.v) { // x - x = 0
                    return num(0);
                }
                return add(simplify2(e.e1), neg(simplify2(e.e2)));
            case MUL:
                if ((m = matchNum(e.e1)) && m.n == 0) { // 0 * expression = 0
                    return num(0);
                }
                if ((m = matchNum(e.e2)) && m.n == 0) { // expression * 0 = 0
                    return num(0);
                }
                if ((m = matchNum(e.e1)) && m.n == 1) { // 1 * expression = expression
                    return simplify2(e.e2);
                }
                if ((m = matchNum(e.e2)) && m.n == 1) { // expression * 1 = expression
                    return simplify2(e.e1);
                }
                if ((m1 = matchNum(e.e1)) && (m2 = matchNum(e.e2))) { // 7 * 5 = 35
                    return num(m1.n * m2.n);
                }
                if ((m1 = matchNum(e.e1)) && (m2 = matchMulNumExpr(e.e2)) ) { // 7 * 5 * expression = 35 * expression
                    return mul(num(m1.n * m2.n), m2.ex);
                }
                if ((m1 = matchNum(e.e1)) && (m2 = matchMulExprNum(e.e2)) ) { // 7 * 5 * expression = 35 * expression
                    return mul(num(m1.n * m2.n), m2.ex);
                }
                if ((m1 = matchNegNum(e.e1)) && m1.n == 1) { // -1 * expression = -expression
                    return neg(simplify2(e.e2));
                }
                if ((m1 = matchNegNum(e.e2)) && m1.n == 1) { // expression * -1 = -expression
                    return neg(simplify2(e.e1));
                }
                if ((m1 = matchVar(e.e1)) && (m2 = matchVar(e.e2)) && m1 == m2) { // x * x = x^2
                    return pow(e.e1, num(2));
                }
                if ((m1 = matchMulNumVar(e.e1)) && (m2 = matchVar(e.e2)) && m1.v == m2) { // 5 * x * x = 5 * x^2
                    return mul(num(m1.n), pow(e.e2, num(2)));
                }
                if ((m1 = matchVar(e.e1)) && (m2 = matchPowVarNum(e.e2)) && m1 == m2.v) { // x * x^3 = x^4
                    return pow(e.e1, num(m2.e + 1));
                }
                if ((m1 = matchPowVarNum(e.e1)) && (m2 = matchVar(e.e2)) && m1.v == m2) { // x^3 * x = x^4
                    return pow(e.e2, num(m1.e + 1));
                }
                if ((m1 = matchPowVarNum(e.e1)) && (m2 = matchPowVarNum(e.e2)) && m1.v == m2.v) { // x^5 * x^2 = x^7
                    return pow(_var(m1.v), num(m1.e + m2.e));
                }
                return mul(simplify2(e.e1), simplify2(e.e2));
            case DIV:
                return div(simplify2(e.e1), simplify2(e.e2));
            case POW:
                return e.e2.type == NUM && e.e2.n == 1 ? simplify2(e.e1) : pow(simplify2(e.e1), simplify2(e.e2));
            case COS:
                return cos(simplify2(e.e));
            case SIN:
                return sin(simplify2(e.e));
            case TAN:
                return tan(simplify2(e.e));
            case EXP:
                return exp(simplify2(e.e));
            case LN:
                return ln(simplify2(e.e));
            case LOG:
                return log(simplify2(e.e));
            case NEG:
                return e.e.type == NEG ? simplify2(e.e) : neg(simplify2(e.e));
            default:
                return e;
        }
    }

    const simplified = simplify2(e);
    if (areEqual(e, simplified)) {
        return e;
    }
    return simplify(simplified);
}  

//-- Returns an expression tree where subsequent Add operations have been combined into term lists
const termify = (e: Expression) : Expression => {

    const subToAdd = (e: Expression) : Expression => {
        switch(e.type) {
            case ADD:
                return add(subToAdd(e.e1), subToAdd(e.e2));
            case SUB:
                return add(subToAdd(e.e1), neg(subToAdd(e.e2)));
            case MUL:
                return mul(subToAdd(e.e1), subToAdd(e.e2));
            case DIV:
                return div(subToAdd(e.e1), subToAdd(e.e2));
            case POW:
                return pow(subToAdd(e.e1), subToAdd(e.e2));
            case COS:
                return cos(subToAdd(e.e));
            case SIN:
                return sin(subToAdd(e.e));
            case TAN:
                return tan(subToAdd(e.e));
            case EXP:
                return exp(subToAdd(e.e));
            case LN:
                return ln(subToAdd(e.e));
            case LOG:
                return log(subToAdd(e.e));
            case NEG:
                return neg(subToAdd(e.e));
            default:
                return e;
        }
    }

    const termify2 = (e: Expression) : Expression => {
        switch(e.type) {
            case ADD:
                let addEx : { ex1 : Expression, ex2 : Expression } | null;
                if (addEx = matchAdd(e.e1)) {
                    return terms([termify2(addEx.ex1), termify2(addEx.ex2), termify2(e.e2)]);
                }
                if (addEx = matchAdd(e.e2)) {
                    return terms([termify2(e.e1), termify2(addEx.ex1), termify2(addEx.ex2)]);
                }
                return e;
            case MUL:
                return mul(termify2(e.e1), termify2(e.e2));
            case DIV:
                return div(termify2(e.e1), termify2(e.e2));
            case POW:
                return pow(termify2(e.e1), termify2(e.e2));
            case COS:
                return cos(termify2(e.e));
            case SIN:
                return sin(termify2(e.e));
            case TAN:
                return tan(termify2(e.e));
            case EXP:
                return exp(termify2(e.e));
            case LN:
                return ln(termify2(e.e));
            case LOG:
                return log(termify2(e.e));
            case NEG:
                return neg(termify2(e.e));
            case TERMS:
                return terms(termify3(e.ts));
            default:
                return e;
        }
    }

    const termify3 = (es: Expression[]) : Expression[] => {
        let addEx : { ex1 : Expression, ex2 : Expression } | null;
        let terms : Expression[] | null;

        if (es.length >= 1) {
            if (addEx = matchAdd(es[0])) {
                return [addEx.ex1, addEx.ex2].concat(termify3(es.slice(1)));
            }
            if (terms = matchTerms(es[0])) {
                return terms.concat(termify3(es.slice(1)));
            }
            let ess : Expression[] = [es[0]];
            return ess.concat(termify3(es.slice(1)));
        }
        return [];
    }

    const s2a = subToAdd(e);
    const tfy = termify2(s2a);
    if (areEqual(s2a, tfy)) {
        return s2a;
    }
    return termify(tfy);
}  

// In a terms list, replace e.g. -mul(5, e) with mul(-5, e)
const unNegTerms = (e: Expression) : Expression => {

    const translateNegMul = (e: Expression) : Expression => {
        let nmne : { n : number, ex : Expression } | null;
        return (nmne = matchNegMulNumExpr(e)) ? mul(num(-nmne.n), nmne.ex) : e;
    }

    switch(e.type) {
        case TERMS:
            return terms(e.ts.map(translateNegMul));
        default:
            return e;
    }
}

// Returns an expression tree where all term lists have been sorted.
const sortTerms = (e: Expression) : Expression => {

    const compareTerms = (t1 : Expression, t2: Expression) : number => {
        
        let v2 : string | null;
        let pvn1, pvn2 : { v : string, e : number } | null;
        let mnpvn1, mnpvn2 : { n : number, v : string, e : number } | null;

        if (mnpvn1 = matchMulNumPowVarNum(t1)) {
            if (mnpvn2 = matchMulNumPowVarNum(t2)) { // Compare a*x^e1 with b*x^e2
                if (mnpvn1.v == mnpvn2.v) {
                    if (mnpvn2.e == mnpvn1.e) {
                        return mnpvn2.n - mnpvn1.n;
                    }
                    return mnpvn1.e - mnpvn2.e;
                }
                return mnpvn2.v.localeCompare(mnpvn1.v);
            }
            if (pvn2 = matchPowVarNum(t2)) { // Compare a*x^e1 with x^e2
                if (mnpvn1.v == pvn2.v) {
                    if (pvn2.e == mnpvn1.e) {
                        return 1 - mnpvn1.n;
                    }
                    return mnpvn1.e - pvn2.e;
                }
                return pvn2.v.localeCompare(mnpvn1.v);
            }
            if (v2 = matchVar(t2)) { // Compare a*x^e1 with x
                return mnpvn1.v == v2 ? 1 - mnpvn1.e : v2.localeCompare(mnpvn1.v);
            }
            return 1; // a*x^e1 > anything else
        }
        if (pvn1 = matchPowVarNum(t1)) {
            if (mnpvn2 = matchMulNumPowVarNum(t2)) {  // Compare x^e1 with b*x^e2
                if (pvn1.v == mnpvn2.v) {
                    if (mnpvn2.e == pvn1.e) {
                        return mnpvn2.n - 1;
                    }
                    return pvn1.e - mnpvn2.e;
                }
                return mnpvn2.v.localeCompare(pvn1.v);
            }
            if (pvn2 = matchPowVarNum(t2)) { // Compare x^e1 with x^e2
                if (pvn1.v == pvn2.v) {
                    return pvn1.e - pvn2.e;
                }
                return pvn2.v.localeCompare(pvn1.v);
            }
            if (v2 = matchVar(t2)) { // Compare x^e1 > x
                return pvn1.v == v2 ? 1 - pvn1.e : v2.localeCompare(pvn1.v);
            }
            return 1; // x^e1 > anything else
        }

        return 0;
    }

    switch(e.type) {
        case ADD:
            return add(sortTerms(e.e1), sortTerms(e.e2));
        case MUL:
            return mul(sortTerms(e.e1), sortTerms(e.e2));
        case DIV:
            return div(sortTerms(e.e1), sortTerms(e.e2));
        case POW:
            return pow(sortTerms(e.e1), sortTerms(e.e2));
        case COS:
            return cos(sortTerms(e.e));
        case SIN:
            return sin(sortTerms(e.e));
        case TAN:
            return tan(sortTerms(e.e));
        case EXP:
            return exp(sortTerms(e.e));
        case LN:
            return ln(sortTerms(e.e));
        case LOG:
            return log(sortTerms(e.e));
        case NEG:
            return neg(sortTerms(e.e));
        case TERMS:
            return terms(e.ts.sort(compareTerms).reverse());
        default:
            return e;
    }
}

// Returns an expression tree where certain simplifications have been made to the term lists
const simplifyTermList = (e: Expression) : Expression => {

    // n1 * v ^ e + n2 * v ^ e = (n1 + n2) * v ^ e
    const addPowers = (e1: Expression, e2: Expression) : Expression | null => {
        let p1, p2 : { n : number, v : string, e : number } | null;
        return (p1 = matchMulNumPowVarNum(e1)) && (p2 = matchMulNumPowVarNum(e2)) && p1.v == p2.v && p1.e == p2.e
            ? mul(num(p1.n + p2.n), pow(_var(p1.v), num(p1.e)))
            : null;
    }

    const simplifyTermList2 = (es: Expression[]) : Expression[] => {
        let powers, n0, n1;
        if (es.length > 1) {
            if (powers = addPowers(es[0], es[1])) {
                return [powers].concat(simplifyTermList2(es.slice(2)));
            }
            if ((n0 = matchNum(es[0])) && (n1 = matchNum(es[1]))) {
                return (simplifyTermList2([num(n0.n + n1.n)].concat(es.slice(2))));
            }
        }
        if (es.length >= 1) {
            return [es[0]].concat(simplifyTermList2(es.slice(1)));
        }
        return [];
    }

    switch(e.type) {
        case ADD:
            return add(simplifyTermList(e.e1), simplifyTermList(e.e2));
        case MUL:
            return mul(simplifyTermList(e.e1), simplifyTermList(e.e2));
        case DIV:
            return div(simplifyTermList(e.e1), simplifyTermList(e.e2));
        case POW:
            return pow(simplifyTermList(e.e1), simplifyTermList(e.e2));
        case COS:
            return cos(simplifyTermList(e.e));
        case SIN:
            return sin(simplifyTermList(e.e));
        case TAN:
            return tan(simplifyTermList(e.e));
        case EXP:
            return exp(simplifyTermList(e.e));
        case LN:
            return ln(simplifyTermList(e.e));
        case LOG:
            return log(simplifyTermList(e.e));
        case NEG:
            return neg(simplifyTermList(e.e));
        case TERMS:
            return terms(simplifyTermList2(e.ts));
        default:
            return e;
    }
}

// Returns an expression tree where term lists have been replaced with subsequent Add operations 
const unTermify = (e: Expression) : Expression => {

    const unTermify2 = (e: Expression) : Expression =>
    {
        switch(e.type) {
            case ADD:
                return add(unTermify2(e.e1), unTermify2(e.e2));
            case MUL:
                return mul(unTermify2(e.e1), unTermify2(e.e2));
            case DIV:
                return div(unTermify2(e.e1), unTermify2(e.e2));
            case POW:
                return pow(unTermify2(e.e1), unTermify2(e.e2));
            case COS:
                return cos(unTermify2(e.e));
            case SIN:
                return sin(unTermify2(e.e));
            case TAN:
                return tan(unTermify2(e.e));
            case EXP:
                return exp(unTermify2(e.e));
            case LN:
                return ln(unTermify2(e.e));
            case LOG:
                return log(unTermify2(e.e));
            case NEG:
                return neg(unTermify2(e.e));
            case TERMS:
                return unTermify3(e.ts);
            default:
                return e;
        }
    }

    const unTermify3 = (es: Expression[]) : Expression => {
        let leftExpr = es[0];
        let rightExpr = es.length == 2 ? es[1] : unTermify3 (es.slice(1));
        return add(leftExpr, rightExpr);
    }

    let untermified = unTermify2(e);

    return areEqual(e, untermified) ? e : unTermify(untermified);
}  

// Returns an expression tree where certain negations have been removed
const unNeg = (e: Expression) : Expression => {
    switch(e.type) {
        case ADD:
            return matchNeg(e.e2) ? sub(unNeg(e.e1), unNeg(e.e2)) : add(unNeg(e.e1), unNeg(e.e2));
        case SUB:
            return matchNeg(e.e2) ? add(unNeg(e.e1), unNeg(e.e2)) : sub(unNeg(e.e1), unNeg(e.e2));
        case MUL:
            return mul(unNeg(e.e1), unNeg(e.e2));
        case DIV:
            return div(unNeg(e.e1), unNeg(e.e2));
        case POW:
            return pow(unNeg(e.e1), unNeg(e.e2));
        case COS:
            return cos(unNeg(e.e));
        case SIN:
            return sin(unNeg(e.e));
        case TAN:
            return tan(unNeg(e.e));
        case EXP:
            return exp(unNeg(e.e));
        case LN:
            return ln(unNeg(e.e));
        case LOG:
            return log(unNeg(e.e));
        case NEG:
            return e.e;
        default:
            return e;
    }
} 

const areEqual = (e1: Expression, e2: Expression) : boolean => {
    switch(e1.type) {
        case ADD:
        case SUB:
        case MUL:
        case DIV:
        case POW:
            return e2.type == e1.type ? areEqual(e1.e1, e2.e1) && areEqual(e1.e2, e2.e2) : false;
        case COS:
        case SIN:
        case TAN:
        case EXP:
        case LN:
        case LOG:
        case NEG:
            return e2.type == e1.type ? areEqual(e1.e, e2.e) : false;
        case NUM:
            return e2.type == e1.type ? e1.n === e2.n : false;
        case VAR:
            return e2.type == e1.type ? e1.v === e2.v : false;
        case TERMS:
            if (e2.type == TERMS && e1.ts.length == e2.ts.length) {
                for (let i = 0; i < e1.ts.length; i++) {
                    if (!areEqual(e1.ts[i], e2.ts[i])) {
                        return false;
                    }
                }
                return true;
            }
            return false;
        default:
            return false;
    }
}

export const test = { // Used only for testing
    simplifyTermList,
    unNegTerms,
    sortTerms,
    unTermify,
    simplify,
    areEqual,
    termify,
    unNeg
};

