const CONFIG = require('./src/config');
const bodyParser = require('body-parser');
const express = require('express');
const request = require('request');
const path = require('path');
const cors = require('cors');
/**
 * Initialize the Key Value Store Database
 */
const DB = require('./src/Utilities/database');

const GlobalMiddleware = require('./src/Middleware/Global')
/********************************************
 * GLOBAL VAR
 *******************************************/


/********************************************
 * EXPRESS / SERVER SETUP
 *******************************************/
const app = express();
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'twig');
app.disable('x-powered-by');
app.disable('etag');
app.set('trust proxy', true);
app.use(bodyParser.json());
//app.use(express.json());
 /**
  * If we are serving files then add DIR here
  */
 //app.use(express.static(path.join(__dirname, 'client/dist'), {maxAge: '30d'}))
 const corsOptions = {
  //origin: 'http://localhost',
  methods: 'GET,PUT,POST,DELETE',
  allowedHeaders: 'Content-Type, Authorization',
  optionsSuccessStatus: 200
}
app.use(cors(corsOptions))
app.use(express.urlencoded({ extended: false }));
/********************************************
 * ROUTERS
 *******************************************/
const clientRouter = require('./src/Routers/client');

/********************************************
 * MIDDLEWARE
 *******************************************/

//Add compression for JS files
app.get('*.js', function (req, res, next) {
  if (req.header('Accept-Encoding').includes('gzip')) {
      req.url = req.url + '.gz';
      res.set('Content-Encoding', 'gzip');
      res.set('Content-Type', 'text/javascript');
  }
  next();
});
//Add compression for CSS files
app.get('*.css', function (req, res, next) {
  if (req.header('Accept-Encoding').includes('gzip')) {
      req.url = req.url + '.gz';
      res.set('Content-Encoding', 'gzip');
      res.set('Content-Type', 'text/css');
  }
  next();
});
//APP Global middleware 
app.use('*', (req, res, next) => GlobalMiddleware.nullWare(req, res, next));

/********************************************
 * ROUTES
 *******************************************/
app.use('/', clientRouter)

/********************************************
 * START APP
 *******************************************/
 const PORT = normalizePort(global.config.PORT);
 app.set('port', PORT)
 app.listen(PORT, () => {
     console.log(`${global.config.APP_NAME} is listening on port ${PORT}`)
 });
 app.on('error', onError);
 
 
 function normalizePort(val) {
     var port = parseInt(val, 10);
     if (isNaN(port)) return val;
     if (port >= 0) return port;
     return false;
 }
/********************************************
 * ERROR HANDLING
 *******************************************/
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  console.log(err)
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

function onError(error) {

  console.log(error)

  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof PORT === 'string'
    ? 'Pipe ' + PORT
    : 'Port ' + PORT;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

module.exports = app;