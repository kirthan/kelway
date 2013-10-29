//     Email Action
//     
//     This module is responsible for sending emails for
//	   various server actions. We need user, server,
//	   company, account manager, server details to prepare an email.
//     
//     @package    ServiceApp Plugins
//     @module     Email Action
//     @author     Chethan K

function EmailActions(app){
	

	var user = null, // set place holder for all the entities
	    server = null, 
	    company = null,
	    accountManager = null,
	    requested_server= null;

	//  *** `private` setUser : *** Function to set User
	setUser = function(token, callback){
		app.auth.getUserDetails(token, function(theUser){

			if(theUser){
				user = theUser;
				callback(true);
			}else {
				callback(false);
			}
		}) 
	}

	//  *** `private` setServer : *** Function to set server
	setServer = function(serverID, callback){
		app.plugins.servers.getServer(serverID, function(theServer){
			if(theServer){
				server = theServer;
				callback(true);
			}else {
				callback(false);
			}
		})
	}

	//  *** `private` setRequestedServer : *** Function to set requested server
	setRequestedServer = function(serverID, callback){
		app.plugins.server_requests.getServer(serverID, function(theServer){
			if(theServer){
				requested_server = theServer;
				callback(true);
			}else {
				callback(false);
			}
		})
	}

	//  *** `private` setCustomer : *** Function to set customer
	setCustomer = function(customerID, callback){
		app.plugins.companies.getCompany(customerID, function(theCompany){
			if(theCompany){
				company = theCompany;
				callback(true);
			}else {
				callback(false);
			}
		})	
	}

	//  *** `private` setAccountManager : *** Function to set Account Manager
	setAccountManager = function(accountManagerID, callback){
		app.plugins.account_managers.getAccountManager(accountManagerID, function(theAccountManager){
			if(theAccountManager){
				accountManager = theAccountManager;
				callback(true);
			}else {
				callback(false);
			}
		})	
	}
	
	//  *** `private` setAllParams : *** Function to set all the params. initial point.	
	setAllParams = function(token, serverID, callback){
		setUser(token, function(success){
			if(success){
				setCustomer(user.company_id, function(success){
					if(success){
						setServer(serverID, function(success){
							if(success){
								setAccountManager(company.account_manager, function(success){
									if(success){
										callback(null, true);
									} else {
										callback("Account manager Not found", false);
									}
								})
							} else {
								callback("Server Not found",false);
							}
						})
					} else {
						callback("customer not found", false);
					}
				})
			} else {
				callback("user not found", false);
			}
		})
	}
	
	//  *** `private` sendMail : *** Function to send e mail. Set all the necessary data and call sendMail function
	sendMail = function(template, subject, params, callback){
		toEmail 	= app.get('DESTINATION_EMAIL'),
		toName 		= accountManager.first_name + " " + accountManager.last_name; 
		theParams 		= {
			user 				: user,
			customer			: company,
			server 				: server,
			requested_server	: requested_server,
			accountManager      : accountManager,
			params 				: params,
		}
		app.plugins.emails.sendMail(template, theParams, subject, toEmail, toName);
		callback();
	}

	//  *** `public` attachMedia : *** Function to Send an email for the action 'Attach Media'
	this.attachMedia = function(params, callback){
		setAllParams(params.access_token, params.serverID, function(err, success){
			if(success){
				sendMail("attach_media", "Attach Media", params, function(){
					callback(null, true);
				})
			} else {
				callback(err, false);
			}
		})
    }

    //  *** `public` deleteServer : *** Function to Send an email for the action 'Delete Server'
	this.deleteServer = function(params, callback){
		setAllParams(params.access_token, params.serverID, function(err, success){
			if(success){
				sendMail("delete_server", "Delete Server", params, function(){
					callback(null, true);
				})
			} else {
				callback(err, false);
			}
		})
    }

    //  *** `public` detachMedia : *** Function to Send an email for the action 'Detach Media'
	this.detachMedia = function(params, callback){
		setAllParams(params.access_token, params.serverID, function(err, success){
			if(success){
				sendMail("detach_media", "Detach Media", params, function(){
					callback(null, true);
				})
			} else {
				callback(err, false);
			}
		})
    }
	
	//  *** `public` editDescription : *** Function to Send an email for the action 'Edit Description'
	this.editDescription = function(params, callback){
		setAllParams(params.access_token, params.serverID, function(err, success){
			if(success){
				sendMail("edit_description", "Edit Descreption", params, function(){
					callback(null, true);
				})
			} else {
				callback(err, false);
			}
		})
    }

    //  *** `public` powerOffServer : *** Function to Send an email for the action 'PowerOff Server'
    this.powerOffServer = function(params, callback){

    	setAllParams(params.access_token, params.serverID, function(err, success){
			if(success){
				sendMail("power_off_server", "Power Off Server", params, function(){
					callback(null, true);
				})
			} else {
				callback(err, false);
			}
		})
    }

    //  *** `public` resetServer : *** Function to Send an email for the action 'Reset Server'
    this.resetServer = function(params, callback){

    	setAllParams(params.access_token, params.serverID, function(err, success){
			if(success){
				sendMail("reset_server", "Reset Server", params, function(){
					callback(null, true);
				})
			} else {
				callback(err, false);
			}
		})
    }
    //  *** `public` shutdownServer : *** Function to Send an email for the action 'Shutdown Server'
    this.shutdownServer = function(params, callback){

    	setAllParams(params.access_token, params.serverID, function(err, success){
			if(success){
				sendMail("shutdown_server", "Shutdown Server", params, function(){
					callback(null, true);
				})
			} else {
				callback(err, false);
			}
		})
    }

    //  *** `public` sshDetails : *** Function to Send an email for the action 'sshDetails'
    this.sshDetails = function(params, callback){

    	setAllParams(params.access_token, params.serverID, function(err, success){
			if(success){
				sendMail("ssh_details", "SSH Details", params, function(){
					callback(null, true);
				})
			} else {
				callback(err, false);
			}
		})
    }

    //  *** `public` upgradeServer : *** Function to Send an email for the action 'upgradeServer'
	this.upgradeServer = function(params, callback){

		setAllParams(params.access_token, params.serverID, function(err, success){
			if(success){
				sendMail("upgrade_server", "Upgrade Server", params, function(){
					callback(null, true);
				})
			} else {
				callback(err, false);
			}
		})
    }

    //  *** `public` sendServerRequestEmail : *** Function to Send an email for the action 'New Server Request'
    this.sendServerRequestEmail = function( params, callback){
    	setUser(params.access_token, function(success){
			if(success){
				setCustomer(user.company_id, function(success){
					if(success){
						setRequestedServer(params.id, function(success){
							if(success){
								setAccountManager(company.account_manager, function(success){
									if(success){
										sendMail("request_new_server", "Request New Server", params, function(){
											callback(null, true);
										})
									} else {
										callback("Account manager Not found", false);
									}
								})
							} else {
								callback("Request server Not found",false);
							}
						})
					} else {
						callback("customer not found", false);
					}
				})
			} else {
				callback("user not found", false);
			}
		})
    }
}

module.exports = EmailActions;