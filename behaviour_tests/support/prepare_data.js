var restClient 	= require('./restclient'),
	should 		= require('should'),
	dataPool    = require('./dataLoader');

module.exports = {

	
	getSuperAdminToken: function(callback){
		dataPool.getDataSet("01_login_logout", function(err, data){
			
			restClient.post(
				'/login',
				{user: data.superAdminUserName.valid[0], pass: data.superAdminPassword.valid[0]},
				function(err, req, res, obj){
					if(err){ throw(err) };
					if(!obj.token){ throw new Error('Did not find access token') };
					obj.status.should.equal('success');
					this.superAdminToken = obj.token;
					var res = {
						token : obj.token
					}
					callback(null,res);
				}
			)
		})
	},

	createUser : function(customerID, superAdminToken, callback){
		dataPool.getDataSet("04_user", function(err, data){
			
			var userName = data.userName.valid[0] +  Math.floor(Math.random()*89999+10000)
			
			restClient.post(
				'/users/create?access_token=' + superAdminToken,
				{
					user_name 			: userName,
					password			: data.password.valid[0],
					confirm_password 	: data.password.valid[0],
					email 				: data.email.valid[0],
					phone_number 		: data.phoneNumber.valid[0],
					first_name 			: data.firstName.valid[0],
					last_name 			: data.lastName.valid[0],
					company_id 			: customerID
				},
				function(err, req, res, obj){
					if(err){ throw(err) }
					obj.status.should.equal('success')
					var res = {
						userName 		: userName,
						userPassword 	: data.password.valid[0],
						userID 			: obj.id
					}
					callback(null,res);
				}
			)
		})	
	},

	createStaff : function(superAdminToken, callback){
		dataPool.getDataSet("05_staff", function(err, data){
			staffName 		= data.userName.valid[0] +  Math.floor(Math.random()*89999+10000),
			
			restClient.post(
				'/staff/create?access_token=' + superAdminToken,
				{
					user_name 			: staffName,
					password			: data.password.valid[0],
					confirm_password 	: data.password.valid[0],
					email 				: data.email.valid[0],
					phone_number 		: data.phoneNumber.valid[0],
					first_name 			: data.firstName.valid[0],
					last_name 			: data.lastName.valid[0]
				},
				function(err, req, res, obj){
					if(err){ throw(err) }
					obj.status.should.equal('success')
					var res = {
						staffName 		: staffName,
						staffPassword 	: data.password.valid[0],
						staffID 		: obj.id 
					}
					callback(null,res);
				}	
			)
		})	
	},

	createAccountManager : function(superAdminToken, callback){
		dataPool.getDataSet("02_account_managers", function(err, data){
			
			restClient.post(
				'/account-managers/create?access_token=' + superAdminToken,
				{
					first_name 		: data.firstName.valid[0],
					last_name 		: data.firstName.valid[0],
					email 			: data.email.valid[0],
					phone_number 	: data.phoneNumber.valid[0]
				},
				function(err, req, res, obj){
					if(err){ throw(err) }
					if(obj.status == "failed"){ 
						throw new Error('Account Manager not created') 
					}
					var res = {
						accountManagerID : obj.id
					}
					callback(null,res);
				}
			)
		})		
	},

	createCustomer : function(accountManagerID, superAdminToken, callback){
		dataPool.getDataSet("03_customers", function(err, data){
			
			restClient.post(
				'/customers/create?access_token=' + superAdminToken,
				{
					name 			: data.name.valid[0],
					short_code 		: data.shortCode.valid[0], 
					account_manager : accountManagerID
				},
				function(err, req, res, obj){
					if(err){ throw(err) }
					if(obj.status == "failed"){ 
						throw new Error('Customer not created') 
					}
					var res = {
						customerID : obj.id
					}
					callback(null,res);
				}
			)
		})	
	},
	
	createServer : function(customerID, superAdminToken, callback){
		dataPool.getDataSet("08_server", function(err, data){
			
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
					var res = {
						serverID : obj.id
					}
					callback(null,res);
				}	
			)
		})	
	},

	deleteUser : function(userID, superAdminToken, callback){
		restClient.get(
			'/users/delete/' + userID + '?access_token=' + superAdminToken,
			function(err, req, res, obj){
				if(err){ throw(err) }
				obj.status.should.equal('success')
				callback(null,true);
			}
		)
	},

	deleteStaff : function(staffID, superAdminToken, callback){
		restClient.get(
			'/staff/delete/' + staffID + '?access_token=' + superAdminToken,
			function(err, req, res, obj){
				if(err){ throw(err) }
				obj.status.should.equal('success')
				callback(null,true);
			}
		)
	},

	deleteCustomer : function(customerID, superAdminToken, callback){
		restClient.get(
			'/customers/delete/' + customerID + '?access_token=' + superAdminToken,
			function(err, req, res, obj){
				if(err){ throw(err) }
				obj.status.should.equal('success')
				callback(null,true);
			}
		)
	},

	deleteAccountManager : function(accountManagerID, superAdminToken, callback){
		restClient.get(
			'/account-managers/delete/' + accountManagerID + '?access_token=' + superAdminToken,
			function(err, req, res, obj){
				if(err){ throw(err) }
				obj.status.should.equal('success')
				callback(null,true);
			}
		)
	},

	deleteServer : function(serverID, superAdminToken, callback){
		restClient.get(
			'/servers/delete/' + serverID + '?access_token=' + superAdminToken,
			function(err, req, res, obj){
				if(err){ throw(err) }
				obj.status.should.equal('success')
				callback(null,true);
			}
		)
	},

	getUserToken : function(userName, password, callback){
		restClient.post(
			'/login',
			{user: userName, pass:password},
			function(err, req, res, obj){
				if(err){ throw(err) }
				if(!obj.token){ throw new Error('Did not find access token') }
				obj.status.should.equal('success')
				var res = {
					userToken : obj.token
				}
				callback(null,res);
			}
		)
	},

	getAdminToken : function(staffName, password, callback){
		restClient.post(
			'/login',
			{user: staffName, pass:password},
			function(err, req, res, obj){
				if(err){ throw(err) }
				if(!obj.token){ throw new Error('Did not find access token') }
				obj.status.should.equal('success')
				var res = {
					staffToken : obj.token
				}
				callback(null,res);
			}
		)
	},

	deleteUserToken : function(userToken, callback){
		restClient.get(
			'/logout?access_token=' + userToken,
			function(err, req, res, obj){
				if(err){ throw(err) }
				if(obj.errors){ throw new Error('Did not logout.') }
				obj.status.should.equal('success')
				callback(null,true);
			}
		)
	},

	deleteAdminToken : function(adminToken, callback){
		restClient.get(
			'/logout?access_token=' + adminToken,
			function(err, req, res, obj){
				if(err){ throw(err) }
				if(obj.errors){ throw new Error('Did not logout.') }
				obj.status.should.equal('success')
				callback(null,true);
			}
		)
	},

	deleteSuperAdminToken : function(superAdminToken, callback){
		restClient.get(
			'/logout?access_token=' + superAdminToken,
			function(err, req, res, obj){
				if(err){ throw(err) }
				if(obj.errors){ throw new Error('Did not logout.') }
				obj.status.should.equal('success')
				callback(null,true);
			}
		)
	}

}