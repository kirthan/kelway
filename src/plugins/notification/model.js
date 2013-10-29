//         NotificationModel
//        
//         This is the model describing the schema for Notifications.
//        
//         @package    ServiceApp Plugins
//         @module     NotificationModel
//         @author     Chetan K

function NotificationModel(app){
    // *** `private` db :*** local reference to the plugins db  
    var db = app.plugins.db;

    // ***`private` notificationSchema :*** Schema holder for notification.
	var notificationSchema = new db.Schema({
        customer_id        : String,
        created_by         : String,
        created_at         : String,
        resolved_by        : String,
        resolved_at        : String,
        title              : String,
        notification_class : String,
        severity           : String,
        description        : String,
        resolve_url        : String,
        resolved           : Boolean
	});

    return db.conn.model('notification', notificationSchema);
}

module.exports = NotificationModel;