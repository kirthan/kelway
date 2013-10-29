var QosCache 	= require('../src/plugins/nimsoft/qos_cache'),
	should 		= require('should'),
	nodemock 	= require('nodemock');

var cacheLifeTime = "600", 
	cacheLoadTime = "60",
	dummyParams   = { nimsoft_id : 'dummy'};

	var appMock = nodemock.mock("get").takes('MEMCACHE_NIMSOFT_DATA_TOTAL_LIFETIME').returns(cacheLifeTime).times(20);
		appMock.mock("get").takes('MEMCACHE_NIMSOFT_DATA_LOADING_LIFETIME').returns(cacheLoadTime).times(20);

suite("Power Stats", function(){

	var cacheKey = dummyParams.nimsoft_id + "POWER",
		qosMock = nodemock.mock("powerStats").takes(dummyParams, function(){}).calls(1, [null,"APIDATA"]).times(10);
	
	test("QOS From Cache", function(done){

		var cacheMock = nodemock.mock("get").takes(cacheKey, function(){}).calls(1, [null, "CACHEDATA"]).times(3);
						cacheMock.mock("set").takes(cacheKey, "CACHEDATA", cacheLifeTime, function(){}).times(3);
						cacheMock.mock("set").takes(cacheKey + "dummy", "dummy_data", cacheLoadTime, function(){}).times(3);
						cacheMock.mock("get").takes(cacheKey + "dummy", function(){}).calls(1,[null, "dummy_data"]).times(3);

		var pluginsMock = {
			cache : cacheMock
		};
		appMock.plugins = pluginsMock ; 
		var qosCache = new QosCache(appMock, qosMock);
		qosCache.powerStats(dummyParams, function(err, data){
			data.should.equal("CACHEDATA");
			done();
		})
	})

	test("QOS From API", function(done){
		
		var cacheMock = nodemock.mock("get").takes(cacheKey, function(){}).calls(1, [false]).times(3);
						cacheMock.mock("set").takes(cacheKey, "APIDATA", cacheLifeTime, function(){}).times(3);
						cacheMock.mock("set").takes(cacheKey + "dummy", "dummy_data", cacheLoadTime, function(){}).times(3);
						cacheMock.mock("get").takes(cacheKey + "dummy", function(){}).calls(1,[null, "dummy_data"]).times(3);

		var pluginsMock = {
			cache : cacheMock
		};
		appMock.plugins = pluginsMock ; 
		var qosCache = new QosCache(appMock, qosMock);
		qosCache.powerStats(dummyParams, function(err, data){
			data.should.equal("APIDATA");
			done();
		})
	})

	test("QOS From Cache And Reload Cache", function(done){

		var cacheMock = nodemock.mock("get").takes(cacheKey, function(){}).calls(1, [null, "CACHEDATA"]).times(3);
						cacheMock.mock("set").takes(cacheKey, "APIDATA", cacheLifeTime, function(){}).times(3);
						cacheMock.mock("set").takes(cacheKey + "dummy", "dummy_data", cacheLoadTime, function(){}).times(3);
						cacheMock.mock("get").takes(cacheKey + "dummy", function(){}).calls(1,[false]).times(3);

		var pluginsMock = {
			cache : cacheMock
		};
		appMock.plugins = pluginsMock ; 
		var qosCache = new QosCache(appMock, qosMock);
		qosCache.powerStats(dummyParams, function(err, data){
			data.should.equal("CACHEDATA");
			done();
		})
	})
})

suite("CPU Stats", function(){

	var cacheKey = dummyParams.nimsoft_id + "CPU",
		qosMock = nodemock.mock("cpuStats").takes(dummyParams, function(){}).calls(1, [null,"APIDATA"]).times(10);
	
	test("QOS From Cache", function(done){

		var cacheMock = nodemock.mock("get").takes(cacheKey, function(){}).calls(1, [null, "CACHEDATA"]).times(3);
						cacheMock.mock("set").takes(cacheKey, "CACHEDATA", cacheLifeTime, function(){}).times(3);
						cacheMock.mock("set").takes(cacheKey + "dummy", "dummy_data", cacheLoadTime, function(){}).times(3);
						cacheMock.mock("get").takes(cacheKey + "dummy", function(){}).calls(1,[null, "dummy_data"]).times(3);

		var pluginsMock = {
			cache : cacheMock
		};
		appMock.plugins = pluginsMock ; 
		var qosCache = new QosCache(appMock, qosMock);
		qosCache.cpuStats(dummyParams, function(err, data){
			data.should.equal("CACHEDATA");
			done();
		})
	})

	test("QOS From API", function(done){
		
		var cacheMock = nodemock.mock("get").takes(cacheKey, function(){}).calls(1, [false]).times(3);
						cacheMock.mock("set").takes(cacheKey, "APIDATA", cacheLifeTime, function(){}).times(3);
						cacheMock.mock("set").takes(cacheKey + "dummy", "dummy_data", cacheLoadTime, function(){}).times(3);
						cacheMock.mock("get").takes(cacheKey + "dummy", function(){}).calls(1,[null, "dummy_data"]).times(3);

		var pluginsMock = {
			cache : cacheMock
		};
		appMock.plugins = pluginsMock ; 
		var qosCache = new QosCache(appMock, qosMock);
		qosCache.cpuStats(dummyParams, function(err, data){
			data.should.equal("APIDATA");
			done();
		})
	})

	test("QOS From Cache And Reload Cache", function(done){

		var cacheMock = nodemock.mock("get").takes(cacheKey, function(){}).calls(1, [null, "CACHEDATA"]).times(3);
						cacheMock.mock("set").takes(cacheKey, "APIDATA", cacheLifeTime, function(){}).times(3);
						cacheMock.mock("set").takes(cacheKey + "dummy", "dummy_data", cacheLoadTime, function(){}).times(3);
						cacheMock.mock("get").takes(cacheKey + "dummy", function(){}).calls(1,[false]).times(3);

		var pluginsMock = {
			cache : cacheMock
		};
		appMock.plugins = pluginsMock ; 
		var qosCache = new QosCache(appMock, qosMock);
		qosCache.cpuStats(dummyParams, function(err, data){
			data.should.equal("CACHEDATA");
			done();
		})
	})
})

