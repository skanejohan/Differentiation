import { _var, add, cos, div, exp, ln, log, mul, neg, num, pow, sin, sub, tan, terms } from '../Source/math.expressions';
import * as simplification from '../Source/math.expressions.simplification';
import { debug, debugExpression } from '../Source/debug';

describe('testing areEqual', () => {
    let add1 = add(num(1), num(2));
    let add2 = add(num(1), num(3));
    let add3 = add(_var('a'), num(2));
    test('testing add', () => {
      expect(simplification.test.areEqual(add1, add1)).toBe(true);
      expect(simplification.test.areEqual(add1, add2)).toBe(false);
      expect(simplification.test.areEqual(add1, add3)).toBe(false);
    });
    let sub1 = sub(num(1), num(2));
    let sub2 = sub(num(1), num(3));
    let sub3 = sub(_var('a'), num(2));
    test('testing sub', () => {
      expect(simplification.test.areEqual(sub1, sub1)).toBe(true);
      expect(simplification.test.areEqual(sub1, sub2)).toBe(false);
      expect(simplification.test.areEqual(sub1, sub3)).toBe(false);
      expect(simplification.test.areEqual(sub1, add1)).toBe(false);
    });
    let mul1 = mul(num(1), num(2));
    let mul2 = mul(num(1), num(3));
    let mul3 = mul(_var('a'), num(2));
    test('testing mul', () => {
      expect(simplification.test.areEqual(mul1, mul1)).toBe(true);
      expect(simplification.test.areEqual(mul1, mul2)).toBe(false);
      expect(simplification.test.areEqual(mul1, mul3)).toBe(false);
      expect(simplification.test.areEqual(mul1, add1)).toBe(false);
    });
    let div1 = div(num(1), num(2));
    let div2 = div(num(1), num(3));
    let div3 = div(_var('a'), num(2));
    test('testing div', () => {
      expect(simplification.test.areEqual(div1, div1)).toBe(true);
      expect(simplification.test.areEqual(div1, div2)).toBe(false);
      expect(simplification.test.areEqual(div1, div3)).toBe(false);
      expect(simplification.test.areEqual(div1, add1)).toBe(false);
    });
    let pow1 = pow(num(1), num(2));
    let pow2 = pow(num(1), num(3));
    let pow3 = pow(_var('a'), num(2));
    test('testing pow', () => {
      expect(simplification.test.areEqual(pow1, pow1)).toBe(true);
      expect(simplification.test.areEqual(pow1, pow2)).toBe(false);
      expect(simplification.test.areEqual(pow1, pow3)).toBe(false);
      expect(simplification.test.areEqual(pow1, add1)).toBe(false);
    });
    let cos1 = cos(num(1));
    let cos2 = cos(num(2));
    let cos3 = cos(_var('a'));
    test('testing cos', () => {
      expect(simplification.test.areEqual(cos1, cos1)).toBe(true);
      expect(simplification.test.areEqual(cos1, cos2)).toBe(false);
      expect(simplification.test.areEqual(cos1, cos3)).toBe(false);
      expect(simplification.test.areEqual(cos1, add1)).toBe(false);
    });
    let sin1 = sin(num(1));
    let sin2 = sin(num(2));
    let sin3 = sin(_var('a'));
    test('testing sin', () => {
      expect(simplification.test.areEqual(sin1, sin1)).toBe(true);
      expect(simplification.test.areEqual(sin1, sin2)).toBe(false);
      expect(simplification.test.areEqual(sin1, sin3)).toBe(false);
      expect(simplification.test.areEqual(sin1, add1)).toBe(false);
    });
    let tan1 = tan(num(1));
    let tan2 = tan(num(2));
    let tan3 = tan(_var('a'));
    test('testing tan', () => {
      expect(simplification.test.areEqual(tan1, tan1)).toBe(true);
      expect(simplification.test.areEqual(tan1, tan2)).toBe(false);
      expect(simplification.test.areEqual(tan1, tan3)).toBe(false);
      expect(simplification.test.areEqual(tan1, add1)).toBe(false);
    });
    let exp1 = exp(num(1));
    let exp2 = exp(num(2));
    let exp3 = exp(_var('a'));
    test('testing exp', () => {
      expect(simplification.test.areEqual(exp1, exp1)).toBe(true);
      expect(simplification.test.areEqual(exp1, exp2)).toBe(false);
      expect(simplification.test.areEqual(exp1, exp3)).toBe(false);
      expect(simplification.test.areEqual(exp1, add1)).toBe(false);
    });
    let ln1 = ln(num(1));
    let ln2 = ln(num(2));
    let ln3 = ln(_var('a'));
    test('testing ln', () => {
      expect(simplification.test.areEqual(ln1, ln1)).toBe(true);
      expect(simplification.test.areEqual(ln1, ln2)).toBe(false);
      expect(simplification.test.areEqual(ln1, ln3)).toBe(false);
      expect(simplification.test.areEqual(ln1, add1)).toBe(false);
    });
    let log1 = log(num(1));
    let log2 = log(num(2));
    let log3 = log(_var('a'));
    test('testing log', () => {
      expect(simplification.test.areEqual(log1, log1)).toBe(true);
      expect(simplification.test.areEqual(log1, log2)).toBe(false);
      expect(simplification.test.areEqual(log1, log3)).toBe(false);
      expect(simplification.test.areEqual(log1, add1)).toBe(false);
    });
    let neg1 = neg(num(1));
    let neg2 = neg(num(2));
    let neg3 = neg(_var('a'));
    test('testing neg', () => {
      expect(simplification.test.areEqual(neg1, neg1)).toBe(true);
      expect(simplification.test.areEqual(neg1, neg2)).toBe(false);
      expect(simplification.test.areEqual(neg1, neg3)).toBe(false);
      expect(simplification.test.areEqual(neg1, add1)).toBe(false);
    });
    test('testing terms', () => {
      expect(simplification.test.areEqual(terms([neg1]), terms([neg1]))).toBe(true);
      expect(simplification.test.areEqual(terms([neg1]), terms([neg2]))).toBe(false);
    });
    test('complex tests', () => {
      let ex1 = mul(num(2), _var('a'));
      expect(simplification.test.areEqual(ex1, ex1)).toBe(true);
    });
});

