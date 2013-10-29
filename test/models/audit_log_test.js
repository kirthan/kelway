var AuditLogModel = require('../../src/plugins/audit_log'),
	nodemock 	  = require('nodemock'),
	mongoose	  = require('mongoose'),
	should 		  = require('should');

	//Clear 'orange_testing' Database before excecuting testcases.
var _model, conn = mongoose.createConnection('mongodb://localhost:27017/orange_testing'); 

mongoose.connection.on('open', function(){
	mongoose.connection.db.dropDatabase(function(err){
		  if(err){
            throw new Error('Cannot drop DB.' + err);
        }
	});
});

suiteTeardown(function(done){
	mongoose.disconnect();
	done();
});

var dbMock = {
	Schema : mongoose.Schema,
	conn   : conn
}, 
reqForLogout = { 
	params : {
		access_token : "dummy"
	},
	url 	: "logout",
	query   : {
		access_token : "dummy"
	}
},
req = {
	params : {
		access_token : "dummy"
	},
	url 	: "dummy",
	query   : {
		access_token : "dummy"
	}
}
user 		= {
	_id : "dummy",
	user_name: "dummy"
}, 
routeInfo 	= {
	params : {
		audit_log_message : "dummy"
	}
},
params = {
	user_id 	: "dummy",
	user_name 	: "dummy"
}
authMock 		= nodemock.mock("getUserDetails").takes(req.params.access_token, function(){}).calls(1, [user]).times(10),
userMock 		= nodemock.mock("getUser").takes(params.user_id, function(){}).calls(1, [user]).times(10);
routerMock      = nodemock.mock("on").takes('BeforeRoute', function(){}).calls(1, [reqForLogout, routeInfo, null, function(){}]).times(1);
routerMock.mock("on").takes('AuthFailure', function(){}).calls(1, [req, routeInfo, null, function(){}]).times(1),
routerMock.mock("on").takes('AfterRoute', function(){}).calls(1, [req, routeInfo, null, function(){}]).times(1),
pluginMock 		= {
	db 			: dbMock,
	users 		: userMock
},
appMock  = {
	plugins : pluginMock,
	auth 	: authMock,
	users 	: userMock,
	router  : routerMock	
},
_model	= new AuditLogModel(appMock);

suite("Get User Name",function(){
	test("Valid", function(done){
		_model.getUserName(params, function(err, params){
			should.not.exist(err);
			done();
		})
	})	
});

suite("Get Params",function(){
	test("Valid", function(done){
		var localParams = {
			params : [{dummy : "dummy"}]
		}
		_model.getParams(localParams, function(err, modifiedParams){
			modifiedParams.params.dummy.should.equal('dummy');
			done();
		})
	})

	test("InValid", function(done){
		var localParams = {}
		_model.getParams(localParams, function(err, modifiedParams){
			should.not.exist(modifiedParams.params);
			done();
		})
	})
});

suite("Set Query", function(){
	test("Valid", function(done){
		var localParams = {
			user_id : "dummy",
			date : 123123123
		}
		_model.setQuery(localParams, function(err,modifiedParams){
			localParams.user_id.should.equal("dummy");
		})
		done();
	})

	test("Invalid", function(done){
		var localParams = {}
		_model.setQuery(localParams, function(err,modifiedParams){
			localParams.user_id.should.equal(".*");
		})
		done();
	})
})
