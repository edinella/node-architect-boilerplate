// get dependencies
var architect = require('architect');
var path = require('path');
var fs = require('fs');

// get app and their tests
describe('Plugins', function(){
  this.timeout(5000);
  it('should import tests', function(done){
    
    // get general configs
    var configPath = path.join(__dirname, "../config.js");
    var configDirname = path.dirname(configPath);
    var config = require(configPath);
    
    // through each setting
    for(var i=0,l=config.length;i<l;i++) {
      
      // replaces test preferences
      if(typeof config[i] == 'object')
        for(var prop in config[i])
          if(prop.indexOf('test_') === 0) {
            config[i][prop.substr(5)] = config[i][prop];
            delete config[i][prop];
          }
      
      // discovers test plugins
      var packagePath = config[i].packagePath || config[i];
      if(packagePath.substr(0,2) == './'){
        var packageName = packagePath.replace('./plugins/', '');
        packagePath = path.resolve(__dirname, '../', packagePath, packageName+'.test');
        if(fs.existsSync(packagePath))
          config.push(packagePath);
      }
    }
    
    // starts architect plugin with the proper configuration
    config = architect.resolveConfig(config, configDirname);
    architect.createApp(config, function(err, app){
      if(err) throw new Error('Cannot get app');
      
      // imports tests
      for(var serviceName in app.services)
        if(serviceName.slice(-5) == '.test')
          describe('Plugin '+serviceName, function(){
            (function addSuiteObject(obj) {
              for(var key in obj) {
                var item = obj[key];
                if('function' == typeof item) {
                  switch(key) {
                    case 'before': before(item); break;
                    case 'after': after(item); break;
                    case 'beforeEach': beforeEach(item); break;
                    case 'afterEach': afterEach(item); break;
                    default: it(key, item);
                  }
                }
                else
                  describe(key, function(){
                    addSuiteObject.call(this, item);
                  });
              }
            })(app.services[serviceName]);
          });
      
      // runs imported tests
      done();
    });
  });
});