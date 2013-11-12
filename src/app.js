//     Injects all the dependencies to ServiceApp Container 

// Load required modules.
var restify         = require('restify'),
  fs        = require('fs'),
  ServiceApp      = require('./app/service_app'), // Main app
  JSONRouteSetup  = require('./lib/router/setup'), // Router
  JSONPluginSetup = require('./lib/plugins/setup'), // Plugin Container
  Auth      = require('./lib/auth'), // Authoriser
  DBUserInfo      = require('./lib/user_info/db_user_info'), // User info 
  Tokenizer     = require('./lib/tokenizer'), 
  baseConfigFile  = __dirname + '/conf/conf.json', // Base Config file
  pluginConfFile  = __dirname + '/conf/plugins.json'; // Plugins config
  
  ConfigLoader  = require('./config_loader.js'), // Configuration loader.
  siteConfigFile = null;
  
  if(process.env.NODE_ENV){
    siteConfigFile  = __dirname + '/conf/env/'+ process.env.NODE_ENV +'.json';
  }
  
  var theApp    = new ServiceApp(new ConfigLoader(baseConfigFile, siteConfigFile, fs), restify);
  theApp.router   = new JSONRouteSetup(fs);
  theApp.plugins  = new JSONPluginSetup(pluginConfFile, fs);
  var userInfo    = new DBUserInfo(theApp),
    tokenizer   = new Tokenizer(theApp, fs, userInfo);
    
  theApp.auth     = new Auth(userInfo,tokenizer);
  theApp.init(function(){
    theApp.run();
  });