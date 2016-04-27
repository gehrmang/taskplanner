/*
 * app.js: GNU GENERAL PUBLIC LICENSE Version 3
 */
(function() {
  "use strict";

  /**
   * The main application. Initializes the web services and database
   * connections.
   * 
   * @author Gerry Gehrmann
   * @since 0.0.1
   */

  /** ******************************** */
  /** ********* Node modules ********* */
  /** ******************************** */
  var express = require('express');
  var cookieParser = require('cookie-parser');
  var session = require('express-session');
  var bodyParser = require('body-parser');
  var passport = require('passport');
  var winston = require('winston');
  var EventEmitter = require('events').EventEmitter;

  var messageBus = new EventEmitter();

  /** Winston logging initialization */
  winston.add(winston.transports.File, {
    filename: 'log/taskplanner.log',
    level: 'debug'
  });
  winston.cli();
  winston.handleExceptions(new winston.transports.File({
    filename: 'log/exceptions.log'
  }));

  /** ******************************** */
  /** **** Configuration modules ***** */
  /** ******************************** */
  var hostConfig = require('config').get('host');
  require('./app/config/mongo.config')(messageBus);
  require('./app/config/passport.config');

  /** ******************************** */
  /** ****** Controller modules ****** */
  /** ******************************** */
  //require('./app/controllers/notification.controller')(messageBus);

  /** ******************************** */
  /** ******** Route modules ********* */
  /** ******************************** */
  var auth = require('./app/routes/auth.routes');

  /** ******************************** */
  /** ** Application initialization ** */
  /** ******************************** */

  /** The main ExpressJS application */
  var app = express();

  /** Body parser initialization */
  app.use(bodyParser.urlencoded({
    extended: false
  }));
  app.use(bodyParser.json());

  /** Cookie parser and session initialization */
  app.use(cookieParser('securedsession'));
  app.use(session({
    secret: 'securedsession',
    resave: true,
    saveUninitialized: true,
    cookie: {
      secure: false
    }
  }));

  /** Access restrictions */
  app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization');
    next();
  });

  /** Passport initialization */
  app.use(passport.initialize());
  app.use(passport.session());

  /** Web routes initialization */
  app.use(express.static('public'));
  app.use('/auth', auth);

  /** ******************************** */
  /** ******* Start the server ******* */
  /** ******************************** */
  var port = process.env.PORT;
  if (!port) {
    port = hostConfig.port;
  }
  var server = app.listen(port, function() {
    var host = server.address().address;
    var port = server.address().port;

    winston.info('Taskplanner listening at http://%s:%s', host, port);
  });

  process.on('SIGTERM', function() {
    server.close(function() {
      winston.info('Taskplanner shutdown at ' + new Date());
      process.exit(0);
    });
  });

})();
