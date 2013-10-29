//     AuditLogModel
//        
//     This is the model describing the schema for Audit log entries.
//        
//     package    ServiceApp Plugins
//     module     AuditLogModel
//     author     Chetan K

function AuditLogModel(app){
	// ***`private` db :*** local reference to the plugins db  
    var db = app.plugins.db;

    // ***`private` auditLogSchema :*** Schema holder for autit log.
	var auditLogSchema = new db.Schema({
		user_id 	: String,
		path 		: String,
		params		: Array,
		timestamp 	: String,
		message 	: String
	});
	
    return db.conn.model('auditLog', auditLogSchema);
}

module.exports = AuditLogModel;