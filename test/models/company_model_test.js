var CompanyModel = require('../../src/plugins/company'),
	Mock 		 = require('./../mock'),
	mongoose	 = require('mongoose'),
	should 		 = require('should');

//Clear 'orange_testing' Database before excecuting testcases.
var _model, conn = mongoose.createConnection('mongodb://localhost:27017/orange_testing'); 

mongoose.connection.on('open', function(){
	mongoose.connection.db.dropDatabase(function(err){
		  if(err){
            throw new Error('Cannot drop DB.' + err);
        }
	});
});

suiteTeardown(function(done){
	mongoose.disconnect();
	done();
});

var dbMock = {
	Schema : mongoose.Schema,
	conn   : conn
}

pluginMock 	= {db: dbMock}
appMock 	= {plugins : pluginMock}
_model		= new CompanyModel(appMock);

setup(function(done){
	var companyModel = {
		name			: "dummy",
		short_code		: "dummy",
		account_manager	: "dummy"	
	}
	
	_model.addCompany(companyModel, function(result){
		console.log("setup")
		result.should.not.be.false;
		validCompanyID = result._id;
		done();
	});
});

suite("Get Company",function(){
	test(" Invalid Company ID ",function(done){
		var ObjectId = mongoose.Types.ObjectId;
		_model.getCompany(new ObjectId(), function(companyModel){
			companyModel.should.be.false;
			done();
		});
	})
	
	test(" Valid Company ID ",function(done){
		_model.getCompany(validCompanyID, function(companyModel){
			companyModel.should.not.be.false;
			done();
		});
	})
});	

