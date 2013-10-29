// var EmailService = require('../src/plugins/email'),
// 	Mock = require('./mock'),
// 	should = require('should'),
// 	confFile        = __dirname + '/conf/conf.json',
// 	fs 				= require('fs'),
// 	JSONConfReader  = require('../src/lib/conf_reader/json_reader'),
// 	ServiceApp      = require('../src/app/service_app'),
// 	restify         = require('restify');

// suite("Login",function(){
// 	test("Valid User",function(){
// 		var theApp = new ServiceApp(new JSONConfReader(confFile, fs), restify);
// 		emailService = new EmailService(theApp,fs);
// 		emailService.sendMail();
// 	});
// })