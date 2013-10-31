//     
//     @package    ServiceApp Router
//     @module     Static Content Router
//     @author     Abhilash Hebbar

function NonDBCrud(app){
	
	//  *** `private` respond : *** Generic function to create respone object
	var respond = function(content,sendContent, callback){
		var responseObj = {};

		if(content && sendContent){
			responseObj = content;
		}

		if(content){
			responseObj.status = 'success';
		} else {
			responseObj.status = 'failed';
		}
		callback(null, responseObj)
	}

	//  *** `private` getContent : *** Function to get static content : Routing
	this.ListDiskDetailForVirtualMachine = function(req, callback){
		app.plugins.virtual_machine.getDiskDetail(req.query.vmname, function(err, data){
			respond(data, true, callback);
		});
	}

	this.getSWcomputesummary = function(req, callback){
		app.plugins.virtual_machine.getSWcomputesummary(req.query.customer, function(err, data){
			respond(data, true, callback);
		});
	}

	this.getMailSummary = function(req, callback){
		app.plugins.email.getMailSummary(req.query.customer, function(err, data){
			respond(data, true, callback);
		});
	}


	this.resetVMPool = function(req, callback){
		respond(true, false, callback)
	}
}

module.exports = NonDBCrud;