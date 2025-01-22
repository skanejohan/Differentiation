import { ADD, MUL, NEG, NUM, POW, TERMS, VAR } from "./math.constants"
import { Expression } from "./math.expressions"

// NUM (n) => { n } | null
export const matchNum = (e: Expression) : { n : number } | null => { return e.type == NUM ? { n : e.n } : null }

// VAR (v) => v | null
export const matchVar = (e: Expression) : string | null => { return e.type == VAR ? e.v : null }

// NEG (e) => e | null
export const matchNeg = (e: Expression) : Expression | null => { return e.type == NEG ? e.e : null }

// NEG ( NUM (n) ) => { n : n } | null
export const matchNegNum = (e: Expression) : { n : number } | null => { return e.type == NEG && e.e.type == NUM ? { n : e.e.n } : null }

// ADD ( ex1, ex2 ) => { ex1, ex2 } | null
export const matchAdd = (ex: Expression) : { ex1 : Expression, ex2 : Expression } | null => {
    return ex.type == ADD ? { ex1 : ex.e1, ex2 : ex.e2 } : null;
}

// MUL ( ex1, ex2 ) => { ex1, ex2 } | null
export const matchMul = (ex: Expression) : { ex1 : Expression, ex2 : Expression } | null => {
    return ex.type == MUL ? { ex1 : ex.e1, ex2 : ex.e2 } : null;
}

// TERMS ( exs ) => exs | null
export const matchTerms = (ex: Expression) : Expression[] | null => {
    return ex.type == TERMS ? ex.ts : null;
}

// POW ( VAR (v) , NUM (e) ) => { v, e } | null
export const matchPowVarNum = (ex: Expression) : { v : string, e : number } | null => {
    let v, e;
    return ex.type == POW && (v = matchVar(ex.e1)) && (e = matchNum(ex.e2)) ? { v : v, e : e.n } : null;
}

// MUL ( NUM (n), ex ) => { n, ex } | null
export const matchMulNumExpr = (ex: Expression) : { n : number, ex: Expression } | null => {
    let n;
    return ex.type == MUL && (n = matchNum(ex.e1)) ? { n : n.n, ex : ex.e2 } : null;
}

// MUL ( ex, NUM (n) ) => { n, ex } | null
export const matchMulExprNum = (ex: Expression) : { n : number, ex: Expression } | null => {
    let n;
    return ex.type == MUL && (n = matchNum(ex.e2)) ? { n : n.n, ex : ex.e1 } : null;
}

// MUL ( NUM (n), VAR(v) ) => { n, v } | null
export const matchMulNumVar = (ex: Expression) : { n : number, v : string } | null => {
    let m1, m2;
    return (m1 = matchMulNumExpr(ex)) && (m2 = matchVar(m1.ex)) ? { n : m1.n, v : m2 } : null;
}

// MUL ( NUM (n) , POW ( VAR (v) , NUM (e) ) ) => { n, v, e } | null
export const matchMulNumPowVarNum = (ex: Expression) : { n : number, v : string, e : number } | null => {
    let n, pvn;
    return ex.type == MUL && (n = matchNum(ex.e1)) && (pvn = matchPowVarNum(ex.e2)) ? { n : n.n, v : pvn.v, e : pvn.e } : null;
}

// NEG ( MUL ( NUM (n), EXPR ) ) => { n, EXPR } | null
export const matchNegMulNumExpr = (e: Expression) : { n : number, ex : Expression } | null => {
    let e2;
    return e.type == NEG && (e2 = matchMulNumExpr(e.e)) ? e2 : null;
}
