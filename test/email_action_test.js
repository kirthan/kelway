var EmailModel = require('../src/plugins/email_action'),
	Mock = require('nodemock')
	should = require('should');

var
appMock = Mock.mock("get").takes('DESTINATION_EMAIL').returns("dummy@dummy.com").times(18),
 user = {
	company_id : "dummy"
	}, 
	company = {
		account_manager : "dummy"
	},
    params = {
		access_token : "dummy",
		serverID : "dummy"
	},
	accountManager = {
		email  : "dummy@dummy.com",
		first_name : "dummy",
		last_name : "dummy"
	},
	theParams 		= {
		user 				: user,
		customer			: company,
		server 				: true,
		requested_server	: null,
		accountManager      : accountManager,
		params 				: params,
	},
	authMock = Mock.mock("getUserDetails").takes('dummy',function(){}).calls(1, [user]).times(18),
		
	serversMock = Mock.mock("getServer").takes('dummy',function(){}).calls(1, [true]).times(18),
		
	serversRequestMock = Mock.mock("getServer").takes('dummy',function(){}).calls(1, [null]).times(18),
		
	companiesMock = Mock.mock("getCompany").takes('dummy', function(){}).calls(1, [company]).times(18),
		
	usersMock = Mock.mock("getUser").takes('dummy', function(){}).calls(1, [accountManager]).times(18),

	accountManagersMock = Mock.mock("getAccountManager").takes('dummy', function(){}).calls(1, [accountManager]).times(18),

	pluginsMock = {
			servers : serversMock,
			server_requests : serversRequestMock,
			companies : companiesMock,
			users :usersMock,
			account_managers : accountManagersMock
		};

	appMock.auth = authMock;		

suite("Attach Media",function(){
	test("Valid Scenario",function(done){
		emailsMock 				= Mock.mock("sendMail").takes("attach_media", theParams, "Attach Media", "dummy@dummy.com", "dummy dummy");
		pluginsMock.emails		= emailsMock;
		appMock.plugins 		= pluginsMock;
		
		// mock("foo").takes(10, [10, 20, 30]).returns(98);
		// getMock = Mock.mock().takes('DESTINATION_EMAIL').returns(98).times(18),
		// appMock.get = getMock,
		// appMock2 = Mock.mock("get").takes('DESTINATION_EMAIL').returns(98).times(18),
		// appMock2.plugins = pluginsMock;
		// console.log(appMock2.get("DESTINATION_EMAIL"));
		// console.log(appMock.plugins);
		var emailActionsModel 	= new EmailModel(appMock) ;
		
		emailActionsModel.attachMedia(params, function(err, success){
			success.should.be.true;
			done();
		})
	})

	test("Invalid Scenario",function(done){
		emailsMock			= Mock.mock("sendMail").takes("attach_media", theParams, "Attach Media", "dummy@dummy.com", "dummy dummy");
		authMock2 			= Mock.mock("getUserDetails").takes('dummy',function(){}).calls(1, [false]).times(18),
		pluginsMock.emails 	= emailsMock;
		appMock.plugins 	= pluginsMock;
		appMock2 			= {
			auth 	: authMock2,
			plugins : pluginsMock
		}
		var emailActionsModel = new EmailModel(appMock2) ;

		emailActionsModel.attachMedia(params, function(err, success){
			success.should.be.false;
			done();
		})
	})

})

suite("Delete Server",function(){
	test("Valid Scenario",function(done){
		
		emailsMock 				= Mock.mock("sendMail").takes("delete_server", theParams, "Delete Server", "dummy@dummy.com", "dummy dummy");
		pluginsMock.emails 		= emailsMock;
		appMock.plugins 		= pluginsMock;
		var emailActionsModel 	= new EmailModel(appMock) ;

		emailActionsModel.deleteServer(params, function(err, success){
			success.should.be.true;
			done();
		})
	})

	test("Invalid Scenario",function(done){
		emailsMock 		= Mock.mock("sendMail").takes("delete_server", theParams, "Delete Server", "dummy@dummy.com", "dummy dummy");
		serversMock2 	= Mock.mock("getServer").takes('dummy',function(){}).calls(1, [false]).times(18),
		pluginsMock2 	= {
			servers 			: serversMock2,
			server_requests 	: serversRequestMock,
			companies 			: companiesMock,
			users 				:usersMock,
			emails 				: emailsMock
		},
		appMock.plugins 	= pluginsMock2;
		var emailActionsModel = new EmailModel(appMock) ;

		emailActionsModel.deleteServer(params, function(err, success){
			success.should.be.false;
			done();
		})
	})

})

