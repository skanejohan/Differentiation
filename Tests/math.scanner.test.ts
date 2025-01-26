import Scanner from "../Source/math.scanner";
import { asterisk, error, lparen, number, pow, rparen, sin, variable } from "../Source/math.tokens";

describe('testing scanner', () => {

  test('testing scanner', () => {
    expect(getTokens(" @ ")).toEqual([error("Unexpected character @ at position 2")]);
    expect(getTokens(" sin ( 5 * x ) ")).toEqual([sin(), lparen(), number(5), asterisk(), variable("x"), rparen()]);
    expect(getTokens("x^5")).toEqual([variable("x"), pow(), number(5)]);
  });

});

const getTokens = (s: string) => { return Array.from(new Scanner(s).getTokens()) }