describe('testing unNeg', () => {

  test('testing add', () => {
    let expr = add(num(1), num(2));
    expect(simplification.test.unNeg(expr)).toEqual(expr);
    expr = add(num(1), neg(num(2)));
    expect(simplification.test.unNeg(expr)).toEqual(sub(num(1), num(2)));
  });

  test('testing sub', () => {
    let expr = sub(num(1), num(2));
    expect(simplification.test.unNeg(expr)).toEqual(expr);
    expr = sub(num(1), neg(num(2)));
    expect(simplification.test.unNeg(expr)).toEqual(add(num(1), num(2)));
  });

});

describe('testing unTermify', () => {

  test('testing add', () => {
    let expr = add(num(1), add(num(2), num(3)));
    expect(simplification.test.unTermify(expr)).toEqual(expr);
  });
  
  test('testing terms', () => {
    let expr = terms([num(1), num(2), num(3)]);
    let expected = add(num(1), add(num(2), num(3)));
    expect(simplification.test.unTermify(expr)).toEqual(expected);
  });
  
  test('testing add with terms', () => {
    let expr = add(num(5), terms([num(1), num(2), num(3)]));
    let expected = add(num(5), add(num(1), add(num(2), num(3))));
    expect(simplification.test.unTermify(expr)).toEqual(expected);
  });
  
});

