var api = (function() {

    const url = "http://213.188.154.144:5002/";
  
    var get = function(path, success, error) {
      $.ajax({
        success: success,
        error: error,
        type: 'GET',
        url: url + path,
      });
    };
  
    var api = {};

    api.simplify = function(expr, success, error) {
      get(`simplify?expression=${expr}`, success, error);
    }

    api.diff = function(expr, variable, success, error) {
      get(`diff?expression=${expr}&variable=${variable}`, success, error);
    }

    return api;
})();
  
function simplifyExpression(expr) {
  api.simplify(expr, 
  data => {
      $("#ResultDiv").html("$f(x)=" + data + "$")
      MathJax.Hub.Queue(["Typeset",MathJax.Hub,"ResultDiv"]);
  },
  error => console.log(error));
}

function diffExpression(expr, variable) {
  api.diff(expr, variable, 
  data => {
      $("#ResultDiv").html("$\\frac{d}{dx}f(x)=" + data + "$")
      MathJax.Hub.Queue(["Typeset",MathJax.Hub,"ResultDiv"]);
  },
  error => console.log(error));
}


function display(){
    $.ajax({
        url: "http://213.188.154.144/diff?v=x&e=" + encodeURIComponent($("#ExpressionInput").val())
    }).done(function(data){
        $("#ResultDiv").html("$\\frac{d}{dx}f(x)=" + data + "$")
        MathJax.Hub.Queue(["Typeset",MathJax.Hub,"ResultDiv"]);
    })
}
