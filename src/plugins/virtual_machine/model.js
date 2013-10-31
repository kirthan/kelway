//         VirtualMachineModel
//        
//         This is the model describing the schema for Customer.
//        
//         @package    Kelway API plugins
//         @module     VirtualMachineModel
//         @author     Chetan K

function VirtualMachineModel(app){
    // *** `private` db :*** local reference to the plugins db  
    var db = app.plugins.db;
    
    // ***`private` virtualMachineSchema :*** Schema holder for virtual machine.
	var virtualMachineSchema = new db.Schema({
        CustomerCode    : String,
        ComputerName	: String,
        OperatingSystem	: String,
        Size		    : String,
        IPAddress       : String,
        Name            : String,
        Password        : String,
        Status          : String,
        CPUMemory       : String,
        DiskMemory      : String,
        vCPU            : String,
        NumberOfDisks   : Number
	});

    return db.conn.model('virtual_machine', virtualMachineSchema);
}

module.exports = VirtualMachineModel;