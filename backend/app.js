const express     = require('express');
const path        = require('path');
const cors        = require('cors')
const passport    = require('passport');
const session     = require('express-session');
const bodyParser  = require('body-parser');
const config      = require('./config');
const cookieParser = require('cookie-parser');
const {ErrorHandler} = require('express-json-api-error-handler')

const errorHandler = new ErrorHandler({buildMeta: true})

require('./auth/auth');
const authRouter = require('./routes/auth');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const messageRouter = require('./routes/message');

const app = express();
const server = require('http').createServer(app);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.urlencoded({extended: false}))
app.use(errorHandler.handle)
app.use(session({
    secret: config.JWT_SECRET,
    saveUninitialized: true,
    resave: false
}))

errorHandler.setErrorEventHandler(err => { console.error(error, 'error')})

app.use('/', indexRouter);
app.use('/online', (req, res, next) => res.render('users'));
app.use('/auth', authRouter);
app.use('/users', passport.authenticate('jwt', {session: false}), usersRouter);
app.use('/message', passport.authenticate('jwt', {session: false}), messageRouter);

app.use(function (err, req, res) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    return res.status(err.status || 500).json({error: true, message: err.message});
});

module.exports = {app, server};
