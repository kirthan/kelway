var ServerRequestModel 	= require('../../src/plugins/server_request'),
	Mock 				= require('./../mock'),
	mongoose			= require('mongoose'),
	should 				= require('should'),
	nodemock 			= require('nodemock');

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
emailActionsMock = nodemock.mock("sendServerRequestEmail").takes('dummy', function(){}).calls(1, [null,true]).times(1);
pluginMock = {
	db: dbMock,
	email_actions: emailActionsMock
	},

userDetails = {
	company_id : "dummy"
},



authMock = new Mock([
	{name:'getRoles', callback_args:[["user"]]},
	{name:'getUserDetails',callback_args:[userDetails]}
]),

appMock = nodemock.mock("get").takes('BASIC_SMALL_VMS_PRICE').returns(1).times(9);
appMock.mock("get").takes('ESSENTIAL_SMALL_VMS_PRICE').returns(2).times(9);
appMock.mock("get").takes('PREMIUM_SMALL_VMS_PRICE').returns(3).times(9);
appMock.mock("get").takes('BASIC_MEDIUM_VMS_PRICE').returns(4).times(9);
appMock.mock("get").takes('ESSENTIAL_MEDIUM_VMS_PRICE').returns(5).times(9);
appMock.mock("get").takes('PREMIUM_MEDIUM_VMS_PRICE').returns(6).times(9);
appMock.mock("get").takes('BASIC_LARGE_VMS_PRICE').returns(7).times(9);
appMock.mock("get").takes('ESSENTIAL_LARGE_VMS_PRICE').returns(8).times(9);
appMock.mock("get").takes('PREMIUM_LARGE_VMS_PRICE').returns(9).times(9);

appMock.plugins = pluginMock;
appMock.auth = authMock;
_model		= new ServerRequestModel(appMock);

suiteTeardown(function(done){
	mongoose.disconnect();
	done();
});



setup(function(done){

	var serverRequestModel = {
		company_id             : "dummy",
        server_size            : "small",
        class           	   : "premium",
        operating_system       : "dummy",
        location               : "dummy",
        network                : "dummy",
        name                   : "dummy",
        description            : "dummy",
        password               : "dummy",
        backup_service         : true,
        additional_storage     : "dummy",
        ltr_policy_a           : true,
        ltr_policy_b           : true,
        ltr_policy_c           : true,
        ltr_policy_d           : true,
        is_confirmed           : true,
        server_cost            : "dummy",
        memory_cost            : "dummy",
        total_cost             : "dummy"	
	}
	
	_model.addServer(serverRequestModel, function(result){
		result.should.not.be.false;
		validServerRequestID = result._id;
		done();
	});
});

suite("Get Server Request",function(){

	test(" Invalid Server Request ID ",function(done){
		var ObjectId = mongoose.Types.ObjectId;
		_model.getServer( new ObjectId(), function(serverRequestModel){
			serverRequestModel.should.be.false;
			done();
		});
	})

	test(" Valid Server Request ID ",function(done){
		_model.getServer(validServerRequestID, function(serverRequestModel){
			serverRequestModel.should.not.be.false;
			done();
		});
	})
});	

suite("Get Company",function(){
	test(" For Normal User",function(done){
		var params = {
			access_token : "dummy"
		}
	
		_model.getCompany(params, function(err,params){
			params.company_id.should.equal("dummy");
			done();
		});
	})
});	


suite("Validate Mandatory Fields",function(){
	test("For Success Scenario",function(done){
		
		var params = {
			id : validServerRequestID
		}
	
		_model.validateMandatoryFields(params, function(err,params){
			params.is_confirmed.should.be.true;
			done();
		});
	})

	test(" For Failure Scenario",function(done){
		
		localParams = {
			 name     : "dummy"
		}
		var params = {
			access_token : "dummy"
		}
		
		_model.addServer(localParams, function(result){
			var params = {
				id : result._id
			}
			_model.validateMandatoryFields(params, function(err,params){
				console.log(params);
				should.not.exist(params.is_confirmed);
				done();
			});
		});
	})
});

suite("generate Password",function(){
	test(" Valid User ",function(done){
	
		var params = {
			password : "dummy"
		}
		
		_model.generatePassword(params, function(err, params){
			should.exist(params.password);
			done();
		});
	})
});		

