import { Network } from "../types";

export const dateFormatter = (date:string | number) => {
  return new Date(date).toLocaleDateString();
}

export const timeFormatter = (datetime: string | number) => {
  return new Date(datetime).toLocaleTimeString();
}

export const valueToString = (value: number) => {
  const suffixes = ["", "K", "M", "B", "T"];
  const suffixNum = Math.floor(("" + value).length / 3);
  let shortValue = String(parseFloat((suffixNum != 0 ? (value / Math.pow(1000, suffixNum)) : value).toPrecision(2)));
  if (Number(shortValue) % 1 != 0) {
    shortValue = Number(shortValue).toFixed(1);
  }
  return shortValue + suffixes[suffixNum];
}

export const parseCurrency = (currency: string) => {
  if (currency.length === 3) return currency
  let str = '';
  for (let i = 0; i < currency.length; i += 2)
    str += String.fromCharCode(parseInt(currency.substring(i, i + 2), 16));
  return str;
}

export const apiBaseUrl = (network: Network) => network === 'xrpl' ? 'https://xrpldata.inftf.org' : 'https://data.xahau.network'
export const nativeToken = (network: Network) => network === 'xrpl' ? 'XRP' : 'XAH'
