/**
 * This module exports an array indicating which plugins should be initialized; Each plugin can be represented by a string that is the path to the plugin.
 * Instead, the plugin can also be an object, identifying the plugin through the property "PackagePath" and containing other desired settings for the plugin.
 * Configurations starting with "test_" replace their similar when running the tests.
 **/
module.exports = [
  "./plugins/products",
  {
    "packagePath": "./node_modules/architect-logger",
    "exitOnError": false,
    "transports": {
      "console": {
        "colorize": true,
        "level": "verbose"
      },
      "file": {
        "filename": "./logs/errors.log",
        "level": "warn"
      }
    }
  },
  {
    "packagePath": "./plugins/app",
    "port": process.env.PORT || 80,
    "host": process.env.IP || "0.0.0.0"
  },
  {
    "packagePath": "./plugins/express",
    "staticPath": "public",
    "view engine": "jade",
    "locals": {
      "pretty": true
    },
    "options.sessionSecret": "X-3K3jU$08243R;up5Dp",
  }
];