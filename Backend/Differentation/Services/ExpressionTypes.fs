module ExpressionTypes

type Expression = 
  | Add of Expression * Expression
  | Sub of Expression * Expression
  | Mul of Expression * Expression
  | Div of Expression * Expression
  | Pow of Expression * Expression
  | Cos of Expression
  | Sin of Expression
  | Tan of Expression
  | Exp of Expression
  | Ln of Expression 
  | Log of Expression
  | Neg of Expression
  | Num of int
  | Var of string
  | Terms of List<Expression>
