
import { _var, add, cos, div, exp, Expression, mul, neg, num, pow, sin, sub } from "./math.expressions";

export const diff = (e : Expression, v : string) : Expression => {
    switch(e.type) {
        case "add":
            return add(diff(e.e1, v), diff(e.e2, v));
        case "sub":
            return sub(diff(e.e1, v), diff(e.e2, v));
        case "mul":
            return add (mul (diff(e.e1, v), e.e2), mul(e.e1, diff(e.e2, v)))
        case "div":
            let numerator = sub (mul (diff(e.e1, v), e.e2), mul (e.e1, diff(e.e2, v)));
            let denominator = pow(e.e2, num(2))
            return div (numerator, denominator);
        case "pow":
            if (e.e2.type == "num")
            {
                return mul (mul (num(e.e2.n), pow (e.e1, num (e.e2.n-1))), diff(e.e1, v));
            }
            else 
            {
                throw new Error("Not implemented yet");
            }
        case "cos":
            return mul (neg (diff (e.e, v)), sin (e.e));
        case "sin":
            return mul (diff (e.e, v), cos (e.e));
        case "tan":
            return div (diff (e.e, v), pow (cos (e.e), num(2)));
        case "exp":
            return mul (diff (e.e, v), exp (e.e));
        case "ln":
            return div (diff (e.e, v), e.e);
        case "log":
            throw new Error("Not implemented yet");
        case "num":
            return num(0);
        case "var":
            return e.v == v ? num(1) : _var(e.v)
        case "neg":
            return neg (diff (e.e, v));
        default: 
            return e;
    }
}
