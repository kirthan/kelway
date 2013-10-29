function AccountRoute(app){

	this.status = function(req, callback){
		callback(null,{'nimsoft_api_status':app.get('NIMSOFT').DISABLED?'disabled':'enabled'});
	}
	this.disable = function(){}
	this.enable = function(){}
}

module.exports = AccountRoute;