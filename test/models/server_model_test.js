var ServerModel 	= require('../../src/plugins/server'),
	Mock 				= require('./../mock'),
	mongoose			= require('mongoose'),
	should 				= require('should');

var _model, validServerID;

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
userDetails = {
	company_id : "dummy",
	_id: "dummy"
},

authMock = new Mock([
	{name:'getRoles', callback_args:[["user"]]},
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

suite("Get Server",function(){
	
	test(" Invalid Server ID ",function(done){
		var ObjectId = mongoose.Types.ObjectId;
		_model.getServer( new ObjectId(), function(serverModel){
			serverModel.should.be.false;
			done();
		});
	})

	test(" Valid Server ID ",function(done){
		_model.getServer(validServerID, function(serverModel){
			serverModel.should.not.be.false;
			done();
		});
	})
});	

suite("Get Company",function(){
	test(" For Admin OR SuperAdmin As User",function(done){
		done();
		// authMock = new Mock([
		// 	{name:'getRoles', return_value: ["admin"] }
		// ]);
		// var params = {
		// 	access_token : "dummy"
		// }
		// // app = {
		// // 	auth : authMock
		// // }
		// // _newModel		= new ServerModel(appMock);
		// _model.getServer(params, function(err,params){
		// 	params.company.serverModel.should.equal(".*");
		// 	done();
		// });
	})

	test(" For Normal User",function(done){
		var params = {
			access_token : "dummy"
		}
		
		_model.getCompany(params, function(err,params){
			params.company.should.equal("dummy");
			done();
		});
	})
});	

suite("Delete Users By Customer",function(){
	test("Valid",function(done){
		params = {
			company_id : "dummy",
		}
		_model.deleteServersByCustomer(params, function(err,params){
			should.not.exist(err);
			done();
		});
	})
});