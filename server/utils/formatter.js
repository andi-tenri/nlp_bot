exports.formatRupiah = (amount) => {
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