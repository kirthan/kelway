//     Injects all the dependencies to ServiceApp Container 

// Load required modules.
var restify         = require('restify'),
	fs 				= require('fs'),
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
		seedData(theApp);
	});
} else {
	throw new Error( process.env.NODE_ENV + ' Environment Not found');
}
	

function seedData(app){
	var Customer = app.plugins.db.model('customer'),
		VirtualMechine = app.plugins.db.model('virtual_mechine'),
		EmailAccount = app.plugins.db.model('email_account'),
		EmailContact = app.plugins.db.model('email_contact'),
		DistrubutionList = app.plugins.db.model('distrubution_list');

	Customer.remove({},function(err){
		if(err) throw(err);

		Customer.seed(require('../demo_data/customer.json'));
	});


	VirtualMechine.remove({},function(err){
		if(err) throw(err);

		VirtualMechine.seed(require('../demo_data/virtual_mechine.json'));
	})


	EmailAccount.remove({},function(err){
		if(err) throw(err);

		EmailAccount.seed(require('../demo_data/email_account.json'));
	})


	EmailContact.remove({},function(err){
		if(err) throw(err);

		EmailContact.seed(require('../demo_data/email_contact.json'));
	})


	DistrubutionList.remove({},function(err){
		if(err) throw(err);

		DistrubutionList.seed(require('../demo_data/distrubution_list.json'));
	})
}