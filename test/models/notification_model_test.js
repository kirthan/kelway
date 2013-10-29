var NotificationModel 	= require('../../src/plugins/notification'),
	Mock 				= require('./../mock'),
	mongoose			= require('mongoose'),
	should 				= require('should');

//Clear 'orange_testing' Database before excecuting testcases.
var conn = mongoose.createConnection('mongodb://localhost:27017/orange_testing'); 

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
	
	pluginMock 	= {db: dbMock},

	userDetails = {
		company_id : "dummy",
		_id: "dummy"
	},
	
	authMock = new Mock([
		{name:'getRoles', callback_args:[["admin"]]},
		{name:'getUserDetails',callback_args:[userDetails]}
	]),

	appMock = {
		auth : authMock,
		plugins : pluginMock
	},
		
	_model	= new NotificationModel(appMock);


suite("Get Company",function(){
	test(" For Admin OR SuperAdmin As User",function(done){

		var params = {
			access_token : "dummy"
		};
		_model.getCompany(params, function(err,params){
			err[0].should.equal("not authorised");
			_model.remove;
			done();
		});
	})

	test(" For Normal User",function(done){
		done();
	})
});	

suite("Set Params",function(){
	test(" For Normal User",function(done){
		
		var params = {
			access_token : "dummy"
		}
		_model.setParams(params, function(err,params){
			params.created_by.should.equal("dummy");
			done();
		});
	})
});	

suite("Resolve URL",function(){
	test(" For Normal User",function(done){

		var params = {
			access_token : "dummy"
		}
		_model.resolveUrl(params, function(err,params){
			params.resolved_by.should.equal("dummy");
			done();
		});
	})
});
