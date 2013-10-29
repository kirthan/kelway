var APIHandler 	= require('../src/plugins/nimsoft/api_handler'),
	should 		= require('should'),
	nodemock 	= require('nodemock');

var nimsoftConfigMock = {
		"DISABLED": false,
		"TIMEOUT" : 3000,
		"HOST" : "194.105.149.12",
		"PORT" : "80",
		"BASE_PATH" : "/rest",
		"HEADERS" : {
			"Accept"		: "application/json",
			"Content-type"	: "application/json"
		},
		"AUTH" : {
			"USER" : "Corpedge",
			"PASS" : "C0rpEdg3"
		},
		"QOS":{
			"CPU"     :{"NAME": "QOS_VMWARE_VM_CPU_SYSTEM","TARGET":"CPU+Usage+(Average%2FRate)"},
			"MEMORY"  :{"NAME": "QOS_VMWARE_VM_GUEST_MEMORY_USAGE_PCT","TARGET":"Memory%20Usage"},
			"DISK"    :{"NAME": "QOS_VMWARE_VM_GUEST_DISK_FREE","TARGET":"C%3A%5C%2FFree%2B(in+%2525+of+Capacity)"},
			"DISKIOP" :{"NAME": "QOS_VMWARE_VIRTUAL_DISK_READ_REQUEST","TARGET":"Virtual%20Disks%2Fscsi0%3A0%2FDisk%20Average%20Read%20Requests%20Per%20Second"},
			"POWER"   :{"NAME": "QOS_VMWARE_VARIABLE","TARGET":"PowerState"}
		},
		"NO_SAMPLES": 20,
		"STARTTIME_BEFORE":{"DELTA":"30", "FOR":"months" },
		"ENDTIME_BEFORE":{"DELTA":"15","FOR":"minutes"}
	}

	var path, method = "get", options = {};

suite("Test", function(){
	test(" ", function(done){
		path =  "/qos/data/name/" + nimsoftConfigMock.QOS['CPU'].NAME + 
              '/' + "dummy" + '/' + nimsoftConfigMock.QOS['CPU'].TARGET +
              '/lastday/now/01';
		var apiHandler = new  APIHandler(nimsoftConfigMock);
		apiHandler.request(path, method, options, function(data){
			console.log(data);
			done();
		})
	})
})
