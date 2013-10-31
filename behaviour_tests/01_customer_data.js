var restClient = require('./support/restclient'),
	should 	   = require('should'),
	dataPool   = require('./support/dataLoader'),
	accessToken, data, cname;

describe('Customer data from database', function(){
	before(function(done){
		dataPool.getDataSet("customer", function(err, res){
			data = res;
			cname = encodeURIComponent(data[0].Name);
			cname = cname.replace(/'/g,"%27");
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
					console.log(obj)
				// obj.value[0].CustomerCode.should.equal(data.CustomerCode.valid[0])
				// obj.value[0].Name.should.equal(data.CustomerName.valid[0])
				// obj.value[1].CustomerCode.should.equal(data.CustomerCode.valid[1])
				// obj.value[1].Name.should.equal(data.CustomerName.valid[1])
				// obj.Count.should.equal(data.CustomerCount.valid[0])
				done();
			}
		)
	})

	it('Get customer code',function(done){
		
		restClient.get(
			'/GetCustomerCode?customername=' + cname,
			function(err, req, res, obj){
				if(err){ throw(err) }
				console.log(obj)
				// obj.code.should.equal(data.CustomerCode.valid[1])
				done()
			}
		)
	})

	it('Get customer details',function(done){
		console.log(data[0].Name)
		restClient.get(
			'/GetCustomerDetails?customername=' + cname,
			function(err, req, res, obj){
				if(err){ throw(err) }
					// console.log(obj)
				// obj.CustomerCode.should.equal(data.CustomerCode.valid[1])
				// obj.SWAssure.should.equal(data.CustomerSWAssure.valid[1])
				// obj.SWBackup.should.equal(data.CustomerSWBackup.valid[1])
				// obj.SWCompute.should.equal(data.CustomerSWCompute.valid[1])
				// obj.SWMail.should.equal(data.CustomerSWMail.valid[1])
				done()
			}
		)
	})


})