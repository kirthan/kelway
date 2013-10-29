var restClient = require('./support/restclient'),
	prepareData = require('./support/prepare_data'),
	dataPool   = require('./support/dataLoader'),
	should 	   = require('should'), superAdminToken, customerID, data;



describe('Customer', function(){
	before(function(done){
		dataPool.getDataSet("03_customers", function(err, res){
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

	it("list Customers", function(done){
		restClient.get(
			'/customers?access_token=' + superAdminToken,
			function(err, req, res, obj){
				if(err){ throw(err) }
				obj.status.should.equal('success')
				done()
			}
		)
	})

	it("create : failed, validation error", function(done){
		restClient.post(
			'/customers/create?access_token=' + superAdminToken,
			{},
			function(err, req, res, obj){
				if(err){ throw(err) }
				obj.status.should.equal('failed')
				obj.errors.should.have.lengthOf(3)
				done()
			}
		)
	})

	it("create : success", function(done){
		restClient.post(
			'/customers/create?access_token=' + superAdminToken,
			{
				name 			: data.name.valid[0],
				short_code 		: data.shortCode.valid[0], 
				account_manager : data.accountManager.valid[0]
			},
			function(err, req, res, obj){
				if(err){ throw(err) }
				customerID = obj.id
				obj.status.should.equal('success')

				//Cross check Customer
				restClient.get(
					'/customers/' + customerID + '?access_token=' + superAdminToken,
					function(err, req, res, obj){
						if(err){ throw(err) }
						obj.status.should.equal('success')
						var respObj = obj.result.shift()
						respObj.name.should.equal(data.name.valid[0])
						respObj.short_code.should.equal(data.shortCode.valid[0])
						respObj.account_manager.should.equal(data.accountManager.valid[0])
						done()
					}
				)
				
			}
		)
	})
	
	it("get single customer", function(done){
		restClient.get(
			'/customers/' + customerID + '?access_token=' + superAdminToken,
			function(err, req, res, obj){
				if(err){ throw(err) }
				obj.status.should.equal('success')
				done()
			}
		)
	})
	
	it("update customer : failed, validation error", function(done){
		restClient.post(
			'/customers/update/' + customerID + '?access_token=' + superAdminToken,
			{ },	
			function(err, req, res, obj){
				if(err){ throw(err) }
				obj.status.should.equal('failed')
				obj.errors.should.have.lengthOf(3)
				done()
			}
		)
	}) 


	it("update : success", function(done){
		restClient.post(
			'/customers/update/' + customerID + '?access_token=' + superAdminToken,
			{
				name 			: data.name.valid[1],
				short_code 		: data.shortCode.valid[1], 
				account_manager : data.accountManager.valid[1]
			},	
			function(err, req, res, obj){
				if(err){ throw(err) }
				obj.status.should.equal('success')

				//Cross check customer
				restClient.get(
					'/customers/' + customerID + '?access_token=' + superAdminToken,
					function(err, req, res, obj){
						if(err){ throw(err) }
						obj.status.should.equal('success')
						var respObj = obj.result.shift()
						respObj.name.should.equal(data.name.valid[1])
						respObj.short_code.should.equal(data.shortCode.valid[1])
						respObj.account_manager.should.equal(data.accountManager.valid[1])
						done()
					}
				)
			}
		)
	}) 


	it("delete", function(done){
		restClient.get(
			'/customers/delete/' + customerID + '?access_token=' + superAdminToken,
			function(err, req, res, obj){
				if(err){ throw(err) }
				obj.status.should.equal('success')
				
				restClient.get(
					'/customers/' + customerID + '?access_token=' + superAdminToken,
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
