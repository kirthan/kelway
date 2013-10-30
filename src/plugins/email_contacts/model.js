//         EmailContactsModel
//        
//         This is the model describing the schema for Customer.
//        
//         @package    Kelway API plugins
//         @module     EmailContactsModel
//         @author     Chetan K

function EmailContactsModel(app){
    // *** `private` db :*** local reference to the plugins db  
    var db = app.plugins.db;
    
    // ***`private` emailContactSchema :*** Schema holder for customer.
	var emailContactSchema = new db.Schema({
       Alias                    : String,
       CustomerCode             : String,
       ExternalEmailAddress     : String,
       Name                     : String,
       PrimarySMTPAddress       : String
	});

  return db.conn.model('email_contact', emailContactSchema);
}

module.exports = EmailContactsModel;