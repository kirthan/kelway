var ConfigLoader = require('../src/config_loader'),
    Mock = require('./mock'),
    should = require('should');

suite("Configuration Reader[JSON Based]",function(){
    var confReader, appMock, fsMockInvalid,fsMockValid;

    setup(function(){
        appMock = new Mock(['get','set']);
        fsMockInvalid = new Mock([{name:'readFile',callback_args:[true,null]}]);
        fsMockValid = new Mock([{name:'readFile',callback_args:[null,'{"asdf":"qwer"}']}]);
    });

    suite("Load Basic Config File",function(){
        test("File Not Exists Negative Test",function(done){
            confReader = new ConfigLoader('', fsMockInvalid,fsMockInvalid);
            (function(){
                confReader.loadBaseConfig(appMock,function(){});
            }).should.throw()
            done();
        })

        test("Valid Test",function(done){
            confReader = new ConfigLoader('',fsMockValid,fsMockValid);
            confReader.loadBaseConfig(appMock,function(){
                appMock.set_called.should.be.true;
                done();
            });
        })
    });

    suite("Environment Specific Config File",function(){
        test("File Not Exists Negative Test",function(done){
           confReader = new ConfigLoader('', fsMockInvalid,fsMockInvalid);
            (function(){
                confReader.loadEnvSpecificConfigFile(appMock,function(){});
            }).should.throw()
            done();
        })

        test("Valid Test",function(done){
            confReader = new ConfigLoader('',fsMockValid,fsMockValid);
            confReader.loadEnvSpecificConfigFile(appMock,function(){
                appMock.set_called.should.be.true;
                done();
            });
        })
    });
})