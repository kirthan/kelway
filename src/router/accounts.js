//     Accounts (Trial)
//     
//     This module is responsible for listing nimsoft accounts
//     
//     @package    ServiceApp Router
//     @module     Accounts
//     @author     Abhilash Hebbar
function AccountRoute(app){
	
	//  *** `private` index : *** Function to list accounts
	this.index = function(req, callback){
		app.plugins.server_reporting.getAccounts(function(accounts){
			res.send(accounts);
		})
	}
	this.create = function(){}
	this.delete = function(){}
}

module.exports = AccountRoute;