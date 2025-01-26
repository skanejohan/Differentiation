import Scanner from '../Source/math.scanner';
import Parser from '../Source/math.parser';
import { Expression, _var, add, cos, div, ln, log, mul, neg, num, pow, sin, sub, tan } from '../Source/math.expressions';
import { debugExpression } from '../Source/debug';
import { clean } from '../Source/math.expressions.simplification';

describe('testing parser', () => {

    test('testing fundamental expressions', () => {
        expect(parse("5")).toEqual(num(5));
        expect(parse('x')).toEqual(_var('x'));
        expect(parse('x + 5')).toEqual(add(_var('x'), num(5)));
        expect(parse('x - 5')).toEqual(sub(_var('x'), num(5)));
        expect(parse('x * 5')).toEqual(mul(_var('x'), num(5)));
        expect(parse('x / 5')).toEqual(div(_var('x'), num(5)));
        expect(parse('x ^ 5')).toEqual(pow(_var('x'), num(5)));
        expect(parse("(5)")).toEqual(num(5));
        expect(parse("sin(5)")).toEqual(sin(num(5)));
        expect(parse("cos(5)")).toEqual(cos(num(5)));
        expect(parse("tan(5)")).toEqual(tan(num(5)));
        expect(parse("log(5)")).toEqual(log(num(5)));
        expect(parse("ln(5)")).toEqual(ln(num(5)));
        expect(parse("-5")).toEqual(neg(num(5)));
    });

    test('testing errors', () => {
        expect(parse('x +')).toEqual("Expected factor after operator '+'");
        expect(parse('x -')).toEqual("Expected factor after operator '-'");
        expect(parse('x *')).toEqual("Expected power after operator '*'");
        expect(parse('x /')).toEqual("Expected power after operator '/'");
        expect(parse('x ^')).toEqual("Expected unary after operator '^'");
    });

    test('testing num and var', () => {
        expect(parse(' y ')).toEqual(_var('y'));
        expect(parse('  z  ')).toEqual(_var('z'));
        expect(parse('  78  ')).toEqual(num(78));
        expect(parse('-1654')).toEqual(neg(num(1654)));
        expect(parse('  -15  ')).toEqual(neg(num(15)));
    });

    test('testing addition', () => {
        expect(parse('3+3')).toEqual(num(6));
        expect(parse('x+x')).toEqual(mul(num(2), _var('x')));
        expect(parse('x+x+x')).toEqual(mul(num(3), _var('x')));
        expect(parse('3+(x+2)')).toEqual(add(_var('x'), num(5)));
        expect(parse('sin(x)+cos(x)')).toEqual(add(sin(_var('x')), cos(_var('x'))));
    });

    test('testing multiplication', () => {
        expect(parse('3*4')).toEqual(num(12));
        expect(parse('3*4*5')).toEqual(num(60));
        expect(parse('-1*x')).toEqual(neg(_var('x')));
    });

    test('testing addition and multiplication', () => {
        expect(parse('3*4+5')).toEqual(num(17));
        expect(parse('2*x+x')).toEqual(mul(num(3), _var('x')));
        expect(parse('x+2*x')).toEqual(mul(num(3), _var('x')));
        expect(parse('2*x+2*x')).toEqual(mul(num(4), _var('x')));
    });

    test('testing subtracttion', () => {
        expect(parse('x-3')).toEqual(sub(_var('x'), num(3)));
        expect(parse('3-x')).toEqual(sub(num(3), _var('x')));
        expect(parse('3-3')).toEqual(num(0));
        expect(parse('x-x')).toEqual(num(0));
        expect(parse('2*x-3')).toEqual(sub(mul(num(2), _var('x')), num(3)));
        expect(parse('3-2*x')).toEqual(sub(num(3), mul(num(2), _var('x'))));
    });

    test('testing pow', () => {
        expect(parse('x^2')).toEqual(pow(_var('x'), num(2)));
    });

    test('testing polynomials', () => {
        expect(parse('4*x^2')).toEqual(mul(num(4), pow(_var('x'), num(2))));
        expect(parse('x+3')).toEqual(add(_var('x'), num(3)));
        expect(parse('3+x')).toEqual(add(_var('x'), num(3)));
        expect(parse('2*x+3')).toEqual(add(mul(num(2), _var('x')), num(3)));
        expect(parse('3+2*x')).toEqual(add(mul(num(2), _var('x')), num(3)));
        expect(parse('x^2+3')).toEqual(add(pow(_var('x'), num(2)), num(3)));
        expect(parse('3+x^2')).toEqual(add(pow(_var('x'), num(2)), num(3)));
        expect(parse('2*x^3+3')).toEqual(add(mul(num(2), pow(_var('x'), num(3))), num(3)));
        expect(parse('3+2*x^3')).toEqual(add(mul(num(2), pow(_var('x'), num(3))), num(3)));
        expect(parse('x^2+x')).toEqual(add(pow(_var('x'), num(2)), _var('x')));
        expect(parse('x+x^2')).toEqual(add(pow(_var('x'), num(2)), _var('x')));
        expect(parse('2*x^3+x')).toEqual(add(mul(num(2), pow(_var('x'), num(3))), _var('x')));
        expect(parse('x+2*x^3')).toEqual(add(mul(num(2), pow(_var('x'), num(3))), _var('x')));
        expect(parse('x^2+4*x')).toEqual(add(pow(_var('x'), num(2)), mul(num(4), _var('x'))));
        expect(parse('4*x+x^2')).toEqual(add(pow(_var('x'), num(2)), mul(num(4), _var('x'))));
        expect(parse('2*x^3+3*x')).toEqual(add(mul(num(2), pow(_var('x'), num(3))), mul(num(3), _var('x'))));
        expect(parse('3*x+2*x^3')).toEqual(add(mul(num(2), pow(_var('x'), num(3))), mul(num(3), _var('x'))));
        expect(parse('x^3+x^2')).toEqual(add(pow(_var('x'), num(3)), pow(_var('x'), num(2))));
        expect(parse('x^2+x^3')).toEqual(add(pow(_var('x'), num(3)), pow(_var('x'), num(2))));
        expect(parse('2*x^3+x^2')).toEqual(add(mul(num(2), pow(_var('x'), num(3))), pow(_var('x'), num(2))));
        expect(parse('x^2+2*x^3')).toEqual(add(mul(num(2), pow(_var('x'), num(3))), pow(_var('x'), num(2))));
        expect(parse('x^3+2*x^2')).toEqual(add(pow(_var('x'), num(3)), mul(num(2), pow(_var('x'), num(2)))));
        expect(parse('2*x^2+x^3')).toEqual(add(pow(_var('x'), num(3)), mul(num(2), pow(_var('x'), num(2)))));
        expect(parse('2*x^3+2*x^2')).toEqual(add(mul(num(2), pow(_var('x'), num(3))), mul(num(2), pow(_var('x'), num(2)))));
        expect(parse('2*x^2+2*x^3')).toEqual(add(mul(num(2), pow(_var('x'), num(3))), mul(num(2), pow(_var('x'), num(2)))));
        expect(parse('4*x^2+9*x+3')).toEqual(add(mul(num(4), pow(_var('x'), num(2))), add(mul(num(9), _var('x')), num(3))));
        expect(parse('4*x^2+3+9*x')).toEqual(add(mul(num(4), pow(_var('x'), num(2))), add(mul(num(9), _var('x')), num(3))));
        expect(parse('3+9*x+4*x^2')).toEqual(add(mul(num(4), pow(_var('x'), num(2))), add(mul(num(9), _var('x')), num(3))));
        expect(parse('3+4*x^2+9*x')).toEqual(add(mul(num(4), pow(_var('x'), num(2))), add(mul(num(9), _var('x')), num(3))));
        expect(parse('9*x+4*x^2+3')).toEqual(add(mul(num(4), pow(_var('x'), num(2))), add(mul(num(9), _var('x')), num(3))));
        expect(parse('9*x+3+4*x^2')).toEqual(add(mul(num(4), pow(_var('x'), num(2))), add(mul(num(9), _var('x')), num(3))));
        expect(parse('4*x^2+x^2')).toEqual(mul(num(5), pow(_var('x'), num(2))));
        expect(parse('4*x^2+3*x^2')).toEqual(mul(num(7), pow(_var('x'), num(2))));
        expect(parse('x*x*x+x*x*x')).toEqual(mul(num(2), pow(_var('x'), num(3))));
    });

    test('testing trigonometry', () => {
        expect(parse('sin(5*x)')).toEqual(sin(mul(num(5), _var('x'))));
        expect(parse(' sin ( 5 * x ) ')).toEqual(sin(mul(num(5), _var('x'))));
        expect(parse('sin(4*x+3)')).toEqual(sin(add(mul(num(4), _var('x')), num(3))));
    });

    test('testing exponentiation', () => {
        expect(parse('e^x')).toEqual(pow(_var('e'), _var('x')));
        expect(parse('e^(x)')).toEqual(pow(_var('e'), _var('x')));
    });

    test('testing complex expressions', () => {
        expect(parse(' sin ( 4 * x ^ 2 + 5 * x ) + cos ( tan ( 3 * x ) ) ')).toEqual(add(sin(add(mul(num(4), pow(_var('x'), num(2))), mul(num(5), _var('x')))), cos(tan(mul(num(3), _var('x'))))));
        expect(parse('1/(cos(x)^2)')).toEqual(div (num(1), pow(cos(_var('x')), num(2))));
        expect(parse('e^(2*x)')).toEqual(pow(_var('e'), mul(num(2), _var('x'))));
    });
});

const parse = (expression: string) => {
    let tokens = Array.from(new Scanner(expression).getTokens());
    let parser = new Parser(tokens);
    let result = parser.parse();
    return result.hasOwnProperty('type') ? clean(result as Expression) : result;
}

const debugParseResult = (expression: string) => {
    let tokens = Array.from(new Scanner(expression).getTokens());
    let parser = new Parser(tokens);
    let result = parser.parse();
    if (result.hasOwnProperty('type')) {
        debugExpression(result as Expression);
    } else {
        console.log(result);
    }   
}