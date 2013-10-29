//     Form Field Router
//     
//     @package    ServiceApp Router
//     @module     Form Field Router
//     @author     Chethan K

function FormFields(app){
	//  *** `private` respond : *** generic function to send response
	var respond = function(content, callback){
		var responseObj = {};
		
		if(content){
			responseObj.result = content;
			responseObj.status = 'success';
		} else {
			responseObj.status = 'failed';
		}
		
		callback(null, responseObj);
	}

	//  *** `private` getServerSizes : *** route to getServerSizes method
	this.getServerSizes = function(req, callback){
		app.plugins.form_fields.getServerSizes(function(content){
			respond(content, callback);
		});
	}

	//  *** `private` getServerLocations : *** route to getServerLocations method
	this.getServerLocations = function(req, callback){
		app.plugins.form_fields.getServerLocations(function(content){
			respond(content, callback);
		});
	}
}

module.exports = FormFields;