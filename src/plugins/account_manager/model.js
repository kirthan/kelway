//         AccountManagerModel
//        
//         This is the model describing the schema for Audit log entries.
//        
//         @package    ServiceApp Plugins
//         @module     AccountManagerModel
//         @author     Chetan K

function AccountManagerModel(app){
    // *** `private` db :*** local reference to the plugins db  
    var db = app.plugins.db;

    // ***`private` accountManagerSchema :*** Schema holder for account manager.
	var accountManagerSchema = new db.Schema({
		first_name				: String,
		last_name				: String,
		email					: String,
		phone_number			: String
	});
    return db.conn.model('account_manager', accountManagerSchema);
}

module.exports = AccountManagerModel;