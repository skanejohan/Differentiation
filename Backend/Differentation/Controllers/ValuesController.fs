namespace Differentation.Controllers

open Microsoft.AspNetCore.Mvc
open FParsec
open ExpressionParser
open ExpressionUtils
open Differentiation

[<CLIMutable>]
type DataModel = { expression : string; variable : char }

[<ApiController>]
type ValuesController () =
    inherit ControllerBase()

    [<HttpGet("simplify")>]
    member this.Simplify([<FromBody>] value:string) =
        match run pExpr value with
        | Success (result, _, _) -> ActionResult<string>((clean result).ToString())
        | Failure (msg, _, _)    -> ActionResult<string>(msg)
    
    [<HttpGet("diff")>]
    member this.Diff([<FromBody>] value:DataModel) =
        match run pExpr value.expression with
        | Success (result, _, _) -> ActionResult<string>((clean (diff value.variable result)).ToString())
        | Failure (msg, _, _)    -> ActionResult<string>(msg)
