// BigInteger untuk javascript 
// (Native BigInt tidak support operasi dengan Number/Integer)
const bigInt = require('big-integer');

class RSA {

    /**
     * Enkripsi: c = plaintext^e mod n
     * @param {String} plaintext
     * @param {BigInt} n 
     * @param {BigInt} e 
     */
    encrypt(plaintext, n, e) {
        return bigInt(this.encode(plaintext)).modPow(e, n);
    }

    /**
     * Dekripsi: p = cipher^d mod n
     * @param {String|BigInt|Int} cipher 
     * @param {BigInt} d 
     * @param {BigInt} n 
     */
    decrypt(cipher, d, n) {
        return bigInt(cipher).modPow(d, n); 
    }

    /**
     * Merubah plaintext ke ascii code.
     * @param {String} text 
     */
    encode(text) {
        return bigInt(text
            .split('')
            .map(i => i.charCodeAt())
            .join(''));
    }

    /**
     * merubah ascii code ke readable string.
     * @param {String|Int} code 
     */
    decode(code) {
        const codeStr = code.toString();
        let string = '';

        for (let i = 0; i < codeStr.length; i += 2) {
            let num = Number(codeStr.substr(i, 2));
            
            if (num <= 30) {
                string += String.fromCharCode(Number(codeStr.substr(i, 3)));
                i++;
            } else {
                string += String.fromCharCode(num);
            }
        }

        return string;
    }
}

module.exports = new RSA();
