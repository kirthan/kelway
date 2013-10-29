//    User
//     
//     This Module is mainly responsible for before/after actions,
//     associated with User model and also basic CRUD operations.
//  
//     @package    ServiceApp Plugins
//     @module     User
//     @author     Chethan K

var UserModel = require('./model'),
    md5 = require('MD5'),
    _ = require('underscore');

function User(app){
    //  *** `private` userModel : *** Holds user model object
    var userModel = UserModel(app);

    //  *** `public` getUser : *** Function to user, given ID
    this.getUser = function(userID, callback){
        userModel.findOne({_id:userID }, function(err,userDetails){
            if(err){
                throw new Error('getUser Cannot Find User' + err);
            }
            if(userDetails){
                callback(userDetails);
            }else {
                callback(false);
            }
        });
    }

    //  *** `public` validateUser : *** Function to validate user, given username, password
    this.validateUser = function(username, password, callback){
        userModel.findOne({user_name:username, password:password }, function(err,userDetails){
            if(err){
                throw new Error('Cannot Find User' + err);
            }
            if(userDetails){
                callback(userDetails);
            }else {
                callback(false);
            }
        });
    }

    //  *** `public` md5Password : *** Function to encrypt password 
    this.md5Password = function(params,callback){
        params.password = md5(params.password + app.get('SALT'));
        callback(null,params);
    }

    //  *** `public` setDefaultRoles : *** Function to set default role 'user' for all kind of users
    this.setDefaultRoles = function(params,callback){
        params.roles = ['user'];
        callback(null,params);
    }

    //  *** `public` setDefaultStaffRoles : *** Function to Function to set default role 'user', 'admin' for all staff
    this.setDefaultStaffRoles = function(params,callback){
        params.roles = ['user','admin'];
        callback(null,params);
    }

    //  *** `public` saveStaffCompany : *** Function to set company id as kelway_company_id for staff
    this.saveStaffCompany = function(params,callback){
        params.company_id = 'kelway_company_id';
        callback(null,params);
    }

    //  *** `public` isUserNotAdmin : *** Function to validate is current user Admin.?
    this.isUserNotAdmin = function(params,callback){
        userModel.findOne({_id:params.id,'$or':[{roles : 'admin'},{roles : 'superAdmin'}] }, function(err,userDetails){
            if(err){
                throw new Error('Cannot Find User' + err);
            }
            if(userDetails){
                callback(['cannot remove admin user'],params);
            }else {
                callback(null,params);
            }
        });  
    }

    //  *** `public` isUserNotSuperAdmin : *** Function to validate is current user not a super admin
    this.isUserNotSuperAdmin = function(params,callback){
      userModel.findOne({_id:params.id, roles : 'superAdmin'}, function(err,userDetails){
            if(err){
                throw new Error('Cannot Find User' + err);
            }
            if(userDetails){
                callback(['cannot remove/update SuperAdmin user'],params);
            }else {
                callback(null,params);
            }
        });  
    }
    
    //  *** `public` getSuperAdmin : *** Function to get any super admin
    this.getSuperAdmin = function(callback){
        userModel.findOne({roles : 'superAdmin' }, function(err,userDetails){
            if(err){
                throw new Error('Cannot Find superAdmin' + err);
            }
            if(userDetails){
                callback(userDetails);
            }else {
                callback(false);
            }
        }); 
    }

    //  *** `public` addUser : *** Function to add new user
    this.addUser = function(params, callback){
        userModel(params).save(function(err,user){
            if(err){
                throw new Error('Cannot save User.' + err);
            }
            callback(user);
        });
    }

    //  *** `public` getCurrentUID : *** Function to get current user ID give access token
    this.getCurrentUID = function(params, callback){
        app.auth.getUserDetails(params.access_token, function(userDetails){
            if(userDetails){
                params.currentUID = userDetails._id; 
                callback(null,params);
            }else {
                callback(['cannot Find User'],params);
            }
        })
    } 

    //  *** `public` validateTwoEmails : *** Function to validate two email id's for equality
    this.validateTwoEmails = function(params, callback){
        if(params.email != params.confirm_email){
            callback(['Emails are not same'],params);
        }else {
            callback(null,params);
        }
    } 

    //  *** `public` validateTwoPasswords : *** Function to validate two passwords for equality
    this.validateTwoPasswords = function(params, callback){
        if(params.password !=  params.confirm_password ){
            callback(['Passwords are not same'],params);
        }else {
            callback(null,params);
        }
    } 

    //  *** `public` validateCurrentPassword : *** Function to validate current password, before updating it 
    this.validateCurrentPassword = function(params, callback){
        app.auth.getUserDetails(params.access_token, function(userDetails){
            params.current_password = md5(params.current_password + app.get('SALT'));
            if(userDetails){
                if(params.current_password == userDetails.password){
                    callback(null,params);
                }else {
                    callback(['Please enter correct current password'],params);
                }
            }else {
                callback(['Cannot find user'],params); 
            }
        })
    } 

    //  *** `public` deleteUsersByCustomer : *** Function to delete all the users associated with the customer
    this.deleteUsersByCustomer = function(params, callback){
        userModel.remove({company_id:params.id}, function(err, success){
            if(err){
                callback(['Error deleting users associated with customer'], params)
            }else{
                callback(null, params);
            }
        });
    }

    //  *** `public` checkForDuplicateUserWhileCreating : *** Function to check duplicate user while creating a new user
    this.checkForDuplicateUserWhileCreating = function(params, callback){
        userModel.findOne({user_name:params.user_name }, function(err,userDetails){
            if(err){
                throw new Error('getUser Cannot Find User' + err);
            }
            if(userDetails){
                callback(['Duplicate user name.'], params);
            }else {
                callback(null, params);
            }
        });
    }

    //  *** `public` checkForDuplicateUserWhileUpdating : *** Function to check for duplicate user while updating a given user
    this.checkForDuplicateUserWhileUpdating = function(params, callback){
        userModel.findOne({user_name:params.user_name }, function(err,userDetails){
            if(err){
                throw new Error('getUser Cannot Find User' + err);
            }
            if(userDetails && userDetails.id != params.id){
                callback(['Duplicate user name.'], params);
            }else {
                callback(null, params);
            }
        });
    }

}

module.exports = User;

