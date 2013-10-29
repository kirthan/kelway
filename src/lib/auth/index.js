//     Authentication
//     
//     @package    ServiceApp Lib
//     @module     Authentication
//     @author     Abhilash Hebbar

var md5 = require('MD5'),
async = require('async');

function Authoriser(userInfo,token){
	
	//  *** `private` auth : *** Establish the 'auth' object. 'auth' refers to its own instance.
	var auth 			= this,

	//  *** `private` destroyTimer : *** Establish the 'destroyTimer' object that clears/resets 
	destroyTimer 	= {};
	
	//  *** `private` userInfo : *** 'userInfo' object is injected externally on startup, 
	// which holds functions to authenticate user by interacting to user table
	this.userInfo = userInfo;
	
	//  *** `private` token : *** 'token' which is created during 'login' is passed before every action
	// to authenticate user. 'token' holds encrypted user id. 
	this.token = token;


	//  *** `public` init : *** Calling 'run' method of the restify module.
	// This will be called once during the start of the application.
	this.init = function(app){
		this.app = app;
	}

	//  *** `public` login : *** Core login functionality, 
	// It delgates the 'login' functionality to userInfo object.
	// It just returns status along with the necessary details if logged in successfully.
	this.login = function(user,pass,callback){

		//Delegate to userInfo object.
		this.userInfo.login(user,encrypt(pass),function(success, user, company, accountManager){
			if(!success){
				callback(false);
				return;
			}
			//Create token if logged in successfully
			//This 'access token' is the way to identify user in successive actions.
			auth.token.createToken(user._id,function(token){
				//set lifetime for this token. 
				//If the user is idle for a perticuler period of time, 
				//this session will be destroyed 
				auth.setDestroyTimer(token);
				
				var theUser 			= null,
					theCompany			= null,
					theAccountManager	= null;

				if(user){
					theUser = {
						first_name 	: user.first_name,
						last_name	:  user.last_name,
						roles 		: user.roles,
						email		: user.email 
					}
				}
				if(accountManager){
					theAccountManager = {
						name  		: accountManager.first_name + " " + accountManager.last_name,
						email 		: accountManager.email,
						phoneNumber	: accountManager.phone_number
					}
				}
				if(company){
					theCompany = {
						name 		: company.name,
						shortCode	: company.short_code
					}
				}
				//Returns token, user details, user's company details, user's associated manager details
				// upon login to save it in its client counter-part to minimise any further requests.
				callback(true, token, theUser, theCompany, theAccountManager);
			})
		})
	}


	//  *** `public` setDestroyTimer : *** Sets the token's lifetime, defined in configuration : 'timeOut'.
	// As soon as the 'timeout' timer reaches to 0, 'logout' public function will be called,
	// and that inherently destroys the token and logs out.   
	// This function is called frequently on every action to reset the timer
	this.setDestroyTimer = function(token){
		if(auth.app.get('TOKEN_TIMEOUT') || auth.app.get('TOKEN_TIMEOUT') > 0){
			var timeOut = 1000 * auth.app.get('TOKEN_TIMEOUT');
			clearTimeout(destroyTimer[token]);
			destroyTimer[token] = setTimeout(function() {
				auth.logout(token,function(){});
			}, timeOut)
		}else {
			throw new Error('Token Time Out is Not defined'); 
		}
	}

	//  *** `public` logout : *** Logs out user by destroying the session token.
	this.logout = function(token, callback){

		// Delegate 'token delete' functionality to token object, 
		// where token related functionalities are clubbed together to maintain 
		// separation of concern.
		this.token.deleteToken(token, function(tokenDeleted){
			if(!tokenDeleted){
				callback(false);
				return;
			}
			callback(true);
		})
	}

	//  *** `public` authorise : *** Role based access control is implemented here.
	this.authorise = function(role,req,res,callback){

		auth.token.isAuthorised(role, req.query.access_token, function(authorised){
			if(authorised){
				auth.setDestroyTimer(req.query.access_token);
				callback(true, null);
			}
			else{
				callback(false, {errors:["Not authorised"],status:'403'});
			}
		})
	}

	//  *** `public` getRoles : *** Returns user roles.
	this.getRoles = function(token,callback){
		auth.token.getUid(token,function(uid){
			if(!uid){
				callback(false);
				return;
			}	
			auth.userInfo.getRoles(uid,function(roles){
				if(roles){
					callback(roles);
				}else{
					callback(false);
				}
			})	
		})
	}

	//  *** `public` getUserDetails : *** User object is returned  after receiving and breaking the token. 
	this.getUserDetails = function(token,callback){
		auth.token.getUid(token,function(uid){
			if(!uid){
				callback(false);
				return;
			}
			auth.userInfo.getDetails(uid,function(err, userDetails){
				if(userDetails){
					callback(userDetails);
				}else{
					callback(false);
				}
			})	
		})
	}

	//  *** `private` encrypt : *** Private function to perform password encryption.
	function encrypt(pass){
		return md5(pass + auth.app.get('SALT'));
	}
	
}

module.exports = Authoriser;