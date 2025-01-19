// /* 
// expr     ::= "cos" <brackets>
//          |   "sin" <brackets>
//          |   "tan" <brackets>
//          |   "exp" <brackets>
//          |   "log" <brackets>
//          |   "ln" <brackets>
// term     ::= <pow> "+" <Term>
//          |   <pow> "-" <Term>
//          |   <pow>
// pow      ::= <factor> "^" <Term>
//          |   <factor>
// factor   ::= <brackets> "*" <factor>
//          |   <brackets> "/" <factor>
//          |   <brackets>
//          |   "-" <expr>
//          |   <variable> 
//          |   <number>
// brackets ::= "(" <term> ")"
// variable ::= <alpha> <variable>
//          |   <alpha>
// alpha    ::= "a".."z", "A".."Z"
// number   ::= <integer> "." <integer> 
//          |   <integer>
// integer  ::= <digit> <integer> 
//          |   <digit>
// digit    ::= "0".."9"
// */

import * as constants from './math.constants'

export type Expression =
| { type: typeof constants.ADD; e1: Expression; e2: Expression }
| { type: typeof constants.SUB; e1: Expression; e2: Expression }
| { type: typeof constants.MUL; e1: Expression; e2: Expression }
| { type: typeof constants.DIV; e1: Expression; e2: Expression }
| { type: typeof constants.POW; e1: Expression; e2: Expression }
| { type: typeof constants.SIN; e: Expression; }
| { type: typeof constants.COS; e: Expression; }
| { type: typeof constants.TAN; e: Expression; }
| { type: typeof constants.EXP; e: Expression; }
| { type: typeof constants.LOG; e: Expression; }
| { type: typeof constants.LN; e: Expression; }
| { type: typeof constants.NEG; e: Expression; }
| { type: typeof constants.NUM; n: number }
| { type: typeof constants.VAR; v: string }
| { type: typeof constants.TERMS; ts: Expression[] };

export const add = (e1: Expression, e2: Expression) => {
    let result : Expression = { e1: e1, e2: e2, type: constants.ADD };
    return result;
}

export const sub = (e1: Expression, e2: Expression) => {
    let result : Expression = { e1: e1, e2: e2, type: constants.SUB };
    return result;
}

export const mul = (e1: Expression, e2: Expression) => {
    let result : Expression = { e1: e1, e2: e2, type: constants.MUL };
    return result;
}

export const div = (e1: Expression, e2: Expression) => {
    let result : Expression = { e1: e1, e2: e2, type: constants.DIV };
    return result;
}

export const pow = (e1: Expression, e2: Expression) => {
    let result : Expression = { e1: e1, e2: e2, type: constants.POW };
    return result;
}

export const cos = (e: Expression) => {
    let result : Expression = { e: e, type: constants.COS };
    return result;
}

export const sin = (e: Expression) => {
    let result : Expression = { e: e, type: constants.SIN };
    return result;
}

export const tan = (e: Expression) => {
    let result : Expression = { e: e, type: constants.TAN };
    return result;
}

export const exp = (e: Expression) => {
    let result : Expression = { e: e, type: constants.EXP };
    return result;
}

export const ln = (e: Expression) => {
    let result : Expression = { e: e, type: constants.LN };
    return result;
}

export const log = (e: Expression) => {
    let result : Expression = { e: e, type: constants.LOG };
    return result;
}

export const neg = (e: Expression) => {
    let result : Expression = { e: e, type: constants.NEG };
    return result;
}

export const num = (n: number) : Expression  => { return { n: n, type: constants.NUM }; } 

export const _var = (v: string) => {
    let result : Expression = { v: v, type: constants.VAR };
    return result;
} 

export const terms = (ts: Expression[]) => {
    let result : Expression = { ts: ts, type: constants.TERMS };
    return result;
} 