suite("Update Cost",function(){
	test(" Invalid Server ",function(done){
		var ObjectId = mongoose.Types.ObjectId;
		var params = {
			id : new ObjectId()
		}
		_model.updateCost(params, function(err, params){
			console.log(err);
			// err.should.not.be.equal(null);
			done();
		});
	})

	test("Server Costs For BASIC_SMALL_VMS_PRICE",function(done){
		var localParams = {
		        server_size            : "small",
		        class           	   : "basic",
		}
		_model.addServer(localParams, function(result){
			var params = {
				id : result._id
			}
			_model.updateCost(params, function(err,params){
				params.server_cost.should.be.equal("1.00");
				done();
			});
		});

	})

	test("Server Costs For ESSENTIAL_SMALL_VMS_PRICE",function(done){
		var localParams = {
		        server_size            : "small",
		        class           	   : "essential",
		}
		_model.addServer(localParams, function(result){
			var params = {
				id : result._id
			}
			_model.updateCost(params, function(err,params){
				params.server_cost.should.be.equal("2.00");
				done();
			});
		});

	})

	test("Server Costs For PREMIUM_SMALL_VMS_PRICE",function(done){
		var localParams = {
		        server_size            : "small",
		        class           	   : "premium",
		}
		_model.addServer(localParams, function(result){
			var params = {
				id : result._id
			}
			_model.updateCost(params, function(err,params){
				params.server_cost.should.be.equal("3.00");
				done();
			});
		});

	})

	test("Server Costs For BASIC_MEDIUM_VMS_PRICE",function(done){
		var localParams = {
		        server_size            : "medium",
		        class           	   : "basic",
		}
		_model.addServer(localParams, function(result){
			var params = {
				id : result._id
			}
			_model.updateCost(params, function(err,params){
				params.server_cost.should.be.equal("4.00");
				done();
			});
		});

	})

	test("Server Costs For ESSENTIAL_MEDIUM_VMS_PRICE",function(done){
		var localParams = {
		        server_size            : "medium",
		        class           	   : "essential",
		}
		_model.addServer(localParams, function(result){
			var params = {
				id : result._id
			}
			_model.updateCost(params, function(err,params){
				params.server_cost.should.be.equal("5.00");
				done();
			});
		});

	})

	test("Server Costs For PREMIUM_MEDIUM_VMS_PRICE",function(done){
		var localParams = {
		        server_size            : "medium",
		        class           	   : "premium",
		}
		_model.addServer(localParams, function(result){
			var params = {
				id : result._id
			}
			_model.updateCost(params, function(err,params){
				params.server_cost.should.be.equal("6.00");
				done();
			});
		});

	})

	test("Server Costs For BASIC_LARGE_VMS_PRICE",function(done){
		var localParams = {
		        server_size            : "large",
		        class           	   : "basic",
		}
		_model.addServer(localParams, function(result){
			var params = {
				id : result._id
			}
			_model.updateCost(params, function(err,params){
				params.server_cost.should.be.equal("7.00");
				done();
			});
		});

	})

	test("Server Costs For ESSENTIAL_LARGE_VMS_PRICE",function(done){
		var localParams = {
		        server_size            : "large",
		        class           	   : "essential",
		}
		_model.addServer(localParams, function(result){
			var params = {
				id : result._id
			}
			_model.updateCost(params, function(err,params){
				params.server_cost.should.be.equal("8.00");
				done();
			});
		});

	})

	test("Server Costs For PREMIUM_LARGE_VMS_PRICE",function(done){
		var localParams = {
		        server_size            : "large",
		        class           	   : "premium",
		}
		_model.addServer(localParams, function(result){
			var params = {
				id : result._id
			}
			_model.updateCost(params, function(err,params){
				params.server_cost.should.be.equal("9.00");
				done();
			});
		});

	})

	test("Server Costs With memory_cost",function(done){
		var localParams = {
		        server_size            : "large",
		        class           	   : "premium",
		}
		_model.addServer(localParams, function(result){
			var params = {
				id : result._id,
				additional_storage: 20
			}
			_model.updateCost(params, function(err,params){
				params.memory_cost.should.be.equal("14.40");
				done();
			});
		});

	})
	test("NULL Server Cost",function(done){
		var localParams = {
		        server_size            : "dummy",
		        class           	   : "dummy",
		}
		_model.addServer(localParams, function(result){
			var params = {
				id : result._id
			}
			_model.updateCost(params, function(err,params){
				should.not.exist(params.server_cost);
				done();
			});
		});

	})

});	

suite("Set Backup Service",function(){
	test("Set To False",function(done){
		var params = {
			id : validServerRequestID
		}
	
		_model.setBackupService(params, function(err,params){
			params.backup_service.should.be.false;
			done();
		});
	})

	test("Set To True",function(done){
	
		var params = {
			backup_service : true
		}

		_model.setBackupService(params, function(err,params){
			params.backup_service.should.be.true;
			done();
		});
	})
});	

suite("Set LTR Service",function(){
	test("Set To False",function(done){
		var params = {
			id : validServerRequestID
		}
		
		_model.setLTRService(params, function(err,params){
			params.ltr_policy_a.should.be.false;
			done();
		});
	})

	test("Set To True",function(done){

		var params = {
			ltr_policy_a : true,
			ltr_policy_b : true,
			ltr_policy_c : true,
			ltr_policy_d : true
		}
	
		_model.setLTRService(params, function(err,params){
			params.ltr_policy_a.should.be.true;
			done();
		});
	})
});	


suite("Send Server Request Email",function(){
	test("Valid Test",function(done){
		var params = "dummy";
		_model.sendServerRequestEmail(params,function(err, params){
			should.not.exist(err);
			done();
		})
		
	})
});	