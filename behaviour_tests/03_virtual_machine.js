var restClient = require('./support/restclient'),
	should 	   = require('should'),
	dataPool   = require('./support/dataLoader'),
	accessToken, data;

describe('Create Virtual Machine', function(){
	before(function(done){
		dataPool.getDataSet("01_login_logout", function(err, res){
			data = res;
			done();
		})
	})

	after(function(done){
		done()
	})


	it('Create virtual machine',function(done){
		restClient.get(
			'/CreateVMFromTemplate?customercode='+ data.VMCustomerCode.valid[0]+'&computername='+
			data.VMComputerName.valid[0] + '&os='+ data.VMOperatingSystem.valid[0] + 
			'&size=' + data.VMSize.valid[0],
			function(err, req, res, obj){
				if(err){ throw(err) }
				obj.IPAddress.should.equal(data.VMIPAddress.valid[0])
				obj.Message.should.equal(data.VMMessage.valid[0])
				obj.Name.should.equal(data.VMName.valid[0])
				obj.Password.should.equal(data.VMPassword.valid[0])
			}
		)
	})

	it('Refresh the virtual machine template pool',function(done){
		restClient.get(
			'/ResetVMPool',
			function(err, req, res, obj){
				if(err){ throw(err) }
				// obj.Count.should.equal(data.VMVirtualMachinesCount.valid[0])
			}
		)
	})
})

describe('Control power state of virtual machine', function(){
	before(function(done){
		done()
	})

	after(function(done){
		done()
	})


	it('Power off virtual machine',function(done){
		restClient.get(
			'PowerOffVM?vmname='+ data.VMName.valid[0],
			function(err, req, res, obj){
				if(err){ throw(err) }
					obj.Status.should.equal(data.VMPoweredOffStatus.valid[0])
					obj.VMName.should.equal(data.VMName.valid[0])
			}
		)
	})

	it('Power on virtual machine',function(done){
		restClient.get(
			'PowerOnVM?vmname='+ data.VMName.valid[0],
			function(err, req, res, obj){
				if(err){ throw(err) }
					obj.Status.should.equal(data.VMPoweredOnStatus.valid[0])
					obj.VMName.should.equal(data.VMName.valid[0])
			}
		)
	})

	it('Shutdown virtual machine',function(done){
		restClient.get(
			'ShutDownOnVM?vmname='+ data.VMName.valid[0],
			function(err, req, res, obj){
				if(err){ throw(err) }
					obj.Status.should.equal(data.VMPoweredOffStatus.valid[0])
					obj.VMName.should.equal(data.VMName.valid[0])
			}
		)
	})

	it('Restart virtual machine',function(done){
		restClient.get(
			'RestartVM?vmname='+ data.VMName.valid[0],
			function(err, req, res, obj){
				if(err){ throw(err) }
					obj.Status.should.equal(data.VMPoweredOnStatus.valid[0])
					obj.VMName.should.equal(data.VMName.valid[0])
			}
		)
	})

})