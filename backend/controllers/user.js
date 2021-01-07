const {NotFoundError} = require('express-json-api-error-handler');
const UserModel = require('../models/user');

module.exports = {
    profile: async function(req, res, next) {
        res.json({
            message: 'Profile user',
            user: req.user,
        })
    },

    findById: async function (req, res, next) {
        const user = await UserModel.findOne({ user_id: req.params.id })

        if (!user) {
            return next(new NotFoundError('User tidak ditemukan! ID: ' + req.params.id));
        }

        res.json({
            error: false,
            user: {
                id: user._id, 
                username: user.username, 
                jenis_kelamin: user.jenis_kelamin, 
                alamat: user.alamat
            }
        })
    },

    findByUsername: async function (req, res, next) {
        const user = await UserModel.findOne({ username: req.body.username })

        if (!user) {
            return next(new NotFoundError('User tidak ditemukan!'));
        }

        res.json({
            error: false,
            user: {
                id: user._id, 
                username: user.username, 
                jenis_kelamin: user.jenis_kelamin, 
                alamat: user.alamat
            }
        })
    }
}