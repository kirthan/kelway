var MethodExec = require('../src/plugins/method_exec'),
		Mock  = require('./mock'),
	should 	  = require('should'),
	 async = require('async');

suite("Test seriesExecutor", function(){
	test("Valid", function(done){
		var appMock ={},
		 MethodMock = {
			a: function(params,callback){
				params.a = 'a';
				callback(null, params);
			},
			b: function(params,callback){
				params.a = 'b';
				callback(null, params);
			},
			c: function(params,callback){
				params.a = 'c';
				callback(null, params);
			}
		},
		pluginsMock = {
			mock : MethodMock
		};
		appMock.plugins = pluginsMock;
		var params = {'a':'not initialized'};
		var executor = new MethodExec(appMock).seriesExecutor(['mock.a','mock.b','mock.c'],params);
		executor(function(err, params){
			console.log(params);
			params.a.should.equal('c');
			done();
		})
	})

	test("Invalid", function(done){
		var appMock ={},
		 MethodMock = {
			a: function(params,callback){
				params.a = 'a';
				callback("error", params);
			},
			b: function(params,callback){
				params.a = 'b';
				callback(null, params);
			},
			c: function(params,callback){
				params.a = 'c';
				callback(null, params);
			}
		},
		pluginsMock = {
			mock : MethodMock
		};
		appMock.plugins = pluginsMock;
		var params = {'a':'not initialized'};
		var executor = new MethodExec(appMock).seriesExecutor(['mock.a','mock.b','mock.c'],params);
		executor(function(err, params){
			err.should.equal('error');
			done();
		})
	})

		test("No methods", function(done){
		var appMock ={},
		 MethodMock = {
			a: function(params,callback){
				params.a = 'a';
				callback("error", params);
			},
			b: function(params,callback){
				params.a = 'b';
				callback(null, params);
			},
			c: function(params,callback){
				params.a = 'c';
				callback(null, params);
			}
		},
		pluginsMock = {
			mock : MethodMock
		};
		appMock.plugins = pluginsMock;
		var params = {'a':'not initialized'};
		var executor = new MethodExec(appMock).seriesExecutor([],params);
		executor(function(err, params){
			params.a.should.equal('not initialized');
			done();
		})
	})
})

suite("Test parameteriseQuery", function(){
	test("Query value is expression", function(done){
		var appMock = {},
		mockQuery = {id : '${id}' },
		mockParams = {
			id : 12123
		};
		var calls = [
			function(callback){
				query = new MethodExec(appMock).parameteriseQuery(mockQuery,mockParams);
				query.id.should.equal("12123");
				callback();
			}
		];
		async.series(calls,function(err,results){
			done();
		});
	});

	test("Query value is an array", function(done){
		var appMock = {},
		mockQuery = {id : ["dummy", "dummy2"] },
		mockParams = {
			id : 12123
		};
		var calls = [
			function(callback){
				query = new MethodExec(appMock).parameteriseQuery(mockQuery,mockParams);
				query.id[0].should.equal("dummy");
				callback();
			}
		];
		async.series(calls,function(err,results){
			done();
		});
	});

	test("Query value is an Object", function(done){
		var appMock = {},
		mockQuery = {id : { key: "dummy"}
		 },
		mockParams = {
			id : 12123
		};
		var calls = [
			function(callback){
				query = new MethodExec(appMock).parameteriseQuery(mockQuery,mockParams);
				console.log(query);
				query.id.key.should.equal("dummy");
				callback();
			}
		];
		async.series(calls,function(err,results){
			done();
		});
	});
})