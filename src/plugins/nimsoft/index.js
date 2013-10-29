//     Nimsoft
//     
//     
//     @package    ServiceApp Plugins
//     @module     Nimsoft 
//     @author     Abhilash Hebbar


var NimsoftAccount 	= require('./accounts')
  , NimsoftQOS     	= require('./qos')
  , QOSCache 		= require('./qos_cache')
  , NimsoftAPI 		= require('./api_handler')
  , NimsoftTime 	= require('./datetime_util');
	
function NimsoftAPIHandler(app){
	var nimsoftAPI 	= new NimsoftAPI(app.get('NIMSOFT')),
		nimsoftQOS 	= new NimsoftQOS(app.get('NIMSOFT'), nimsoftAPI, NimsoftTime),
	 	qos 		= new QOSCache(app, nimsoftQOS);

	//  *** `public` getAccounts : *** description
	this.getAccounts = function(callback){ 
		var nimsoftAccount = new NimsoftAccount(app.get('NIMSOFT'));
		nimsoftAccount.getAll(callback);
	}

	//  *** `public` cpuStats : *** Function to get CPU stats data
	this.cpuStats = function(params,callback){
		qos.cpuStats(params,mergeAndSend(params,callback));
	}

	//  *** `public` powerStats : *** Function to get Power stats data
	this.powerStats = function(params,callback){
		qos.powerStats(params,mergeAndSend(params,callback));
	}

	//  *** `public` memoryStats : *** Function to get Memory stats data
	this.memoryStats = function(params,callback){
		qos.memoryStats(params,mergeAndSend(params,callback));
	}

	//  *** `public` diskStats : *** Function to get Disk stats data
	this.diskStats = function(params,callback){
		qos.diskStats(params,mergeAndSend(params,callback));
	}

	//  *** `public` diskIopStats : *** Function to get Didk iop stats data
	this.diskIopStats = function(params,callback){
		qos.diskIopStats(params,mergeAndSend(params,callback));
	}

	//  *** `private` mergeAndSend : *** Function to merge and send params from cache
	function mergeAndSend(params,callback){
		return function(err,data){
			var newData = _.extend(params,data);
			callback(err,newData);
		}
	}
}
module.exports = NimsoftAPIHandler;