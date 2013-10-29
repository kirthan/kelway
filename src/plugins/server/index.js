//    Server
//     
//     This Module is mainly responsible for before/after actions,
//     associated with server model and also basic CRUD operations.
//  
//     @package    ServiceApp Plugins
//     @module     Server
//     @author     Chethan K
var ServerModel = require('./model');
			  _ = require('underscore');

function ServiceWorks(app){

    //  *** `private` serverModel : *** Holds server model object
    var serverModel = ServerModel(app);

    //  *** `public` getCompany : *** Function to filter servers for normal user
    this.getCompany = function(params, callback){
    	app.auth.getRoles(params.access_token, function(roles){
    		if(_.contains(roles,"admin","superAdmin")){
    			params.company = ".*";
                callback(null,params);
    		}else{
                app.auth.getUserDetails(params.access_token, function(userDetails){
                    params.company = userDetails.company_id;
                    callback(null,params);
                });    
    		}
		});
    }

    //  *** `public` getServer : *** Function to get server, given ID 
    this.getServer = function(serverID, callback){
        serverModel.findOne({_id:serverID }, function(err,server){
            if(err){
                throw new Error('getServer Cannot Find server' + err);
            }
            if(server){
                callback(server);
            }else {
                callback(false);
            }
        });
    }

    //  *** `public` addServer : *** Function to add new server
    this.addServer = function(params, callback){
        serverModel(params).save(function(err,server){
            if(err){
                throw new Error('Server save content.' + err);
            }
            callback(server);
        });
    }

    //  *** `public` deleteServersByCustomer : *** Function to delete all the servers associated with a given customer
    this.deleteServersByCustomer = function(params, callback){
        serverModel.remove({company_id:params.id}, function(err, success){
            if(err){
                callback(['Error deleting servers associated with customer'], params)
            }else{
                callback(null, params);
            }
        });
    }
}

module.exports = ServiceWorks;