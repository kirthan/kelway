var pluginSetUp = require('../src/lib/plugins/setup'),
    Mock = require('./mock'),
    should = require('should');

suite("Plugins setup [JSON Based]",function(){

	setup(function(){
        appMock = new Mock([{ name:'get', return_value: __dirname + '/mock/plugins/' }]);
        fsMockInvalid = new Mock([{name:'readFile',callback_args:[true,null]}]);
        fsMockInvalidPlugin = new Mock([{name:'readFile',callback_args:[null,'{"invalidPlugin":"invalidPlugin"}']}]);
        fsMockValid = new Mock([{name:'readFile',callback_args:[null,'{"dummy":"dummy"}']}]);
    })

	suite("Negative tests",function(){
		test("Invalid File",function(){
			plugin = new pluginSetUp(null,fsMockInvalid);
            (function(){
                plugin.setup(appMock, function(){});
            }).should.throw('Cannot read file.');
		})

		test("Invalid Plugin",function(){
			plugin = new pluginSetUp(null,fsMockInvalidPlugin);
            (function(){
                plugin.setup(appMock, function(){});
            }).should.throw("invalidPlugin plugin doesn't exist.");
		})
	})

	suite("Plugin Access",function(){
		test("Valid based",function(done){
			plugin = new pluginSetUp(null,fsMockValid);
            plugin.setup(appMock, function(){
            	pluginObj = this.plugin['dummy'];
            	pluginObj.dummy();
            	pluginObj.dummy_called.should.be.true;
            	done();
            });
		})
	})
})