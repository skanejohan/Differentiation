module ExpressionUtils

open ExpressionTypes

// Returns an expression tree where all "Sub a b" have been replaced with "Add a (Neg b)"
let rec subToAdd expr =
    match expr with
        | Add (e1, e2) -> Add (subToAdd e1, subToAdd e2)
        | Sub (e1, e2) -> Add (subToAdd e1, Neg (subToAdd e2))
        | Mul (e1, e2) -> Mul (subToAdd e1, subToAdd e2)
        | Div (e1, e2) -> Div (subToAdd e1, subToAdd e2)
        | Pow (e1, e2) -> Pow (subToAdd e1, subToAdd e2)
        | Cos e        -> Cos (subToAdd e)
        | Sin e        -> Sin (subToAdd e)
        | Tan e        -> Tan (subToAdd e)
        | Exp e        -> Exp (subToAdd e)
        | Ln e         -> Ln  (subToAdd e)
        | Log e        -> Log (subToAdd e)
        | Neg e        -> Neg (subToAdd e)
        | e            -> e

//-- Returns an expression tree where subsequent Add operations have been combined into term lists
let rec termify e = 
    if subToAdd e = termify' (subToAdd e) then subToAdd e 
    else termify (termify' (subToAdd e))
and termify' expr =
    match expr with 
    | Add (e1, Add (e2, e3)) -> Terms [termify' e1; termify' e2; termify' e3]
    | Add (Add (e1, e2), e3) -> Terms [termify' e1; termify' e2; termify' e3]
    | Mul (e1, e2) ->           Mul (termify' e1, termify' e2)
    | Div (e1, e2) ->           Div (termify' e1, termify' e2)
    | Pow (e1, e2) ->           Pow (termify' e1, termify' e2)
    | Cos e ->                  Cos (termify' e)
    | Sin e ->                  Sin (termify' e)
    | Tan e ->                  Tan (termify' e)
    | Exp e ->                  Exp (termify' e)
    | Ln e ->                   Ln (termify' e)
    | Log e ->                  Log (termify' e)
    | Neg e ->                  Neg (termify' e)
    | Terms ts ->               Terms (termify'' ts)
    | anythingElse ->           anythingElse
and termify'' expr =
    match expr with
    | Add (e1, e2) :: xs -> e1 :: e2 :: xs //List.concat [[ e1; e2 ]; xs]
    | Terms es :: xs     -> List.concat [ es; xs]
    | e :: es            -> List.concat [ [e]; termify'' es]
    | []                 -> []

let rec unNegTerms expr =
    match expr with
    | Terms ts -> Terms (unNegTerms' ts)
    | e        -> e
and unNegTerms' expr =
    match expr with
    | Neg (Mul (Num n, e)) :: ts -> Mul (Num -n, e) :: unNegTerms' ts
    | t :: ts ->                    t :: unNegTerms' ts
    | [] ->                         []

// Returns an expression tree where term lists have been replaced with subsequent Add operations 
let rec unTermify expr = 
    if expr = unTermify' expr then expr 
    else unTermify (unTermify' expr)
and unTermify' expr =
    match expr with 
    | Add (e1, e2) -> Add (unTermify' e1, unTermify' e2)
    | Mul (e1, e2) -> Mul (unTermify' e1, unTermify' e2)
    | Div (e1, e2) -> Div (unTermify' e1, unTermify' e2)
    | Pow (e1, e2) -> Pow (unTermify' e1, unTermify' e2)
    | Cos e ->        Cos (unTermify' e)
    | Sin e ->        Sin (unTermify' e)
    | Tan e ->        Tan (unTermify' e)
    | Exp e ->        Exp (unTermify' e)
    | Ln e ->         Ln (unTermify' e)
    | Log e ->        Log (unTermify' e)
    | Neg e ->        Neg (unTermify' e)
    | Terms ts ->     unTermify'' ts
    | anythingElse -> anythingElse
and unTermify'' expr =
    match expr with
    | (t1 :: t2 :: []) -> Add (t1, t2)
    | (t1 :: ts)       -> Add (t1, unTermify'' ts)
    | _                -> Num 0 // Should not happen

// Returns an expression tree where certain negations have been removed
let rec unNeg expr =
    match expr with
    | Add (e1, Neg e2) -> Sub (unNeg e1, unNeg e2)
    | Add (e1, e2)     -> Add (unNeg e1, unNeg e2)
    | Sub (e1, Neg e2) -> Add (unNeg e1, unNeg e2)
    | Sub (e1, e2)     -> Sub (unNeg e1, unNeg e2)
    | Mul (e1, e2)     -> Mul (unNeg e1, unNeg e2)
    | Div (e1, e2)     -> Div (unNeg e1, unNeg e2)
    | Pow (e1, e2)     -> Pow (unNeg e1, unNeg e2)
    | Cos e            -> Cos (unNeg e)
    | Sin e            -> Sin (unNeg e)
    | Tan e            -> Tan (unNeg e)
    | Exp e            -> Exp (unNeg e)
    | Ln e             -> Ln (unNeg e)
    | Log e            -> Log (unNeg e)
    | Neg e            -> Neg (unNeg e)
    | anythingElse     -> anythingElse

// Returns an expression tree where all term lists have been sorted.
let rec sortTerms expr =
    match expr with
    | Add (e1, e2) -> Add (sortTerms e1, sortTerms e2)
    | Sub (e1, e2) -> Add (sortTerms e1, sortTerms e2)
    | Mul (e1, e2) -> Mul (sortTerms e1, sortTerms e2)
    | Div (e1, e2) -> Div (sortTerms e1, sortTerms e2)
    | Pow (e1, e2) -> Pow (sortTerms e1, sortTerms e2)
    | Cos e        -> Cos (sortTerms e)
    | Sin e        -> Sin (sortTerms e)
    | Tan e        -> Tan (sortTerms e)
    | Exp e        -> Exp (sortTerms e)
    | Ln e         -> Ln (sortTerms e)
    | Log e        -> Log (sortTerms e)
    | Neg e        -> Neg (sortTerms e)
    | Terms ts     -> Terms (List.rev (List.sortWith compareTerms ts))
    | anythingElse -> anythingElse
and compareTerms t1 t2 =
    match (t1, t2) with 
    | (Mul (Num _, Pow (Var _, Num e1)), Mul (Num _, Pow (Var _, Num e2))) -> compare e1 e2 // a*x^e1 > b*x^e2 if e1 > e2
    | (Mul (Num _, Pow (Var _, Num e1)), Pow (Var _, Num e2))              -> compare e1 e2 // a*x^e1 > x^e2 if e1 > e2
    | (Mul (Num _, Pow (Var _, Num e1)), Var _)                            -> compare e1 1  // a*x^e1 > x if e1 > 1
    | (Mul (Num _, Pow (Var _, Num e1)), _)                                -> GT            // a*x^e1 > anything else
    | (Pow (Var _, Num e1), Mul (Num _, Pow (Var _, Num e2)))              -> compare e1 e2 // x^e1 > b*x^e2 if e1 > e2
    | (Pow (Var _, Num e1), Pow (Var _, Num e2))                           -> compare e1 e2 // x^e1 > x^e2 if e1 > e2
    | (Pow (Var _, Num e1), Var _)                                         -> compare e1 1  // x^e1 > x if e1 > 1
    | (Pow (Var _, Num e1), _)                                             -> GT            // x^e1 > anything else
    | (Mul (Num _, Var _), Mul (Num _, Pow (Var _, Num e2)))               -> compare 1 e2  // a*x > b*x^e2 if e2 < 1
    | (Mul (Num _, Var _), Pow (Var _, Num e2))                            -> compare 1 e2  // a*x > x^e2 if e2 < 1
    | (Mul (Num _, Var _), Var _)                                          -> EQ            // a*x = x
    | (Mul (Num _, Var _), _)                                              -> GT            // a*x > anything else
    | (Var _, Mul (Num _, Pow (Var _, Num e2)))                            -> compare 1 e2  // x > b*x^e2 if e2 < 1
    | (Var _, Pow (Var _, Num e2))                                         -> compare 1 e2  // x > x^e2 if e2 < 1
    | (Var _, _)                                                           -> GT            // x > anything else
    | (Num _, Mul (Num _, Pow (Var _, Num e2)))                            -> LT            // a < b*x^e2
    | (Num _, Pow (Var _, Num e2))                                         -> LT            // a < x^e2
    | (Num _, Mul (Num _, Var _))                                          -> LT            // a < b*x
    | (Num _, Var _)                                                       -> LT            // a < x
    | (Num n1, Num n2)                                                     -> compare n1 n2 // a > b if numerically greater
    | (Num _, _)                                                           -> GT
    | (_, Num _)                                                           -> LT
    | _                                                                    -> EQ
and EQ = 0
and GT = 1
and LT = -1

// Returns an expression tree where certain simplifications have been made to the term lists
let rec simplifyTermList expr =
    match expr with
    | Add (e1,e2)  -> Add (simplifyTermList e1, simplifyTermList e2)
    | Sub (e1, e2) -> Add (simplifyTermList e1, simplifyTermList e2)
    | Mul (e1, e2) -> Mul (simplifyTermList e1, simplifyTermList e2)
    | Div (e1, e2) -> Div (simplifyTermList e1, simplifyTermList e2)
    | Pow (e1, e2) -> Pow (simplifyTermList e1, simplifyTermList e2)
    | Cos e        -> Cos (simplifyTermList e)
    | Sin e        -> Sin (simplifyTermList e)
    | Tan e        -> Tan (simplifyTermList e)
    | Exp e        -> Exp (simplifyTermList e)
    | Ln e         -> Ln (simplifyTermList e)
    | Log e        -> Log (simplifyTermList e)
    | Neg e        -> Neg (simplifyTermList e)
    | Terms ts     -> Terms (simplifyTermList' ts)
    | anythingElse -> anythingElse
and simplifyTermList' expr =
    match expr with
    | Mul (Num n1, Pow (Var v1, Num e1)) :: Mul (Num n2, Pow (Var v2, Num e2)) :: ts when v1 = v2 && e1 = e2 -> 
        Mul (Num (n1+n2), Pow (Var v1, Num e1)) :: simplifyTermList' ts
    | Num n1 ::Num n2 ::ts                                                                                   -> Num (n1+n2) :: simplifyTermList' ts
    | t ::ts                                                                                                 -> t :: simplifyTermList' ts
    | []                                                                                                     -> []

// Returns an expression tree where certain simplifications have been made
let rec simplify expr = 
    if expr = simplify' expr then expr 
    else simplify (simplify' expr)
and simplify' expr =
    match expr with 
    // Addition - general simplifications
    | Add (Num 0, e2) -> simplify' e2 // 0 + expression = expression
    | Add (e1, Num 0) -> simplify' e1 // expression + 0 = expression
    | Add (Num n1, Num n2) -> Num (n1 + n2) // n1 + n2 = their sum   
    | Add (Var v1, Var v2) when v1 = v2 -> Mul (Num 2, Var v1) // x + x = 2 * x
    | Add (Pow (Var v1, Num e1), Pow (Var v2, Num e2)) when v1 = v2 && e1 = e2 -> Mul (Num 2, Pow (Var v1, Num e1)) // x^3 + x^3 = 2 * x^3
    | Add (Mul (Num n1, Pow (Var v1, Num e1)), Pow (Var v2, Num e2)) when v1 = v2 && e1 = e2 -> Mul (Num (n1+1), Pow (Var v1, Num e1)) // 7*x^3 + x^3 = 8 * x^3
    | Add (Mul (Num n1, Pow (Var v1, Num e1)), Mul (Num n2, Pow (Var v2, Num e2))) when v1 = v2 && e1 = e2 -> Mul (Num (n1+n2), Pow (Var v1, Num e1)) // 4 * x^2 + 3 * x^2 = 7 * x^2
    | Add (Var v1, Mul (Num n, Var v2)) when v1 = v2 -> Mul (Num (n+1), Var v2) // x + 3 * x = 4 * x
    | Add (Mul (Num n, Var v1), Var v2) when v1 = v2 -> Mul (Num (n+1), Var v2) // 3 * x + x = 4 * x
    | Add (Mul (Num n1, Var v1), Mul (Num n2, Var v2)) when v1 = v2 -> Mul (Num (n1+n2), Var v2) //  5 * x + 3 * x = 8 *x
    // Addition - ordering of polynomials
    | Add (Num n, Var v) -> Add (Var v, Num n) // 3 + x -> x + 3
    | Add (Num n1, Mul (Num n2, Var v)) -> Add (Mul (Num n2, Var v), Num n1) // 3 + 2 * x -> 2 * x + 3
    | Add (Num n1, Pow (Var v, Num n2)) -> Add (Pow (Var v, Num n2), Num n1) // 3 + x^2 -> x^2 + 3
    | Add (Num n1, Mul (Num n2, Pow (Var v, Num n3))) -> Add (Mul (Num n2, Pow (Var v, Num n3)), Num n1) // 3 + 2 * x^3 -> 2 * x^3 + 3
    | Add (Var v1, Pow (Var v2, Num n2)) when v1 = v2 -> Add (Pow (Var v2, Num n2), Var v1) // x + x^2 -> x^2 + x
    | Add (Var v1, Mul (Num n1, Pow (Var v2, Num n2))) when v1 = v2 -> Add (Mul (Num n1, Pow (Var v2, Num n2)), Var v1) // x + 2 * x^3 -> 2 * x^3 + x
    | Add (Mul (Num n1, Var v1), Pow (Var v2, Num n3)) when v1 = v2 -> Add (Pow (Var v2, Num n3), Mul (Num n1, Var v1)) // 4 * x + x^2 -> x^2 + 4 * x
    | Add (Mul (Num n1, Var v1), Mul (Num n2, Pow (Var v2, Num n3))) when v1 = v2 -> Add (Mul (Num n2, Pow (Var v2, Num n3)), Mul (Num n1, Var v1)) // 4 * x + 3 * x^2 -> 3 * x^2 + 4 * x
    | Add (Pow (Var v1, Num n1), Pow (Var v2, Num n2)) when v1 = v2 && n1 < n2 -> Add (Pow (Var v2, Num n2), Pow (Var v1, Num n1)) // x^2 + x^3 -> x^3 + x^2
    | Add (Pow (Var v1, Num n1), Mul (Num n2, Pow (Var v2, Num n3))) when v1 = v2 && n1 < n3 -> Add (Mul (Num n2, Pow (Var v2, Num n3)), Pow (Var v1, Num n1)) // x^2 + 2 * x^3 -> 2 * x^3 + x^2
    | Add (Mul (Num n1, Pow (Var v1, Num e1)), Pow (Var v2, Num e2)) when v1 = v2 && e1 < e2 -> Add (Pow (Var v2, Num e2), Mul (Num n1, Pow (Var v1, Num e1))) // 2 * x^2 + x^3 -> x^3 + 2 * x^2
    | Add (Mul (Num n1, Pow (Var v1, Num e1)), Mul (Num n2, Pow (Var v2, Num e2))) when v1 = v2 && e1 < e2 -> Add (Mul (Num n2, Pow (Var v2, Num e2)), Mul (Num n1, Pow (Var v1, Num e1))) // 2 * x^2 + 2 * x^3 -> 2 * x^3 + 2 * x^2
    // Addition - for all others, just simplify the sub-expressions
    | Add (e1, e2) -> Add (simplify' e1, simplify' e2)
    // Subtraction
    | Sub (Num 0, e2) -> Neg(simplify' e2) // 0 - expression = -expression
    | Sub (e1, Num 0) -> simplify' e1 // expression - 0 = expression
    | Sub (Num n1, Num n2) -> Num (n1 - n2) // n1 - n2 = their difference
    | Sub (Var v1, Var v2) when v1 = v2 -> Num 0 // x - x = 0
    // Subtraction - for all others, just simplify the sub-expressions
    | Sub (e1, e2) -> Sub (simplify' e1, simplify' e2)
    // Multiplication
    | Mul (_, Num 0) -> Num 0 // 7 * 0 = 0
    | Mul (Num 0, _) -> Num 0 // 0 * 5 = 0
    | Mul (e1, Num 1) -> simplify' e1 // 7 * 1 = 7
    | Mul (Num 1, e2) -> simplify' e2 // 1 * 5 = 5
    | Mul (Num n1, Num n2) -> Num (n1*n2) // 7 * 5 = 35
    | Mul (Num n1, Mul (Num n2, e2)) -> Mul (Num (n1*n2), e2) // 7 * 5 * expression = 35 * expression
    | Mul (Mul (Num n1, e1), Num n2) -> Mul (Num (n1*n2), e1) // 7 * expression * 5 = 35 * expression
    | Mul (Neg (Num 1), e2) -> Neg (simplify' e2) // -1 * expression = -expression
    | Mul (e1, Neg (Num 1)) -> Neg (simplify' e1) // expression * -1 = -expression
    | Mul (Var v1, Var v2) when v1 = v2 -> Pow (Var v1, Num 2) // x * x = x^2    
    | Mul (Mul (Num n1, Var v1), Var v2) when v1 = v2 -> Mul (Num n1, Pow (Var v1, Num 2)) // 5 * x * x = 5 * x^2    
    | Mul (Var v1, Pow (Var v2, Num n)) when v1 = v2 -> Pow (Var v1, Num (n+1)) // x * x^3 = x^4    
    | Mul (Pow (Var v1, Num n), Var v2) when v1 = v2 -> Pow (Var v1, Num (n+1)) // x^5 * x = x^6    
    | Mul (Pow (Var v1, Num n1), Pow (Var v2, Num n2)) when v1 = v2 -> Pow (Var v1, Num (n1+n2)) // x^5 * x^2 = x^7    
    | Mul (e1, e2) -> Mul (simplify' e1, simplify' e2)
    // Division
    | Div (e1, e2) -> Div (simplify' e1, simplify' e2)
    // Power, trigonometric functions, logarithms, negation
    | Pow (e1, Num 1) -> simplify' e1 // x ^ 1 = x
    // TODO ? | Pow (e1, Num 0) -> Num 1 // x ^ 0 = 1
    | Pow (e1, e2) -> Pow (simplify' e1, simplify' e2)
    | Cos e -> Cos (simplify' e)
    | Sin e -> Sin (simplify' e)
    | Tan e -> Tan (simplify' e)
    | Exp e -> Exp (simplify' e)
    | Ln e -> Ln (simplify' e)
    | Log e -> Log (simplify' e)
    | Neg (Neg e) -> simplify' e
    | Neg e -> Neg (simplify' e)
    | e -> e

// clean returns an expression tree that has been maximally simplified
let clean = simplify >> unNeg >> unTermify >> simplifyTermList >> sortTerms >> unNegTerms >> termify >> simplify

//-- repr returns a "readable" string representing the expression
//repr :: Expression -> String
//repr (Add e1 e2) = repr e1 ++ "+" ++ repr e2
//repr (Sub e1 e2) = repr e1 ++ "-" ++ repr e2
//repr (Mul e1 e2) = repr e1 ++ "*" ++ repr e2
//repr (Div e1 e2) = repr e1 ++ "/" ++ repr e2
//repr (Pow e1 e2) = repr e1 ++ "^" ++ repr e2
//repr (Cos e)     = "cos(" ++ repr e ++ ")"
//repr (Sin e)     = "sin(" ++ repr e ++ ")"
//repr (Tan e)     = "tan(" ++ repr e ++ ")"
//repr (Exp e)     = "exp(" ++ repr e ++ ")"
//repr (Ln e)      = "ln(" ++ repr e ++ ")"
//repr (Log e)     = "log(" ++ repr e ++ ")"
//repr (Num i)     = show i
//repr (Var v)     = v
//repr (Neg e)     = "-" ++ repr e
//repr (Terms ts)  = "[" ++ concat (map repr ts) ++ "]"

//-- repr' returns a string representing the expression tree
//repr' ind (Add e1 e2) = indent ind ++ "ADD\n" ++ repr' (ind + 2) e1 ++ repr' (ind + 2) e2
//repr' ind (Sub e1 e2) = indent ind ++ "SUB\n" ++ repr' (ind + 2) e1 ++ repr' (ind + 2) e2
//repr' ind (Mul e1 e2) = indent ind ++ "MUL\n" ++ repr' (ind + 2) e1 ++ repr' (ind + 2) e2
//repr' ind (Div e1 e2) = indent ind ++ "DIV\n" ++ repr' (ind + 2) e1 ++ repr' (ind + 2) e2
//repr' ind (Pow e1 e2) = indent ind ++ "POW\n" ++ repr' (ind + 2) e1 ++ repr' (ind + 2) e2
//repr' ind (Cos e)     = indent ind ++ "COS\n" ++ repr' (ind + 2) e
//repr' ind (Sin e)     = indent ind ++ "SIN\n" ++ repr' (ind + 2) e
//repr' ind (Tan e)     = indent ind ++ "TAN\n" ++ repr' (ind + 2) e
//repr' ind (Exp e)     = indent ind ++ "EXP\n" ++ repr' (ind + 2) e
//repr' ind (Ln e)      = indent ind ++ "LN\n"  ++ repr' (ind + 2) e
//repr' ind (Log e)     = indent ind ++ "LOG\n" ++ repr' (ind + 2) e
//repr' ind (Num n)     = indent ind ++ "NUM: " ++ show n ++ "\n"
//repr' ind (Var v)     = indent ind ++ "VAR: " ++ v ++ "\n"
//repr' ind (Neg e)     = indent ind ++ "NEG\n" ++ repr' (ind + 2) e
//repr' ind (Terms ts)  = indent ind ++ "TERMS\n" ++ concat (map (repr' (ind + 2)) ts)
//indent ind = map (\_ -> ' ') [1..ind]

//-- mathjax returns a string representing the expression formatted for use with MathJax
//mathjax (Add e1 e2) = mathjax e1 ++ "+" ++ mathjax e2
//mathjax (Sub e1 e2) = mathjax e1 ++ "-" ++ mathjax e2
//mathjax (Mul e1 e2) = mathjax e1 ++ "*" ++ mathjax e2
//mathjax (Div e1 e2) = "\\frac{" ++ mathjax e1 ++ "}{" ++ mathjax e2 ++ "}" 
//mathjax (Pow e1 e2) = mathjax e1 ++ "^" ++ mathjax e2
//mathjax (Cos e)     = "cos(" ++ mathjax e ++ ")"
//mathjax (Sin e)     = "sin(" ++ mathjax e ++ ")"
//mathjax (Tan e)     = "tan(" ++ mathjax e ++ ")"
//mathjax (Exp e)     = "exp(" ++ mathjax e ++ ")"
//mathjax (Ln e)      = "ln(" ++ mathjax e ++ ")"
//mathjax (Log e)     = "log(" ++ mathjax e ++ ")"
//mathjax (Num i)     = show i
//mathjax (Var v)     = v
//mathjax (Neg e)     = "-" ++ mathjax e
