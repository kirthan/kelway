var restClient 	= require('./support/restclient'),
	should 		= require('should'),
	prepareData = require('./support/prepare_data'),
	dataPool   = require('./support/dataLoader'),
	async      	= require('async'),
	superAdminToken, accountManagerID, customerID, 
	calls, userToken, userName, userPassword, 
	userID, serverID, data;

describe('Server : ', function(){
	before(function(done){
		calls = [

			function(callback){
				dataPool.getDataSet("08_server", function(err, res){
					data = res;
					callback();
				})
			},
			//login as super Admin
			function(callback){
				prepareData.getSuperAdminToken(function(err,data){
					superAdminToken = data.token;
					callback();
				})
			},

			//create account manager
			function(callback){
				prepareData.createAccountManager(superAdminToken, function(err,data){
					accountManagerID = data.accountManagerID;
					callback();
				})
			},			
			
			//create customer
			function(callback){
				prepareData.createCustomer(accountManagerID, superAdminToken, function(err,data){
					customerID = data.customerID;
					callback();
				})
			},
			
			//create normal user
			function(callback){
				prepareData.createUser(customerID, superAdminToken, function(err,data){
					userID = data.userID;
					userName = data.userName;
					userPassword = data.userPassword;
					callback();
				})
			},
			
			//login as normal user
			function(callback){
				prepareData.getUserToken(userName, userPassword, function(err,data){
					userToken = data.userToken;
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
			
			// logout normal user
			function(callback){
				prepareData.deleteUserToken(userToken, function(err,data){
					callback();
				})
			},
			
			//delete user
			function(callback){
				prepareData.deleteUser(userID, superAdminToken, function(err,data){
					callback();
				})
			},
			
			//delete Account Manager
			function(callback){
				prepareData.deleteAccountManager(accountManagerID, superAdminToken, function(err,data){
					callback();
				})
			},

			//delete customer
			function(callback){
				prepareData.deleteCustomer(customerID, superAdminToken, function(err,data){
					callback();
				})
			},

			//logout superAdmin
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

	it("list servers for a user : empty", function(done){
		restClient.get(
			'/servers?access_token=' + userToken,
			function(err, req, res, obj){
				if(err){ throw(err) }
				obj.status.should.equal('success')
				obj.total.should.equal(0)
				done()
			}	
		)	
	})

	it("create : failed, validation error", function(done){
		restClient.post(
			'/servers/create?access_token=' + superAdminToken,
			{},
			function(err, req, res, obj){
				if(err){ throw(err) }
				obj.status.should.equal('failed')
				obj.errors.should.have.lengthOf(7)
				done()
			}	
		)	
	})

	it("create : success", function(done){
		restClient.post(
			'/servers/create?access_token=' + superAdminToken,
			{
				name 				: data.name.valid[0],
				company_id 			: customerID,
				nimsoft_id 			: data.nimsoftID.valid[0],
				class 				: data.class.valid[0],
				ip_address 			: data.ipAddress.valid[0],
				operating_system	: data.operatingSystem.valid[0],
				instance_size 		: data.instanceSize.valid[0]
			},
			function(err, req, res, obj){
				if(err){ throw(err) }
				obj.status.should.equal('success')
				serverID = obj.id
				
				//get this server by id
				restClient.get(
					'/servers/'+ serverID +'?access_token=' + superAdminToken,
					function(err, req, res, obj){
						if(err){ throw(err) }
						obj.status.should.equal('success')
						obj.total.should.equal(1)
						done()
					}	
				)	
			}	
		)	
	})

	it("update : failed, validation error", function(done){
		restClient.post(
			'/servers/update/'+ serverID +'?access_token=' + superAdminToken,
			{},
			function(err, req, res, obj){
				if(err){ throw(err) }
				obj.status.should.equal('failed')
				obj.errors.should.have.lengthOf(7)
				done()
			}	
		)	
	})

	it("update : success", function(done){
		restClient.post(
			'/servers/update/'+ serverID + '?access_token=' + superAdminToken,
			{
				name 				: data.name.valid[1],
				company_id 			: customerID,
				nimsoft_id 			: data.nimsoftID.valid[1],
				class 				: data.class.valid[1],
				ip_address 			: data.ipAddress.valid[1],
				operating_system	: data.operatingSystem.valid[1],
				instance_size 		: data.instanceSize.valid[1]
			},
			function(err, req, res, obj){
				if(err){ throw(err) }
				obj.status.should.equal('success')
				
				//get this server by id
				restClient.get(
				'/servers/'+ serverID +'?access_token=' + superAdminToken,
					function(err, req, res, obj){
						if(err){ throw(err) }
						obj.status.should.equal('success')
						var respObj = obj.result.shift()
						respObj.name.should.equal(data.name.valid[1])
						respObj.company_id.should.equal(customerID)
						respObj.nimsoft_id.should.equal(data.nimsoftID.valid[1])
						respObj.class.should.equal(data.class.valid[1])
						respObj.ip_address.should.equal(data.ipAddress.valid[1])
						respObj.operating_system.should.equal(data.operatingSystem.valid[1])
						respObj.instance_size.should.equal(data.instanceSize.valid[1])
						done()
					}	
				)	
			}	
		)	
	})

	it("update description by user : failed, validation error", function(done){
		restClient.post(
			'/servers/update-description/'+ serverID + '?access_token=' + userToken,
			{},
			function(err, req, res, obj){
				if(err){ throw(err) }
				obj.status.should.equal('failed')
				obj.errors.should.have.lengthOf(1)
				done()
			}
		)	
	})
	
	it("update description by user : success", function(done){
		restClient.post(
			'/servers/update-description/'+ serverID + '?access_token=' + userToken,
			{
				description : data.description.valid[0]
			},
			function(err, req, res, obj){
				if(err){ throw(err) }
				obj.status.should.equal('success')
				
				//verify
				restClient.get(
					'/servers/'+ serverID +'?access_token=' + superAdminToken,
					function(err, req, res, obj){
						if(err){ throw(err) }
						obj.status.should.equal('success')
						obj.result[0].description.should.equal(data.description.valid[0])
						done()
					}	
				)
			}
		)	
	})

	
	it("get single server: for normal user", function(done){
		restClient.get(
			'/servers/'+ serverID +'?access_token=' + userToken,
			function(err, req, res, obj){
				if(err){ throw(err) }
				obj.status.should.equal('success')
				obj.total.should.equal(1)
				done()
			}	
		)	
	})
	
	it("get single server : for admin", function(done){
		restClient.get(
			'/servers/'+ serverID +'?access_token=' + superAdminToken,
			function(err, req, res, obj){
				if(err){ throw(err) }
				obj.status.should.equal('success')
				obj.total.should.equal(1)
				done()
			}	
		)	
	})

	it("get servers by customer : for admin", function(done){
		restClient.get(
			'/servers/for-customer/'+ customerID +'?access_token=' + superAdminToken,
			function(err, req, res, obj){
				if(err){ throw(err) }
				obj.status.should.equal('success')
				obj.total.should.equal(1)
				done()
			}	
		)	
	})
	it("verify unauthorised access", function(done){
		calls = [
			function(callback){
				restClient.post(
					'/servers/create?access_token=' + userToken,
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
					'/servers/update/'+ serverID +'?access_token=' + userToken,
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
					'/servers/for-customer/'+ customerID +'?access_token=' + userToken,
					function(err, req, res, obj){
						if(err){ throw(err) }
						obj.status.should.equal('403');
						callback();
					}
				)
			},
			function(callback){
				restClient.get(
					'/servers/delete/'+ serverID +'?access_token=' + userToken,
					function(err, req, res, obj){
						if(err){ throw(err) }
						obj.status.should.equal('403');
						callback();
					}
				)
			}
		];
		async.series(calls,function(err,results){
			done()
		})
	})
	
	it("delete" , function(done){
		restClient.get(
			'/servers/delete/'+ serverID +'?access_token=' + superAdminToken,
			function(err, req, res, obj){
				if(err){ throw(err) }
				obj.status.should.equal('success')
				restClient.get(
					'/servers/'+ serverID +'?access_token=' + superAdminToken,
					function(err, req, res, obj){
						if(err){ throw(err) }
						obj.status.should.equal('success')
						obj.total.should.equal(0)
						done()
					}	
				)	
			}	
		)	
	})

})