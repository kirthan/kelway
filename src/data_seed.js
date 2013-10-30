//     Injects all the dependencies to ServiceApp Container 

// Load required modules.
var restify         = require('restify'),
	fs 				= require('fs'),
	async           = require('async'),
	ServiceApp      = require('./app/service_app'), // Main app
	JSONRouteSetup  = require('./lib/router/setup'), // Router
	JSONPluginSetup = require('./lib/plugins/setup'), // Plugin Container
	Auth 			= require('./lib/auth'), // Authoriser
	DBUserInfo      = require('./lib/user_info/db_user_info'), // User info	
	Tokenizer 		= require('./lib/tokenizer'), 
	baseConfigFile  = __dirname + '/conf/conf.json', // Base Config file
	pluginConfFile  = __dirname + '/conf/plugins.json'; // Plugins config
	
	ConfigLoader 	= require('./config_loader.js'); // Configuration loader.

	
if(process.env.NODE_ENV){
	siteConfigFile  = __dirname + '/conf/env/'+ process.env.NODE_ENV +'.json';
	var theApp 		= new ServiceApp(new ConfigLoader(baseConfigFile, siteConfigFile, fs), restify);
	theApp.router  	= new JSONRouteSetup(fs);
	theApp.plugins 	= new JSONPluginSetup(pluginConfFile, fs);
	var userInfo   	= new DBUserInfo(theApp),
		tokenizer  	= new Tokenizer(theApp, fs, userInfo);
		
	theApp.auth    	= new Auth(userInfo,tokenizer);
	theApp.init(function(){
		seedData(theApp,function(){
			process.exit();
		});
	});
} else {
	throw new Error( process.env.NODE_ENV + ' Environment Not found');
}
	

function seedData(app, callback){
	var Customer = app.plugins.db.getModel('customer'),
		VirtualMechine = app.plugins.db.getModel('virtual_machine'),
		EmailAccount = app.plugins.db.getModel('email_account'),
		EmailContact = app.plugins.db.getModel('email_contact'),
		DistrubutionList = app.plugins.db.getModel('distribution_list');

	var calls = [
		function(cb){ Customer.remove({},function(err){ cb(err) }); },
		function(cb){ Customer.create(require('../demo_data/customer.json'), function(err){ cb(err) }); } ,
		function(cb){ VirtualMechine.remove({},function(err){ cb(err) }); },
		function(cb){ VirtualMechine.create(require('../demo_data/virtual_mechine.json'), function(err){ cb(err) }); }
		// function(cb){ EmailAccount.remove({},function(err){ cb(err) }); },
		// function(cb){ EmailAccount.create(require('../demo_data/email_account.json'), function(err){ cb(err) }); },
		// function(cb){ EmailContact.remove({},function(err){ cb(err) }); },
		// function(cb){ EmailContact.create(require('../demo_data/email_contact.json'), function(err){ cb(err) }); },
		// function(cb){ DistrubutionList.remove({},function(err){ cb(err) }); },
		// function(cb){ DistrubutionList.create(require('../demo_data/distrubution_list.json'), function(err){ cb(err) }); }
	]

	async.series(calls,function(err){
		callback(err);
	})
}