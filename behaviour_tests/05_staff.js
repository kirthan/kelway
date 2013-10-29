var restClient 	= require('./support/restclient'),
	should 		= require('should'),
	async      	= require('async'),
	prepareData = require('./support/prepare_data'),
	dataPool   	= require('./support/dataLoader'),
	superAdminToken, staffID, staffToken, 
	staffName, staffPassword, calls, data;

describe('Staff : ', function(){
	before(function(done){
		dataPool.getDataSet("05_staff", function(err, res){
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

	it("list Staff", function(done){
		restClient.get(
			'/staff?access_token=' + superAdminToken,
			function(err, req, res, obj){
				if(err){ throw(err) }
				obj.status.should.equal('success')
				done()
			}
		)
	})

	it("create : failed, validation error", function(done){
		restClient.post(
			'/staff/create?access_token=' + superAdminToken,
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
		staffName 		= data.userName.valid[0] +  Math.floor(Math.random()*89999+10000),
		staffPassword 	= data.password.valid[0];
		calls = [
			function(callback){
				restClient.post(
					'/staff/create?access_token=' + superAdminToken,
					{
						user_name 			: staffName,
						password			: staffPassword,
						confirm_password 	: staffPassword,
						email 				: data.email.valid[0],
						phone_number 		: data.phoneNumber.valid[0],
						first_name 			: data.firstName.valid[0],
						last_name 			: data.lastName.valid[0]
					},
					function(err, req, res, obj){
						if(err){ throw(err) }
						obj.status.should.equal('success')
						staffID = obj.id
						callback();
					}	
				)
			},
			function(callback){
				restClient.get(
					'/staff/' + staffID + '?access_token=' + superAdminToken,
					function(err, req, res, obj){
						if(err){ throw(err) }
						obj.status.should.equal('success')
						var userObj = obj.result.shift();
						userObj.user_name.should.equal(staffName)
						userObj.email.should.equal(data.email.valid[0])
						userObj.phone_number.should.equal(data.phoneNumber.valid[0])
						userObj.first_name.should.equal(data.firstName.valid[0])
						userObj.last_name.should.equal(data.lastName.valid[0])
						callback();
					}
				)
			},
			function(callback){
				restClient.post(
							'/login',
					{user: staffName, pass:staffPassword},
					function(err, req, res, obj){
						if(err){ throw(err) }
						if(!obj.token){ throw new Error('Did not find access token') }
						obj.status.should.equal('success')
						staffToken = obj.token
						callback()
					}
				)
			}
		]

		async.series(calls, function(err, res){
			if(err){ throw(err) }
			done()
		})
	})


	it("create duplicate staff : failed", function(done){
		restClient.post(
			'/staff/create?access_token=' + superAdminToken,
			{
				user_name 			: staffName,
				password			: staffPassword,
				confirm_password 	: staffPassword,
				email 				: data.email.valid[0],
				phone_number 		: data.phoneNumber.valid[0],
				first_name 			: data.firstName.valid[0],
				last_name 			: data.lastName.valid[0]
			},
			function(err, req, res, obj){
				if(err){ throw(err) }
				obj.status.should.equal('failed')
				obj.errors.should.have.lengthOf(1)
				done()
			}	
		)
	})

	it("update : failed, validation error", function(done){
		restClient.post(
			'/staff/update/'+ staffID +'?access_token=' + superAdminToken,
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
		staffName 		= data.userName.valid[1] +  Math.floor(Math.random()*89999+10000),
		staffPassword 	= data.password.valid[1];

		calls = [
			function(callback){
				restClient.post(
					'/staff/update/' + staffID + '?access_token=' + superAdminToken,
					{
						user_name 			: staffName,
						password			: staffPassword,
						confirm_password 	: staffPassword,
						email 				: data.email.valid[1],
						phone_number 		: data.phoneNumber.valid[1],
						first_name 			: data.firstName.valid[1],
						last_name 			: data.lastName.valid[1]
					},
					function(err, req, res, obj){
						if(err){ throw(err) }
						obj.status.should.equal('success')
						callback();
					}	
				)
			},
			function(callback){
				restClient.get(
					'/staff/' + staffID + '?access_token=' + superAdminToken,
					function(err, req, res, obj){
						if(err){ throw(err) }
						obj.status.should.equal('success')
						var userObj = obj.result.shift();
						userObj.user_name.should.equal(staffName)
						userObj.email.should.equal(data.email.valid[1])
						userObj.phone_number.should.equal(data.phoneNumber.valid[1])
						userObj.first_name.should.equal(data.firstName.valid[1])
						userObj.last_name.should.equal(data.lastName.valid[1])
						callback();
					}
				)
			},
			function(callback){
				restClient.post(
							'/login',
					{user: staffName, pass:staffPassword},
					function(err, req, res, obj){
						if(err){ throw(err) }
						if(!obj.token){ throw new Error('Did not find access token') }
						obj.status.should.equal('success')
						staffToken = obj.token
						callback()
					}
				)
			}
		]

		async.series(calls, function(err, res){
			if(err){ throw(err) }
			done()
		})
	})

	it("delete staff by another staff : failed", function(done){
		restClient.get(
			'/staff/delete/' + staffID + '?access_token=' + staffToken,
			function(err, req, res, obj){
				if(err){ throw(err) }
				obj.status.should.equal('403')
				done()
			}
		)
	})
	
	it("delete", function(done){
		restClient.get(
			'/staff/delete/' + staffID + '?access_token=' + superAdminToken,
			function(err, req, res, obj){
				if(err){ throw(err) }
				obj.status.should.equal('success')
				
				restClient.get(
					'/staff/' + staffID + '?access_token=' + superAdminToken,
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