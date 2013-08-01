
// exports setup
module.exports = function setup(options, imports, register) {
  var products = imports.products;
  var app = imports.express.app;
  
  // API routes
  app.get('/api/products', products.index);
  app.post('/api/products', products.create);
  app.post('/api/products/:id', products.show);
  app.post('/api/products/:id', products.update);
  app.post('/api/products/:id', products.destroy);

  // starts apps, adds and registers it
  app.startServer(options.port, function serverStarted(){
    console.log("Server listening on port %d in %s mode", options.port, app.settings.env);
    register(null, {"app": {}});
  });
};