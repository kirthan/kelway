var restClient 	= require('./support/restclient'),
	should 		= require('should'),
	prepareData = require('./support/prepare_data'),
	dataPool   = require('./support/dataLoader'),
	async      	= require('async'),
	superAdminToken, accountManagerID, customerID, 
	calls, userToken, userName, userPassword, userID, serverID, 
	newAreaName, areaContent, data;

describe('Static content', function(){
		before(function(done){
		calls = [
			function(callback){
				dataPool.getDataSet("10_static_content", function(err, res){
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

	it("save content : failed, validation error", function(done){
		restClient.post(
			'/static-content/save/'+ data.areaName.valid[0] +'?access_token=' + superAdminToken,
			{
			},
			function(err, req, res, obj){
				if(err){ throw(err) }
				obj.status.should.equal('failed')
				obj.errors.should.have.lengthOf(1)
				done()
			}	
		)		
	})

	it("save content : success", function(done){
		restClient.post(
			'/static-content/save/'+ data.areaName.valid[0] +'?access_token=' + superAdminToken,
			{
				content : data.areaContent.valid[0]
			},
			function(err, req, res, obj){
				if(err){ throw(err) }
				obj.status.should.equal('success')
				done()
			}	
		)		
	})
	
	it("get content : success", function(done){
		restClient.get(
			'/static-content/'+ data.areaName.valid[0] +'?access_token=' + superAdminToken,
			function(err, req, res, obj){
				if(err){ throw(err) }
				obj.status.should.equal('success')
				obj.content.should.equal(data.areaContent.valid[0])
				done()
			}	
		)		
	})

	it("update content : failed, validation error", function(done){
		restClient.post(
			'/static-content/save/'+ data.areaName.valid[0] +'?access_token=' + superAdminToken,
			{},
			function(err, req, res, obj){
				if(err){ throw(err) }
				obj.status.should.equal('failed')
				done()
			}	
		)		
	})

	it("update content : success", function(done){
		restClient.post(
			'/static-content/save/'+ data.areaName.valid[0] +'?access_token=' + superAdminToken,
			{
				content : data.areaContent.valid[1]
			},
			function(err, req, res, obj){
				if(err){ throw(err) }
				obj.status.should.equal('success')
				
				//verify
				restClient.get(
					'/static-content/'+ data.areaName.valid[0] +'?access_token=' + superAdminToken,
					function(err, req, res, obj){
						if(err){ throw(err) }
						obj.status.should.equal('success')
						obj.content.should.equal(data.areaContent.valid[1])
						done()
					}	
				)	
			}	
		)		
	})

	it("get all content versions", function(done){
		restClient.get(
			'/static-content/versions/'+ data.areaName.valid[0] +'?access_token=' + superAdminToken,
			function(err, req, res, obj){
				if(err){ throw(err) }
				obj.should.have.lengthOf(2)
				done()
			}	
		)		
	})
	it("get content by version", function(done){
		restClient.get(
			'/static-content/version/'+ data.areaName.valid[0] +'/1?access_token=' + superAdminToken,
			function(err, req, res, obj){
				if(err){ throw(err) }
				obj.version.should.equal(1)
				done()
			}	
		)		
	})

	it("delete content : success", function(done){
		restClient.get(
			'/static-content/delete/'+ data.areaName.valid[0] +'?access_token=' + superAdminToken,
			function(err, req, res, obj){
				if(err){ throw(err) }
				obj.status.should.equal('success')
				
				//success
				restClient.get(
					'/static-content/'+ data.areaName.valid[0] +'?access_token=' + superAdminToken,
					function(err, req, res, obj){
						if(err){ throw(err) }
						obj.status.should.equal('failed')
						done()
					}	
				)
			}	
		)		
	})
})
		
