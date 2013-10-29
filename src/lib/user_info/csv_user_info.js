// 		Deprecated CSV User Info module.
//     
//     This module is responsible for getting Info from,
//     current user which includes logging in, getting roles, 
//     getting  complete deatils.
//    
//	   @package    ServiceApp Library
//     @module     CSV User Info
//     @author     Abhilash Hebbar
//     @author     Chethan K

var _ = require('underscore');
function CsvUserInfo(file, fs){
	var csvUserInfo = this, 
		userInfo;
	
	function readFile(callback){
		fs.readFile(file,function(err,data){
			if(err){ throw new Error('Cannot read file.'); }
			userInfo = getUserInfo(data.toString());
			callback();
		})
	}

	function getUserInfo(data){
		var records = data.split("\n");
		var headerRow = records.shift().split(',');
		var retVal = [];
		_.each(records, function(rec){
			var recArray = rec.split(",");
			var uiObj = {};
			for (var i = 0; i < headerRow.length; i++) {
				uiObj[headerRow[i]] = recArray[i];
			};
			fixRoles(uiObj);
			retVal.push(uiObj);
		})
		return retVal;
	}

	function fixRoles(uiObj){
		uiObj['Roles'] = uiObj['Roles'].split('|');
	}

	function doLogin(user,pass,callback){
		var theUser = _.find(userInfo, function(uiObj){
			return uiObj.Name == user && uiObj.Password ==  pass; 
		})
		if(!theUser){
			callback(false);
			return;
		}
		callback(true, theUser.ID, theUser.Roles);
	}

	function doGetRoles(uid,callback){
		var theUser = getUserByID(uid);
		if(!theUser){
			callback(false);
			return;
		}
		callback(theUser.Roles);
	}

	function getUserByID(uid){
		var theUser = _.find(userInfo, function(uiObj){
			return uiObj.ID == uid; 
		})
		return theUser;
	}

	this.login = function(user,pass,callback){
		if(!userInfo){
			readFile(function(){
				doLogin(user,pass,callback);
			})
			return;
		}
		doLogin(user,pass,callback);
	}

	this.getRoles = function(uid,callback){
		if(!userInfo){
			readFile(function(){
				doGetRoles(uid,callback);
			});
			return;
		}
		doGetRoles(uid,callback);
	}

	this.getDetails = function(uid,callback){
		var theUser;
		if(!userInfo){
			readFile(function(){
				theUser = getUserByID(uid);
			})
		}
		else {
			theUser = getUserByID(uid);
		}
		
		delete(theUser['Password']);

		callback(theUser);
	}
}

module.exports = CsvUserInfo;