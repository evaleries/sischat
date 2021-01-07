const config = require('../config');
const jwt = require('jsonwebtoken');


function parseToken(req) {
    let token = req.headers.authorization ? req.headers.authorization.replace('Bearer ', '') : null;
    return token && token.length ? token : null;
}

function verifyToken() {
    return async function(req, res, next) {
        try {
            let token = getToken(req);
            if (!token) return next();

            req.user = jwt.verify(token, config.JWT_SECRET)
            let user = User.findOne({ token: {$in: [token]} });

            if (!user) {
                return res.json({
                    error: 1,
                    message: 'Token Expired'
                })
            }
        } catch (err) {
            if (err && err.name === 'JsonWebTokenError') {
                return res.json({
                    error: 1,
                    message: err.message
                });
            }
            next(err);
        }
        return next();
    }
}

module.exports = {
    decodeToken
}