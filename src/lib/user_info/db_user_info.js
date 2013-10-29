//     DB User Info
//     
//     Actions associated with current user,
//	   1. login
//	   2. get roles, 
//	   3. get complete details
//    
//	   @package    ServiceApp Library
//     @module     DB User Info
//     @author     Abhilash Hebbar
//     @author     Chethan K


var _ = require('underscore');
function DBUserInfo(app){

	//  *** `public` login : *** Function to login user by getting user name and password
		this.login = function(user,pass,callback){
		
		app.plugins.users.validateUser(user, pass, function(theUser){ //validate user from user model
			var user = null, //User,
				company = null, // Company,
				accountManager = null; //Account Manager
			
			if(!theUser){
				callback(false);
				return;
			}
			if(_.contains(theUser.roles, "admin", "superAdmin")){// For Admin and Super Admin,
				callback(true, theUser, null, null); // No company and account manager 
			} else {
				app.plugins.companies.getCompany(theUser.company_id, function(theCompany){
					if(!theCompany){  // Get Company Details from 'companies' model
						callback(false);
						return;
					}
					if(!theCompany.account_manager){
						callback(true, theUser, theCompany, null);
					}else{
						app.plugins.account_managers.getAccountManager(theCompany.account_manager, function(theAccountManager){
							if(!theAccountManager){ // Get Account Manager from 'account_managers' model
								callback(false);
								return;
							}
							callback(true, theUser, theCompany, theAccountManager);
						})
					}
				});
			}
		});
	}

	//  *** `public` getRoles : *** Function to get roles, Given User ID 
	this.getRoles = function(uid,callback){

		app.plugins.users.getUser(uid, function(theUser){
			if(!theUser){
				callback(false);
				return;
			}
			callback(theUser.roles);
		});
	}

	//  *** `public` getDetails : *** Function to get user deatails, Given User ID
	this.getDetails = function(uid,callback){
		
		app.plugins.users.getUser(uid, function(theUser){
			if(!theUser){
				callback(false);
				return;
			}
			delete(theUser.password);
			callback(true, theUser);
		});
	}
}

module.exports = DBUserInfo;