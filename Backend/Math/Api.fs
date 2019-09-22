module Api

open FParsec
open ExpressionUtils
open ExpressionParser
open Differentiation

let evaluate expr = 
    match run pExpr expr with
    | Success (result, _, _) -> mathjax (clean result)
    | Failure (msg, _, _)    -> msg

let differentiate expr variable =
    match run pExpr expr with
    | Success (result, _, _) -> mathjax (clean (diff variable result))
    | Failure (msg, _, _)    -> msg

