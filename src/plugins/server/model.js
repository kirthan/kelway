//         SeverModel
//        
//         This is the model describing the schema for Server.
//        
//         @package    ServiceApp Plugins
//         @module     SeverModel
//         @author     Chetan K

function ServerModel(app){
    
    // *** `private` db :*** local reference to the plugins db  
    var db = app.plugins.db;

    // ***`private` serverSchema :*** Schema holder for server.
	var serverSchema = new db.Schema({
        company_id             : String,
        nimsoft_id             : String,
		customerPrefix         : String,
        name    	           : String,
        description            : String,
        notes   	           : String,
        class   	           : String,
        ip_address   	       : String,
        operating_system       : String,
        instance_size          : String,
        has_service_backup     : Boolean,
        has_service_security   : Boolean,
        has_service_protection : Boolean,
        has_service_monitoring : Boolean

	});

    return db.conn.model('server', serverSchema);
}

module.exports = ServerModel;