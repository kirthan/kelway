var EmailModel = require('../src/plugins/email_action'),
	Mock = require('nodemock')
	should = require('should');

var appMock = Mock.mock("get").takes('DESTINATION_EMAIL').returns("dummy@dummy.com").times(18),
 user = {
	company_id : "dummy"
	},	 
	company = {
		account_manager : "dummy"
	},
    params = {
		access_token : "dummy",
		serverID : "dummy",
		id:"dummy"
	},
	accountManager = {
		email  : "dummy@dummy.com",
		first_name : "dummy",
		last_name : "dummy"
	},
	theParams 		= {
		user 				: user,
		customer			: company,
		requested_server	: true,
		accountManager      : accountManager,
		params 				: params,
	},
	authMock = Mock.mock("getUserDetails").takes('dummy',function(){}).calls(1, [user]).times(5),
		
	serversRequestMock = Mock.mock("getServer").takes('dummy',function(){}).calls(1, [true]).times(5),
		
	companiesMock = Mock.mock("getCompany").takes('dummy', function(){}).calls(1, [company]).times(5),
		
	usersMock = Mock.mock("getUser").takes('dummy', function(){}).calls(1, [accountManager]).times(5),

	accountManagersMock = Mock.mock("getAccountManager").takes('dummy', function(){}).calls(1, [accountManager]).times(5),
		


	pluginsMock = {
			server_requests : serversRequestMock,
			companies : companiesMock,
			users :usersMock,
			account_managers: accountManagersMock
		};

	appMock.auth = authMock;

suite("Server Reuest",function(){
	test("Valid Scenario",function(done){
		emailsMock 				= Mock.mock("sendMail").takes("request_new_server", theParams, "Request New Server", "dummy@dummy.com", "dummy dummy");
		pluginsMock.emails		= emailsMock;
		appMock.plugins 		= pluginsMock;
		var emailActionsModel 	= new EmailModel(appMock) ;
		
		emailActionsModel.sendServerRequestEmail(params, function(err, success){
			success.should.be.true;
			done();
		})
	})

	test("Invalid Scenario User As NULL",function(done){
		emailsMock 				= Mock.mock("sendMail").takes("request_new_server", theParams, "Request New Server", "dummy@dummy.com", "dummy dummy");
		authMock 				= Mock.mock("getUserDetails").takes('dummy',function(){}).calls(1, [false]).times(4);
		pluginsMock.emails		= emailsMock;

		appMock.plugins 		= pluginsMock;
		appMock.auth 			= authMock;
		var emailActionsModel 	= new EmailModel(appMock) ;
		
		emailActionsModel.sendServerRequestEmail(params, function(err, success){
			success.should.be.false;
			done();
		})
	})

	test("Invalid Scenario Server As NULL",function(done){
		emailsMock 				= Mock.mock("sendMail").takes("request_new_server", theParams, "Request New Server", "dummy@dummy.com", "dummy dummy");
		serversRequestMock = Mock.mock("getServer").takes('dummy',function(){}).calls(1, [false]).times(4),
		pluginsMock.emails		= emailsMock;
		pluginsMock.requested_server = serversRequestMock;
		appMock.plugins 		= pluginsMock;
		var emailActionsModel 	= new EmailModel(appMock) ;
		emailActionsModel.sendServerRequestEmail(params, function(err, success){
			success.should.be.false;
			done();
		})
	})

	test("Invalid Scenario Customer As NULL",function(done){
		emailsMock 				= Mock.mock("sendMail").takes("request_new_server", theParams, "Request New Server", "dummy@dummy.com", "dummy dummy");
		companiesMock = Mock.mock("getCompany").takes('dummy', function(){}).calls(1, [false]).times(4),
		pluginsMock.emails		= emailsMock;
		pluginsMock.company 	= companiesMock;
		appMock.plugins 		= pluginsMock;
		var emailActionsModel 	= new EmailModel(appMock) ;
		emailActionsModel.sendServerRequestEmail(params, function(err, success){
			success.should.be.false;
			done();
		})
	})
})	
