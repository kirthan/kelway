var Router = require('../src/lib/router/setup'),
    Mock = require('./mock'),
    nodemock = require('nodemock'),
    should = require('should');

suite("Router setup [JSON Based]",function(){
    var router, appMock, serverMock, fsMock, authMock;

    setup(function(){
        appMock         = nodemock.mock("get").takes('ROUTER_DIR').returns( __dirname + '/mock/router/').times(10);
        appMock.mock("get").takes('ROUTE_CONFIG_FILES').returns(["dummy"]).times(10);
        responseMock    = new Mock(['send1']);
        requestMock     = new Mock(['']);
        nextMock        = new Mock(['']);
        authMock        = nodemock.mock("authorise").takes("SuperAdmin","",responseMock).calls(1, [false, null]).times(6);
        appMock.auth    = authMock;
        serverMock      = nodemock.mock("get").takes("/version", function(requestMock, responseMock, nextMock){
        }).returns().times(6); 
        serverMock.mock("post").takes("/version", function(requestMock, responseMock, nextMock){}).returns().times(6); 
        serverMock.mock("head").takes("/version", function(requestMock, responseMock, nextMock){}).returns().times(6); 
    })

    suite("Negative tests",function(){
        test("Invalid module",function(){
            // TODO: Asynchronous exception handling. Not sure how.
            // router = new Router(__dirname + '/tmp/router_invalid_module.json');
            // (function(){ router.setup() }).should.throw();
        })
        test("Invalid method",function(){
            // TODO: Asynchronous exception handling. Not sure how.
        })
    })

    suite("Route execution",function(){
        test("GET Request",function(done){
            fsMock = new Mock([{
                name: 'readFile',
                callback_args: [null,'{"/version":{"module":"dummy","authorisation":"SuperAdmin"}}']
            }])
            router = new Router(fsMock);
            router.setup(appMock,serverMock,function(){
                // serverMock.get_called.should.be.true;
                done();
            })
        })

        test("POST Request",function(done){
            fsMock = new Mock([{
                name: 'readFile',
                callback_args: [null,'{"/version":{"module":"dummy","req_method":"post","authorisation":"SuperAdmin"}}']
            }])
            router = new Router(fsMock);
            router.setup(appMock,serverMock,function(){
                // serverMock.post_called.should.be.true;
                done();
            })
        })

        test("HEAD Request",function(done){
            fsMock = new Mock([{
                name: 'readFile',
                callback_args: [null,'{"/version":{"module":"dummy","req_method":"head","authorisation":"SuperAdmin"}}']
            }])
            router = new Router(fsMock);
            router.setup(appMock,serverMock,function(){
                // serverMock.head_called.should.be.true;
                done();
            })
        })
    })

    suite('Authorisation',function(){
        test('Valid GET',function(done){
            fsMock = new Mock([{
                name: 'readFile',
                callback_args: [null,'{"/version":{"module":"dummy","authorisation":"SuperAdmin"}}']
            }])
            router = new Router(fsMock);
            router.setup(appMock,serverMock,function(){
                // authMock.authorise_called.should.be.true;
                done();
            })
        })
        test('Valid POST',function(done){
            fsMock = new Mock([{
                name: 'readFile',
                callback_args: [null,'{"/version":{"module":"dummy","authorisation":"SuperAdmin","req_method":"post"}}']
            }])
            router = new Router(fsMock);
            router.setup(appMock,serverMock,function(){
                // authMock.authorise_called.should.be.true;
                done();
            })
        })

        test('Valid HEAD',function(done){
            fsMock = new Mock([{
                name: 'readFile',
                callback_args: [null,'{"/version":{"module":"dummy","authorisation":"SuperAdmin","req_method":"head"}}']
            }])
            router = new Router(fsMock);
            router.setup(appMock,serverMock,function(){
                // authMock.authorise_called.should.be.true;
                done();
            })
        })
    })
})