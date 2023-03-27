const express = require('express')
const app = express()
var path = require('path')
var createError = require('http-errors')
const session = require('express-session')
const flash = require('connect-flash')
const bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
const passport = require('passport')


// connect to models to routes
require('./models/database')
const indexRouter = require('./index')
const customerRouter = require('./customer_routes/customerRouter')

//view engine set up
require('./config/passport')(passport)
//set variables and use sessions
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.json())  // replaces body-parser
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));

//start session
app.use(
  session({
      secret: 'secret',
      resave: true,
      saveUninitialized: true
  })
)

app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.use('/', indexRouter);
app.use('/customer', customerRouter)

//catch 404 and forward to error handler
app.use(function(req, res, next){
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
})

//open port to start the app
app.listen(process.env.PORT || 3000, () => {
  console.log("The library app is running!")
})
