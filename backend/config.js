require('dotenv').config();
const bigInt = require('big-integer');

module.exports = {
    JWT_SECRET: process.env.JWT_SECRET,
    DB_HOST: process.env.DB_HOST,
    DB_PORT: process.env.DB_PORT,
    DB_NAME: process.env.DB_NAME,
    DB_USER: process.env.DB_USER,
    DB_PASS: process.env.DB_PASS,
    RSA: {
        n: bigInt(process.env.RSA_N),
        e: bigInt(process.env.RSA_E),
        d: bigInt(process.env.RSA_D)
    }
}
