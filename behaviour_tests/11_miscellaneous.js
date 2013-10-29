var restClient 	= require('./support/restclient'),
	should 		= require('should'),
	prepareData = require('./support/prepare_data'),
	async      	= require('async'),
	dataPool    = require('./support/dataLoader'),
	moment		= require('moment'),
	superAdminToken, accountManagerID, customerID, 
	calls, userToken, userName, userPassword, userID, 
	staffID, staffName, staffPassword, staffToken;

describe('miscellaneous : ', function(){
	before(function(done){
		calls = [
			function(callback){
				prepareData.getSuperAdminToken(function(err,data){
					superAdminToken = data.token;
					callback();
				})
			},

			function(callback){
				prepareData.createAccountManager(superAdminToken, function(err,data){
					accountManagerID = data.accountManagerID;
					callback();
				})
			},			
			
			function(callback){
				prepareData.createCustomer(accountManagerID, superAdminToken, function(err,data){
					customerID = data.customerID;
					callback();
				})
			},
			
			function(callback){
				prepareData.createUser(customerID, superAdminToken, function(err,data){
					userID = data.userID;
					userName = data.userName;
					userPassword = data.userPassword;
					callback();
				})
			},

			function(callback){
				prepareData.createStaff(superAdminToken, function(err,data){
					staffID = data.staffID;
					staffName = data.staffName;
					staffPassword = data.staffPassword;
					callback();
				})
			},
			
			function(callback){
				prepareData.getUserToken(userName, userPassword, function(err,data){
					userToken = data.userToken;
					callback();
				})
			},

			function(callback){
				prepareData.getAdminToken(staffName, staffPassword, function(err,data){
					staffToken = data.staffToken;
					callback();
				})
			}
		];
		
		async.series(calls,function(err,results){
			done();
		})
	})

	after(function(done){
		calls = [
			
			function(callback){
				prepareData.deleteUserToken(userToken, function(err,data){
					callback();
				})
			},
			
			function(callback){
				prepareData.deleteUser(userID, superAdminToken, function(err,data){
					callback();
				})
			},

			function(callback){
				prepareData.deleteAdminToken(staffToken, function(err,data){
					callback();
				})
			},
			
			function(callback){
				prepareData.deleteAccountManager(accountManagerID, superAdminToken, function(err,data){
					callback();
				})
			},

			function(callback){
				prepareData.deleteCustomer(customerID, superAdminToken, function(err,data){
					callback();
				})
			},

			function(callback){
				prepareData.deleteStaff(staffID, superAdminToken, function(err,data){
					callback();
				})
			},

			function(callback){
				prepareData.deleteSuperAdminToken(superAdminToken, function(err,data){
					callback();
				})
			}

		];
		
		async.series(calls,function(err,results){
			done();	
		})
	})

	it("get service work version", function(done){
		restClient.get(
			'/',
			function(err, req, res, obj){
				if(err){ throw(err) }
				obj.version.should.equal('1.0.0')
				done()
			}	
		)		
	})

	it("get service work version, explicitly", function(done){
		restClient.get(
			'/version',
			function(err, req, res, obj){
				if(err){ throw(err) }
				obj.version.should.equal('1.0.0')
				done()
			}	
		)		
	})

	it("get nimsoft account status", function(done){
		restClient.get(
			'/nimsoft',
			function(err, req, res, obj){
				if(err){ throw(err) }
				obj.nimsoft_api_status.should.equal('enabled')
				done()
			}	
		)		
	})

	it("get roles for superAdmin", function(done){
		restClient.get(
			'/roles?access_token=' + superAdminToken,
			function(err, req, res, obj){
				if(err){ throw(err) }
				obj.status.should.equal('success')
				obj.roles.should.have.lengthOf(3)
				done()
			}	
		)		
	})

	it("get roles for staff", function(done){
		restClient.get(
			'/roles?access_token=' + staffToken,
			function(err, req, res, obj){
				if(err){ throw(err) }
				obj.status.should.equal('success')
				obj.roles.should.have.lengthOf(2)
				done()
			}	
		)		
	})

	it("get roles for user", function(done){
		restClient.get(
			'/roles?access_token=' + userToken,
			function(err, req, res, obj){
				if(err){ throw(err) }
				obj.status.should.equal('success')
				obj.roles.should.have.lengthOf(1)
				done()
			}	
		)		
	})

	it("get form fields : server sizes", function(done){
		restClient.get(
			'/form-fields/server-sizes?access_token=' + userToken,
			function(err, req, res, obj){
				if(err){ throw(err) }
				obj.status.should.equal('success')
				done()
			}	
		)		
	})

	it("get form fields : server locations", function(done){
		restClient.get(
			'/form-fields/server-locations?access_token=' + userToken,
			function(err, req, res, obj){
				if(err){ throw(err) }
				obj.status.should.equal('success')
				done()
			}	
		)		
	})

	it("audit logs all", function(done){
		restClient.post(
			'/audit-log?access_token=' + superAdminToken,
			{
				page 			: 1,
				items_per_page  : 1
			},
			function(err, req, res, obj){
				if(err){ throw(err) }
				obj.status.should.equal('success')
				obj.result.should.have.lengthOf(1)
				done()
			}	
		)		
	})

	it("audit logs filter by user", function(done){
		restClient.post(
			'/audit-log/filter?access_token=' + superAdminToken,
			{
				user_id : userID
			},
			function(err, req, res, obj){
				if(err){ throw(err) }
				obj.status.should.equal('success')
				obj.result.should.have.lengthOf(1)
				done()
			}	
		)		
	})

	it("audit logs filter by date", function(done){
		var val = moment().format('MM,DD,YYYY');
		restClient.post(
			'/audit-log/filter?access_token=' + superAdminToken,
			{
				date 			: new Date(val).getTime(),
				page 			: 1,
				items_per_page  : 1
			},
			function(err, req, res, obj){
				if(err){ throw(err) }
				obj.status.should.equal('success')
				obj.result.should.have.lengthOf(1)
				done()
			}	
		)		
	})

	it("audit logs filter by user and date", function(done){
		var val = moment().format('MM,DD,YYYY');
		restClient.post(
			'/audit-log/filter?access_token=' + superAdminToken,
			{
				user_id : userID,
			 	date 	: new Date(val).getTime()
			},
			function(err, req, res, obj){
				if(err){ throw(err) }
				obj.status.should.equal('success')
				obj.result.should.have.lengthOf(1)
				done()
			}	
		)		
	})
		
})