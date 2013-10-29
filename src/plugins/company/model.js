//         CompanyModel
//        
//         This is the model describing the schema for Company.
//        
//         @package    ServiceApp Plugins
//         @module     CompanyModel
//         @author     Chetan K

function CompanyModel(app){
    // *** `private` db :*** local reference to the plugins db   
    var db = app.plugins.db;

    // ***`private` companySchema :*** Schema holder for company.
	var companySchema = new db.Schema({
		name				 : String,
		short_code			 : String,
		account_manager		 : String
	});
    return db.conn.model('company', companySchema);
}

module.exports = CompanyModel;