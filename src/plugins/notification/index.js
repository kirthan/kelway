//     Notification
//     
//     This Module is mainly responsible for before/after actions,
//     associated with notification model and also basic CRUD operations.
//     
//     @package    ServiceApp Plugins
//     @module     Notification
//     @author     Chethan K

var NotificationModel = require('./model'),
    moment = require('moment'),
    _ = require("underscore");

function Notification(app){
    //  *** `private` notificationModel : *** Function to
    var notificationModel = NotificationModel(app);

    //  *** `public` getCompany : *** Function to get Company ID for a given User. 
    // This  is to Filter notifications by company ID for normal user. 
    this.getCompany = function(params, callback){
        app.auth.getRoles(params.access_token, function(roles){
            if(_.contains(roles,"admin","superAdmin")){
                callback(['not authorised'],params);
            }else{
                app.auth.getUserDetails(params.access_token, function(userDetails){
                    params.company = userDetails.company_id;
                    callback(null,params);
                });    
            }
        });
    }
    
    //  *** `public` setParams : *** Function to set/prepare params before persist
    this.setParams = function(params, callback){
        params.resolved_at = null;
        params.resolved_by = null;
        params.created_at = moment().format('YYYY-MM-DD HH:mm:ss');
        app.auth.getUserDetails(params.access_token, function(userDetails){
            params.created_by = userDetails._id;
            callback(null,params);
        });
    }
    
    //  *** `public` resolveUrl : *** Function to set resolve_by and resolve_at params upon resolve url
    this.resolveUrl = function(params, callback){
        app.auth.getUserDetails(params.access_token, function(userDetails){
            params.resolved_by = userDetails._id;
            params.resolved_at = moment().format('YYYY-MM-DD HH:mm:ss');
            callback(null,params);
        });
    }
}

module.exports = Notification;

