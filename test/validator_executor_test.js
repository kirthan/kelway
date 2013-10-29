var Validator = require('../src/plugins/validator'),
		Mock  = require('./mock'),
	should 	  = require('should');


suite("Validator Executor",function(done){
	var appMock = {};

	test("Valid Test Executor (Simple)",function(done){
		var validator = new Validator(appMock),
			rules = {"name":{required:true}}, values = {"name": "asdf"};
		var executor = validator.validateExecutor(rules,values);
		executor(function(err){
			should.not.exist(err);
			done();
		})
	})

	test("Invalid Test Executor (Simple)",function(done){
		var values = {"first_name": "asdf"}, 
			rules =  { 
					"first_name": { 
						required: true, 
						length: {
							min: 10,
							max: 50 
						}
					} 
		    	};
		var validator = new Validator(appMock);
		var exec = validator.validateExecutor(rules,values);
		exec(function(err){
			err.should.have.length(1)
			done();
		})
	})

	test("Validate Email (valid)",function(done){
		var values = {"email": "email@email.com"}, 
			rules =  { 
					"email": { 
						required: true, 
						email: true
					} 
		    	};
		var validator = new Validator(appMock);
		var exec = validator.validateExecutor(rules,values);
		exec(function(err){
			should.not.exist(err);
			done();
		})
	})

	test("Validate Email (Invalid)",function(done){
		var values = {"email": "dummy"}, 
			rules =  { 
					"email": { 
						required: true, 
						email: true
					} 
		    	};
		var validator = new Validator(appMock);
		var exec = validator.validateExecutor(rules,values);
		exec(function(err){
			should.exist(err);
			done();
		})
	})

	test("Validate URL (valid)",function(done){
		var values = {"sample_url": "www.sample.com"}, 
			rules =  { 
					"sample_url": { 
						required: true, 
						url: true
					} 
		    	};
		var validator = new Validator(appMock);
		var exec = validator.validateExecutor(rules,values);
		exec(function(err){
			should.not.exist(err);
			done();
		})
	})

	test("Validate URL (Invalid)",function(done){
		var values = {"sample_url": "wwwdotsampledotcom"}, 
			rules =  { 
					"sample_url": { 
						required: true, 
						url: true
					} 
		    	};
		var validator = new Validator(appMock);
		var exec = validator.validateExecutor(rules,values);
		exec(function(err){
			should.exist(err);
			done();
		})
	})


	test("Validate Alphanumeric (valid)",function(done){
		var values = {"sample_alphanumeric": "asdf1234"}, 
			rules =  { 
					"sample_alphanumeric": { 
						required: true, 
						alphanumeric: true
					} 
		    	};
		var validator = new Validator(appMock);
		var exec = validator.validateExecutor(rules,values);
		exec(function(err){
			should.not.exist(err);
			done();
		})
	})

	test("Validate Alphanumeric (Invalid)",function(done){
		var values = {"sample_alphanumeric": "wwwdotsampledotcom_@#!"}, 
			rules =  { 
					"sample_alphanumeric": { 
						required: true, 
						alphanumeric: true
					} 
		    	};
		var validator = new Validator(appMock);
		var exec = validator.validateExecutor(rules,values);
		exec(function(err){
			should.exist(err);
			done();
		})
	})

	test("Validate Phone (valid)",function(done){
		var values = {"sample_number": "123-123-1234"}, 
			rules =  { 
					"sample_number": { 
						required: true, 
						phone: true
					} 
		    	};
		var validator = new Validator(appMock);
		var exec = validator.validateExecutor(rules,values);
		exec(function(err){
			should.not.exist(err);
			done();
		})
	})

	test("Validate Phone (Invalid)",function(done){
		var values = {"sample_number": "123-123-1234123"}, 
			rules =  { 
					"sample_number": { 
						required: true, 
						phone: true
					} 
		    	};
		var validator = new Validator(appMock);
		var exec = validator.validateExecutor(rules,values);
		exec(function(err){
			should.exist(err);
			done();
		})
	})

	test("Validate IP (valid)",function(done){
		var values = {"sample_ip": "123.123.123.123"}, 
			rules =  { 
					"sample_ip": { 
						required: true, 
						ip: true
					} 
		    	};
		var validator = new Validator(appMock);
		var exec = validator.validateExecutor(rules,values);
		exec(function(err){
			should.not.exist(err);
			done();
		})
	})

	test("Validate IP (Invalid)",function(done){
		var values = {"sample_ip": "123-123-1234123"}, 
			rules =  { 
					"sample_ip": { 
						required: true, 
						ip: true
					} 
		    	};
		var validator = new Validator(appMock);
		var exec = validator.validateExecutor(rules,values);
		exec(function(err){
			should.exist(err);
			done();
		})
	})
})