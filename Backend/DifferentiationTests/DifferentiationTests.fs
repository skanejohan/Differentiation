namespace Tests

open NUnit.Framework
open ExpressionParser
open ExpressionUtils
open Differentiation
open FParsec

[<DifferentiationTest>]
type DifferentiationTest () =

    member this.assertParser var input output =
        match run pExpr input with
        | Success (result, _, _) -> Assert.AreEqual(output, (clean (diff var result)).ToString())
        | Failure (msg, _, _) -> Assert.Fail(msg)

    [<Test>]
    member this.Polynomials () =
        this.assertParser 'x' "5" "Num 0"
        this.assertParser 'x' "x" "Num 1"
        this.assertParser 'y' "x" "Var 'x'"
        this.assertParser 'x' "-x" "Neg (Num 1)"
        this.assertParser 'x' "x^2" "Mul (Num 2,Var 'x')"
        this.assertParser 'x' "x*x" "Mul (Num 2,Var 'x')"
        this.assertParser 'x' "x*x*x" "Mul (Num 3,Pow (Var 'x',Num 2))"
        this.assertParser 'x' "x*x*x+x*x*x" "Mul (Num 6,Pow (Var 'x',Num 2))"
        this.assertParser 'x' "2*x+3*x^2" "Add (Mul (Num 6,Var 'x'),Num 2)"
        this.assertParser 'x' "5*x^4+3*x^3+6*x^2+15*x+3" "Add\n  (Mul (Num 20,Pow (Var 'x',Num 3)),\n   Add (Mul (Num 9,Pow (Var 'x',Num 2)),Add (Mul (Num 12,Var 'x'),Num 15)))"

    [<Test>]
    member this.Trigonometry () =
        this.assertParser 'x' "sin(x)" "Cos (Var 'x')"
        this.assertParser 'x' "cos(x)" "Neg (Sin (Var 'x'))"
        this.assertParser 'x' "tan(x)" "Div (Num 1,Pow (Cos (Var 'x'),Num 2))"
        this.assertParser 'x' "4*x^3+sin(2*x)+3" "Add (Mul (Num 12,Pow (Var 'x',Num 2)),Mul (Num 2,Cos (Mul (Num 2,Var 'x'))))"
        this.assertParser 'x' "cos(cos(x))" "Mul (Sin (Var 'x'),Sin (Cos (Var 'x')))"
     