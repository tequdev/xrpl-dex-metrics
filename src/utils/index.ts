export const dateFormatter = (date:string) => {
  return new Date(date).toLocaleDateString();
}

export const parseCurrency = (currency: string) => {
  if (currency.length === 3) return currency
  let str = '';
  for (let i = 0; i < currency.length; i += 2)
    str += String.fromCharCode(parseInt(currency.substring(i, i + 2), 16));
  return str;
}
