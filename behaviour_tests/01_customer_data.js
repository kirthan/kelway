var restClient = require('./support/restclient'),
	should 	   = require('should'),
	dataPool   = require('./support/dataLoader'),
	accessToken, data;

describe('Customer data from database', function(){
	before(function(done){
		dataPool.getDataSet("01_login_logout", function(err, res){
			data = res;
			done();
		})
	})

	after(function(done){
		done()
	})


	it('Get customer list',function(done){
		restClient.get(
			'/Listcustomers',
			function(err, req, res, obj){
				if(err){ throw(err) }
				obj.value[0].CustomerCode.should.equal(data.CustomerCode.valid[0])
				obj.value[0].Name.should.equal(data.CustomerName.valid[0])
				obj.value[1].CustomerCode.should.equal(data.CustomerCode.valid[1])
				obj.value[1].Name.should.equal(data.CustomerName.valid[1])
				obj.Count.should.equal(data.CustomerCount.valid[0])
			}
		)
	})

	it('Get customer code',function(done){
		restClient.get(
			'/GetCustomerCode?customername=' + data.CustomerName.valid[1],
			function(err, req, res, obj){
				if(err){ throw(err) }
				obj.code.should.equal(data.CustomerCode.valid[1])
			}
		)
	})

	it('Get customer details',function(done){
		restClient.get(
			'/GetCustomerDetails?customername=' + data.Name.valid[1],
			function(err, req, res, obj){
				if(err){ throw(err) }
				obj.CustomerCode.should.equal(data.CustomerCode.valid[1])
				obj.SWAssure.should.equal(data.CustomerSWAssure.valid[1])
				obj.SWBackup.should.equal(data.CustomerSWBackup.valid[1])
				obj.SWCompute.should.equal(data.CustomerSWCompute.valid[1])
				obj.SWMail.should.equal(data.CustomerSWMail.valid[1])
			}
		)
	})


})