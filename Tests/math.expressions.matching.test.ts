import { _var, add, mul, neg, num, pow, terms } from "../Source/math.expressions";
import { matchAdd, matchMulNumExpr, matchMulNumPowVarNum, matchMulNumVar, matchNeg, matchNegMulNumExpr, matchNegNum, matchNum, matchPowVarNum, matchTerms, matchVar } from "../Source/math.expressions.matching";

describe('testing matching', () => {

  test('testing matchNum', () => {
    expect(matchNum(num(5))).toEqual( { n : 5 });
    expect(matchNum(_var('a'))).toEqual(null);
  });

  test('testing matchVar', () => {
    expect(matchVar(_var('a'))).toEqual('a');
    expect(matchVar(num(5))).toEqual(null);
  });

  test('testing matchNeg', () => {
    expect(matchNeg(neg(_var('a')))).toEqual(neg(_var('a')));
    expect(matchNeg(num(5))).toEqual(null);
  });

  test('testing matchNegNum', () => {
    expect(matchNegNum(neg(num(5)))).toEqual({ n : 5});
    expect(matchNegNum(neg(_var('a')))).toEqual(null);
  });

  test('testing matchAdd', () => {
    expect(matchAdd(add(_var('a'), num(2)))).toEqual( { ex1 : _var('a'), ex2 : num(2) } );
    expect(matchAdd(num(5))).toEqual(null);
  });

  test('testing matchTerms', () => {
    expect(matchTerms(terms([_var('a'), num(2)]))).toEqual( [_var('a'), num(2)] );
    expect(matchTerms(num(5))).toEqual(null);
  });

  test('testing matchMulNumExpr', () => {
    expect(matchMulNumExpr(mul(num(5), _var('x')))).toEqual({ n : 5, ex : _var('x') });
    expect(matchMulNumExpr(pow(num(3), num(5)))).toEqual(null);
  });

  test('testing matchMulNumVar', () => {
    expect(matchMulNumVar(mul(num(5), _var('x')))).toEqual({ n : 5, v : 'x' });
    expect(matchMulNumVar(mul(num(5), num(3)))).toEqual(null);
  });

  test('testing matchPowVarNum', () => {
    expect(matchPowVarNum(pow(_var('x'), num(5)))).toEqual({ v : 'x', e : 5 });
    expect(matchPowVarNum(pow(num(3), num(5)))).toEqual(null);
  });

  test('testing matchMulNumPowVarNum', () => {
    expect(matchMulNumPowVarNum(mul(num(3), pow(_var('x'), num(5))))).toEqual({ n : 3, v : 'x', e : 5 });
    expect(matchMulNumPowVarNum(mul(num(3), pow(_var('y'), num(5))))).toEqual({ n : 3, v : 'y', e : 5 });
    expect(matchMulNumPowVarNum(mul(num(3), pow(num(3), num(5))))).toEqual(null);
  });

  test('testing matchNegMulNumExpr', () => {
    expect(matchNegMulNumExpr(neg(mul(num(5), _var('x'))))).toEqual({ n : 5, ex : _var('x') });
    expect(matchNegMulNumExpr(pow(num(3), num(5)))).toEqual(null);
  });

});