suite("Detach Media",function(){
	test("Valid Scenario",function(done){
		emailsMock 				= Mock.mock("sendMail").takes("detach_media", theParams, "Detach Media", "dummy@dummy.com", "dummy dummy");
		pluginsMock.emails 		= emailsMock;
		appMock.plugins 		= pluginsMock;
		var emailActionsModel 	= new EmailModel(appMock) ;
		
		emailActionsModel.detachMedia(params, function(err, success){
			success.should.be.true;
			done();
		})
	})

	test("Invalid Scenario",function(done){
		emailsMock = Mock.mock("sendMail").takes("detach_media", theParams, "Detach Media", "dummy@dummy.com", "dummy dummy");
		companiesMock2 			= Mock.mock("getCompany").takes('dummy', function(){}).calls(1, [false]).times(1);
		pluginsMock2 			= {
			servers 		: serversMock,
			server_requests : serversRequestMock,
			companies		: companiesMock2,
			users 			: usersMock,
			emails 			: emailsMock
		},
		appMock.plugins 		= pluginsMock2;
		var emailActionsModel 	= new EmailModel(appMock) ;

		emailActionsModel.detachMedia(params, function(err, success){
			success.should.be.false;
			done();
		})
	})
})

suite("Edit Descreption",function(){
	test("Valid Scenario",function(done){
		emailsMock 				= Mock.mock("sendMail").takes("edit_description", theParams, "Edit Descreption", "dummy@dummy.com", "dummy dummy");
		pluginsMock.emails 		= emailsMock;
		appMock.plugins 		= pluginsMock;
		var emailActionsModel 	= new EmailModel(appMock) ;

		emailActionsModel.editDescription(params, function(err, success){
			success.should.be.true;
			done();
		})
	})

	test("Invalid Scenario",function(done){
		emailsMock 		= Mock.mock("sendMail").takes("edit_description", theParams, "Edit Descreption", "dummy@dummy.com", "dummy dummy");
		usersMock2 		= Mock.mock("getUser").takes('dummy', function(){}).calls(1, [false]).times(9),
		accountManagersMock2 = Mock.mock("getAccountManager").takes('dummy', function(){}).calls(1, [false]).times(9),
		pluginsMock2 	= {
			servers : serversMock,
			server_requests : serversRequestMock,
			companies : companiesMock,
			users :usersMock2,
			emails : emailsMock,
			account_managers : accountManagersMock2
		},
		appMock.plugins 		= pluginsMock2;
		var emailActionsModel 	= new EmailModel(appMock) ;

		emailActionsModel.editDescription(params, function(err, success){
			success.should.be.false;
			done();
		})
	})
})


suite("Power Off Server",function(){
	test("Valid Scenario",function(done){
		emailsMock 				= Mock.mock("sendMail").takes("power_off_server", theParams, "Power Off Server", "dummy@dummy.com", "dummy dummy");
		pluginsMock.emails 		= emailsMock;
		appMock.plugins 		= pluginsMock;
		var emailActionsModel 	= new EmailModel(appMock) ;

		emailActionsModel.powerOffServer(params, function(err, success){
			success.should.be.true;
			done();
		})
	})

	test("Invalid Scenario",function(done){
		
		emailsMock 			= Mock.mock("sendMail").takes("power_off_server", theParams, "Power Off Server", "dummy@dummy.com", "dummy dummy");
		authMock2 			= Mock.mock("getUserDetails").takes('dummy',function(){}).calls(1, [false]).times(18),
		pluginsMock.emails	= emailsMock;
		appMock.plugins 	= pluginsMock;
		appMock2			= {
			auth 		: authMock2,
			plugins 	: pluginsMock
		}
		var emailActionsModel = new EmailModel(appMock2) ;

		emailActionsModel.powerOffServer(params, function(err, success){
			success.should.be.false;
			done();
		})
	})
})


