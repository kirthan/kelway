var VirtualMachineModel = require('./model'),
_ = require('underscore');


function VirtualMachine(app){
    var vmModel = VirtualMachineModel(app);

    this.getParamsForListVMs = function(params, callback){

        switch (params.CPUMemory){
            case "low":
            params.RAMinGB = 1;
            break;

            case "medium":
            params.RAMinGB = 2;
            break;

            case "intermittent":
            params.RAMinGB = 3;
            break;

            case "heavy":
            params.RAMinGB = 4;
            break;

            default:
            params.RAMinGB = 1;
            break;
        }

    	callback(null, params)
    }
    this.getParamsForListDiskSummary = function(params, callback){
        params.TotalCapacity = params.NumberOfDisks * params.DiskMemory;
        params.FreeSpaceGB = params.TotalCapacity - params.TotalCapacity * 0.18;
        callback(null, params)
    }

    this.getDiskDetail = function(vmname, callback){
        var diskDetail = [];
    	vmModel.findOne({Name: vmname}, function(err, data){
            if(data && data.NumberOfDisks){
               for(var i=0; i < data.NumberOfDisks; i++){
                var freeSpace = data.DiskMemory - ( data.DiskMemory * (0.1 * (i + 1 )) ),
                    percFree  = ((freeSpace/data.DiskMemory) * 100).toFixed(2);
                   diskDetail.push({
                        CapacityGB      : data.DiskMemory,
                        Drive           : "C://",
                        FreeSpaceGB     : freeSpace ,
                        PercFree        : percFree,
                        PercUsed        : (100 - percFree).toFixed(2)
                   })
               }
               var data = {
                value : diskDetail,
                Count : data.NumberOfDisks
               }
                callback(err, data)
            } else {
                callback(err, "No Disks Allotted")
            }
        })
    }

    this.powerOffVM = function(params, callback){
    	params.Status = "poweredOff"
    	callback(null, params)
    }

    this.powerOnVM = function(params, callback){
    	params.Status = "poweredOn"
    	callback(null, params)
    }

    this.setParamsPowerOffVM = function(params, callback){
    	vmModel.findOne({Name: params.vmname}, function(err, data){
    		params.Status = data.Status
    		params.VMName = data.Name
    		callback(null, params)
    	})
    }

    this.setParamsPowerOnVM = function(params, callback){
    	vmModel.findOne({Name: params.vmname}, function(err, data){
    		params.Status = data.Status
    		params.VMName = data.Name
    		callback(null, params)
    	})
    }

    this.setParamsToCreateVM = function(params, callback){
        var validServerSizes      = ["small", "medium", "large", "Xlarge"],
            validOperatingSystems = ["2008R2std", "2008R2ent", "2012Std", "2012R2Std" ];
        
        if(!(_.contains(validServerSizes, params.size))){
            callback(["invalid server size. allowed sizes are small, medium, large, Xlarge"], params)
        }
        
        if(!(_.contains(validOperatingSystems, params.os))){
            callback(["invalid Operating system. 2008R2std, 2008R2ent, 2012Std, 2012R2Std."], params)
        }
        
        params.Size               = params.size,
        params.CustomerCode       = params.customercode,
        params.OperatingSystem    = params.os,
        params.Name               = params.computername;
        params.IPAddress          = "192.168.0.14",
        params.Password           = _.random(0, 100) + "QWT" + _.random(1, 100);
        params.Status             = "poweredOn";
        
        switch (params.size){
            case "small":
                params.CPUMemory        = "low";
                params.DiskMemory       = "30";
                params.vCPU             = 1;
                params.NumberOfDisks    = 1;
                break;

            case "medium":
                params.CPUMemory        = "medium";
                params.DiskMemory       = "45";
                params.vCPU             = 2;
                params.NumberOfDisks    = 2;
                break;

            case "large":
                params.CPUMemory        = "intermittent";
                params.DiskMemory       =  "60";
                params.vCPU             = 3;
                params.NumberOfDisks    = 3;
                break;

            case "Xlarge":
                params.CPUMemory        = "heavy";
                params.DiskMemory       = "75";
                params.vCPU             = 4;
                params.NumberOfDisks    = 4;
                break;

        }
        
        callback(null, params)
    }

    this.getParamsToCreateVM = function(params, callback){
        
        params.Message =  "Your new virtual machine has been being configured.";
       
        delete(params.customercode);
        delete(params.computername);
        delete(params.os);
        delete(params.size);
        delete(params.Size);
        delete(params.CustomerCode);
        delete(params.OperatingSystem);
        delete(params.Status);
        delete(params.CPUMemory);
        delete(params.DiskMemory);
        delete(params.vCPU);
        delete(params.NumberOfDisks);
        
        callback(null, params);
    }
     
    this.getSWcomputesummary = function(customer, callback){
        var CPU = 0, Disk = 0, Number = 0, RAM =0, data;
       vmModel.find({CustomerCode: customer}, function(err, vms){
            _.each(vms, function(vm){
                CPU = CPU + parseInt(vm.vCPU);
                Disk = (vm.NumberOfDisks * vm.DiskMemory) + Disk;
                Number = Number + 1;
                switch (vm.CPUMemory) {
                    case "low" :
                        RAM = RAM + 1;
                        break;

                    case "medium":
                        RAM = RAM + 2;
                        break;

                    case "intermittent":
                        RAM = RAM + 3;
                        break;

                    case "heavy":
                        RAM = RAM + 4;
                        break;

                    default :
                        RAM = RAM + 1;
                        break;
                }
            })
            data = {
                CPU     : CPU,
                Disk    : Disk,
                Number  : Number,
                RAM     : RAM
            }
           console.log(data)
            callback(null, data);
        })
    }   
}

module.exports = VirtualMachine;