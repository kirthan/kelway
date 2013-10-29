//     Form Fields
//     
//    This module is responsible for mapping huge form fileds 
//	  with the values present in database.
//     
//     @package    ServiceApp Plugins
//     @module     Form Fields
//     @author     Chethan K


function FormFields(app){
	var serverSizes = null,
		serverLocations = null;

	//  *** `public` getServerSizes : *** Function to get detailed server size for given small/medium/large persisted in DB
	this.getServerSizes = function(callback){
		if(!serverSizes){
			serverSizes = {
				"server_size":{
					"small"		: "Small (1 vCPU, 4GB memory, 40GB disk, 40 IOPS)",
					"medium"	: "Medium (2 vCPU, 8GB memory, 60GB disk, 60 IOPS)",
					"large" 	: "Large (4 vCPU, 16GB memory, 70GB disk, 70 IOPS)"
				}
			}
		}
		callback(serverSizes);
	}

	//  *** `public` getServerLocations : *** Function to get detailed server Locations
	this.getServerLocations = function(callback){
		if(!serverLocations){
			serverLocations = {
				"operating_system" : {
					"WS2008R2SEGUI"		:  	"Windows Server 2008 R2 Standard Edition (with GUI)",
					"WS2008R2EEGUI"		:   "Windows Server 2008 R2 Enterprise Edition (with GUI)",
					"WS2012SEGUI"		:   "Windows Server 2012 Standard Edition (with GUI)",
					"WS2012SECORE"		:   "Windows Server 2012 Standard Edition (Core)",
					"WS2012R2SEGUI"		:   "Windows Server 2012 R2 Standard Edition (with GUI)",
					"WS2012R2SECORE"	:   "Windows Server 2012 R2 Standard Edition (Core)",
					"UBUNTU1304" 		:  	"Ubuntu 13.04",
					"CENTOS64"	 		: 	"CentOS 6.4"
				},
				"location" :{
					"compute" : "ServiceWorks Compute (Kelway Cloud)"
				},
				"network":{
					"LAN1"	: "LAN1",
					"LAN2"	: "LAN2",
					"LAN3"	: "LAN3",
					"LAN4"	: "LAN4",
					"DMZ" 	: "DMZ"
				}
			}
		}
		callback(serverLocations);
	}
}
module.exports = FormFields;