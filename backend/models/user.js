const mongoose = require('mongoose');
const config = require('../config');
const rsa = require('../rsa');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        unique: true,
        maxlength: 255,
    },
    password: {
        type: String,
        required: true
    },
    jenis_kelamin: {
        type: String,
        required: true
    },
    alamat: {
        type: String,
        required: true
    },
    reset_token: String,
    expired_at: Date,
    messages: [
        {type: mongoose.Schema.Types.ObjectId, ref: 'message'}
    ]
}, {
    timestamps: true
});

UserSchema.path('email').validate(function (email) {
    return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(email);
}, email => `${email.value} tidak valid`);

UserSchema.path('username').validate(function (username) {
    return /^[a-zA-Z0-9]+([_ -]?[a-zA-Z0-9])*$/.test(username);
}, username => `${username.value} tidak valid!`);

UserSchema.path('jenis_kelamin').validate(function (jenis_kelamin) {
    return jenis_kelamin == 'P' || jenis_kelamin == 'L';
}, jenis_kelamin => `${jenis_kelamin.value} seharusnya P atau L`);

UserSchema.pre('save', function (next) {
    this.password = rsa.encrypt(this.password, config.RSA.n, config.RSA.e);
    next();
});

UserSchema.methods.validatePassword = async function (password) {
    let decrypt = await rsa.decrypt(this.password, config.RSA.d, config.RSA.n);
    return rsa.decode(decrypt) === password;
}

module.exports = mongoose.model('user', UserSchema)