suite("Memory Stats", function(){

	var cacheKey = dummyParams.nimsoft_id + "MEMORY",
		qosMock = nodemock.mock("memoryStats").takes(dummyParams, function(){}).calls(1, [null,"APIDATA"]).times(10);
	
	test("QOS From Cache", function(done){

		var cacheMock = nodemock.mock("get").takes(cacheKey, function(){}).calls(1, [null, "CACHEDATA"]).times(3);
						cacheMock.mock("set").takes(cacheKey, "CACHEDATA", cacheLifeTime, function(){}).times(3);
						cacheMock.mock("set").takes(cacheKey + "dummy", "dummy_data", cacheLoadTime, function(){}).times(3);
						cacheMock.mock("get").takes(cacheKey + "dummy", function(){}).calls(1,[null, "dummy_data"]).times(3);

		var pluginsMock = {
			cache : cacheMock
		};
		appMock.plugins = pluginsMock ; 
		var qosCache = new QosCache(appMock, qosMock);
		qosCache.memoryStats(dummyParams, function(err, data){
			data.should.equal("CACHEDATA");
			done();
		})
	})

	test("QOS From API", function(done){
		
		var cacheMock = nodemock.mock("get").takes(cacheKey, function(){}).calls(1, [false]).times(3);
						cacheMock.mock("set").takes(cacheKey, "APIDATA", cacheLifeTime, function(){}).times(3);
						cacheMock.mock("set").takes(cacheKey + "dummy", "dummy_data", cacheLoadTime, function(){}).times(3);
						cacheMock.mock("get").takes(cacheKey + "dummy", function(){}).calls(1,[null, "dummy_data"]).times(3);

		var pluginsMock = {
			cache : cacheMock
		};
		appMock.plugins = pluginsMock ; 
		var qosCache = new QosCache(appMock, qosMock);
		qosCache.memoryStats(dummyParams, function(err, data){
			data.should.equal("APIDATA");
			done();
		})
	})

	test("QOS From Cache And Reload Cache", function(done){

		var cacheMock = nodemock.mock("get").takes(cacheKey, function(){}).calls(1, [null, "CACHEDATA"]).times(3);
						cacheMock.mock("set").takes(cacheKey, "APIDATA", cacheLifeTime, function(){}).times(3);
						cacheMock.mock("set").takes(cacheKey + "dummy", "dummy_data", cacheLoadTime, function(){}).times(3);
						cacheMock.mock("get").takes(cacheKey + "dummy", function(){}).calls(1,[false]).times(3);

		var pluginsMock = {
			cache : cacheMock
		};
		appMock.plugins = pluginsMock ; 
		var qosCache = new QosCache(appMock, qosMock);
		qosCache.memoryStats(dummyParams, function(err, data){
			data.should.equal("CACHEDATA");
			done();
		})
	})
})

