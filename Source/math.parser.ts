// expression -> term
// term       -> factor ( ( "-" | "+" ) factor )*
// factor     -> power ( ( "/" | "*" ) power )*
// power      -> unary ( "^" unary )*
// unary      -> "-" unary
//            |  primary
// primary    -> function | NUMBER | STRING | "(" expression ")"
// function   -> ( "sin" | "cos" | "tan" | "exp" | "log" | "ln") "(" expression ")"

import { ASTERISK, COS, EXP, LN, LOG, LPAREN, MINUS, NUM, PLUS, POW, RPAREN, SIN, SLASH, TAN, VAR } from "./math.constants";
import { _var, add, cos, div, exp, Expression, ln, log, mul, neg, num, pow, sin, sub, tan } from "./math.expressions";
import { Token } from "./math.tokens";

export default class Parser {

    constructor(tokens: Token[]) {
        this.tokens = tokens;
    }

    public parse() : Expression | string {
        return this.expression() ?? this.error;
    }

    private expression() : Expression | null {
        return this.term();
    }

    private term() : Expression | null {
        let expr = this.factor();
        if (expr != null) {
            while (this.match(MINUS) || this.match(PLUS)) {
                let operator = this.previousToken();
                let right = this.factor();
                if (right != null) {
                    expr = operator.type == MINUS 
                        ? sub(expr, right)
                        : add(expr, right);
                }
                else {
                    let op = operator.type == PLUS ? "+" : "-";
                    this.error = `Expected factor after operator '${op}'`;
                    return null;
                }
            }
        }
        return expr;
    }

    private factor() : Expression | null {
        let expr = this.power();
        if (expr != null) {
            while (this.match(ASTERISK) || this.match(SLASH)) {
                let operator = this.previousToken();
                let right = this.power();
                if (right != null) {
                    expr = operator.type == ASTERISK 
                        ? mul(expr, right)
                        : div(expr, right);
                }
                else {
                    let op = operator.type == ASTERISK ? "*" : "/";
                    this.error = `Expected power after operator '${op}'`;
                    return null;
                }
            }
        }
        return expr;
    }

    private power() : Expression | null {
        let expr = this.unary();
        if (expr != null) {
            while (this.match(POW)) {
                let right = this.unary();
                if (right != null) {
                    expr = pow(expr, right);
                }
                else {
                    this.error = "Expected unary after operator '^'";
                    return null;
                }
            }
        }
        return expr;
    }

    private unary() : Expression | null {
        if (this.match(MINUS)) {
            let right = this.unary();
            if (right == null) {
                this.error = "Expected unary after operator '-'";
                return null;
            }
            return neg(right);
        }
        return this.primary();
    }

    private primary() : Expression | null {
        let fun = this.function();
        if (fun != null) {
            return fun;
        }
        if (this.match(LPAREN)) {
            let expr = this.expression();
            return expr != null && this.consume(RPAREN)
                ? expr
                : null;
        }
        if (this.match(NUM)) {
            var t = this.previousToken();
            return t.type == NUM ? num(t.n) : null;
        }
        if (this.match(VAR)) {
            var t = this.previousToken();
            return t.type == VAR ? _var(t.v) : null;
        }
        this.error = "Unexpected end of input";
        return null;
    }

    private function() : Expression | null {
        let functions = [
            { type: SIN, function: sin },
            { type: COS, function: cos },
            { type: TAN, function: tan },
            { type: EXP, function: exp },
            { type: LOG, function: log },
            { type: LN, function: ln }];
        for (let i = 0; i < functions.length; i++) {
            if (this.match(functions[i].type)) {
                if (!this.consume(LPAREN)) {
                    return null;
                }
                let expr = this.expression();
                return expr != null && this.consume(RPAREN)
                    ? functions[i].function(expr) 
                    : null;
            }
        }
        return null;
    }

    private advance() {
        if (this.moreTokens()) {
            this.tokenIndex++;
        }
        return this.previousToken();
    }

    private check(tokenType: string) {
        return this.moreTokens() && this.currentToken().type === tokenType;
    }

    private consume(tokenType: string) {
        return this.match(tokenType, true);
    }

    private match(tokenType: string, mandatory : boolean = false) {
        if (this.check(tokenType)) {
            this.advance();
            return true;
        }
        if (mandatory) {
            this.error = `Expected ${tokenType} but got ${this.currentToken().type}`;
        }
        return false;
    }

    private moreTokens() {
        return this.tokenIndex < this.tokens.length;
    }
    
    private currentToken() {
        return this.tokens[this.tokenIndex];
    }
    
    private previousToken() {
        return this.tokens[this.tokenIndex-1];
    }

    private tokenIndex: number = 0;
    private error: string = "";
    private tokens: Token[];
}