const config        = require('../config');
const passport      = require('passport');
const UserModel     = require('../models/user');
const localStrategy = require('passport-local').Strategy;
const JWTStrategy   = require('passport-jwt').Strategy;
const ExtractJwt    = require('passport-jwt').ExtractJwt;
const {AuthError, BadRequestError} = require('express-json-api-error-handler');

passport.use(
    'register',
    new localStrategy(
        {
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true
        },
        async (req, username, password, done) => {
            const {email, jenis_kelamin, alamat} = req.body;
            username = username.toLowerCase();
            try {
                const user = await UserModel.create({ 
                    username, password, email, jenis_kelamin, alamat
                });

                if (!user) {
                    throw new BadRequestError('Pendaftaran gagal!');
                }

                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }
    )
);

passport.use(
    'login',
    new localStrategy(
        {
            usernameField: 'username',
            passwordField: 'password'
        },
        async (username, password, done) => {
            try {
                const user = await UserModel.findOne({ username })
                if (!user) {
                    return done(new BadRequestError('Login Gagal! username atau password Anda salah'), false);
                }

                const validPassword = await user.validatePassword(password);

                if (!validPassword) {
                    return done(new BadRequestError('Login Gagal! username atau password Anda salah'), false);
                }

                return done(null, user, {message: 'Login berhasil'});

            } catch (error) {
                return done(error);
            }
        }
    )
);

passport.use(
    new JWTStrategy(
        {
            secretOrKey: config.JWT_SECRET,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        },
        async (token, done) => {
            try {
                return done(null, token.user);
            } catch (error) {
                return done(new AuthError(error));
            }
        }
    )
)