suite("Disk Stats", function(){

	var cacheKey = dummyParams.nimsoft_id + "DISK",
		qosMock = nodemock.mock("diskStats").takes(dummyParams, function(){}).calls(1, [null,"APIDATA"]).times(10);
	
	test("QOS From Cache", function(done){

		var cacheMock = nodemock.mock("get").takes(cacheKey, function(){}).calls(1, [null, "CACHEDATA"]).times(3);
						cacheMock.mock("set").takes(cacheKey, "CACHEDATA", cacheLifeTime, function(){}).times(3);
						cacheMock.mock("set").takes(cacheKey + "dummy", "dummy_data", cacheLoadTime, function(){}).times(3);
						cacheMock.mock("get").takes(cacheKey + "dummy", function(){}).calls(1,[null, "dummy_data"]).times(3);

		var pluginsMock = {
			cache : cacheMock
		};
		appMock.plugins = pluginsMock ; 
		var qosCache = new QosCache(appMock, qosMock);
		qosCache.diskStats(dummyParams, function(err, data){
			data.should.equal("CACHEDATA");
			done();
		})
	})

	test("QOS From API", function(done){
		
		var cacheMock = nodemock.mock("get").takes(cacheKey, function(){}).calls(1, [false]).times(3);
						cacheMock.mock("set").takes(cacheKey, "APIDATA", cacheLifeTime, function(){}).times(3);
						cacheMock.mock("set").takes(cacheKey + "dummy", "dummy_data", cacheLoadTime, function(){}).times(3);
						cacheMock.mock("get").takes(cacheKey + "dummy", function(){}).calls(1,[null, "dummy_data"]).times(3);

		var pluginsMock = {
			cache : cacheMock
		};
		appMock.plugins = pluginsMock ; 
		var qosCache = new QosCache(appMock, qosMock);
		qosCache.diskStats(dummyParams, function(err, data){
			data.should.equal("APIDATA");
			done();
		})
	})

	test("QOS From Cache And Reload Cache", function(done){

		var cacheMock = nodemock.mock("get").takes(cacheKey, function(){}).calls(1, [null, "CACHEDATA"]).times(3);
						cacheMock.mock("set").takes(cacheKey, "APIDATA", cacheLifeTime, function(){}).times(3);
						cacheMock.mock("set").takes(cacheKey + "dummy", "dummy_data", cacheLoadTime, function(){}).times(3);
						cacheMock.mock("get").takes(cacheKey + "dummy", function(){}).calls(1,[false]).times(3);

		var pluginsMock = {
			cache : cacheMock
		};
		appMock.plugins = pluginsMock ; 
		var qosCache = new QosCache(appMock, qosMock);
		qosCache.diskStats(dummyParams, function(err, data){
			data.should.equal("CACHEDATA");
			done();
		})
	})
})

suite("Disk Iop Stats", function(){

	var cacheKey = dummyParams.nimsoft_id + "DISKIOP",
		qosMock = nodemock.mock("diskIopStats").takes(dummyParams, function(){}).calls(1, [null,"APIDATA"]).times(10);
	
	test("QOS From Cache", function(done){

		var cacheMock = nodemock.mock("get").takes(cacheKey, function(){}).calls(1, [null, "CACHEDATA"]).times(3);
						cacheMock.mock("set").takes(cacheKey, "CACHEDATA", cacheLifeTime, function(){}).times(3);
						cacheMock.mock("set").takes(cacheKey + "dummy", "dummy_data", cacheLoadTime, function(){}).times(3);
						cacheMock.mock("get").takes(cacheKey + "dummy", function(){}).calls(1,[null, "dummy_data"]).times(3);

		var pluginsMock = {
			cache : cacheMock
		};
		appMock.plugins = pluginsMock ; 
		var qosCache = new QosCache(appMock, qosMock);
		qosCache.diskIopStats(dummyParams, function(err, data){
			data.should.equal("CACHEDATA");
			done();
		})
	})

	test("QOS From API", function(done){
		
		var cacheMock = nodemock.mock("get").takes(cacheKey, function(){}).calls(1, [false]).times(3);
						cacheMock.mock("set").takes(cacheKey, "APIDATA", cacheLifeTime, function(){}).times(3);
						cacheMock.mock("set").takes(cacheKey + "dummy", "dummy_data", cacheLoadTime, function(){}).times(3);
						cacheMock.mock("get").takes(cacheKey + "dummy", function(){}).calls(1,[null, "dummy_data"]).times(3);

		var pluginsMock = {
			cache : cacheMock
		};
		appMock.plugins = pluginsMock ; 
		var qosCache = new QosCache(appMock, qosMock);
		qosCache.diskIopStats(dummyParams, function(err, data){
			data.should.equal("APIDATA");
			done();
		})
	})

	test("QOS From Cache And Reload Cache", function(done){

		var cacheMock = nodemock.mock("get").takes(cacheKey, function(){}).calls(1, [null, "CACHEDATA"]).times(3);
						cacheMock.mock("set").takes(cacheKey, "APIDATA", cacheLifeTime, function(){}).times(3);
						cacheMock.mock("set").takes(cacheKey + "dummy", "dummy_data", cacheLoadTime, function(){}).times(3);
						cacheMock.mock("get").takes(cacheKey + "dummy", function(){}).calls(1,[false]).times(3);

		var pluginsMock = {
			cache : cacheMock
		};
		appMock.plugins = pluginsMock ; 
		var qosCache = new QosCache(appMock, qosMock);
		qosCache.diskIopStats(dummyParams, function(err, data){
			data.should.equal("CACHEDATA");
			done();
		})
	})
})

