const express   = require('express');
const passport  = require('passport');
const jwt       = require('jsonwebtoken');
const config    = require('../config');
const {AuthError} = require('express-json-api-error-handler');

const router = express.Router();

router.post(
    '/register',
    passport.authenticate('register', {session: false}),
    async (req, res, next) => {
        res.json({
            error: false,
            message: 'Pendaftaran berhasil',
            user: req.user
        })
    }
);

router.post(
    '/login',
    async (req, res, next) => {
        passport.authenticate(
            'login',
            async (err, user, info) => {
                try {
                    if (err || !user) {
                        return res.status(400).json({error: true, message: err.message});
                    }

                    req.login(
                        user,
                        {session: false},
                        async (error) => {
                            if (error) return next(error);

                            const body = { _id: user.id, username: user.username, alamat: user.alamat, jenis_kelamin: user.jenis_kelamin, email: user.email };
                            const token = jwt.sign({user: body}, config.JWT_SECRET, {expiresIn: '6h'});

                            return res.json({...body, ...{token}});
                        }
                    )
                } catch (error) {
                    return next(error);
                }
            }
        )(req, res, next);
    }
)

module.exports = router;