// var ServiceWorksModel 	= require('../src/plugins/service_works'),
// 	Mock 				= require('./mock'),
// 	mongoose			= require('mongoose'),
// 	should 				= require('should');

// var _model, validServerID;
// //Clear 'orange_testing' Database before excecuting testcases.
// var conn = mongoose.connect('mongodb://localhost:27017/orange_testing'); 

// mongoose.connection.on('open', function(){
// 	mongoose.connection.db.dropDatabase(function(err){
// 		  if(err){
//             throw new Error('Cannot drop DB.' + err);
//         }
// 	});
// });

// var dbMock = {
// 	Schema : mongoose.Schema,
// 	conn   : conn
// }

// pluginMock 	= {db: dbMock}
// appMock 	= {plugins : pluginMock}
// _model		= new ServiceWorksModel(appMock);

// setup(function(done){

// 	var serverDetails = {
// 			customerPrefix    : "customer_prefix",
// 	        nimSoftID         : "234234",
// 	        serverName    	  : "server123",
// 	        serverDescription : "server Descreption",
// 	        serverNotes   	  : "Server Notes",
// 	        serverClass   	  : "Server Class",
// 	        IPAdress   		  : "192.168.0.90",
// 	        operatingSystem   : "Linux/Ubuntu",
// 	        instanceSize 	  : "small"
// 		}
	
// 	_model.addServer(serverDetails, function(result){
// 		result.should.not.be.false;
// 		validServerID = result._id;
// 		done();
// 	});
// });

// suite("Add Server",function(){
// 	test(" Valid Data",function(done){
// 		var serverDetails = {
// 			customerPrefix    : "customer_prefix",
// 	        nimSoftID         : "234234",
// 	        serverName    	  : "server123",
// 	        serverDescription : "server Descreption",
// 	        serverNotes   	  : "Server Notes",
// 	        serverClass   	  : "Server Class",
// 	        IPAdress   		  : "192.168.0.90",
// 	        operatingSystem   : "Linux/Ubuntu",
// 	        instanceSize 	  : "small"
// 		}
	
// 		_model.addServer(serverDetails, function(serverDetails){
// 			serverDetails.should.not.be.false;
// 			done();
// 		});
// 	})
// });	

// suite("Get Server", function(){
// 	test(" Valid ServerID",function(done){
// 		_model.getServer(validServerID, function(serverDetails){
// 			serverDetails.should.not.be.false;
// 			done();
// 		});
// 	})
// })

// suite("Update Server", function(){
// 	test(" Valid ServerID",function(done){
// 		var params = {
// 			serverName    	  : "server name changed",
// 	        serverDescription : "server descreption changed",
// 		}
// 		_model.updateServer(validServerID, params, function(success){
// 			success.should.be.true;
// 			done();
// 		});
// 	})
// })


// suite("Delete Server", function(){
// 	test(" Valid ServerID",function(done){
// 		_model.deleteServer(validServerID, function(success){
// 			success.should.be.true;
// 			done();
// 		});
// 	})
// })