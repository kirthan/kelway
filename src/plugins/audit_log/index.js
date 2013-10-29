//     Account Manager
//     
//     This Module is mainly responsible for before/after actions,
//     associated with Audit Log model and also basic CRUD operations.

//     @package    ServiceApp Plugins
//     @module     Audit Log
//     @author     Chethan K

var AuditLogModel 	= require('./model'),
	_ 				= require('underscore'),
	async			= require('async');

function AuditLog(app){
	
	//  *** `private` auditLogModel : *** Holds audit log model object
	var auditLogModel = AuditLogModel(app);

	//  *** `public` getUserName : *** Function to get User name, Given user id
	this.getUserName = function(params, callback){
		app.plugins.users.getUser(params.user_id, function(user){
			if(user){
				params.user_name = user.user_name;
			}
			callback(null, params)
		})
	}

	//  *** `public` setQuery : *** Function to Set query to enable filter operations for audit log
	this.setQuery = function(params, callback){

		var BIG_NUMBER = 9999999999999,
			SMALL_NUMBER = 0;
		if(!params.user_id){  // Filter by User
			params.user_id = ".*"
		} 
		if(params.date){ // Filter by Date
			params.startDate = params.date;
			params.endDate 	 = parseInt(params.date) + (1000 * 60 * 60 * 24 );//Filter logs of one day duration
		} else {
			// disable filter by Date 
			params.startDate = SMALL_NUMBER;
			params.endDate = BIG_NUMBER;
		}
		callback(null, params)
	}

	//  *** `public` getParams : *** Function to shift params in the form of object to array.
	this.getParams = function(params, callback){
		if(params.params){
			params.params = params.params.shift();
		}else {
			params.params = null;
		}
		callback(null, params)
	}

	//  *** `private` addAuditLog : *** Function to add log for a valid action.
	// This can only be called by events 'BeforeRoute', 'AfterRoute', 'AuthFailure'
	addAuditLog = function(req, routeInfo, data){
		prepareParams(req, routeInfo, data, function(auditLogParams){
			auditLogModel(auditLogParams).save(function(err, res){
				if(err){
	                throw new Error('Cannot save Audit Log. ' + err);
	            }
			})
		})
    }

    //  *** `private` prepareParams : *** Function to prepare log data before persist
    prepareParams = function(req, routeInfo, data, mainCallback){

    	//  *** `private` reqParams : *** clone get parameters to avoid call by reference error
    	var reqParams = _.clone(req.params), 

    	userID, // user ID
    	auditLogParams, // Container for final params after preperations
    	auditLogMessage, // Log Message from the router info object 
    	wrapReqParams, // Converting array to object before persist
    	path, // Requested URL 
    	calls, // Container to hold all the functions to excecute serialy
    	response, // Respone object 
    	token; // User access token
		
		calls = [
			
			function(callback){ //Get Current User
				
				
				if(reqParams.access_token) { // For Logged in user, 
					token = reqParams.access_token; //token will be in request data
				}else if(data && data.token){ //for logging in user, 
					token = data.token; //token value will be in response data
				}

				
				if(token){
					app.auth.getUserDetails(token, function(user){
						if(user){
							userID = user._id; //if token is valid, get user id
						}
						callback();
					})
				} else {
					callback();
				}
			},
			
			
			function(callback){
				if(reqParams && Object.keys(reqParams).length != 0){ //check for null/empty 
					reqParams = obscurParams(reqParams); // Obscur sensitive data
					callback();
				} else {
					callback();
				}
			},

			function(callback){
				
				if(reqParams.access_token != null){
					delete reqParams['access_token']; //remove access_token from req.params 
				}
				if(req.query.access_token != null){
					delete req.query.access_token; //remove access_token from rer.query
				}
				
				if(routeInfo.params){ //Check Audit log message for this action
					auditLogMessage = routeInfo.params.audit_log_message;
				}

				
				var REGEX =  /[?].*/;
				path = req.url.replace(REGEX, ""); //remove get params from query string

				
				if(data){ //prepare response data
					response = {};
					if(data.status){
						response.status = data.status;
					}
					if(data.id){
						response.id = data.id;
					}
					if(data.errors){
						response.errors = data.errors
					}
				}

				wrapReqParams = [{
					response		: response ? response : null,
					postParams 		: reqParams,
					getParams  	   	: req.query
				}];
				callback();
			}
		];
		
		async.series(calls,function(err,results){
			auditLogParams = {
				params 		: wrapReqParams,
				user_id 	: userID,
				timestamp	: new Date().getTime(),
				message 	: auditLogMessage,
				path 		: path
			}
			mainCallback(auditLogParams);
		});
    }

    //  *** `private` obscurParams : *** Function to hide all the sensitive data
    obscurParams = function(reqParams){
    	// blurr sensitive data in the request
		var sensitiveVars = ['password', 'confirm_password', // Any variables needs to obscurr, 
		'current_password', 'email',  //just add it to this array 
		'confirm_email','phone_number', 'pass'];
		_.each(sensitiveVars, function(name){
			if(this[name]){
				this[name] = "********";
			} 
		},reqParams);

		return reqParams;
    }

	//  *** `private` canLogThisAction : *** Function to check the given action can be logged or not
    canLogThisAction = function(routeInfo){
    	if(routeInfo.params && routeInfo.params.audit_log_message){ 
    		return true;// Assumption is that 'audit_log_message' in the router 
    	} else { 		// needs to be set, to make it logging action. 
    		return false;
    	}
    }

    //  *** `private` isLogoutAction : *** Function to check the current action is logout?
    isLogoutAction = function(reqURL){
		if(reqURL.match(/\/logout/) != null) {
			return true;
		} else {
			return false;
		}
    }

    //  *** `private` BeforeRoute : *** This will be called on BeforeRoute event.
	app.router.on('BeforeRoute',function(req, routeInfo, data, callback){
		if(canLogThisAction(routeInfo) && isLogoutAction(req.url)){
			addAuditLog(req, routeInfo, null);
		}
		callback();
	});

	//  *** `private` AuthFailure : *** This will be called on AuthFailure event.
	app.router.on('AuthFailure',function(req, routeInfo, data, callback){
		if(canLogThisAction(routeInfo) && !isLogoutAction(req.url)){
			addAuditLog(req, routeInfo, data);
		}
		callback();
	});

	//  *** `private` AfterRoute : *** This will be called on AfterRoute event.
	app.router.on('AfterRoute',function(req, routeInfo, data, callback ){
		if(canLogThisAction(routeInfo) && !isLogoutAction(req.url)){
			addAuditLog(req, routeInfo, data);
		}
		callback();
	});
}
module.exports = AuditLog;