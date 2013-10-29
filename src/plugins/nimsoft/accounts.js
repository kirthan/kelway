//     Nimsoft Account
//     
//     This module is to list all the nimsoft accounts.
//     
//     @package    ServiceApp Plugins
//     @module     Nimsoft Account
//     @author     Abhilash Hebbar

var NimsoftAPI = require('./api_handler');

function NimsoftAccount(apiConfig){
//  *** `private` getAll : *** Function to get all the nimsoft accounts
    this.getAll = function(callback){
        var nimsoftAPI = new NimsoftAPI(apiConfig);
        nimsoftAPI.request('/accounts','get',{},function(res){
        	callback(res.account);
        });
    }
}

module.exports = NimsoftAccount;