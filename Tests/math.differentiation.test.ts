import { diff } from '../Source/math.differentiation';
import { _var, add, mul, neg, num, terms } from '../Source/math.expressions';
import { _0, _1, _12x, _2, _20x3, _2x, _2x3, _3, _3x2, _5, _6, _6x, _6x2, _7, _9x2, _x, _x2, _x3, _x4 } from './testconstants';
import { clean } from '../Source/math.expressions.simplification';
import * as S from '../Source/math.expressions.simplification';
import { debug, debugExpression } from '../Source/debug';

describe('testing differentiation', () => {

    test('testing polynomials', () => {
        expect(diff(_5, 'x')).toEqual(_0);
        expect(diff(_x, 'x')).toEqual(_1);
        expect(diff(_x, 'y')).toEqual(_x);
        expect(diff(neg(_x), 'x')).toEqual(neg(_1));
        expect(clean(diff(_x2, 'x'))).toEqual(_2x);
        expect(clean(diff(_x3, 'x'))).toEqual(_3x2);
        expect(clean(diff(_2x3, 'x'))).toEqual(_6x2);
        expect(clean(diff(add(_2x, _3x2), 'x'))).toEqual(add(_6x, _2));

        let expression = add(mul(_5, _x4), add(mul(_3, _x3), add(mul(_6, _x2), add(mul(_7, _x), _3)))); // 5x4 + 3x3 + 6x2 + 7x + 3
        let derived = add(_20x3, add(_9x2, add(_12x, _7))); // 20x3 + 9x2 + 12x + 7
        expect(clean(diff(expression, 'x'))).toEqual(derived);
    });
});
