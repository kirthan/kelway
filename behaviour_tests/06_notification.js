var restClient 	= require('./support/restclient'),
	should 		= require('should'),
	assert      = require("assert"),
	async      	= require('async'),
	dataPool   	= require('./support/dataLoader'),
	prepareData = require('./support/prepare_data'),
	superAdminToken, accountManagerID, customerID, 
	calls, userToken, userName, userPassword, notificationID1, 
	notificationID2, userID,data;

describe('Notification : ', function(){
	before(function(done){
		calls = [
			
			function(callback){
				dataPool.getDataSet("06_notification", function(err, res){
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

			
			//delete added notification
			function(callback){
				restClient.get(
					'/notification/delete/' + notificationID2 + '?access_token=' + superAdminToken,
					function(err, req, res, obj){
						if(err){ throw(err) }
						obj.status.should.equal('success')
						callback()
					}
				)
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

	it("create : failed, validation error", function(done){
		restClient.post(
			'/notification/create?access_token=' + superAdminToken,
			{},
			function(err, req, res, obj){
				if(err){ throw(err) }
				obj.status.should.equal('failed')
				obj.errors.should.lengthOf(6)
				done()
			}	
		)	
	})

	it("create : success", function(done){
		restClient.post(
			'/notification/create?access_token=' + superAdminToken,
			{
				title				: data.title.valid[0],
				description 		: data.description.valid[0],
				resolve_url 		: data.resolveURL.valid[0],
				customer_id 		: customerID,
				severity 			: data.severity.valid[0],
				notification_class 	: data.notificationClass.valid[0]
			},
			function(err, req, res, obj){
				if(err){ throw(err) }
				obj.status.should.equal('success')
				notificationID1 = obj.id
				
				restClient.get(
					'/notification/' + notificationID1 + '?access_token=' + superAdminToken,
					function(err, req, res, obj){
						if(err){ throw(err) }
						obj.status.should.equal('success')
						var respObj = obj.result.shift()
						respObj.title.should.equal(data.title.valid[0])
						respObj.description.should.equal(data.description.valid[0])
						respObj.resolve_url.should.equal(data.resolveURL.valid[0])
						respObj.severity.should.equal(data.severity.valid[0])
						respObj.notification_class.should.equal(data.notificationClass.valid[0])
						assert.equal(respObj.resolved_by, null);
						assert.equal(respObj.resolved_at, null);
						done()
					}
				)	
			}
		)	
	})

	it("update : failed, validation error", function(done){
		restClient.post(
			'/notification/update/'+ notificationID1 +'?access_token=' + superAdminToken,
			{},
			function(err, req, res, obj){
				if(err){ throw(err) }
				obj.status.should.equal('failed')
				obj.errors.should.lengthOf(6)
				done()
			}	
		)	
	})


	it("update : success", function(done){
		restClient.post(
			'/notification/update/'+ notificationID1 +'?access_token=' + superAdminToken,
			{
				title				: data.title.valid[1],
				description 		: data.description.valid[1],
				resolve_url 		: data.resolveURL.valid[1],
				customer_id 		: customerID,
				severity 			: data.severity.valid[1],
				notification_class 	: data.notificationClass.valid[1]
			},
			function(err, req, res, obj){
				if(err){ throw(err) }
				obj.status.should.equal('success')
				
				restClient.get(
					'/notification/' + notificationID1 + '?access_token=' + superAdminToken,
					function(err, req, res, obj){
						if(err){ throw(err) }
						obj.status.should.equal('success')
						var respObj = obj.result.shift()
						respObj.title.should.equal(data.title.valid[1])
						respObj.description.should.equal(data.description.valid[1])
						respObj.resolve_url.should.equal(data.resolveURL.valid[1])
						respObj.severity.should.equal(data.severity.valid[1])
						respObj.notification_class.should.equal(data.notificationClass.valid[1])
						done()
					}
				)	
			}
		)	
	})
	
	it("resolve notification", function(done){

		//create new notification for resolve verification
		restClient.post(
			'/notification/create?access_token=' + superAdminToken,
			{
				title				: data.title.valid[0],
				description 		: data.description.valid[0],
				resolve_url 		: data.resolveURL.valid[0],
				customer_id 		: customerID,
				severity 			: data.severity.valid[0],
				notification_class 	: data.notificationClass.valid[0]
			},
			function(err, req, res, obj){
				if(err){ throw(err) }
				obj.status.should.equal('success')
				notificationID2 = obj.id
				restClient.get(
					'/notification/resolve/' + notificationID2 + '?access_token=' + userToken,
					function(err, req, res, obj){
						if(err){ throw(err) }
						obj.status.should.equal('success')
						
						//After resolve verify!!
						restClient.get(
							'/notification/' + notificationID2 + '?access_token=' + superAdminToken,
							function(err, req, res, obj){
								if(err){ throw(err) }
								obj.status.should.equal('success')
								obj.result[0].resolved_by.should.equal(userID);
								done()
							}
						)	
					}
				)	
			}
		)	
	})

	it("list all notifications by normal user", function(done){
		restClient.get(
			'/notification/all?access_token=' + userToken,
			function(err, req, res, obj){
				if(err){ throw(err) }
				obj.status.should.equal('success')
				obj.total.should.equal(2)
				done()
			}
		)	
	})

	it("list unresolved notifications by normal user", function(done){
		restClient.get(
			'/notification?access_token=' + userToken,
			function(err, req, res, obj){
				if(err){ throw(err) }
				obj.status.should.equal('success')
				obj.total.should.equal(1)
				done()
			}
		)	
	})

	it("list all notifications for a customer by admin", function(done){
		restClient.get(
			'/notification/for-customer/all/'+ customerID +'?access_token=' + superAdminToken,
			function(err, req, res, obj){
				if(err){ throw(err) }
				obj.status.should.equal('success')
				obj.total.should.equal(2)
				done()
			}
		)	
	})

	it("list unresolved notifications for a customer by admin", function(done){
		restClient.get(
			'/notification/for-customer/'+ customerID +'?access_token=' + superAdminToken,
			function(err, req, res, obj){
				if(err){ throw(err) }
				obj.status.should.equal('success')
				obj.total.should.equal(1)
				done()
			}
		)	
	})

	it("Verify unauthorised access", function(done){
		calls = [
			function(callback){
				restClient.post(
					'/notification/create?access_token=' + userToken,
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
					'/notification/update/'+ notificationID1 +'?access_token=' + userToken,
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
					'/notification/delete/'+ notificationID1 +'?access_token=' + userToken,
					function(err, req, res, obj){
						if(err){ throw(err) }
						obj.status.should.equal('403');
						callback();
					}
				)
			},
			function(callback){
				restClient.get(
					'/notification/for-customer/'+ customerID +'?access_token=' + userToken,
					function(err, req, res, obj){
						if(err){ throw(err) }
						obj.status.should.equal('403');
						callback();
					}
				)
			},
			function(callback){
				restClient.get(
					'/notification/for-customer/all/'+ customerID +'?access_token=' + userToken,
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

	it("delete", function(done){
		restClient.get(
			'/notification/delete/' + notificationID1 + '?access_token=' + superAdminToken,
			function(err, req, res, obj){
				if(err){ throw(err) }
				obj.status.should.equal('success')
				
				restClient.get(
					'/notification/' + notificationID1 + '?access_token=' + superAdminToken,
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