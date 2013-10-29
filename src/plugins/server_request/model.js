//         ServerRequestModel
//        
//         This is the model describing the schema for Server Request.
//        
//         @package    ServiceApp Plugins
//         @module     ServerRequestModel
//         @author     Chetan K

function ServerRequestModel(app){
    // *** `private` db :*** local reference to the plugins db  
    var db = app.plugins.db;
    
    // ***`private` serverRequestSchema :*** Schema holder for server request.
	var serverRequestSchema = new db.Schema({
        company_id             : String,
        server_size            : String,
        class                  : String,
        operating_system       : String,
        location               : String,
        network                : String,
        name                   : String,
        description            : String,
        password               : String,
        backup_service         : Boolean,
        additional_storage     : String,
        ltr_policy_a           : Boolean,
        ltr_policy_b           : Boolean,
        ltr_policy_c           : Boolean,
        ltr_policy_d           : Boolean,
        is_confirmed           : Boolean,
        server_cost            : String,
        memory_cost            : String,
        total_cost             : String
	});

    return db.conn.model('server_request', serverRequestSchema);
}

module.exports = ServerRequestModel;