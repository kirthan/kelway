var ServerModel 	= require('../../src/plugins/server'),
	Mock 				= require('./../mock'),
	mongoose			= require('mongoose'),
	should 				= require('should');

var _model, validServerID;

//Clear 'orange_testing' Database before excecuting testcases.
var conn = mongoose.connect('mongodb://localhost:27017/orange_testing'); 

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
	userDetails = {
		company_id : "dummy",
		_id: "dummy"
	},

	authMock = new Mock([
		{name:'getRoles', callback_args:[["admin"]]},
		{name:'getUserDetails',callback_args:[userDetails]}
	]);

	pluginMock 	= {
		db: dbMock,
		auth : authMock
	}

	appMock 	= {
		plugins : pluginMock,
		auth: authMock
	}

	_model		= new ServerModel(appMock);

	setup(function(done){

	var serverModel = {
		company_id             : "dummy",
        nimsoft_id             : "dummy",
		customerPrefix         : "dummy",
        name    	           : "dummy",
        description            : "dummy",
        notes   	           : "dummy",
        class   	           : "dummy",
        ip_address   	       : "dummy",
        operating_system       : "dummy",
        instance_size          : "dummy",
        has_service_backup     : true,
        has_service_security   : true,
        has_service_protection : true,
        has_service_monitoring : true
	}
	
	_model.addServer(serverModel, function(result){
		result.should.not.be.false;
		validServerID = result._id;
		done();
	});
});


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
			params.company.should.equal(".*");
			done();
		});
	})
});	