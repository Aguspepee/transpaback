require('dotenv').config();

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var bodyParser = require('body-parser');

var AuthToken = require("./middlewares/authToken");

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/usersRouter');
const piquetesRouter = require('./routes/piquetesRouter');
const novedadesRouter = require('./routes/novedadesRouter');
const operacionesRouter = require('./routes/operacionesRouter');
const indisponibilidadesRouter = require('./routes/indisponibilidadesRouter');
const lineasRouter = require('./routes/lineasRouter');
const reportesRouter = require('./routes/reportesRouter');
const puntosRouter = require('./routes/puntosRouter');
const equiposRouter = require('./routes/equiposRouter');
const maquinasRouter = require('./routes/equipos/maquinasRouter');
const sapsRouter = require('./routes/sapsRouter');
var cors = require('cors');


var app = express();

//Token key generator
app.set("secretKey", "gie2022")

console.log(process.env.FRONTEND_URL)

/* //CORS
app.use(cors()) */
const corsOptions = {
  origin: [`${process.env.FRONTEND_URL}`],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  // add the following line to allow socket.io connections
  transports: ['websocket', 'polling'],
};

app.use(cors(corsOptions));



app.use(bodyParser.json({limit: '50mb'}));

//Setea la ubicación de las imagenes
app.use('/clients-images', express.static(path.join(__dirname + '/clients-images/')));
app.use('/users-images', express.static(path.join(__dirname + '/users-images')));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Se importa la función de validación del Token
app.use(AuthToken)

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/piquetes/', piquetesRouter);
app.use('/novedades/', novedadesRouter);
app.use('/equipos/', equiposRouter);
app.use('/maquinas/', maquinasRouter);
app.use('/operaciones/', operacionesRouter);
app.use('/indisponibilidades/', indisponibilidadesRouter);
app.use('/lineas/', lineasRouter);
app.use('/reportes/', reportesRouter);
app.use('/puntos/', puntosRouter);
app.use('/saps', sapsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
