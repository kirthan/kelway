var should = require("should"),
    ServiceApp = require("../src/app/service_app"),
    Mock = require('./mock');

suite("Service App",function(){
    var app, restifyMock, serverMock, confMock, routerMock, pluginsMock, authMock;

    setup(function(){
        confMock = new Mock([
            {name:'loadBaseConfig'},
            {name:'loadEnvSpecificConfigFile'},
        ]);
        serverMock = new Mock([
            {name : 'listen'},
            {name : 'use'}
        ]);
        restifyMock = new Mock([
            {name:'createServer',return_value:serverMock},
            {name:'bodyParser'},
            {name:'queryParser'}
        ]);
        app = new ServiceApp(null,restifyMock); // Restify and conf
    })

    suite("Configuration",function(){
        test("Null configure object",function(){
            (function(){app.init()}).should.throw();
        })
        test("Configure call",function(done){
            app.conf = confMock;

            app.init(function(){
               confMock.loadBaseConfig_called.should.be.true;
            });
            done();
        })

        test("Conf get/set",function(){
            app.set('ASDF','DUMMY');
            app.get('ASDF').should.equal('DUMMY');
        })
    })

    suite("Server",function(){
        test("Create Without conf",function(){
            app = new ServiceApp(null,restifyMock);
            (function(){
                app.init()
            }).should.throw();
        });

        test("Create with Valid Configuration",function(){
            app = new ServiceApp(confMock,restifyMock);
            app.init(function(){
                restifyMock.createServer_called.should.be.true;
            })
        });

        test("Server listen",function(done){
            app = new ServiceApp(confMock,restifyMock);
            app.init(function(){
                app.run()
                serverMock.listen_called.should.be.true;
            })
            done();
        })
    });

    suite("Route Setup",function(){
        test("Setup Router",function(){
            routerMock = new Mock(['setup']);
            app = new ServiceApp(confMock,restifyMock);
            app.router = routerMock;
        })
    })

    suite("Plugin Setup",function(){
        test("Setup Plugins",function(){
            pluginsMock = new Mock(['setup']);
            app = new ServiceApp(confMock,restifyMock);
            app.router = pluginsMock;

            app.init(function(){
                pluginsMock.setup_called.should.be.true;
            })
        })
    })
})