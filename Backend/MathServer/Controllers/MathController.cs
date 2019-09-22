using MathServer.Models;
using Microsoft.AspNetCore.Mvc;

namespace DiffServer.Controllers
{
    [ApiController]
    public class MathController : ControllerBase
    {
        [HttpGet("simplify")]
        public ActionResult<string> Simplify(string expression)
        {
            return new ActionResult<string>(Api.evaluate(expression));
        }

        [HttpGet("diff")]
        public ActionResult<string> Diff(string expression, char variable)
        {
            return new ActionResult<string>(Api.differentiate(expression, variable));
        }
    }
}
