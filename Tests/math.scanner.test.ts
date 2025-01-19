import Scanner from "../Source/math.scanner";
import { asterisk, error, lparen, number, rparen, sin, variable } from "../Source/math.tokens";

describe('testing scanner', () => {

  test('testing scanner', () => {
    expect(getTokens(" @ ")).toEqual([error("Unexpected character @ at position 2")]);
    expect(getTokens(" sin ( 5 * x ) ")).toEqual([sin(), lparen(), number(5), asterisk(), variable("x"), rparen()]);
  });

});

const getTokens = (s: string) => { return Array.from(new Scanner(s).getTokens()) }