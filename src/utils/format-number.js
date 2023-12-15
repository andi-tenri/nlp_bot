import numeral from 'numeral';

// ----------------------------------------------------------------------

export function fNumber(number) {
  return numeral(number).format();
}

export function fCurrency(number) {
  const format = number ? numeral(number).format('0,0.00') : '';

  return 'Rp' + result(format, '.00');
}

export function fPercent(number) {
  const format = number ? numeral(Number(number) / 100).format('0.0%') : '';

  return result(format, '.0');
}

export function fShortenNumber(number) {
  const format = number ? numeral(number).format('0.00a') : '';

  return result(format, '.00');
}

export function fData(number) {
  const format = number ? numeral(number).format('0.0 b') : '';

  return result(format, '.0');
}

function result(format, key = '.00') {
  const isInteger = format.includes(key);

  return isInteger ? format.replace(key, '') : format;
}

export function formatRupiah(amount) {
  if (!amount) return ""
  let numberString = amount.toString();
  let split = numberString.split('.');
  let remainder = split[0].length % 3;
  let rupiah = split[0].substr(0, remainder);
  let thousands = split[0].substr(remainder).match(/\d{1,3}/gi);

  if (thousands) {
    let separator = remainder ? '.' : '';
    rupiah += separator + thousands.join('.');
  }

  rupiah = split[1] !== undefined ? rupiah + ',' + split[1] : rupiah;
  return 'Rp' + rupiah;
}