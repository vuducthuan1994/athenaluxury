const express = require('express');
const app = express();
const mongoose = require('mongoose');
var compressor = require('node-minify');
// const yui = require('@node-minify/yui');
var cookieParser = require('cookie-parser');
require('dotenv').config()
var expressHbs = require('express-handlebars');
var path = require('path');
TZ = "Asia/Ho_Chi_Minh";

var bodyParser = require('body-parser');

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));



app.use(cookieParser());
global.__basedir = __dirname;

// console.log('sync 1');
if (process.env.ENV == 'DEV') {
    // compressor.minify({
    //     compressor: 'gcc',
    //     input: ['public/js/aos.js', 'public/js/jquery.min.js', 'public/js/owl.carousel.min.js', 'public/js/jquery.validate.min.js'

    //     ],
    //     output: 'public/js-dist/app1.js',
    //     type: 'js',
    //     sync: true,
    //     callback: function(err, value) {
    //         console.log(err);
    //         console.log('sync 2', value);
    //     }
    // });

    // compressor.minify({
    //     compressor: 'sqwish',
    //     input: ['public/css/normalize.css', 'public/fonts/font.css', 'public/css/owl.min.css', 'public/css/default.css', 'public/css/animate.css', 'public/css/aos.css'

    //     ],
    //     output: 'public/css-dist/app.css',
    //     type: 'css',
    //     sync: true,
    //     callback: function(err, value) {
    //         console.log(err);
    //         console.log('sync 2', value);
    //     }
    // });
}

mongoose.connect(process.env.DB_URL, {
    user: process.env.DB_USER,
    pass: process.env.DB_PASSWORD,
    useUnifiedTopology: true,
    useNewUrlParser: true
}); // connect to database

// https
app.enable('trust proxy');
//Serves static files (we need it to import a css file)
app.use(express.static('public'))
app.use(express.static('theme'))
    // view engine setup
app.engine('.hbs', expressHbs({
    defaultLayout: 'layout',
    partialsDir: "views/partials/",
    extname: '.hbs',
    helpers: require('./helper/Helper')
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// done engine setup






// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = process.env.ENV == 'DEV' ? err : {};
    // render the error page
    res.render('error');
});

// Configuring Passport
var passport = require('passport');
var expressSession = require('express-session');
// TODO - Why Do we need this key ?
app.use(expressSession({
    secret: 'mySecretKey',
    cookie: {
        maxAge: 1000 * 60 * 30 //đơn vị là milisecond / thoi gian de login lai
    }

}));
app.use(passport.initialize());
app.use(passport.session());

// Using the flash middleware provided by connect-flash to store messages in session
// and displaying in templates
var flash = require('connect-flash');
app.use(flash());

// Initialize Passport
var initPassport = require('./passport/init');
initPassport(passport);

var auth = require('./routes/auth')(passport);
var admin = require('./routes/admin');
var client = require('./routes/client');

app.use('/', client);
app.use('/', auth);
app.use('/admin', admin);





// Moi request voi route ko dinh nghia tro ve trang chu
app.get('/*', function(req, res) {
    res.redirect('/');
});

app.listen(process.env.PORT || 4300);