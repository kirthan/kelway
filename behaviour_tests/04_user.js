var restClient 	= require('./support/restclient'),
	should 		= require('should'),
	prepareData = require('./support/prepare_data'),
	dataPool    = require('./support/dataLoader'),
	async      	= require('async'),
	superAdminToken, userID, accountManagerID, customerID, 
	userToken, userName, userPassword, calls, data;

describe('User : ', function(){
	before(function(done){
		calls = [
			
			function(callback){
				dataPool.getDataSet("04_user", function(err, res){
					data = res;
					callback();
				})
			},		
			
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
			}
			
		];
		
		async.series(calls,function(err,results){
			done();
		})
	})
	
	after(function(done){
		calls = [
			
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
				prepareData.deleteSuperAdminToken(superAdminToken, function(err,data){
					callback();
				})
			}
		];
		
		async.series(calls,function(err,results){
			done();	
		})
	})

	it("List Users", function(done){
		restClient.get(
			'/users?access_token=' + superAdminToken,
			function(err, req, res, obj){
				if(err){ throw(err) }
				obj.status.should.equal('success')
				done()
			}
		)
	})

	it("create: failed, validation error", function(done){
		restClient.post(
			'/users/create?access_token=' + superAdminToken,
			{},
			function(err, req, res, obj){
				if(err){ throw(err) }
				obj.status.should.equal('failed')
				obj.errors.should.have.lengthOf(8)
				done()
			}
		)
	})

	it("create : success", function(done){
		//user name should be unique
		userName = data.userName.valid[0] +  Math.floor(Math.random()*89999+10000),
		userPassword = data.password.valid[0]

		restClient.post(
			'/users/create?access_token=' + superAdminToken,
			{
				user_name 			: userName,
				password			: userPassword,
				confirm_password 	: userPassword,
				email 				: data.email.valid[0],
				phone_number 		: data.phoneNumber.valid[0],
				first_name 			: data.firstName.valid[0],
				last_name 			: data.lastName.valid[0],
				company_id 			: customerID
			},
			function(err, req, res, obj){
				if(err){ throw(err) }
				obj.status.should.equal('success')
				userID = obj.id

				// Cross check Customer
				restClient.get(
					'/users/' + userID + '?access_token=' + superAdminToken,
					function(err, req, res, obj){
						if(err){ throw(err) }
						obj.status.should.equal('success')
						var userObj = obj.result.shift();
						userObj.user_name.should.equal(userName)
						userObj.email.should.equal(data.email.valid[0])
						userObj.phone_number.should.equal(data.phoneNumber.valid[0])
						userObj.first_name.should.equal(data.firstName.valid[0])
						userObj.last_name.should.equal(data.lastName.valid[0])
						
						// Try login with created User
						restClient.post(
							'/login',
							{user: userName, pass:userPassword},
							function(err, req, res, obj){
								if(err){ throw(err) }
								if(!obj.token){ throw new Error('Did not find access token') }
								obj.status.should.equal('success')
								userToken = obj.token
								done()
							}
						)
					}				
				)
			}
		)
	})

	it("update : failed, validation errors", function(done){
		restClient.post(
			'/users/update/'+ userID +'?access_token=' + superAdminToken,
			{},
			function(err, req, res, obj){
				if(err){ throw(err) }
				obj.status.should.equal('failed')
				obj.errors.should.have.lengthOf(8)
				done()
			}
		)
	})

	it("update : success", function(done){
		userName 		= data.userName.valid[1] +  Math.floor(Math.random()*89999+10000),
		userPassword 	= data.password.valid[1];
		restClient.post(
			'/users/update/' + userID + '?access_token=' + superAdminToken,
			{
				user_name 			: userName,
				password			: userPassword,
				confirm_password 	: userPassword,
				email 				: data.email.valid[1],
				phone_number 		: data.phoneNumber.valid[1],
				first_name 			: data.firstName.valid[1],
				last_name 			: data.lastName.valid[1],
				company_id 			: customerID
			},
			function(err, req, res, obj){
				if(err){ throw(err) }
				obj.status.should.equal('success')

				// Cross check Customer
				restClient.get(
					'/users/' + userID + '?access_token=' + superAdminToken,
					function(err, req, res, obj){
						if(err){ throw(err) }
						obj.status.should.equal('success')
						var userObj = obj.result.shift();
						userObj.user_name.should.equal(userName)
						userObj.email.should.equal(data.email.valid[1])
						userObj.phone_number.should.equal(data.phoneNumber.valid[1])
						userObj.first_name.should.equal(data.firstName.valid[1])
						userObj.last_name.should.equal(data.lastName.valid[1])
						
						// Try login with updated User
						restClient.post(
							'/login',
							{user:userName ,pass:userPassword},
							function(err, req, res, obj){
								if(err){ throw(err) }
								if(!obj.token){ throw new Error('Did not find access token') }
								obj.status.should.equal('success')
								userToken = obj.token
								done()
							}
						)
					}				
				)
			}
		)
	})

	it("upadte own password by normal user : failed, empty fields", function(done){
		restClient.post(
			'/users/update-by-user/password?access_token=' + userToken,
			{
			},
			function(err, req, res, obj){
				if(err){ throw(err) }
				obj.status.should.equal('failed')
				obj.errors.should.have.lengthOf(3)
				done()
			}
		)	
	})

	it("update own password by normal user : failed, incorrect current password", function(done){
		restClient.post(
			'/users/update-by-user/password?access_token=' + userToken,
			{
				current_password 	: data.password.invalid,
				password 			: data.password.valid[0],
				confirm_password 	: data.password.valid[0]
			},
			function(err, req, res, obj){
				if(err){ throw(err) }
				obj.status.should.equal('failed')
				obj.errors.should.have.lengthOf(1)
				done()
			}
		)	
	})

	it("update own password by normal user : password and confirm password mismatch", function(done){
		restClient.post(
			'/users/update-by-user/password?access_token=' + userToken,
			{
				current_password 	: userPassword,
				password 			: data.password.valid[0],
				confirm_password 	: data.password.valid[1]
			},
			function(err, req, res, obj){
				if(err){ throw(err) }
				obj.status.should.equal('failed')
				obj.errors.should.have.lengthOf(1)
				done()
			}
		)	
	})

	it("update own password by normal user : success", function(done){
		restClient.post(
			'/users/update-by-user/password?access_token=' + userToken,
			{
				current_password 	: userPassword,
				password 			: data.password.valid[0],
				confirm_password 	: data.password.valid[0]
			},
			function(err, req, res, obj){
				if(err){ throw(err) }
				obj.status.should.equal('success')
				userPassword = data.password.valid[0]
				
				// Try login with created User
				restClient.post(
					'/login',
					{user: userName, pass:userPassword},
					function(err, req, res, obj){
						if(err){ throw(err) }
						if(!obj.token){ throw new Error('Did not find access token') }
						obj.status.should.equal('success')
						userToken = obj.token
						done()
					}
				)
			}
		)	
	})

	it("Update own email id by normal user : failed, empty validation error", function(done){
		restClient.post(
			'/users/update-by-user/email?access_token=' + userToken,
			{},
			function(err, req, res, obj){
				if(err){ throw(err) }
				obj.status.should.equal('failed')
				obj.errors.should.have.lengthOf(2)
				done()
			}
		)	
	})

	
	it("update own email id by normal user : failed, email and confirm email mismatch", function(done){
		restClient.post(
			'/users/update-by-user/email?access_token=' + userToken,
			{
				email 			: data.email.valid[0],
				confirm_email 	: data.email.valid[1]
			},
			function(err, req, res, obj){
				if(err){ throw(err) }
				obj.status.should.equal('failed')
				obj.errors.should.have.lengthOf(1)
				done()
			}
		)	
	})

	it("update own email id by normal user : success", function(done){
		restClient.post(
			'/users/update-by-user/email?access_token=' + userToken,
			{
				email 			: data.email.valid[0],
				confirm_email 	: data.email.valid[0]
			},
			function(err, req, res, obj){
				if(err){ throw(err) }
				obj.status.should.equal('success')
				done()
			}
		)	
	})
	
	it("get user : For normal user", function(done){
		restClient.get(
			'/users/' + userID + '?access_token=' + superAdminToken,
			function(err, req, res, obj){
				if(err){ throw(err) }
				obj.status.should.equal('success')
				obj.result.should.have.lengthOf(1)
				done()
			}
		)
	})

	it("get user : for admin", function(done){
		restClient.get(
			'/users/' + userID + '?access_token=' + userToken,
			function(err, req, res, obj){
				if(err){ throw(err) }
				obj.status.should.equal('success')
				obj.result.should.have.lengthOf(1)
				done()
			}
		)
	})

	it("get users for a given customerID", function(done){
		restClient.get(
			'/users/for-customer/' + customerID + '?access_token=' + superAdminToken,
			function(err, req, res, obj){
				if(err){ throw(err) }
				obj.status.should.equal('success')
				obj.result.should.have.lengthOf(1)
				done()
			}
		)
	})
	
	it("check for unauthorised access for normal user", function(done){
		
		calls = [
			function(callback){
				restClient.get(
					'/users?access_token=' + userToken,
					function(err, req, res, obj){
						if(err){ throw(err) }
						obj.status.should.equal('403');
						callback();
					}
				)
			},
			
			function(callback){
				restClient.post(
					'/users/create?access_token=' + userToken,
					{},
					function(err, req, res, obj){
						if(err){ throw(err) }
						obj.status.should.equal('403');
						callback();
					}
				)
			},

			function(callback){
				restClient.post(
					'/users/update/' + userID + '?access_token=' + userToken,
					{},
					function(err, req, res, obj){
						if(err){ throw(err) }
						obj.status.should.equal('403');
						callback();
					}
				)
			},

			function(callback){
				restClient.get(
					'/users/delete/' + userID + '?access_token=' + userToken,
					function(err, req, res, obj){
						if(err){ throw(err) }
						obj.status.should.equal('403');
						callback();
					}
				)
			},

			function(callback){
				restClient.get(
					'/users/for-customer/' + customerID + '?access_token=' + userToken,
					function(err, req, res, obj){
						if(err){ throw(err) }
						obj.status.should.equal('403');
						callback();
					}
				)
			}
		]

		async.series(calls,function(err,results){
			done();
		})
	})

	it("delete user", function(done){
		restClient.get(
			'/users/delete/' + userID + '?access_token=' + superAdminToken,
			function(err, req, res, obj){
				if(err){ throw(err) }
				obj.status.should.equal('success')
				restClient.get(
					'/users/' + userID + '?access_token=' + superAdminToken,
					function(err, req, res, obj){
						if(err){ throw(err) }
						obj.status.should.equal('success')
						obj.result.should.have.lengthOf(0)
						done()
					}
				)
			}
		)
	})
})