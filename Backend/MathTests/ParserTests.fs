namespace Tests

open NUnit.Framework
open ExpressionParser
open ExpressionUtils
open FParsec

[<ParserTest>]
type ParserTest () =

    member this.assertParser input output =
        match run pExpr input with
        | Success (result, _, _) -> Assert.AreEqual(output, (clean result).ToString())
        | Failure (msg, _, _) -> Assert.Fail(msg)

    [<Test>]
    member this.NumAndVar () =
        this.assertParser "x"       "Var 'x'"
        this.assertParser " y "     "Var 'y'"
        this.assertParser "  z  "   "Var 'z'"
        this.assertParser "75"      "Num 75"
        this.assertParser "  78  "  "Num 78"
        this.assertParser "-1654"   "Neg (Num 1654)"
        this.assertParser "  -15  " "Neg (Num 15)"
     
    [<Test>]
    member this.Addition () =
        this.assertParser "3+x"   "Add (Var 'x',Num 3)"
        this.assertParser "3+3"   "Num 6"
        this.assertParser "x+x"   "Mul (Num 2,Var 'x')"
        this.assertParser "x+x+x" "Mul (Num 3,Var 'x')"

    [<Test>]
    member this.Multiplication () =
        this.assertParser "3*4"   "Num 12"
        this.assertParser "3*4*5" "Num 60"
        this.assertParser "-1*x" "Neg (Var 'x')"

    [<Test>]
    member this.AdditionAndMultiplication () =
        this.assertParser "3*4+5"   "Num 17"
        this.assertParser "2*x+x"   "Mul (Num 3,Var 'x')"
        this.assertParser "x+2*x"   "Mul (Num 3,Var 'x')"
        this.assertParser "2*x+2*x" "Mul (Num 4,Var 'x')"

    [<Test>]
    member this.Subtraction () =
        this.assertParser "x-3"   "Sub (Var 'x',Num 3)"
        this.assertParser "3-x"   "Sub (Num 3,Var 'x')"
        this.assertParser "3-3"   "Num 0"
        this.assertParser "x-x"   "Num 0"
        this.assertParser "2*x-3" "Sub (Mul (Num 2,Var 'x'),Num 3)"
        this.assertParser "3-2*x" "Sub (Num 3,Mul (Num 2,Var 'x'))"

    [<Test>]
    member this.Pow () =
        this.assertParser "x^2"  "Pow (Var 'x',Num 2)"

    [<Test>]
    member this.Polynomials () =
        this.assertParser "4*x^2"       "Mul (Num 4,Pow (Var 'x',Num 2))"
        this.assertParser "x+3"         "Add (Var 'x',Num 3)"
        this.assertParser "3+x"         "Add (Var 'x',Num 3)"
        this.assertParser "2*x+3"       "Add (Mul (Num 2,Var 'x'),Num 3)"
        this.assertParser "3+2*x"       "Add (Mul (Num 2,Var 'x'),Num 3)"
        this.assertParser "x^2+3"       "Add (Pow (Var 'x',Num 2),Num 3)"
        this.assertParser "3+x^2"       "Add (Pow (Var 'x',Num 2),Num 3)"
        this.assertParser "2*x^3+3"     "Add (Mul (Num 2,Pow (Var 'x',Num 3)),Num 3)"
        this.assertParser "3+2*x^3"     "Add (Mul (Num 2,Pow (Var 'x',Num 3)),Num 3)"
        this.assertParser "x^2+x"       "Add (Pow (Var 'x',Num 2),Var 'x')"
        this.assertParser "x+x^2"       "Add (Pow (Var 'x',Num 2),Var 'x')"
        this.assertParser "2*x^3+x"     "Add (Mul (Num 2,Pow (Var 'x',Num 3)),Var 'x')"
        this.assertParser "x+2*x^3"     "Add (Mul (Num 2,Pow (Var 'x',Num 3)),Var 'x')"
        this.assertParser "x^2+4*x"     "Add (Pow (Var 'x',Num 2),Mul (Num 4,Var 'x'))"
        this.assertParser "4*x+x^2"     "Add (Pow (Var 'x',Num 2),Mul (Num 4,Var 'x'))"
        this.assertParser "2*x^3+3*x"   "Add (Mul (Num 2,Pow (Var 'x',Num 3)),Mul (Num 3,Var 'x'))"
        this.assertParser "3*x+2*x^3"   "Add (Mul (Num 2,Pow (Var 'x',Num 3)),Mul (Num 3,Var 'x'))"
        this.assertParser "x^3+x^2"     "Add (Pow (Var 'x',Num 3),Pow (Var 'x',Num 2))"
        this.assertParser "x^2+x^3"     "Add (Pow (Var 'x',Num 3),Pow (Var 'x',Num 2))"
        this.assertParser "2*x^3+x^2"   "Add (Mul (Num 2,Pow (Var 'x',Num 3)),Pow (Var 'x',Num 2))"
        this.assertParser "x^2+2*x^3"   "Add (Mul (Num 2,Pow (Var 'x',Num 3)),Pow (Var 'x',Num 2))"
        this.assertParser "x^3+2*x^2"   "Add (Pow (Var 'x',Num 3),Mul (Num 2,Pow (Var 'x',Num 2)))"
        this.assertParser "2*x^2+x^3"   "Add (Pow (Var 'x',Num 3),Mul (Num 2,Pow (Var 'x',Num 2)))"
        this.assertParser "2*x^3+2*x^2" "Add (Mul (Num 2,Pow (Var 'x',Num 3)),Mul (Num 2,Pow (Var 'x',Num 2)))"
        this.assertParser "2*x^2+2*x^3" "Add (Mul (Num 2,Pow (Var 'x',Num 3)),Mul (Num 2,Pow (Var 'x',Num 2)))"
        this.assertParser "4*x^2+9*x+3" "Add (Mul (Num 4,Pow (Var 'x',Num 2)),Add (Mul (Num 9,Var 'x'),Num 3))"
        this.assertParser "4*x^2+3+9*x" "Add (Mul (Num 4,Pow (Var 'x',Num 2)),Add (Mul (Num 9,Var 'x'),Num 3))"
        this.assertParser "3+9*x+4*x^2" "Add (Mul (Num 4,Pow (Var 'x',Num 2)),Add (Mul (Num 9,Var 'x'),Num 3))"
        this.assertParser "3+4*x^2+9*x" "Add (Mul (Num 4,Pow (Var 'x',Num 2)),Add (Mul (Num 9,Var 'x'),Num 3))"
        this.assertParser "9*x+4*x^2+3" "Add (Mul (Num 4,Pow (Var 'x',Num 2)),Add (Mul (Num 9,Var 'x'),Num 3))"
        this.assertParser "9*x+3+4*x^2" "Add (Mul (Num 4,Pow (Var 'x',Num 2)),Add (Mul (Num 9,Var 'x'),Num 3))"
        this.assertParser "4*x^2+x^2"   "Mul (Num 5,Pow (Var 'x',Num 2))"
        this.assertParser "4*x^2+3*x^2" "Mul (Num 7,Pow (Var 'x',Num 2))"
        this.assertParser "x*x*x+x*x*x" "Mul (Num 2,Pow (Var 'x',Num 3))"
        
    [<Test>]
    member this.Trigonometry () =
        this.assertParser "sin(5*x)"        "Sin (Mul (Num 5,Var 'x'))"
        this.assertParser " sin ( 5 * x ) " "Sin (Mul (Num 5,Var 'x'))"
        this.assertParser "sin(4*x+3)"      "Sin (Add (Mul (Num 4,Var 'x'),Num 3))"

    [<Test>]
    member this.Complex () =
        this.assertParser " sin ( 4 * x ^ 2 + 5 * x ) + cos ( tan ( 3 * x ) ) " "Add\n  (Sin (Add (Mul (Num 4,Pow (Var 'x',Num 2)),Mul (Num 5,Var 'x'))),\n   Cos (Tan (Mul (Num 3,Var 'x'))))"
