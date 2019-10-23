module ExpressionParser

open ExpressionTypes
open FParsec

type EParser = Parser<Expression,unit>

let pExpr, pExprRef : EParser * EParser ref  = createParserForwardedToRef<Expression, unit>()

let pFun name = // Parse a one-parameter function, e.g. sin, cos, ...
    let lead = spaces >>. pstring name >>. spaces >>. pstring "(" >>. spaces 
    let trail = spaces .>> pstring ")" .>> spaces 
    lead >>. pExpr .>> trail

let parens = pstring "(" >>. pExpr .>> pstring ")"

let opp = new OperatorPrecedenceParser<Expression,unit,unit>()
opp.AddOperator(InfixOperator("+", spaces, 1, Associativity.Left, fun x y -> Add(x, y)))
opp.AddOperator(InfixOperator("-", spaces, 1, Associativity.Left, fun x y -> Sub(x, y)))
opp.AddOperator(InfixOperator("*", spaces, 2, Associativity.Left, fun x y -> Mul(x, y)))
opp.AddOperator(InfixOperator("/", spaces, 2, Associativity.Left, fun x y -> Div(x, y)))
opp.AddOperator(InfixOperator("^", spaces, 3, Associativity.Left, fun x y -> Pow(x, y)))
opp.AddOperator(PrefixOperator("-", spaces, 4, true, fun x -> Neg(x)))

let pCos : EParser = pFun "cos" |>> Cos
let pSin : EParser = pFun "sin" |>> Sin
let pTan : EParser = pFun "tan" |>> Tan
let pExp : EParser = pFun "exp" |>> Exp
let pLn : EParser = pFun "ln" |>> Ln
let pLog : EParser = pFun "log" |>> Log
let pNum : EParser = spaces >>. pint32 .>> spaces |>> Num
let pVar : EParser = spaces >>. asciiLetter .>> spaces |>> Var

opp.TermParser <- 
    pCos <|> 
    pSin <|> 
    pTan <|> 
    pExp <|> 
    pLn <|> 
    pLog <|> 
    pCos <|> 
    pCos <|> 
    pNum <|> 
    pVar <|>
    parens

do pExprRef := spaces >>. opp.ExpressionParser
