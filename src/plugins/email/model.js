//         EmailModel
//        
//         This is the model describing the schema for Email.
//        
//         @package    Kelway API plugins
//         @module     EmailModel
//         @author     Chetan K

function EmailModel(app){
    // *** `private` db :*** local reference to the plugins db  
    var db = app.plugins.db;
    
    // ***`private` emailSchema :*** Schema holder for Email.
	var emailSchema = new db.Schema({
      ActiveSyncEnabled         : String,
      Alias                     : String,
      CustomerCode              : String,
      DisplayName               : String,
      EmailAddresses            : String,
      GUID                      : String,
      MailDatabase              : String,
      Name                      : String,
      PrimarySMTPAddress        : String,
      IssueWarningQuota         : String,
      MapiEnabled               : String,
      OWAEnabled                : String,
      ProhibitSendQuota         : String,
      ProhibitSendReceiveQuota  : String





	});

    return db.conn.model('email_account', emailSchema);
}

module.exports = EmailModel;