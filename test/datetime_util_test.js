var DatetimeUtil 	= require('../src/plugins/nimsoft/datetime_util'),
	should 		= require('should'),
	nodemock 	= require('nodemock');

suite("DateTime Utility", function(){
	test("Format To Inavalid Time", function(done){
		var res = DatetimeUtil.formatTo("13-1-2013 12:30", 'MM/DD/YYYY HH:mm')
		//13-1-2013 invalid date format
		res.should.equal('NaN/NaN/0NaN NaN:NaN')
		done();
	})
	test("Format To Inavalid Time", function(done){
		var res = DatetimeUtil.formatTo("12-31-2013 12:30", 'MM/DD/YYYY HH:mm')
		res.should.equal('12/31/2013 12:30');
		done();
	})
	test("before", function(done){
		var res = DatetimeUtil.before('M', 30);
		should.exist(res);
		done();
	})
	test("Thirty Minutes Before", function(done){
		var res = DatetimeUtil.thirtyMinBefore();
		should.exist(res);
		done();
	})
	test("Fifteen Minutes Before", function(done){
		var res = DatetimeUtil.fifteenMinBefore();
		should.exist(res);
		done();
	})
})