suite("Reset Server",function(){
	test("Valid Scenario",function(done){
		emailsMock 				= Mock.mock("sendMail").takes("reset_server", theParams, "Reset Server", "dummy@dummy.com", "dummy dummy");
		pluginsMock.emails 		= emailsMock;
		appMock.plugins 		= pluginsMock;
		var emailActionsModel	= new EmailModel(appMock) ;

		emailActionsModel.resetServer(params, function(err, success){
			success.should.be.true;
			done();
		})
	})

	test("InValid Scenario",function(done){
		emailsMock 			= Mock.mock("sendMail").takes("reset_server", theParams, "Reset Server", "dummy@dummy.com", "dummy dummy");
		authMock2 			= Mock.mock("getUserDetails").takes('dummy',function(){}).calls(1, [false]).times(18),
		pluginsMock.emails 	= emailsMock;
		appMock.plugins		= pluginsMock;
		appMock2 			= {
			auth 	: authMock2,
			plugins : pluginsMock
		}
		var emailActionsModel = new EmailModel(appMock2) ;

		emailActionsModel.resetServer(params, function(err, success){
			success.should.be.false;
			done();
		})
	})
})
suite("Shutdown Server",function(){
	test("Valid Scenario",function(done){
		emailsMock 				= Mock.mock("sendMail").takes("shutdown_server", theParams, "Shutdown Server", "dummy@dummy.com", "dummy dummy");
		pluginsMock.emails		= emailsMock;
		appMock.plugins			= pluginsMock;
		var emailActionsModel	= new EmailModel(appMock) ;

		emailActionsModel.shutdownServer(params, function(err, success){
			success.should.be.true;
			done();
		})
	})

	test("Invalid Scenario",function(done){
		emailsMock 			= Mock.mock("sendMail").takes("shutdown_server", theParams, "Shutdown Server", "dummy@dummy.com", "dummy dummy");
		authMock2 			= Mock.mock("getUserDetails").takes('dummy',function(){}).calls(1, [false]).times(18),
		pluginsMock.emails 	= emailsMock;
		appMock.plugins 	= pluginsMock;
		appMock2 			= {
			auth : authMock2,
			plugins : pluginsMock
		}
		var emailActionsModel = new EmailModel(appMock2) ;

		emailActionsModel.shutdownServer(params, function(err, success){
			success.should.be.false;
			done();
		})
	})
})

suite("SSH Details",function(){
	test("Valid Scenario",function(done){
		emailsMock 				= Mock.mock("sendMail").takes("ssh_details", theParams, "SSH Details", "dummy@dummy.com", "dummy dummy");
		pluginsMock.emails 		= emailsMock;
		appMock.plugins 		= pluginsMock;
		var emailActionsModel 	= new EmailModel(appMock);
		
		emailActionsModel.sshDetails(params, function(err, success){
			success.should.be.true;
			done();
		})
	})

	test("Invalid Scenario",function(done){
		emailsMock 			= Mock.mock("sendMail").takes("ssh_details", theParams, "SSH Details", "dummy@dummy.com", "dummy dummy");
		authMock2 			= Mock.mock("getUserDetails").takes('dummy',function(){}).calls(1, [false]).times(18),
		pluginsMock.emails 	= emailsMock;
		appMock.plugins 	= pluginsMock;
		appMock2 			= {
			auth : authMock2,
			plugins : pluginsMock
		}
		var emailActionsModel =	new EmailModel(appMock2) ;

		emailActionsModel.sshDetails(params, function(err, success){
			success.should.be.false;
			done();
		})
	})
})


suite("Upgrade Server",function(){
	test("Valid Scenario",function(done){
		emailsMock 				= Mock.mock("sendMail").takes("upgrade_server", theParams, "Upgrade Server", "dummy@dummy.com", "dummy dummy");
		pluginsMock.emails 		= emailsMock;
		appMock.plugins 		= pluginsMock;
		var emailActionsModel 	= new EmailModel(appMock) ;
		
		emailActionsModel.upgradeServer(params, function(err, success){
			success.should.be.true;
			done();
		})
	})

	test("Invalid Scenario",function(done){
		emailsMock 				= Mock.mock("sendMail").takes("upgrade_server", theParams, "Upgrade Server", "dummy@dummy.com", "dummy dummy");
		usersMock2				= Mock.mock("getUser").takes('dummy', function(){}).calls(1, [false]).times(9),
		accountManagersMock2    = Mock.mock("getAccountManager").takes('dummy', function(){}).calls(1, [false]).times(10),
		pluginsMock2 			= {
			servers : serversMock,
			server_requests : serversRequestMock,
			companies : companiesMock,
			users :usersMock2,
			emails : emailsMock,
			account_managers : accountManagersMock2
		},

		appMock.plugins 		= pluginsMock2;
		var emailActionsModel 	= new EmailModel(appMock) ;
		
		emailActionsModel.upgradeServer(params, function(err, success){
			success.should.be.false;
			done();
		})
	})
})