var restClient 	= require('./support/restclient'),
	should 		= require('should'),
	prepareData = require('./support/prepare_data'),
	dataPool    = require('./support/dataLoader'),
	async      	= require('async'),
	superAdminToken, accountManagerID, customerID, 
	calls, userToken, userName, userPassword, userID, serverID;

describe('Email notification : ', function(){
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
				prepareData.createServer(customerID, superAdminToken, function(err,data){
					serverID = data.serverID;
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
				prepareData.deleteServer(serverID, superAdminToken, function(err,data){
					callback();
				})
			},
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

	it("attach media : failed, No server error", function(done){
		restClient.post(
			'/email-notification/attach-media?access_token=' + userToken,
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

	it("attach media : success", function(done){
		restClient.post(
			'/email-notification/attach-media?access_token=' + userToken,
			{
				serverID : serverID
			},
			function(err, req, res, obj){
				if(err){ throw(err) }
				obj.status.should.equal('success')
				done()
			}	
		)	
	})

	it("detach media : failed, No server error", function(done){
		restClient.post(
			'/email-notification/detach-media?access_token=' + userToken,
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

	it("detach media : success", function(done){
		restClient.post(
			'/email-notification/detach-media?access_token=' + userToken,
			{
				serverID : serverID
			},
			function(err, req, res, obj){
				if(err){ throw(err) }
				obj.status.should.equal('success')
				done()
			}	
		)	
	})

	

	it("edit description : failed, No server error", function(done){
		restClient.post(
			'/email-notification/edit-description?access_token=' + userToken,
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

	it("edit description : success", function(done){
		restClient.post(
			'/email-notification/edit-description?access_token=' + userToken,
			{
				serverID : serverID
			},
			function(err, req, res, obj){
				if(err){ throw(err) }
				obj.status.should.equal('success')
				done()
			}	
		)	
	})

	it("power off server : failed, No server error", function(done){
		restClient.post(
			'/email-notification/power-off-server?access_token=' + userToken,
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

	it("power off server : success", function(done){
		restClient.post(
			'/email-notification/power-off-server?access_token=' + userToken,
			{
				serverID : serverID
			},
			function(err, req, res, obj){
				if(err){ throw(err) }
				obj.status.should.equal('success')
				done()
			}	
		)	
	})

	it("reset server : failed, No server error", function(done){
		restClient.post(
			'/email-notification/reset-server?access_token=' + userToken,
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

	it("reset server : success", function(done){
		restClient.post(
			'/email-notification/reset-server?access_token=' + userToken,
			{
				serverID : serverID
			},
			function(err, req, res, obj){
				if(err){ throw(err) }
				obj.status.should.equal('success')
				done()
			}	
		)	
	})

	it("shutdown server : failed, No server error", function(done){
		restClient.post(
			'/email-notification/shutdown-server?access_token=' + userToken,
			{},
			function(err, req, res, obj){
				if(err){ throw(err) }
				obj.status.should.equal('failed')
				obj.errors.should.have.lengthOf(1)
				done()
			}	
		)	
	})

	it("shutdown server : success", function(done){
		restClient.post(
			'/email-notification/shutdown-server?access_token=' + userToken,
			{
				serverID : serverID
			},
			function(err, req, res, obj){
				if(err){ throw(err) }
				obj.status.should.equal('success')
				done()
			}	
		)	
	})

	it("ssh details : failed, No server error", function(done){
		restClient.post(
			'/email-notification/ssh-details?access_token=' + userToken,
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

	it("ssh details : success", function(done){
		restClient.post(
			'/email-notification/ssh-details?access_token=' + userToken,
			{
				serverID : serverID
			},
			function(err, req, res, obj){
				if(err){ throw(err) }
				obj.status.should.equal('success')
				done()
			}	
		)	
	})

	it("upgrade server : failed, No server error", function(done){
		restClient.post(
			'/email-notification/upgrade-server?access_token=' + userToken,
			{},
			function(err, req, res, obj){
				if(err){ throw(err) }
				obj.status.should.equal('failed')
				obj.errors.should.have.lengthOf(1)
				done()
			}	
		)	
	})

	it("upgrade server : success", function(done){
		restClient.post(
			'/email-notification/upgrade-server?access_token=' + userToken,
			{
				serverID : serverID
			},
			function(err, req, res, obj){
				if(err){ throw(err) }
				obj.status.should.equal('success')
				done()
			}	
		)	
	})

	it("delete server : failed, No server error", function(done){
		restClient.post(
			'/email-notification/delete-server?access_token=' + userToken,
			{},
			function(err, req, res, obj){
				if(err){ throw(err) }
				obj.status.should.equal('failed')
				obj.errors.should.have.lengthOf(1)
				done()
			}	
		)	
	})

	it("delete server : success", function(done){
		restClient.post(
			'/email-notification/delete-server?access_token=' + userToken,
			{
				serverID : serverID
			},
			function(err, req, res, obj){
				if(err){ throw(err) }
				obj.status.should.equal('success')
				done()
			}	
		)	
	})
})