Remove-Item Out\*.*

Copy-Item Source\index.css Out
Copy-Item Source\index.html Out

npx tsc
Remove-Item Out\debug.js

(Get-Content Out/math.differentiation.js) -replace '"./math.expressions"', '"./math.expressions.js"' | Set-Content Out/math.differentiation.js
(Get-Content Out/math.expressions.js) -replace '"./math.constants"', '"./math.constants.js"' | Set-Content Out/math.expressions.js
(Get-Content Out/math.expressions.matching.js) -replace '"./math.constants"', '"./math.constants.js"' | Set-Content Out/math.expressions.matching.js
(Get-Content Out/math.expressions.simplification.js) -replace '"./math.expressions.matching"', '"./math.expressions.matching.js"' | Set-Content Out/math.expressions.simplification.js
(Get-Content Out/math.expressions.simplification.js) -replace '"./math.expressions"', '"./math.expressions.js"' | Set-Content Out/math.expressions.simplification.js
(Get-Content Out/math.expressions.simplification.js) -replace '"./math.constants"', '"./math.constants.js"' | Set-Content Out/math.expressions.simplification.js
(Get-Content Out/math.parser.js) -replace '"./math.expressions"', '"./math.expressions.js"' | Set-Content Out/math.parser.js
(Get-Content Out/math.parser.js) -replace '"./math.constants"', '"./math.constants.js"' | Set-Content Out/math.parser.js
(Get-Content Out/math.scanner.js) -replace '"./math.tokens"', '"./math.tokens.js"' | Set-Content Out/math.scanner.js
(Get-Content Out/math.tokens.js) -replace '"./math.constants"', '"./math.constants.js"' | Set-Content Out/math.tokens.js
(Get-Content Out/index.js) -replace '"./math.expressions.simplification"', '"./math.expressions.simplification.js"' | Set-Content Out/index.js
(Get-Content Out/index.js) -replace '"./math.expressions"', '"./math.expressions.js"' | Set-Content Out/index.js
(Get-Content Out/index.js) -replace '"./math.differentiation"', '"./math.differentiation.js"' | Set-Content Out/index.js
(Get-Content Out/index.js) -replace '"./math.parser"', '"./math.parser.js"' | Set-Content Out/index.js
(Get-Content Out/index.js) -replace '"./math.scanner"', '"./math.scanner.js"' | Set-Content Out/index.js
(Get-Content Out/index.js) -replace '"./math.constants"', '"./math.constants.js"' | Set-Content Out/index.js
