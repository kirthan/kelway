var UserModel 		= require('../../src/plugins/user'),
	Mock 			= require('./../mock'),
	nodemock 		= require('nodemock'),
	mongoose		= require('mongoose'),
	should 			= require('should'),
	MD5 			= require('MD5');

var _model, validUserID;

//Clear 'orange_testing' Database before excecuting testcases.
var conn = mongoose.createConnection('mongodb://localhost:27017/orange_testing'); 

mongoose.connection.on('open', function(){
	mongoose.connection.db.dropDatabase(function(err){
		  if(err){
            throw new Error('Cannot drop DB.' + err);
        }
	});
});

var appMock = nodemock.mock("get").takes('SALT').returns("1").times(3);

var dbMock = {
		Schema : mongoose.Schema,
		conn   : conn
	},
	user = {
		_id : "dummy",
		password: MD5("dummy1")
	},
	authMock = nodemock.mock("getUserDetails").takes('dummy',function(){}).calls(1, [user]).times(3);
	authMock.mock("getUserDetails").takes('dummy2',function(){}).calls(1, [false]).times(1);

	var pluginMock 	= {
		db: dbMock
	};
	appMock.plugins =  pluginMock,
	appMock.auth = authMock;

	_model		= new UserModel(appMock);

setup(function(done){

	var params = {
		user_name	: "dummy",
		password	: "dummy",
		first_name	: "dummy",
		last_name	: "dummy",
		email		: "dummy",
		company_id  : "dummy",
		phone_number: "dummy",
		roles		: ["admin", "superAdmin"]
	}			
	
	_model.addUser(params, function(result){
		result.should.not.be.false;
		validUserID = result._id;
		done();
	});
});

suiteTeardown(function(done){
	mongoose.disconnect();
	done();
});

suite("Get User",function(){

	test(" Invalid User ID ",function(done){
		var ObjectId = mongoose.Types.ObjectId;
		_model.getUser( new ObjectId(), function(userModel){
			userModel.should.be.false;
			done();
		});
	})

	test(" Valid User ID ",function(done){
		_model.getUser(validUserID, function(userModel){
			userModel.should.not.be.false;
			done();
		});
	})
});


suite("Validate User",function(){
	test("Valid Username And Password",function(done){
		_model.validateUser("dummy", "dummy", function(userModel){
			userModel.user_name.should.be.equal("dummy");
			done();
		});
	})

	test("Invalid Username And Password",function(done){
		_model.validateUser( "dummy2", "dummy2", function(userModel){
			userModel.should.be.false;
			done();
		});
	})
});

suite("Is User Not Admin",function(){
	test("For Normal User", function(done){
		
		var params = {
			user_name	: "dummy",
			password	: "dummy",
			first_name	: "dummy",
			last_name	: "dummy",
			email		: "dummy",
			company_id  : "dummy",
			phone_number: "dummy",
			roles		: ["user"]
		}			
	
		_model.addUser(params, function(result){
			result.should.not.be.false;
			validUserID = result._id;
			var params ={
				id : result._id
			}
			_model.isUserNotAdmin(params, function(err, result){
				should.not.exist(err);
				done();
			})
			
		});
	})

	test("For Admin User", function(done){
		var params ={
			id : validUserID
		}
		_model.isUserNotAdmin(params, function(err, result){
			err[0].should.be.equal('cannot remove admin user');
			done();
		})
	})
});


suite("Is User Not Super Admin",function(){
	test("For Normal User", function(done){
		var params = {
			user_name	: "dummy",
			password	: "dummy",
			first_name	: "dummy",
			last_name	: "dummy",
			email		: "dummy",
			company_id  : "dummy",
			phone_number: "dummy",
			roles		: ["user"]
		}			
	
		_model.addUser(params, function(result){
			result.should.not.be.false;
			validUserID = result._id;
			var params ={
				id : result._id
			}
			_model.isUserNotSuperAdmin(params, function(err, result){
				should.not.exist(err);
				done();
			})
			
		});
	})

	test("For Admin User", function(done){
		var params ={
			id : validUserID
		}
		_model.isUserNotSuperAdmin(params, function(err, result){
			err[0].should.be.equal('cannot remove/update SuperAdmin user');
			done();
		})
	})
});

