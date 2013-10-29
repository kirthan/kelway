//         UserModel
//        
//         This is the model describing the schema for Server Request.
//        
//         @package    ServiceApp Plugins
//         @module     UserModel
//         @author     Chetan K

function UserModel(app){
    // *** `private` db :*** local reference to the plugins db  
    var db = app.plugins.db;
    // ***`private` userSchema :*** Schema holder for user.
	var userSchema = new db.Schema({
		user_name	: String,
		password	: String,
		first_name	: String,
		last_name	: String,
		email		: String,
		company_id  : String,
		phone_number: String,
		roles		: Array		
	});
    return db.conn.model('user', userSchema);
}

module.exports = UserModel;