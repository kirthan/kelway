var restClient = require('./support/restclient'),
	should 	   = require('should'),
	dataPool   = require('./support/dataLoader'),
	accessToken, data, vmData;

describe('Create Virtual Machine', function(){
	before(function(done){
		dataPool.getDataSet("customer", function(err, res){
			data = res;
			dataPool.getDataSet("virtual_mechine", function(err, res2){
				vmData = res2;
				done();
			})
		})
	})

	after(function(done){
		done()
	})


	it('Create virtual machine',function(done){
		restClient.get(
			'/CreateVMFromTemplate?customercode='+ data[0].CustomerCode +'&computername=dummyServerName&os='+ vmData[0].OperatingSystem + 
			'&size=' + vmData[0].Size,
			function(err, req, res, obj){
				if(err){ throw(err) }
					console.log(obj)
					restClient.get(
					'/DeleteVMFromTemplate?vmname=dummyServerName',
					function(err, req, res, obj){
						if(err){ throw(err) }
							console.log(obj)
							done()
					}
				)
			}
		)
	})

	it('Refresh the virtual machine template pool',function(done){
		restClient.get(
			'/ResetVMPool',
			function(err, req, res, obj){
				if(err){ throw(err) }
					console.log(obj)
					done()
			}
		)
	})

	it('Power off virtual machine',function(done){
		restClient.get(
			'/PowerOffVM?vmname='+ vmData[0].Name,
			function(err, req, res, obj){
				if(err){ throw(err) }
				obj.val.Status.should.equal("poweredOff")
				console.log(obj)
				done()
			}
		)
	})

	it('Power on virtual machine',function(done){
		restClient.get(
			'/PowerOnVM?vmname='+ vmData[0].Name,
			function(err, req, res, obj){
				if(err){ throw(err) }
				obj.val.Status.should.equal("poweredOn")
				console.log(obj)
				done()
			}
		)
	})

	it('Shutdown virtual machine',function(done){
		restClient.get(
			'/ShutDownOnVM?vmname='+ vmData[0].Name,
			function(err, req, res, obj){
				if(err){ throw(err) }
				obj.val.Status.should.equal("poweredOff")
				console.log(obj)
				done()
			}
		)
	})

	it('Restart virtual machine',function(done){
		restClient.get(
			'/RestartVM?vmname='+ vmData[0].Name,
			function(err, req, res, obj){
				if(err){ throw(err) }
				obj.val.Status.should.equal("poweredOn")
				console.log(obj)
				done()
			}
		)
	})
})


