var LoginRoute = require('../src/router/login'),
	Mock = require('./mock'),
	should = require('should');

var authMock,appMock, loginRoute;

suite("Login",function(){
	
	test("Valid User",function(){
		var authMock = new Mock([
			{
				name:'login',
				callback_args:[
					true,
					"dummy",
					"dummy",
					"dummy",
					"dummy"
				]
			}
		]),
		appMock ={ auth : authMock },
		reqMock = new Mock([]);
		reqMock.params = {
			user : '',
			pass : ''
		}

		loginRoute = new LoginRoute(appMock);
		loginRoute.login(reqMock, function(err, res){
			res.status.should.equal('success');
		});
	})

	test("Valid User",function(){
		var authMock = new Mock([
			{
				name:'login',
				callback_args:[
					false,
					"dummy",
					"dummy",
					"dummy",
					"dummy"
				]
			}
		]),
		appMock ={ auth : authMock },
		reqMock = new Mock([]);
		reqMock.params = {
			user : '',
			pass : ''
		}

		loginRoute = new LoginRoute(appMock);
		loginRoute.login(reqMock, function(err, res){
			res.status.should.equal('failed');
		});
	})
})

suite("Log out",function(){
	test("Valid User",function(){
		var authMock = new Mock([
			{
				name:'logout',
				callback_args:[
				]
			}
		]),
		appMock ={ auth : authMock },
		reqMock = new Mock([]);
		reqMock.query = {
			access_token : 'dummy'
		};
		
		loginRoute = new LoginRoute(appMock);
		loginRoute.logout(reqMock, function(){
			authMock.logout_called.should.be.true;
		});
	})
})

suite("Get Roles",function(){
	test("Valid User",function(){
		var authMock = new Mock([
			{
				name:'getRoles',
				callback_args:[
				true
				]
			}
		]),
		appMock ={ auth : authMock },
		reqMock = new Mock([]);
		reqMock.query = {
			access_token : ''
		};
		
		loginRoute = new LoginRoute(appMock);
		loginRoute.getRoles(reqMock, function(err, res){
			res.status.should.equal('success');
		});
	})

	test("Valid User",function(){
		var authMock = new Mock([
			{
				name:'getRoles',
				callback_args:[
				false
				]
			}
		]),
		appMock ={ auth : authMock },
		reqMock = new Mock([]);
		reqMock.query = {
			access_token : ''
		};
		
		loginRoute = new LoginRoute(appMock);
		loginRoute.getRoles(reqMock, function(err, res){
			res.status.should.equal('failed');
		});
	})
})
