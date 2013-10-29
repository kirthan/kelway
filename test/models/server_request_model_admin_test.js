var ServerRequestModel 	= require('../../src/plugins/server_request'),
	Mock 				= require('./../mock'),
	mongoose			= require('mongoose'),
	should 				= require('should');

var _model, validServerRequestID;

//Clear 'orange_testing' Database before excecuting testcases.
var conn = mongoose.createConnection('mongodb://localhost:27017/orange_testing'); 

mongoose.connection.on('open', function(){
	mongoose.connection.db.dropDatabase(function(err){
		  if(err){
            throw new Error('Cannot drop DB.' + err);
        }
	});
});

var dbMock = {
	Schema : mongoose.Schema,
	conn   : conn
},

pluginMock = {db: dbMock},

userDetails = {
	company_id : "dummy"
},

authMock = new Mock([
	{name:'getRoles', callback_args:[["admin"]]},
	{name:'getUserDetails',callback_args:[userDetails]}
]),

appMock = new  Mock([
	{name:'get', return_value:1}
]),

appMock 	= {
	plugins : pluginMock,
	auth	: authMock
},

_model		= new ServerRequestModel(appMock);

suiteTeardown(function(done){
	mongoose.disconnect();
	done();
});

suite("Get Company",function(){
	test(" For Admin OR SuperAdmin As User",function(done){
		
		var params = {
			access_token : "dummy"
		}
		_model.getCompany(params, function(err,params){
			err[0].should.equal("admin/SuperAdmin cannot request server");
			done();
		});
	})
});	


