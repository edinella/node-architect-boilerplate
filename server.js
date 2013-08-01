
// requires dependencies
var path = require('path');
var architect = require('architect');

// requires configs
var configName = process.argv[2] || 'config';
var configPath = path.join(__dirname, configName);
var config = architect.loadConfig(configPath);

// starts app
architect.createApp(config).on('ready', function(app){
  console.log('Started with "%s" config file.', configName);
});