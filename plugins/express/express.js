
// requires dependencies
var http = require('http');
var express = require('express');

// prepare app
var app = express();

/**
 * Recursively applies the routes of application from an object map
 * @param {mixed} map Map
 * @param {string} route Route to receive the actions
 */
app.map = function map(routeMap, route) {
  var done = function () {};
  route = route || '';
  for (var key in routeMap)
    switch (typeof routeMap[key]) {
      case 'object':
        if (routeMap[key] instanceof Array) app[key].apply(app, [route].concat(routeMap[key], [done]));
        else app.map(routeMap[key], route + key);
        break;
      case 'function':
        app[key](route, routeMap[key], done);
        break;
    }
};

/**
 * Removes routes whose path starts with the given string
 * @param {string} startingWith Beginning of the route to be removed
 */
app.removeRoutes = function removeRoutes(startingWith) {
  for (var method in app.routes)
    app.routes[method] = app.routes[method].filter(function noAPIRoute(route) {
      return route.path.indexOf(startingWith) !== 0;
    });
};

/**
 * Starts server
 * @param {function} done Success callback
 */
app.startServer = function startServer(port, done) {

  // prepares a dignified death
  process.on('SIGINT', function stop() {
    app.httpserver.close();
    process.exit(0);
  });

  // starts server
  app.httpserver = http.createServer(app).listen(port, done);
};

// exports setup
module.exports = function setup(options, imports, register) {
  
  // apply basic configs
  app.configure(function configure(){
    if(typeof options['view engine'] != 'undefined')
      app.set('view engine', options['view engine']);
    if(typeof options.locals != 'undefined')
      for(var local in options.locals)
        app.locals[local] = options.locals[local];
    
    // apply default middlewares
    app.use(express.compress());
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    if(typeof options.sessionSecret != 'undefined')
      app.use(express.session({secret: options.sessionSecret}));
    app.use(express.methodOverride());
    app.use(express.favicon());
    if(typeof options.staticPath != 'undefined')
      app.use(express.static(options.staticPath));
    app.use(app.router);
  });
  app.configure('development', function configureDevelopment(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  });
  app.configure('production', function configureProduction(){
    app.use(express.errorHandler());
  });
  
  app.use(express.logger({"stream": {"write": imports.logger.verbose}}));
  
  // plugin register
  register(null, {"express": {
    "lib":express,
    "app":app
  }});
};