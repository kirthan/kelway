//     Tokenizer 
//     
//     Create/Delete/Validate access token.
//	   Actions that requires token to get current user data 
//	   also included in this module.
//     
//     @package    ServiceApp Library
//     @module     Tokenizer
//     @author     Abhilash Hebbar
//     @author     Chethan K 

var _ 	= require('underscore'),
	md5 = require('MD5');

function Tokenizer(app, fs, userInfo){
	//  *** `public` tokenize : *** Tokenizer object
	var tokenize = this;
		
	//  *** `public` app : *** Application Object
	this.app = app;
		
	//  *** `public` userInfo : *** UserInfo Object
	this.userInfo = userInfo;

	//  *** `public` tokenDir : *** Path of the token directory
	this.tokenDir  = this.app.get('TOKEN_DIR');
	
	//  *** `public` createToken : *** Function to create 'token'
	this.createToken = function(uid,callback){

		timestamp = new Date().getTime();// Create new file with, 
		var token = md5(uid + timestamp + this.app.get('SALT'));// token name as file name and
		var data  = uid + "|" + timestamp; // user id with timestamp as its content.
		tokenDir  = this.app.get('TOKEN_DIR');
		fs.writeFile(tokenDir + token, data, function(err){ 
			if(err){ throw new Error('Cannot create file.'); } 
			callback(token);
		});
	}

	//  *** `public` deleteToken : *** Function to delete 'token'
	this.deleteToken 	= function(token,callback){
		tokenDir 		= this.app.get('TOKEN_DIR');
		fs.unlink(tokenDir + token, function(err){
			if(err){ throw new Error('Cannot delete file.')}
			callback(true);	
		})
	}

	//  *** `public` validateToken : *** Function to validate 'token'
	this.validateToken 	= function(token, callback){

		tokenDir 		= this.app.get('TOKEN_DIR');
		fs.readFile(tokenDir + token, function(err,data){
			if(err){ throw new Error('Cannot Read file.')}
			arr = data.toString().split("|"); 
			if(md5(arr[0] + arr[1] + tokenize.app.get('SALT')) == token){
				callback(true);
			}
			else{
				callback(false);
			}	
		})
	}
	
	//  *** `public` isAuthorised : *** Function to authorise current user's access to the requested action 
	this.isAuthorised = function(role, token, callback){

		tokenDir = this.app.get('TOKEN_DIR');
		fs.readFile(tokenDir + token, function(err,data){
			if(err){ throw new Error('Cannot Read file.')}
			arr = data.toString().split("|");
			tokenize.userInfo.getRoles(arr[0], function(roles){ // Get roles of the current user
				if(!roles){ 
					callback(false);
					return;
				}
				var checkAuthorised =  false;
				roles.forEach(function(theRole){ // Validate user roles, 
					if(theRole == role){ // against allowed roles
						checkAuthorised = true;
					}
				})
				callback(checkAuthorised);
			});
		});
	}

	//  *** `public` getUid : *** Function to get User Id from 'token'
	this.getUid 	= function(token, callback){
		tokenDir 	= this.app.get('TOKEN_DIR');
		fs.readFile(tokenDir + token, function(err,data){
			if(err){
				 throw new Error('Cannot Read File' + err);
			}
			if(data){
				arr = data.toString().split("|");
				if(md5(arr[0] + arr[1] + tokenize.app.get('SALT')) == token){
						callback(arr[0]);
				} else  {
						callback(false);
				}
			} else {
				callback(false);
			}
		})
	}
}

module.exports = Tokenizer;