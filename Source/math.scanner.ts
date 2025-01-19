import * as tokens from './math.tokens';

export default class Scanner {
    constructor(source: string) {
        this.source = source;
    }

    public *getTokens() {
        while (true) {
            this.SkipWhitespace();
            this.tokenStartPosition = this.currentPosition;
            if (this.IsAtEnd())
            {
                break;
            }
            let c = this.Advance();
            if (this.IsDigit(c)) {
                yield tokens.number(this.ReadNumber());
            }
            else if (this.IsAlpha(c)) {
                let text = this.ReadText();
                switch(text) {
                    case "sin":
                        yield tokens.sin();
                        break;
                    case "cos":
                        yield tokens.cos();
                        break;
                    case "tan":
                        yield tokens.tan();
                        break;
                    case "exp":
                        yield tokens.exp();
                        break;
                    case "log":
                        yield tokens.log();
                        break;
                    case "ln":
                        yield tokens.ln();
                        break;
                    default:
                        yield tokens.variable(text);
                        break;
                }
            }
            else switch(c) {
                case '(':
                    yield tokens.lparen();
                    break;
                case ')':
                    yield tokens.rparen();
                    break;
                case '-':
                    yield tokens.minus();
                    break;
                case '+':
                    yield tokens.plus();
                    break;
                case '/':
                    yield tokens.slash();
                    break;
                case '*':
                    yield tokens.asterisk();
                    break;
                default:
                    yield tokens.error(`Unexpected character ${c} at position ${this.currentPosition}`);
                    break;
            }
        }
    }

    private SkipWhitespace() {
        while (!this.IsAtEnd() && this.Peek() == ' ') {
            this.Advance();
        }
    }

    private Advance() {
        let c = this.Peek();
        this.currentPosition++;
        return c;
    }

    private ReadText() {
        while (this.IsAlpha(this.Peek()))
        {
            this.Advance();
        }
        return this.GetToken();
    }

    private ReadNumber() {
        while (this.IsDigit(this.Peek()))
        {
            this.Advance();
        }
        if (this.Peek() == '.' && this.IsDigit(this.PeekNext()))
        {
            this.Advance();
            while (this.IsDigit(this.Peek()))
            {
                this.Advance();
            }
        }
        return parseFloat(this.GetToken());
    }

    private IsDigit = (c : string) => c >= '0' && c <= '9';
    private IsAlpha = (c : string) => c >= 'a' && c <= 'z' || c >= 'A' && c <= 'Z' || c == '_';
    private Peek = () => this.currentPosition < this.source.length ? this.source[this.currentPosition] : '\0';
    private PeekNext = () => this.currentPosition < this.source.length - 1 ? this.source[this.currentPosition + 1] : '\0';
    private GetToken = () => this.source.substring(this.tokenStartPosition, this.currentPosition);
    private IsAtEnd = () => this.currentPosition == this.source.length; // I.e. we have already read the last character

    private tokenStartPosition : number = 0;
    private currentPosition : number = 0;
    private source: string;
}
