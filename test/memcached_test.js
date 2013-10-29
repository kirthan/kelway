var should 		= require('should'),
	nodemock 	= require('nodemock'),
 	Memcahced 	= require('../src/plugins/memcached');

	var memVars = {
		"TIME_OUT":3000,
	    "RETRIES" : 1,
	    "HOST"    : "localhost",
	    "PORT"    : 11211,
	    "DISABLED": false 
	}
	var appMock = nodemock.mock("get").takes('MEMCACHE').returns(memVars).times(10);
	var memcahced = new Memcahced(appMock);
	
suite("Memcahced GET", function(){
	test("Valid key", function(done){
		setTimeout(function() {
			memcahced.set("key_to_test_get", "dummy", 1000, function(result){
				memcahced.get("key_to_test_get", function(err, result){
					result.should.equal('dummy');
					done();
				});
			})
		}, 1500);
	})

	test("Invalid Key", function(done){
		setTimeout(function() {
			memcahced.get("invalid_key_to_test_get", function(err, result){
				result.should.be.false;
				done();
			});
		}, 1500);
	})

	test("Invalid scenario", function(done){
		memcahced.get("", function(err, result){
			should.not.exist(result);
			done();
		});
	})
})

suite("Memcahced SET", function(){

	test("Valid scenario", function(done){
		setTimeout(function() {
			memcahced.set("key_to_test_set", "dummy", 6000, function(err, result){
				result.should.be.true;
				done();
			});
		}, 1500);
	})

	test("Invalid scenario", function(done){
		setTimeout(function() {
			memcahced.set("key_to_test_set", "dummy", "600", function(err, result){
				should.not.exist(result);
				done();
			});
		}, 1500);
	})
})