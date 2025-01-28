export function render(text, output) {
  output.innerHTML = '';
  MathJax.texReset();
  var options = MathJax.getMetricsFor(output);
  MathJax.tex2chtmlPromise(text, options).then(function (node) {
    output.appendChild(node);
    MathJax.startup.document.clear();
    MathJax.startup.document.updateDocument();
  }).catch(function (err) {
    output.appendChild(document.createElement('pre')).appendChild(document.createTextNode(err.message));
  });
}