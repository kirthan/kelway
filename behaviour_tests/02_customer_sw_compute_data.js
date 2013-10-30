var restClient = require('./support/restclient'),
	should 	   = require('should'),
	dataPool   = require('./support/dataLoader'),
	accessToken, data;

describe('Customer ServiceWorks Compute data from database', function(){
	before(function(done){
		dataPool.getDataSet("01_login_logout", function(err, res){
			data = res;
			done();
		})
	})

	after(function(done){
		done()
	})


	it('Get ServiceWorks Compute summary',function(done){
		restClient.get(
			'/GetSWcomputesummary?customer=' + data.SWCustomerCode.valid[0],
			function(err, req, res, obj){
				if(err){ throw(err) }
				obj.CPU.should.equal(data.SWCPU.valid[0])
				obj.Disk.should.equal(data.SWDisk.valid[0])
				obj.Number.should.equal(data.SWNumber.valid[0])
				obj.RAM.should.equal(data.SWRAM.valid[0])
			}
		)
	})

	it('Get list of virtual machines',function(done){
		restClient.get(
			'/ListVms?customer=' + data.VMCustomerCode.valid[0],
			function(err, req, res, obj){
				if(err){ throw(err) }
				obj.value[0].IPAddress.should.equal(data.VMIPAddress.valid[0])
				obj.value[0].vmsName.should.equal(data.VMName.valid[0])
				obj.value[0].OS.should.equal(data.VMOS.valid[0])
				obj.value[0].RAMinGB.should.equal(data.VMRAMinGB.valid[0])
				obj.value[0].State.should.equal(data.VMState.valid[0])
				obj.value[0].vCPU.should.equal(data.VMvCPU.valid[0])
				
				obj.value[1].IPAddress.should.equal(data.VMIPAddress.valid[1])
				obj.value[1].vmsName.should.equal(data.VMName.valid[1])
				obj.value[1].OS.should.equal(data.VMOS.valid[0])
				obj.value[1].RAMinGB.should.equal(data.VMRAMinGB.valid[0])
				obj.value[1].State.should.equal(data.VMState.valid[0])
				obj.value[1].vCPU.should.equal(data.VMvCPU.valid[0])
				
				obj.Count.should.equal(data.VMCount.valid[0])
			}
		)
	})

	it('Get virtual disk summary',function(done){
		restClient.get(
			'/ListDiskSummary?customer=' + data.VDCustomerCode.valid[0],
			function(err, req, res, obj){
				if(err){ throw(err) }
				obj.value[0].FreeSpaceGB.should.equal(data.VDFreeSpaceGB.valid[0])
				obj.value[0].Number.should.equal(data.VDNumber.valid[0])
				obj.value[0].Server.should.equal(data.VDServer.valid[0])
				obj.value[0].TotalCapacity.should.equal(data.VDTotalCapacity.valid[0])
				obj.value[1].FreeSpaceGB.should.equal(data.VDFreeSpaceGB.valid[1])
				obj.value[1].Number.should.equal(data.VDNumber.valid[1])
				obj.value[1].Server.should.equal(data.VDServer.valid[1])
				obj.value[1].TotalCapacity.should.equal(data.VDTotalCapacity.valid[1])
				obj.Count.should.equal(data.VDSummaryCount.valid[0])
			}
		)
	})

	it('Get virtual disk details',function(done){
		restClient.get(
			'/ListDiskDetail?vmname='+ data.VMName.valid[0],
			function(err, req, res, obj){
				if(err){ throw(err) }
				obj.value[0].CapacityGB.should.equal(data.VDCapacityGB.valid[0])
				obj.value[0].Drive.should.equal(data.VDDrive.valid[0])
				obj.value[0].FreeSpaceGB.should.equal(data.VDFreeSpaceGB.valid[0])
				obj.value[0].PercFree.should.equal(data.VDPercFree.valid[0])
				obj.value[0].PercUsed.should.equal(data.VDPercUsed.valid[0])
				obj.Count.should.equal(data.VDDetailsCount.valid[0])
			}
		)
	})

})