interface Action {
  action: 'BUY' | 'SELL' | 'CAP';
  value: number;
}

interface CurrencyPair {
  source: string;
  destination: string;
}

interface CurrencyActionPair {
  currencyPair: CurrencyPair;
  actions: Action[];
}
export class ParsedFxDto implements CurrencyActionPair {
  currencyPair: CurrencyPair;
  actions: Action[];
}
