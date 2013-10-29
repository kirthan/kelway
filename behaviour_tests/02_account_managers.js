var restClient 	= require('./support/restclient'),
	prepareData = require('./support/prepare_data'),
	dataPool   	= require('./support/dataLoader'),
	should 		= require('should'), superAdminToken, accountManagerID, data;

describe('Account Manager', function(){
	before(function(done){
		dataPool.getDataSet("02_account_managers", function(err, res){
			data = res;
			prepareData.getSuperAdminToken(function(err,data){
				superAdminToken = data.token;
				done();
			})
		})
		
	})

	after(function(done){
		prepareData.deleteSuperAdminToken(superAdminToken, function(err,data){
			done();
		})
	})

	it("List Account Managers", function(done){
		restClient.get(
			'/account-managers?access_token=' + superAdminToken,
			function(err, req, res, obj){
				if(err){ throw(err) }
				obj.status.should.equal('success')
				done()
			}
		)
	})

	it("create : failed, validation errors", function(done){
		restClient.post(
			'/account-managers/create?access_token=' + superAdminToken,
			{},
			function(err, req, res, obj){
				if(err){ throw(err) }
				accountManagerID = obj.id
				obj.status.should.equal('failed')
				obj.errors.should.have.lengthOf(4)
				done()
			}
		)
	})

	it("create : success", function(done){
		restClient.post(
			'/account-managers/create?access_token=' + superAdminToken,
			{
				first_name 		: data.firstName.valid[0],
				last_name 		: data.lastName.valid[0], 
				email 			: data.email.valid[0],
				phone_number 	: data.phoneNumber.valid[0]
			},
			function(err, req, res, obj){
				if(err){ throw(err) }
				accountManagerID = obj.id
				obj.status.should.equal('success')

				//Cross check Account manager
				restClient.get(
					'/account-managers/' + accountManagerID + '?access_token=' + superAdminToken,
					function(err, req, res, obj){
						if(err){ throw(err) }
						obj.status.should.equal('success')
						var respObj = obj.result.shift()					
						respObj.first_name.should.equal(data.firstName.valid[0])
						respObj.last_name.should.equal(data.lastName.valid[0])
						respObj.email.should.equal(data.email.valid[0])
						respObj.phone_number.should.equal(data.phoneNumber.valid[0])
						done()
					}
				)
			}
		)
	})
	
	it("get single account manager ", function(done){
		restClient.get(
			'/account-managers/' + accountManagerID + '?access_token=' + superAdminToken,
			function(err, req, res, obj){
				if(err){ throw(err) }
				obj.status.should.equal('success')
				done()
			}
		)
	})

	it("update : failed, validation errors", function(done){
		restClient.post(
			'/account-managers/update/' + accountManagerID + '?access_token=' + superAdminToken,
			{ },	
			function(err, req, res, obj){
				if(err){ throw(err) }
				obj.status.should.equal('failed')
				obj.errors.should.have.lengthOf(4)
				done()
			}
		)
	}) 

	it("update : success", function(done){
		restClient.post(
			'/account-managers/update/' + accountManagerID + '?access_token=' + superAdminToken,
			{
				first_name 		: data.firstName.valid[1],
				last_name 		: data.lastName.valid[1], 
				email 			: data.email.valid[1],
				phone_number 	: data.phoneNumber.valid[1]
			},	
			function(err, req, res, obj){
				if(err){ throw(err) }
				obj.status.should.equal('success')
				
				//Cross check Updated Account manager
				restClient.get(
					'/account-managers/' + accountManagerID + '?access_token=' + superAdminToken,
					function(err, req, res, obj){
						if(err){ throw(err) }
						obj.status.should.equal('success')
						var respObj = obj.result.shift()					
						respObj.first_name.should.equal(data.firstName.valid[1])
						respObj.last_name.should.equal(data.lastName.valid[1])
						respObj.email.should.equal(data.email.valid[1])
						respObj.phone_number.should.equal(data.phoneNumber.valid[1])
						done()
					}
				)
			}
		)
	}) 


	it("delete", function(done){
		restClient.get(
			'/account-managers/delete/' + accountManagerID + '?access_token=' + superAdminToken,
			function(err, req, res, obj){
				if(err){ throw(err) }
				obj.status.should.equal('success')
				
				// cross check delete
				restClient.get(
					'/account-managers/' + accountManagerID + '?access_token=' + superAdminToken,
					function(err, req, res, obj){
						if(err){ throw(err) }
						obj.status.should.equal('success')
						obj.result.should.be.empty
						done()
					}
				)
			}
		)
	})

})