describe('testing simplifyTermList', () => {

  test('testing add', () => {
    let expr = add(num(1), num(2));
    expect(simplification.test.simplifyTermList(expr)).toEqual(expr);
  });

  test('testing terms', () => {
    let expr = terms([num(1), num(2)]);
    expect(simplification.test.simplifyTermList(expr)).toEqual(terms([num(3)]));
    expr = terms([num(1), num(2), _var('a'), num(3), num(4), num(5)]);
    expect(simplification.test.simplifyTermList(expr)).toEqual(terms([num(3), _var('a'), num(12)]));
  });

  test('testing add with terms', () => {
    let expr = add(num(19), terms([num(1), num(2)]));
    expect(simplification.test.simplifyTermList(expr)).toEqual(add(num(19), terms([num(3)])));

    expr = add(num(19), terms([num(1), num(2), _var('a'), num(3), num(4), num(5)]));
    expect(simplification.test.simplifyTermList(expr)).toEqual(add(num(19), terms([num(3), _var('a'), num(12)])));
  });

});

describe('testing sortTerms', () => {

  test('testing add', () => {
    let expr = add(num(1), num(2));
    expect(simplification.test.sortTerms(expr)).toEqual(expr);
  });

  test('testing terms', () => {
    let _3a2 = mul(num(3), pow(_var('a'), num(2)));
    let _2a3 = mul(num(2), pow(_var('a'), num(3)));
    let _3b2 = mul(num(3), pow(_var('b'), num(2)));
    let _2b3 = mul(num(2), pow(_var('b'), num(3)));
    expect(simplification.test.sortTerms(terms([_3a2, _2a3]))).toEqual(terms([_2a3, _3a2]));
    expect(simplification.test.sortTerms(terms([_2a3, _3a2]))).toEqual(terms([_2a3, _3a2]));
    expect(simplification.test.sortTerms(terms([_2a3, _3b2]))).toEqual(terms([_2a3, _3b2]));
    expect(simplification.test.sortTerms(terms([_3b2, _2a3]))).toEqual(terms([_2a3, _3b2]));
    expect(simplification.test.sortTerms(terms([_3b2, _2b3, _2a3, _3a2]))).toEqual(terms([_2a3, _3a2, _2b3, _3b2]));

    let a2 = pow(_var('a'), num(2));
    let a3 = pow(_var('a'), num(3));
    let b2 = pow(_var('b'), num(2));
    let b3 = pow(_var('b'), num(3));
    expect(simplification.test.sortTerms(terms([_3a2, a3]))).toEqual(terms([a3, _3a2]));
    expect(simplification.test.sortTerms(terms([a3, _3a2]))).toEqual(terms([a3, _3a2]));
    expect(simplification.test.sortTerms(terms([a3, _2a3]))).toEqual(terms([a3, _2a3]));
    expect(simplification.test.sortTerms(terms([_2a3, a3]))).toEqual(terms([a3, _2a3]));
    expect(simplification.test.sortTerms(terms([_2a3, _3b2, a2, b2, b3, _3a2, a3, _2b3]))).toEqual(terms([a3, _2a3, a2, _3a2, b3, _2b3, b2, _3b2]));
  });
  
});

describe('testing unNegTerms', () => {

  test('testing unNegTerms', () => {
    let expr = terms([num(1), neg(mul(num(5), cos(num(2)))), sin(num(3))]);
    expect(simplification.test.unNegTerms(expr)).toEqual(terms([num(1), mul(num(-5), cos(num(2))), sin(num(3))]));
  });
  
});

describe('testing termify', () => {

  test('testing add', () => {
    let expr = add(num(1), add(num(2), num(3)));
    expect(simplification.test.termify(expr)).toEqual(terms([num(1), num(2), num(3)]));
  });

  test('testing sub', () => {
    let expr = sub(num(1), num(3));
    expect(simplification.test.termify(expr)).toEqual(add(num(1), neg(num(3))));
  });
  
  test('testing [add]', () => {
    let expr = terms([add(num(1), add(num(2), num(3))), num(4)]);
    expect(simplification.test.termify(expr)).toEqual(terms([num(1), num(2), num(3), num(4)]));
  });
  
});

