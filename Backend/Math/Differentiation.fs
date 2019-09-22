module Differentiation

open ExpressionTypes

let rec diff var expr =
    match expr with
    | Add (e1, e2)       -> Add (diff var e1, diff var e2)
    | Sub (e1, e2)       -> Sub (diff var e1, diff var e2)
    | Mul (e1, e2)       -> Add (Mul (diff var e1, e2), Mul (e1, diff var e2))
    | Div (e1, e2)       ->
        let numerator = Sub (Mul (diff var e1, e2), Mul (e1, diff var e2))
        let denominator = Pow (e2, Num 2)
        Div (numerator, denominator)
    | Pow (e, Num n)     -> Mul (Mul (Num n, Pow (e, Num (n-1))), diff var e)
    | Pow (e1, e2)       -> failwith "Not implemented yet"
    | Cos e              -> Mul (Neg (diff var e), Sin e)
    | Sin e              -> Mul (diff var e, Cos e)
    | Tan e              -> Div (diff var e, Pow (Cos e, Num 2))
    | Exp e              -> Mul (diff var e, Exp e)
    | Ln e               -> Div (diff var e, e) 
    | Log e              -> failwith "Not implemented yet"
    | Num _              -> Num 0
    | Var v when var = v -> Num 1
    | Var v              -> Var v
    | Neg e              -> Neg (diff var e)
    | anythingElse       -> anythingElse
