var restClient 	= require('./support/restclient'),
	should 		= require('should'),
	prepareData = require('./support/prepare_data'),
	dataPool   	= require('./support/dataLoader'),
	async      	= require('async'),
	superAdminToken, accountManagerID, customerID, 
	calls, userToken, userName, userPassword, userID, data;

describe('Server request : ', function(){
	before(function(done){
		calls = [
			function(callback){
				dataPool.getDataSet("07_server_request", function(err, res){
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
				prepareData.createCustomer(accountManagerID, superAdminToken, 
					function(err,data){
					customerID = data.customerID;
					callback();
				})
			},
			function(callback){
				prepareData.createUser(customerID, superAdminToken, function(err,data){
					userID 			= data.userID;
					userName 		= data.userName;
					userPassword 	= data.userPassword;
					callback();
				})
			},
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
				prepareData.deleteAccountManager(accountManagerID, superAdminToken, 
					function(err,data){
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
	
	it("list empty list of server-requests for a user", function(done){
		restClient.get(
			'/server-request?access_token=' + userToken,
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
			'/server-request/create?access_token=' + superAdminToken,
			{},
			function(err, req, res, obj){
				if(err){ throw(err) }
				obj.status.should.equal('failed')
				obj.errors.should.have.lengthOf(1)
				done()
			}	
		)	
	})

	it("create : failed, admin not allowed to rise server request", function(done){
		restClient.post(
			'/server-request/create?access_token=' + superAdminToken,
			{},
			function(err, req, res, obj){
				if(err){ throw(err) }
				obj.status.should.equal('failed')
				obj.errors.should.have.lengthOf(1)
				done()
			}	
		)	
	})

	it("create : success, wizard initiated", function(done){
		restClient.post(
			'/server-request/create?access_token=' + userToken,
			{ 
				server_size : data.serverSize.valid[0]
			},
			function(err, req, res, obj){
				if(err){ throw(err) }
				obj.status.should.equal('success')
				serverRequestID = obj.id
				
				//verify
				restClient.get(
					'/server-request/'+ serverRequestID +'?access_token=' + userToken,
					function(err, req, res, obj){
						if(err){ throw(err) }
						obj.status.should.equal('success')
						obj.result[0].server_size.should.equal(data.serverSize.valid[0])
						should.exist(obj.result[0].password)
						done()
					}	
				)	
			}	
		)	
	})
	
	it("step 1 : failed, validation error", function(done){
		restClient.post(
			'/server-request/step1/'+ serverRequestID +'?access_token=' + userToken,
			{},
			function(err, req, res, obj){
				if(err){ throw(err) }
				obj.status.should.equal('failed')
				obj.errors.should.have.lengthOf(1)
				done()
			}	
		)	
	})
	
	it("step 7 after step 1: failed, required fields not entered completely ", 
		function(done){
		restClient.post(
			'/server-request/step7/'+ serverRequestID +'?access_token=' + userToken,
			{},
			function(err, req, res, obj){
				if(err){ throw(err) }
				obj.status.should.equal('failed')
				obj.errors.should.have.lengthOf(1)
				done()
			}	
		)	
	})
	
	it("step 1 : success", function(done){
		restClient.post(
			'/server-request/step1/'+ serverRequestID +'?access_token=' + userToken,
			{ 
				server_size : data.serverSize.valid[1]
			},
			function(err, req, res, obj){
				if(err){ throw(err) }
				obj.status.should.equal('success')

				//verify
				restClient.get(
					'/server-request/'+ serverRequestID +'?access_token=' + userToken,
					function(err, req, res, obj){
						if(err){ throw(err) }
						obj.status.should.equal('success')
						obj.result[0].server_size.should.equal(data.serverSize.valid[1])
						should.not.exist(obj.result[0].is_confirmed)
						done()
					}	
				)	
			}	
		)	
	})

	it("step 2 : failed, validation error", function(done){
		restClient.post(
			'/server-request/step2/'+ serverRequestID +'?access_token=' + userToken,
			{},
			function(err, req, res, obj){
				if(err){ throw(err) }
				obj.status.should.equal('failed')
				obj.errors.should.have.lengthOf(1)
				done()
			}	
		)	
	})

	it("step 2 : success", function(done){
		restClient.post(
			'/server-request/step2/'+ serverRequestID +'?access_token=' + userToken,
			{ 
				class : data.class.valid[1]
			},
			function(err, req, res, obj){
				if(err){ throw(err) }
				obj.status.should.equal('success')

				//verify
				restClient.get(
					'/server-request/'+ serverRequestID +'?access_token=' + userToken,
					function(err, req, res, obj){
						if(err){ throw(err) }
						obj.status.should.equal('success')
						obj.result[0].class.should.equal(data.class.valid[1])
						should.not.exist(obj.result[0].is_confirmed)
						done()
					}	
				)	
			}	
		)	
	})

	it("step 3 : failed, validation error", function(done){
		restClient.post(
			'/server-request/step3/'+ serverRequestID +'?access_token=' + userToken,
			{},
			function(err, req, res, obj){
				if(err){ throw(err) }
				obj.status.should.equal('failed')
				obj.errors.should.have.lengthOf(3)
				done()
			}	
		)	
	})

	it("step 3 : success", function(done){
		restClient.post(
			'/server-request/step3/'+ serverRequestID +'?access_token=' + userToken,
			{	
				operating_system 	: data.operatingSystem.valid[0],
				location 			: data.location.valid[0],
				network 			: data.network.valid[0]
			},
			function(err, req, res, obj){
				if(err){ throw(err) }
				obj.status.should.equal('success')
				
				//verify
				restClient.get(
					'/server-request/'+ serverRequestID +'?access_token=' + userToken,
					function(err, req, res, obj){
						if(err){ throw(err) }
						obj.status.should.equal('success')
						obj.result[0].operating_system.should.equal(data.operatingSystem.valid[0])
						obj.result[0].location.should.equal(data.location.valid[0])
						obj.result[0].network.should.equal(data.network.valid[0])
						should.not.exist(obj.result[0].is_confirmed)
						done()
					}	
				)	
			}	
		)	
	})

	it("step 4 : failed, validation error", function(done){
		restClient.post(
			'/server-request/step4/'+ serverRequestID +'?access_token=' + userToken,
			{},
			function(err, req, res, obj){
				if(err){ throw(err) }
				obj.status.should.equal('failed')
				obj.errors.should.have.lengthOf(1)
				done()
			}	
		)	
	})

	it("step 7 after step 5: failed, required fields not entered completely ", function(done){
		restClient.post(
			'/server-request/step7/'+ serverRequestID +'?access_token=' + userToken,
			{},
			function(err, req, res, obj){
				if(err){ throw(err) }
				obj.status.should.equal('failed')
				obj.errors.should.have.lengthOf(1)
				done()
			}	
		)	
	})

	it("step 4 : success", function(done){
		restClient.post(
			'/server-request/step4/'+ serverRequestID +'?access_token=' + userToken,
			{ name : data.name.valid[0]},
			function(err, req, res, obj){
				if(err){ throw(err) }
				obj.status.should.equal('success')
				
				//verify
				restClient.get(
					'/server-request/'+ serverRequestID +'?access_token=' + userToken,
					function(err, req, res, obj){
						if(err){ throw(err) }
						obj.status.should.equal('success')
						obj.result[0].name.should.equal(data.name.valid[0])
						should.not.exist(obj.result[0].is_confirmed)
						done()
					}	
				)	
			}	
		)	
	})

	it("step 5 : failed, validation error", function(done){
		restClient.post(
			'/server-request/step5/'+ serverRequestID +'?access_token=' + userToken,
			{},
			function(err, req, res, obj){
				if(err){ throw(err) }
				obj.status.should.equal('failed')
				obj.errors.should.have.lengthOf(1)
				done()
			}	
		)	
	})
	
	it("step 5 : failed, invalid server-request ID", function(done){
		restClient.post(
			'/server-request/step5/'+ "serverRequestID" +'?access_token=' + userToken,
			{ 
				additional_storage : data.additionalStorage.valid[0],
			},
			function(err, req, res, obj){
				if(err){ throw(err) }
				obj.status.should.equal('failed')
				obj.errors.should.have.lengthOf(1)
				done()
			}	
		)	
	})


	it("step 5 : failed, matching server cost not found", function(done){
		restClient.post(
			'/server-request/step5/'+ serverRequestID +'?access_token=' + userToken,
			{ 
				additional_storage : data.additionalStorage.valid[0],
			},
			function(err, req, res, obj){
				if(err){ throw(err) }
				obj.status.should.equal('failed')
				obj.errors.should.have.lengthOf(1)
				done()
			}	
		)	
	})
	
	
	it("step 5 : success, backup service as false", function(done){

		// update valid server_size and class
		restClient.post(
			'/server-request/step4/'+ serverRequestID +'?access_token=' + userToken,
			{ 
				name 			: data.name.valid[0],
				server_size		: data.serverSize.valid[0],
				class 			: data.class.valid[0]
			},
			function(err, req, res, obj){
				if(err){ throw(err) }
				obj.status.should.equal('success')
				
				//verify
				restClient.post(
					'/server-request/step5/'+ serverRequestID +'?access_token=' + userToken,
					{ 
						additional_storage : data.additionalStorage.valid[1],
					},
					function(err, req, res, obj){
						if(err){ throw(err) }
						obj.status.should.equal('success')
						
						//verify
						restClient.get(
							'/server-request/'+ serverRequestID +'?access_token=' + userToken,
							function(err, req, res, obj){
								if(err){ throw(err) }
									obj.status.should.equal('success')
									var respObj = obj.result.shift()
									respObj.additional_storage.should.equal(data.additionalStorage.valid[1])
									respObj.backup_service.should.equal(false)
									should.exist(respObj.server_cost)
									should.exist(respObj.memory_cost)
									should.exist(respObj.total_cost)
									should.not.exist(respObj.is_confirmed)
									done()
							}	
						)	
					}	
				)	
			}	
		)
	})

	it("step 5 : success, backup service as true", function(done){

		restClient.post(
			'/server-request/step5/'+ serverRequestID +'?access_token=' + userToken,
			{ 
				additional_storage 	: data.additionalStorage.valid[0],
				backup_service		: data.backupService.valid[0]
			},
			function(err, req, res, obj){
				if(err){ throw(err) }
				obj.status.should.equal('success')
				
				//verify
				restClient.get(
					'/server-request/'+ serverRequestID +'?access_token=' + userToken,
					function(err, req, res, obj){
						if(err){ throw(err) }
							obj.status.should.equal('success')
							var respObj = obj.result.shift()
							respObj.additional_storage.should.equal(data.additionalStorage.valid[0])
							respObj.backup_service.should.equal(data.backupService.valid[0])
							should.not.exist(respObj.is_confirmed)
							done()
					}	
				)	
			}	
		)	
	})

	it("step 6 : success, LTR service as false", function(done){
		restClient.post(
			'/server-request/step6/'+ serverRequestID +'?access_token=' + userToken,
			{},
			function(err, req, res, obj){
				if(err){ throw(err) }
				obj.status.should.equal('success')
				
				//verify
				restClient.get(
					'/server-request/'+ serverRequestID +'?access_token=' + userToken,
					function(err, req, res, obj){
						if(err){ throw(err) }
							obj.status.should.equal('success')
							var respObj = obj.result.shift()
							respObj.ltr_policy_a.should.equal(false)
							respObj.ltr_policy_b.should.equal(false)
							respObj.ltr_policy_c.should.equal(false)
							respObj.ltr_policy_d.should.equal(false)
							should.not.exist(respObj.is_confirmed)
							done()
					}	
				)	
			}	
		)	
	})

	it("step 6 : success, LTR service as true", function(done){
		restClient.post(
			'/server-request/step6/'+ serverRequestID +'?access_token=' + userToken,
			{
				ltr_policy_a : data.ltrPolicyA.valid[0],
				ltr_policy_b : data.ltrPolicyB.valid[0],
				ltr_policy_c : data.ltrPolicyC.valid[0],
				ltr_policy_d : data.ltrPolicyD.valid[0]

			},
			function(err, req, res, obj){
				if(err){ throw(err) }
				obj.status.should.equal('success')
				
				//verify
				restClient.get(
					'/server-request/'+ serverRequestID +'?access_token=' + userToken,
					function(err, req, res, obj){
						if(err){ throw(err) }
							obj.status.should.equal('success')
							var respObj = obj.result.shift()
							respObj.ltr_policy_a.should.equal(data.ltrPolicyA.valid[0])
							respObj.ltr_policy_b.should.equal(data.ltrPolicyB.valid[0])
							respObj.ltr_policy_c.should.equal(data.ltrPolicyC.valid[0])
							respObj.ltr_policy_d.should.equal(data.ltrPolicyD.valid[0])
							should.not.exist(respObj.is_confirmed)
							done()
					}	
				)	
			}	
		)	
	})

	it("list empty server requests : for customers", function(done){
		restClient.get(
			'/server-request/for-customer/'+ customerID +'?access_token=' + userToken,
			function(err, req, res, obj){
				if(err){ throw(err) }
				obj.status.should.equal('success')
				obj.total.should.equal(0)
				done()
			}	
		)	
	})

	it("step 7 : success", function(done){
		restClient.post(
			'/server-request/step7/'+ serverRequestID +'?access_token=' + userToken,
			{},
			function(err, req, res, obj){
				if(err){ throw(err) }
				obj.status.should.equal('success')
				
				//verify
				restClient.get(
					'/server-request/'+ serverRequestID +'?access_token=' + userToken,
					function(err, req, res, obj){
						if(err){ throw(err) }
						obj.status.should.equal('success')
						obj.result[0].is_confirmed.should.equal(true)
						done()
					}	
				)
			}	
		)	
	})
 
	it("list server requests : for customers", function(done){
		restClient.get(
			'/server-request/for-customer/'+ customerID +'?access_token=' + userToken,
			function(err, req, res, obj){
				if(err){ throw(err) }
				obj.status.should.equal('success')
				obj.total.should.equal(1)
				done()
			}	
		)	
	})

	it("get server request : for user", function(done){
		restClient.get(
			'/server-request/'+ serverRequestID +'?access_token=' + userToken,
			function(err, req, res, obj){
				if(err){ throw(err) }
				obj.status.should.equal('success')
				obj.total.should.equal(1)
				done()
			}	
		)	
	})

	it("delete server request", function(done){
		restClient.get(
			'/server-request/delete/'+ serverRequestID +'?access_token=' + userToken,
			function(err, req, res, obj){
				if(err){ throw(err) }
				obj.status.should.equal('success')
				
				//verify
				restClient.get(
					'/server-request/'+ serverRequestID +'?access_token=' + userToken,
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