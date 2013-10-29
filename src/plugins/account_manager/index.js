//     Account Manager
//     
//     This Module is mainly responsible for before/after actions,
//     associated with account manager model and also basic CRUD operations. 
//     
//     @package    ServiceApp Plugins
//     @module     Account Manager
//     @author     Chethan K

var AccountManagerModel = require('./model');

function AccountManager(app){
    //  *** `private` accountManagerModel : *** Holds Account Manager Model Object
    var accountManagerModel = AccountManagerModel(app);
    
    //  *** `public` getAccountManager : *** Function to get Account Manager detail,Given ID 
    this.getAccountManager = function(accountManagerID, callback){

        accountManagerModel.findOne({_id:accountManagerID }, function(err,accountManagerDetails){
            if(err){
                throw new Error('Cannot Find Account Manager' + err);
            }
            if(accountManagerDetails){
                callback(accountManagerDetails);
            }else {
                callback(false);
            }
        });
    }

    //  *** `public` addAccountManager : *** Function to add new Account Manager
    this.addAccountManager = function(params, callback){
        
        accountManagerModel(params).save(function(err,accountManager){
            if(err){
                throw new Error('Cannot save accountManager. ' + err);
            }
            callback(accountManager);
        });
    }
}

module.exports = AccountManager;

