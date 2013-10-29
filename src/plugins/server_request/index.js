//     Server Request
//     
//     This Module is mainly responsible for before/after actions,
//     associated with server request model and also basic CRUD operations.
//    
//     @package    ServiceApp Plugins
//     @module     Server Request
//     @author     Chethan K

var ServerRequestModel = require('./model'),
    randomstring = require('randomstring'),
    _ = require("underscore");

function ServerRequest(app){
    
    //  *** `private` serverRequestModel : *** Holds Server Request model object
    var serverRequestModel = ServerRequestModel(app);

    //  *** `public` getCompany : *** Function to deny acces to admin/superAdmin to request new server
    this.getCompany = function(params, callback){
    	app.auth.getRoles(params.access_token, function(roles){
    		if(_.contains(roles,"admin","superAdmin")){
                callback(['admin/SuperAdmin cannot request server'], params);
    		}else{
                app.auth.getUserDetails(params.access_token, function(userDetails){
                    params.company_id = userDetails.company_id;
                    callback(null,params);
                });    
    		}
		});
    }

    //  *** `public` validateMandatoryFields : *** Function To validate all the mandatory fields before persist
    this.validateMandatoryFields = function(params, callback){
       serverRequestModel.findOne(
        { 
            _id             : params.id, 
            company_id      : { $exists: true }, 
            server_size     : { $exists: true }, 
            class           : { $exists: true }, 
            operating_system: { $exists: true }, 
            location        : { $exists: true }, 
            network         : { $exists: true }, 
            name            : { $exists: true } 
        }, 
        function(err,server){
            if(!server){ 
                callback(['Required fields are not entered completely'], params);
            } else {
                params.is_confirmed = true;
                callback(null, params);
            }
       }); 
    }

    //  *** `public` generatePassword : *** Function to generate password for a new server
    this.generatePassword = function(params, callback){
        params.password = randomstring.generate(10);
        callback(null,params);
    }

    //  *** `public` sendServerRequestEmail : *** Function to send server request email
    this.sendServerRequestEmail = function(params, callback){
    	app.plugins.email_actions.sendServerRequestEmail(params, function(err, success){
    		if(success){
    			callback(null, params);
    		}else {
    			callback(['Email Sending failed ' + err], params);
    		}
    	})
    }

    //  *** `public` getServer : *** Function to get server for a given id
    this.getServer = function(serverID, callback){
        serverRequestModel.findOne({_id:serverID }, function(err,server){
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

    //  *** `private` calculateServerCost : *** Function to calculate server cost, given its type and size
    calculateServerCost = function(size, type, callback){
        if(size=="small" && type=="basic"){
            callback(app.get('BASIC_SMALL_VMS_PRICE'));
        }else if(size=="small" && type=="essential"){
            callback(app.get('ESSENTIAL_SMALL_VMS_PRICE'));
        }else if(size=="small" && type=="premium"){
            callback(app.get('PREMIUM_SMALL_VMS_PRICE'));
        }else if(size=="medium" && type=="basic"){
            callback(app.get('BASIC_MEDIUM_VMS_PRICE'));
        }else if(size=="medium" && type=="essential"){
            callback(app.get('ESSENTIAL_MEDIUM_VMS_PRICE'));
        }else if(size=="medium" && type=="premium"){
            callback(app.get('PREMIUM_MEDIUM_VMS_PRICE'));
        }else if(size=="large" && type=="basic"){
            callback(app.get('BASIC_LARGE_VMS_PRICE'));
        }else if(size=="large" && type=="essential"){
            callback(app.get('ESSENTIAL_LARGE_VMS_PRICE'));
        }else if(size=="large" && type=="premium"){
            callback(app.get('PREMIUM_LARGE_VMS_PRICE'));
        }else callback(null);
    }

    //  *** `private` calculateAdditionalMemoryCost : *** Function to calculate memory cost
    calculateAdditionalMemoryCost = function(memory, callback){
        if(memory > 0){
            callback((memory*0.72).toFixed(2));
        }else {
            callback(0);    
        }
    }
    
    //  *** `public` updateCost : *** Function to update cost
    this.updateCost = function(params, callback){
        serverRequestModel.findOne({_id:params.id}, function(err,server){
            if(server){
                calculateServerCost(server.server_size, server.class, function(serverCost){
                    if(serverCost) {
                        params.server_cost = serverCost.toFixed(2);
                        calculateAdditionalMemoryCost(parseInt(params.additional_storage), function(memoryCost){
                            params.memory_cost = memoryCost;
                            params.total_cost  = (parseFloat(serverCost) + parseFloat(memoryCost)).toFixed(2);
                            callback(null, params);
                        })
                    }else {
                            callback(['Server Cost Error'], params);
                    }
                })
            }else {
                 callback(['Requested server not found'], params);
            }
        })
    }

    //  *** `public` setBackupService : *** Function to set backup service enable bit,
    // This is to make sure that, If the backup service is not set its value is null.  
    this.setBackupService = function(params, callback){
        if(!params.backup_service){
            params.backup_service = false;
        }
        callback(null, params);
    }

    //  *** `public` setLTRService : *** Function to set LTR service. 
    // This is to make sure that, If LTR service is not set its value is null.  
    this.setLTRService = function(params, callback){
        if(!params.ltr_policy_a){
            params.ltr_policy_a = false;
        }
        if(!params.ltr_policy_b){
            params.ltr_policy_b = false;
        }
        if(!params.ltr_policy_c){
            params.ltr_policy_c = false;
        } 
        if(!params.ltr_policy_d){
            params.ltr_policy_d = false;
        }
        callback(null, params);
    }

    //  *** `public` addServer : *** Function to add new server request model
    this.addServer = function(params, callback){
        serverRequestModel(params).save(function(err,server){
            if(err){
                throw new Error('Server save content.' + err);
            }
            callback(server);
        });
    }
}

module.exports = ServerRequest;