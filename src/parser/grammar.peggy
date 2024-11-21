 { 
  const { CURRENCY_CODE, throwError } = require('./utils.js');

  if (!Array.isArray(CURRENCY_CODE)) {
    throw new Error("CURRENCY_CODE must be an array of valid currency codes.");
  
}
}
Expression
 = Term+ 
 
 Term = currpair: CurrencyPair " "  "{" _  buy: BuyLine _ sell: SellLine _ cap: CapLine _ "}"  (_ / EOF )_  {
 return {
 		currencyPair: {
        	source: currpair.split("-")[0],
            destination : currpair.split("-")[1]
 			},
            actions:[buy,sell,cap]
 }
 } 
 

Integer "integer"
  = _ [0-9]+ { return parseInt(text(), 10); }
  
Float
 = [+]?([0-9]*[.])?[0-9]+ {
  return parseFloat(text())
 }
  
CurrencyPair "currencyPair"
 = first:CurrencyCode _ "-" _ second:CurrencyCode {
 	return first + "-" + second
 }
  

        CurrencyCode "currency"
  = [A-Z][A-Z][A-Z] {
    if(!CURRENCY_CODE.includes(text())) {
      throwError(`Invalid currency code: ${text()}`);
    }
    return String(text())
 }

Constant = Buy / Sell / Cap

Buy = "BUY"

Sell = "SELL"

Cap = "CAP"

Newline
 = "\n"
 
BuyLine
 = constant:Buy _ value:Float {
 return { action: constant, value:value}
 }
 
 SellLine
 = constant:Sell _ value:Float {
 return { action: constant, value:value}
 }
 
 CapLine
 = constant:Cap _ value:Integer {
 return { action: constant, value:value}
 }
  
_ "whitespace"
  = [ \t\n\r]*
  
 EOF = !.