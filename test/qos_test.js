var QOS 		= require('../src/plugins/nimsoft/qos'),
	should 		= require('should'),
	nodemock 	= require('nodemock');

//Global variables 
var apiConfigMock, nimsoftAPIMock, nimsoftTimeMock;
	apiConfigMock = {
		"QOS":{
			"CPU"     :{"NAME": "dummy","TARGET":"dummy"},
			"MEMORY"  :{"NAME": "dummy","TARGET":"dummy"},
			"DISK"    :{"NAME": "dummy","TARGET":"dummy"},
			"DISKIOP" :{"NAME": "dummy","TARGET":"dummy"},
			"POWER"   :{"NAME": "dummy","TARGET":"dummy"}
		},
		"NO_SAMPLES": 1,
	};
	var qosURLMock = "/qos/data/name/dummy/dummy/dummy/lastday/now/0",
	params = {
		nimsoft_id : "dummy",
	},
	data = {
		samplevalue:1
	};

suite("Power Stats", function(){

	test("Online", function(done){
		nimsoftTimeMock = {};
		APIResponseMock = {
			data : ["data", {"samplevalue":2} ]
		}
		nimsoftAPIMock = nodemock.mock("request").takes(qosURLMock, "get", {}, function(){}).calls(3, [APIResponseMock]);
		qos = new QOS(apiConfigMock, nimsoftAPIMock, nimsoftTimeMock);
		qos.powerStats(params, function(err, params){
			params.power_status.should.equal('online');
			done();
		})
	})

	test("Offline", function(done){
		nimsoftTimeMock = {};
		APIResponseMock = {
			data : ["data", {"samplevalue":0} ]
		}
		nimsoftAPIMock = nodemock.mock("request").takes(qosURLMock, "get", {}, function(){}).calls(3, [APIResponseMock]);
		qos = new QOS(apiConfigMock, nimsoftAPIMock, nimsoftTimeMock);
		qos.powerStats(params, function(err, params){
			params.power_status.should.equal('offline');
			done();
		})
	})

	test("No response from API", function(done){
		nimsoftTimeMock = {};
		APIResponseMock = {data : null};
		nimsoftAPIMock = nodemock.mock("request").takes(qosURLMock, "get", {}, function(){}).calls(3, [APIResponseMock]);
		qos = new QOS(apiConfigMock, nimsoftAPIMock, nimsoftTimeMock);
		qos.powerStats(params, function(err, params){
			params.power_status.should.equal('offline');
			done();
		})
	})
})


suite("CPU Stats", function(){
	test("Valid", function(done){
		sampleMock ={
			sampletime : "dummy",
			samplevalue: "dummy"
		}
		APIResponseMock = {
			data : [{"data": sampleMock }, {"samplevalue":"dummy", "sampletime" : "dummy"} ]
		}
		nimsoftAPIMock = nodemock.mock("request").takes(qosURLMock, "get", {}, function(){}).calls(3, [APIResponseMock]);
		nimsoftTimeMock = nodemock.mock("formatTo").takes("dummy", 'DD/MM/YYYY HH:mm').returns("dummy");
		qos = new QOS(apiConfigMock, nimsoftAPIMock, nimsoftTimeMock);
		qos.cpuStats(params, function(err, params){
			params.cpu_usage[0].time.should.equal('dummy');
			done();
		})
	})
})


suite("Memory Stats", function(){
	test("Valid", function(done){
		sampleMock ={
			sampletime : "dummy",
			samplevalue: "dummy"
		}
		APIResponseMock = {
			data : [{"data": sampleMock }, {"samplevalue":"dummy", "sampletime" : "dummy"} ]
		}
		nimsoftAPIMock = nodemock.mock("request").takes(qosURLMock, "get", {}, function(){}).calls(3, [APIResponseMock]);
		nimsoftTimeMock = nodemock.mock("formatTo").takes("dummy", 'DD/MM/YYYY HH:mm').returns("dummy");
		qos = new QOS(apiConfigMock, nimsoftAPIMock, nimsoftTimeMock);
		qos.memoryStats(params, function(err, params){
			params.memory_usage[0].time.should.equal('dummy');
			done();
		})
	})
})


suite("Disk Stats", function(){
	test("Valid", function(done){
		sampleMock ={
			sampletime : "dummy",
			samplevalue: "dummy"
		}
		APIResponseMock = {
			data : [{"data": sampleMock }, {"samplevalue":"dummy", "sampletime" : "dummy"} ]
		}
		nimsoftAPIMock = nodemock.mock("request").takes(qosURLMock, "get", {}, function(){}).calls(3, [APIResponseMock]);
		nimsoftTimeMock = nodemock.mock("formatTo").takes("dummy", 'DD/MM/YYYY HH:mm').returns("dummy");
		qos = new QOS(apiConfigMock, nimsoftAPIMock, nimsoftTimeMock);
		qos.diskStats(params, function(err, params){
			params.disk_usage[0].time.should.equal('dummy');
			done();
		})
	})
})

suite("DiskIop Stats", function(){
	test("Valid", function(done){
		sampleMock ={
			sampletime : "dummy",
			samplevalue: "dummy"
		}
		APIResponseMock = {
			data : [{"data": sampleMock }, {"samplevalue":"dummy", "sampletime" : "dummy"} ]
		}
		nimsoftAPIMock = nodemock.mock("request").takes(qosURLMock, "get", {}, function(){}).calls(3, [APIResponseMock]);
		nimsoftTimeMock = nodemock.mock("formatTo").takes("dummy", 'DD/MM/YYYY HH:mm').returns("dummy");
		qos = new QOS(apiConfigMock, nimsoftAPIMock, nimsoftTimeMock);
		qos.diskIopStats(params, function(err, params){
			params.diskIop_usage[0].time.should.equal('dummy');
			done();
		})
	})
})