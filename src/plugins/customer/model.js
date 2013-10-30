//         CustomerModel
//        
//         This is the model describing the schema for Customer.
//        
//         @package    Kelway API plugins
//         @module     CustomerModel
//         @author     Chetan K

function CustomerModel(app){
    // *** `private` db :*** local reference to the plugins db  
    var db = app.plugins.db;
    
    // ***`private` customerSchema :*** Schema holder for customer.
	var customerSchema = new db.Schema({
        CustomerCode    : String,
        Name   			: String,
        SWAssure		: String,
        SWBackup		: String,
        SWCompute		: String,
        SWMail			: String
	});

    return db.conn.model('customer_data', customerSchema);
}

module.exports = CustomerModel;