var SCModel 	= require('../src/plugins/db_static_content'),
	Mock 		= require('./mock'),
	mongoose	= require('mongoose'),
	should 		= require('should');

var scModel;
//Clear 'orange_testing' Database before excecuting testcases.
var conn = mongoose.createConnection('mongodb://localhost:27017/orange_testing'); 
mongoose.connection.on('open', function(){
	mongoose.connection.db.dropDatabase(function(err){
		  if(err){
            throw new Error('Cannot drop DB.' + err);
        }
	});
});

// Create Static content model, Before calling any methods on it.
var dbMock = {
	Schema : mongoose.Schema,
	conn   : conn
}

pluginMock 	= {db: dbMock}
appMock 	= {plugins : pluginMock}
scModel		= new SCModel(appMock);

setup(function(done){
	scModel.saveContent('validGlobalArea', 'dummy content', function(success){
		success.should.be.true;
		done();
	});
});

suiteTeardown(function(done){
	mongoose.connection.close();
	done();
});

suite("Get Static Content",function(){
	test(" Valid Area",function(done){
		scModel.getContent('validGlobalArea', function(content){
			content.should.not.be.false;
			done();
		})
	})

	test(" Invalid Area",function(done){
		scModel.getContent('invalidGlobalArea', function(success){
			success.should.be.false;
			done();
		})
	})
});	

suite("Get Static Content By Version",function(){
	test(" Valid Version",function(done){
		scModel.getContentByVersion('validGlobalArea', 1, function(content){
			content.should.not.be.false;
			done();
		})
	})

	test(" Invalid Valid Version",function(done){
		scModel.getContentByVersion('validGlobalArea', 0, function(success){
			success.should.be.false;
			done();
		})
	})
})


suite("Save Version Of Active Static Content",function(){
	test(" valid Area",function(done){
		scModel.activateContentVersion('validGlobalArea', 1, function(success){
			success.should.be.true;
			done();
		})
	})

	test(" Invalid Area",function(done){
		scModel.activateContentVersion('invalidGlobalArea', 'saa', function(success){
			success.should.be.false;
			done();
		})
	})
})

suite("Save Static Content",function(){
	test(" Valid Area",function(done){
		scModel.saveContent('validGlobalArea', 'dummy content', function(success){
			success.should.be.true
			done();
		})
	})
})

suite("Get Static Content Versions",function(){
	test(" Valid Area",function(done){
		scModel.getContentVersions('validGlobalArea', function(success){
			success.should.not.be.false;
			done();
		})
	})

	test(" Invalid Area",function(done){
		scModel.getContentVersions('invalidGlobalArea', function(success){
			success.should.not.be.false;
			done();
		})
	})
})