describe('testing simplify', () => {

  let _0 = num(0);
  let _1 = num(1);
  let _2 = num(2);
  let _3 = num(3);
  let _4 = num(4);
  let _5 = num(5);
  let _7 = num(7);
  let _x = _var('x');
  let _y = _var('y');
  let _2x = mul(_2, _x);
  let _3x = mul(_3, _x);
  let _4x = mul(_4, _x);
  let _7x = mul(_7, _x);
  let _x2 = pow(_x, _2);
  let _2x2 = mul(_2, _x2);
  let _x3 = pow(_x, _3);
  let _2x3 = mul(_2, _x3);
  let _5x3 = mul(_5, _x3);
  let _x5 = pow(_x, _5);
  let _3y = mul(_3, _y);
  let _y3 = pow(_y, _3);

  test('testing add with 0', () => {
    expect(simplification.test.simplify(add(_0, sin(_3)))).toEqual(sin(_3)); // 0 + expression = expression
    expect(simplification.test.simplify(add(sin(_3), _0))).toEqual(sin(_3)); // expression + 0 = expression
  });
  
  test('testing add add two subsequent numbers', () => {
    expect(simplification.test.simplify(add(_3, _7))).toEqual(num(10)); // n1 + n2 = their sum
  });

  test('testing add of two subsequent variables', () => {
    expect(simplification.test.simplify(add(_x, _x))).toEqual(mul(num(2), _x)); // x + x = 2 * x
  });

  test('testing add of two subsequent power expressions', () => {
    expect(simplification.test.simplify(add(_x3, _x3))).toEqual(mul(num(2), _x3)); // x^3 + x^3 = 2 * x^3
    expect(simplification.test.simplify(add(_x3, _2x3))).toEqual(mul(num(3), _x3)); // x^3 + 2*x^3 = 3*x^3
    expect(simplification.test.simplify(add(_5x3, _2x3))).toEqual(mul(num(7), _x3)); // 5*x^3 + 2*x^3 = 7*x^3
    expect(simplification.test.simplify(add(_5x3, _x3))).toEqual(mul(num(6), _x3)); // 5*x^3 + x^3 = 6*x^3
    expect(simplification.test.simplify(add(_x3, _x2))).toEqual(add(_x3, _x2)); // different exponents - no change
    expect(simplification.test.simplify(add(_x3, _y3))).toEqual(add(_x3, _y3)); // different variables - no change
  });

  test('testing add of variables', () => {
    expect(simplification.test.simplify(add(_x, _3x))).toEqual(_4x); // x + 3 * x = 4 * x
    expect(simplification.test.simplify(add(_3x, _x))).toEqual(_4x); // 3 * x + x = 4 * x
    expect(simplification.test.simplify(add(_3x, _4x))).toEqual(_7x); // 3 * x + 4 * x = 7 * x
    expect(simplification.test.simplify(add(_y, _3x))).toEqual(add(_y, _3x)); // different variables - no change
    expect(simplification.test.simplify(add(_3y, _x))).toEqual(add(_3y, _x)); // different variables - no change
    expect(simplification.test.simplify(add(_3y, _3x))).toEqual(add(_3y, _3x)); // different variables - no change
  });

  test('testing ordering of polynomials', () => {
    expect(simplification.test.simplify(add(_x, _3))).toEqual(add(_x, _3)); // x + 3 = x + 3
    expect(simplification.test.simplify(add(_3, _x))).toEqual(add(_x, _3)); // 3 + x = x + 3
    expect(simplification.test.simplify(add(_3, _2x))).toEqual(add(_2x, _3)); // 3 + 2 * x -> 2 * x + 3
    expect(simplification.test.simplify(add(_3, _x2))).toEqual(add(_x2, _3)); // 3 + x^2 -> x^2 + 3
    expect(simplification.test.simplify(add(_3, _2x3))).toEqual(add(_2x3, _3)); // 3 + 2 * x^3 -> 2 * x^3 + 3
    expect(simplification.test.simplify(add(_x, _x2))).toEqual(add(_x2, _x)); // x + x^2 -> x^2 + x
    expect(simplification.test.simplify(add(_x, _2x3))).toEqual(add(_2x3, _x)); // x + 2 * x^3 -> 2 * x^3 + x
    expect(simplification.test.simplify(add(_2x, _x2))).toEqual(add(_x2, _2x)); // 2 * x + x^2 -> x^2 + 2 * x
    expect(simplification.test.simplify(add(_2x, _2x3))).toEqual(add(_2x3, _2x)); // 2 * x + 2*x^3 -> 2*x^3 + 2 * x
    expect(simplification.test.simplify(add(_x2, _x3))).toEqual(add(_x3, _x2)); // x^2 + x^3 -> x^3 + x^2
    expect(simplification.test.simplify(add(_x2, _2x3))).toEqual(add(_2x3, _x2)); // x^2 + 2 * x^3 -> 2 * x^3 + x^2
    expect(simplification.test.simplify(add(_2x2, _x3))).toEqual(add(_x3, _2x2)); // 2 * x^2 + x^3 -> x^3 + 2 * x^2
    expect(simplification.test.simplify(add(_2x2, _2x3))).toEqual(add(_2x3, _2x2)); // 2 * x^2 + 2 * x^3 -> 2 * x^3 + 2 * x^2
  });

  test('testing sub', () => {
    expect(simplification.test.simplify(sub(_0, sin(_3)))).toEqual(neg(sin(_3))); // 0 - expression = -expression
    expect(simplification.test.simplify(sub(sin(_3), _0))).toEqual(sin(_3)); // expression - 0 = expression
    expect(simplification.test.simplify(sub(_7, _3))).toEqual(_4); // n1 - n2 = their difference
    expect(simplification.test.simplify(sub(_x, _x))).toEqual(_0); // x - x = 0
    expect(simplification.test.simplify(sub(sin(_x), _x))).toEqual(add(sin(_x), neg(_x))); // sub -> add with neg for others
  });

  test('testing mul', () => {
    expect(simplification.test.simplify(mul(_0, sin(_3)))).toEqual(_0); // 0 * expression = 0
    expect(simplification.test.simplify(mul(sin(_3), _0))).toEqual(_0); // expression * 0 = 0
    expect(simplification.test.simplify(mul(_1, sin(_3)))).toEqual(sin(_3)); // 1 * expression = expression
    expect(simplification.test.simplify(mul(sin(_3), _1))).toEqual(sin(_3)); // expression * 1 = expression
    expect(simplification.test.simplify(mul(_7, _5))).toEqual(num(35)); // 7 * 5 = 35
    expect(simplification.test.simplify(mul(_7, mul(_5, sin(_3))))).toEqual(mul(num(35), sin(_3))); // 7 * 5 * expression = 35 * expression
    expect(simplification.test.simplify(mul(_7, mul(sin(_3), _5)))).toEqual(mul(num(35), sin(_3))); // 7 * expression * 5 = 35 * expression
    expect(simplification.test.simplify(mul(neg(_1), sin(_3)))).toEqual(neg(sin(_3))); // -1 * expression = -expression
    expect(simplification.test.simplify(mul(sin(_3), neg(_1)))).toEqual(neg(sin(_3))); // expression * -1 = -expression
    expect(simplification.test.simplify(mul(_x, _x))).toEqual(_x2); // x * x = x^2
    expect(simplification.test.simplify(mul(mul(_5, _x), _x))).toEqual(mul(_5, _x2)); // 5 * x * x = 5 * x^2
    expect(simplification.test.simplify(mul(_x, _x2))).toEqual(_x3); // x * x^2 = x^3
    expect(simplification.test.simplify(mul(_x2, _x))).toEqual(_x3); // x^2 * x = x^3
    expect(simplification.test.simplify(mul(_x2, _x3))).toEqual(_x5); // x^2 * x^3 = x^5
  });
});
