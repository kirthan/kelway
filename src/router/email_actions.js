//     Email Action Routers
//     
//    This module is responsible to route to matching actions to
//	  send email for various server actions
//     
//     @package    ServiceApp Router
//     @module     Email Action Routers
//     @author     Chethan K
function EmailActionsRoute(app){

	//  *** `private` respond : *** Generic Function to send response
	var respond = function(error, isMailSent, callback){
		if(isMailSent){
			callback(null,{status:'success'});
		} else {
			callback(null,{
				status:'failed',
				errors:[error]
			});
		}
	}

	//  *** `private` isNormalUser : *** Function to check, the user is admin/superAdmin or a normal user
	var isNormalUser = function(token, callback){
		app.auth.getRoles(token, function(roles){
			callback(!(_.contains(roles, "admin", "superAdmin")));
		});
	}
	
	//  *** `private` attachMedia : *** Function to route for attachMedia action
	this.attachMedia = function(req, callback){
		isNormalUser(req.params.access_token, function(success){
			if(success){
				app.plugins.email_actions.attachMedia(req.params, function(err, success){
					respond(err, success, callback);	
				});
			}else {
				respond("not authorised", false, callback)
			}
		})
	}

	//  *** `public` deleteServer : *** Function to route for deleteServer action
	this.deleteServer = function(req, callback){
		isNormalUser(req.params.access_token, function(success){
			if(success){
				app.plugins.email_actions.deleteServer(req.params, function(err, success){
					respond(err, success, callback);	
				});
			}else {
				respond("not authorised", false, callback)
			}
		})
	}

	//  *** `public` detachMedia : *** Function to route for detachMedia action
	this.detachMedia = function(req, callback){
		isNormalUser(req.params.access_token, function(success){
			if(success){
				app.plugins.email_actions.detachMedia(req.params, function(err, success){
					respond(err, success, callback);	
				});
			}else {
				respond("not authorised", false, callback)
			}
		})
	}

	//  *** `public` editDescription : *** Function to route for editDescription action
	this.editDescription = function(req, callback){
		isNormalUser(req.params.access_token, function(success){
			if(success){
				app.plugins.email_actions.editDescription(req.params, function(err, success){
					respond(err, success, callback);	
				});
			}else {
				respond("not authorised", false, callback)
			}
		})
	}

	//  *** `public` powerOffServer : *** Function to route for powerOffServer action
	this.powerOffServer = function(req, callback){
		isNormalUser(req.params.access_token, function(success){
			if(success){
				app.plugins.email_actions.powerOffServer(req.params, function(err, success){
					respond(err, success, callback);	
				});
			}else {
				respond("not authorised", false, callback)
			}
		})
	}

	//  *** `public` resetServer : *** Function to route for resetServer action
	this.resetServer = function(req, callback){
		isNormalUser(req.params.access_token, function(success){
			if(success){
				app.plugins.email_actions.resetServer(req.params, function(err, success){
					respond(err, success, callback);	
				});
			}else {
				respond("not authorised", false, callback)
			}
		})
	}

	//  *** `public` shutdownServer : *** Function to route for shutdownServer action
	this.shutdownServer = function(req, callback){
		isNormalUser(req.params.access_token, function(success){
			if(success){
				app.plugins.email_actions.shutdownServer(req.params, function(err, success){
					respond(err, success, callback);	
				});
			}else {
				respond("not authorised", false, callback)
			}
		})
	}

	//  *** `public` sshDetails : *** Function to route for sshDetails action
	this.sshDetails = function(req, callback){
		isNormalUser(req.params.access_token, function(success){
			if(success){
				app.plugins.email_actions.sshDetails(req.params, function(err, success){
					respond(err, success, callback);	
				});
			}else {
				respond("not authorised", false, callback)
			}
		})
	}

	//  *** `public` upgradeServer : *** Function to route for upgradeServer action
	this.upgradeServer = function(req, callback){
		isNormalUser(req.params.access_token, function(success){
			if(success){
				app.plugins.email_actions.upgradeServer(req.params, function(err, success){
					respond(err, success, callback);	
				});
			}else {
				respond("not authorised", false, callback)
			}
		})
	}
}

module.exports = EmailActionsRoute;