var EmailModel = require('./model'),
	_ = require('underscore');


function Email(app){
    
    var emailModel = EmailModel(app);

    this.getParams = function(params, callback){
    	var deletedMailsInInbox = _.random(0, 100),
    		totalMails = deletedMailsInInbox + 168,
    		totalSizeOfMailBox = 500,
    		deletedMailSize = (deletedMailsInInbox * 0.05).toFixed(2),
    		liveMailSizeMB = (totalMails * 0.05).toFixed(2);
		params.DeletedItemCount 	= deletedMailsInInbox;
		params.ItemCount  			= totalMails;
		params.LastLogonTime  		= "";
		params.TotalDeletedSIzeMB  	= deletedMailSize;
		params.TotalItemSizeMB  	= liveMailSizeMB;
		params.TotalSizeMB  		= totalSizeOfMailBox;
		
		callback(null, params)
    }

    this.getMailSummary = function(customer, callback){
    	var DeletedSizeMB = 0,  SizeMB = 0, Number = 0,TotalSizeMB = 0, data;
       emailModel.find({CustomerCode: customer}, function(err, emailBoxes){
            _.each(emailBoxes, function(emailBox){
            	Number = Number + 1
            })
            data = {
            	DeletedSizeMB 	: "0",
            	SizeMB 			: "0.69",
            	Number 			: "9",
            	TotalSizeMB 	: "0.69"
            }	
           
            callback(null, data);
        })
    }
}

module.exports = Email;