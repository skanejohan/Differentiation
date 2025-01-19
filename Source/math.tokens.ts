import * as constants from './math.constants'

export type Token =
  | { type: typeof constants.NUM; n: number }
  | { type: typeof constants.VAR; v: string }
  | { type: typeof constants.PLUS }
  | { type: typeof constants.MINUS }
  | { type: typeof constants.ASTERISK }
  | { type: typeof constants.SLASH }
  | { type: typeof constants.LPAREN }
  | { type: typeof constants.RPAREN }
  | { type: typeof constants.SIN }
  | { type: typeof constants.COS }
  | { type: typeof constants.TAN }
  | { type: typeof constants.EXP }
  | { type: typeof constants.LOG }
  | { type: typeof constants.LN }
  | { type: typeof constants.ERROR; error: string };

export const number = (n: number) => { let result : Token = { n: n, type: constants.NUM }; return result; } 
export const variable = (v: string) => { let result : Token = { v: v, type: constants.VAR }; return result; } 
export const plus = () => { let result : Token = { type: constants.PLUS }; return result; } 
export const minus = () => { let result : Token = { type: constants.MINUS }; return result; } 
export const asterisk = () => { let result : Token = { type: constants.ASTERISK }; return result; } 
export const slash = () => { let result : Token = { type: constants.SLASH }; return result; } 
export const lparen = () => { let result : Token = { type: constants.LPAREN }; return result; } 
export const rparen = () => { let result : Token = { type: constants.RPAREN }; return result; } 
export const sin = () => { let result : Token = { type: constants.SIN }; return result; } 
export const cos = () => { let result : Token = { type: constants.COS }; return result; } 
export const tan = () => { let result : Token = { type: constants.TAN }; return result; } 
export const exp = () => { let result : Token = { type: constants.EXP }; return result; } 
export const log = () => { let result : Token = { type: constants.LOG }; return result; } 
export const ln = () => { let result : Token = { type: constants.LN }; return result; } 
export const error = (e: string) => { let result : Token = { error: e, type: constants.ERROR }; return result; } 