suite("Get Super Admin",function(){
	test(" Valid User ID ",function(done){
		_model.getSuperAdmin(function(userModel){
			userModel.should.not.be.false;
			done();
		});
	})

	// test(" Invalid User ID ",function(done){
	// 	var ObjectId = mongoose.Types.ObjectId;
	// 	_model.getSuperAdmin(new ObjectId(), function(userModel){
	// 		console.log(userModel);
	// 		userModel.should.be.false;
	// 		done();
	// 	});
	// })
});

suite("Set MD5 Password",function(){
	test(" Valid User",function(done){
		
		params = {
		 	password : "dummy"
		}
		
		_model.md5Password(params, function(err, params){
			params.password.should.not.equal("dummy");
			done();
		});
	})

});

suite("Set Default Roles",function(){
	test(" Valid User",function(done){
		
		params = {}

		_model.setDefaultRoles(params, function(err,params){
			should.exist(params.roles);
			done();
		});
	})
});


suite("Set Default Staff Roles",function(){
	test(" Valid User",function(done){
		
		params = {}

		_model.setDefaultStaffRoles(params, function(err,params){
			should.exist(params.roles);
			done();
		});
	})
});

suite("Save Staff Company",function(){
	test(" Valid User",function(done){
		params = {}
		_model.saveStaffCompany(params, function(err,params){
			should.exist(params.company_id);
			done();
		});
	})
});

suite("Get Current User ID ",function(){
	test(" Valid User Logged in",function(done){
		params = {
			access_token : "dummy"
		}
		_model.getCurrentUID(params, function(err,params){
			params.currentUID.should.be.equal("dummy");
			done();
		});
	})

	test(" Invalid User",function(done){
		params = {
			access_token : "dummy2"
		}
		_model.getCurrentUID(params, function(err,params){
			should.not.exist(params.currentUID);
			done();
		});
	})
});



suite("Validate Two Emails",function(){
	test(" Valid",function(done){
		params = {
			email : "dummy@dummy.com",
			confirm_email : "dummy@dummy.com"
		}
		_model.validateTwoEmails(params, function(err,params){
			should.not.exist(err);
			done();
		});
	})

	test(" Invalid",function(done){
		params = {
			email : "dummy@dummy.com",
			confirm_email : "dummy2@dummy.com"
		}
		_model.validateTwoEmails(params, function(err,params){
			should.exist(err);
			done();
		});
	})
});

suite("Validate Two Passwords",function(){
	test(" Valid",function(done){
		params = {
			password : "dummy",
			confirm_password : "dummy"
		}
		_model.validateTwoPasswords(params, function(err,params){
			should.not.exist(err);
			done();
		});
	})

	test(" Invalid",function(done){
		params = {
			password : "dummy",
			confirm_email : "dummy2"
		}
		_model.validateTwoPasswords(params, function(err,params){
			should.exist(err);
			done();
		});
	})
});

suite("Validate Current Password",function(){
	test(" Valid",function(done){
		params = {
			access_token : "dummy",
			current_password : "dummy"
		}
		_model.validateCurrentPassword(params, function(err,params){
			should.not.exist(err);
			done();
		});
	})

	test(" Invalid",function(done){
		params = {
			access_token : "dummy",
			current_password : "dummy1"
		}
		_model.validateCurrentPassword(params, function(err,params){
			should.exist(err);
			done();
		});
	})
});
suite("Delete Users By Customer",function(){
	test("Valid",function(done){
		params = {
			company_id : "dummy",
		}
		_model.deleteUsersByCustomer(params, function(err,params){
			should.not.exist(err);
			done();
		});
	})
});
