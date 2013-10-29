var Auth = require('../src/lib/auth'),
	Mock = require('./mock'),
	should = require('should');

var authObj, appMock, validUserInfoMock, inValidUserInfoMock, restifyMock, tokenMock;

suite('Negetive Tests',function(){
	test("Null App",function(){

	})
	
	test("Null Token",function(){
		
	})

	test("Null UserInfo",function(){
		
	})

	test("Not initialized",function(){
		
	})
})

suite("Login",function(){

	test("Valid",function(done){
		appMock = new Mock([
			{name:'get', return_value: 0.01 }
		]);
		tokenMock = new Mock(['createToken',
			{name:'deleteToken',callback_args:[true]}
		]);
		validUserInfoMock = new Mock([
			{name:'login',callback_args:[true,1]}
		]);
		authObj = new Auth(validUserInfoMock, tokenMock);
		authObj.init(appMock);

		authObj.login('','',function(loginsuccess,token){
			loginsuccess.should.be.true;
			validUserInfoMock.login_called.should.be.true;
			tokenMock.createToken_called.should.be.true;
			done();
		})
	});
	
	test("Invalid user",function(done){
		appMock = new Mock([
			{name:'get', return_value: 0.01 }
		]);
		tokenMock = new Mock(['createToken',
			{name:'deleteToken',callback_args:[true]}
		]);
		inValidUserInfoMock = new Mock([
			{name:'login',callback_args:[false,null]}
		]);
		
		authObj = new Auth(inValidUserInfoMock, tokenMock);
		authObj.init(appMock);

		authObj.login('','',function(loginsuccess,token){
			loginsuccess.should.be.false;
			validUserInfoMock.login_called.should.be.true;
			should.not.exist(tokenMock.createToken_called);
			done();
		})
	});

	test("Invalid password",function(){

	});

	test("Auto destroy",function(done){
		appMock = new Mock([
			{name:'get', return_value: 0.01 }
		]);
		tokenMock = new Mock([
			'createToken',
			{name:'deleteToken',callback_args:[true]}
		]);

		validUserInfoMock = new Mock([
			{name:'login',callback_args:[true,1]}
		]);

		authObj = new Auth(validUserInfoMock, tokenMock);
		authObj.init(appMock);

		authObj.login('','',function(loginsuccess,token){
			loginsuccess.should.be.true;
			validUserInfoMock.login_called.should.be.true;
			tokenMock.createToken_called.should.be.true;
			setTimeout(function(){
				tokenMock.deleteToken_called.should.be.true;
				done();
			},20)
		})
	});

	// when setTimout is called make sure that tokenMock.
	//deleeToke is not called

	test("Token Not deleted",function(done){

		appMock = new Mock([
			{name:'get', return_value: 1 }
		]);

		validUserInfoMock = new Mock([
			{name:'getRoles',callback_args:[true,1]}
		]);

		tokenMock = new Mock([
			{name:'deleteToken',callback_args:[true]},
			{name:'isAuthorised',callback_args:[true]}
		]);


		authObj = new Auth(validUserInfoMock, tokenMock);
		authObj.init(appMock);

		var reqMock = new Mock([]),
			resMock = new Mock(['send']),
			nextMock = new Mock(['next']);
			reqMock.query = {
				access_token : "",
			}
		// var authInfo = authObj.authorise("Admin",);

		
		authObj.authorise("Admin",reqMock,resMock,function(){ nextMock.next() });
		nextMock.next_called.should.be.true;
		tokenMock.isAuthorised_called.should.be.true;
		should.not.exist(tokenMock.deleteToken_called);
		done();
	});
	

})

suite("Logout",function(){
	
	test("Valid user",function(done){
		appMock = new Mock([
			{name:'get', return_value: 1 }
		]);
		
		tokenMock = new Mock([
			{name:'deleteToken',callback_args:[true]}
		]);

		validUserInfoMock = new Mock(['dummy']);
		
		authObj = new Auth(validUserInfoMock, tokenMock);
		authObj.init(appMock);

		authObj.logout('', function(logoutSuccess){
			logoutSuccess.should.be.true;
			// validUserInfoMock.logout_called.should.be.true;
			tokenMock.deleteToken_called.should.be.true;
			done();
		})
	});

	test("Is Token Deleted",function(done){
		appMock = new Mock([
			{name:'get', return_value: 1 }
		]);
		
		tokenMock = new Mock([
			{name:'deleteToken',callback_args:[false]}
		]);

		validUserInfoMock = new Mock(['dummy']);
		
		authObj = new Auth(validUserInfoMock, tokenMock);
		authObj.init(appMock);

		authObj.logout('', function(logoutSuccess){
			logoutSuccess.should.be.false;
			// validUserInfoMock.logout_called.should.be.true;
			tokenMock.deleteToken_called.should.be.true;
			done();
		})
	});

})

suite("Authorise",function(){

	test("Authorised",function(){
		
		appMock = new Mock([
			{name:'get', return_value: 1 }
		]);

		validUserInfoMock = new Mock([
			{name:'getRoles',callback_args:[true,1]}
		]);

		tokenMock = new Mock([
			{name:'getToken',callback_args:[true,1]},
			{name:'deleteToken',callback_args:[true]},
			{name:'isAuthorised',callback_args:[true]}
		]);


		authObj = new Auth(validUserInfoMock, tokenMock);
		authObj.init(appMock);

		var reqMock = new Mock([]),
			resMock = new Mock(['send']),
			nextMock = new Mock(['next']);
			reqMock.query = {
				access_token : "",
			}

		authObj.authorise("Admin",reqMock,resMock,function(){ nextMock.next() });
		nextMock.next_called.should.be.true;
	});

	test("Not Authorised",function(){
		
		appMock = new Mock([
			{name:'get', return_value: 1 }
		]);

		validUserInfoMock = new Mock([
			{name:'getRoles',callback_args:[true,1]}
		]);

		tokenMock = new Mock([
			{name:'getToken',callback_args:[true,1]},
			{name:'deleteToken',callback_args:[true]},
			{name:'isAuthorised',callback_args:[false]}
		]);


		authObj = new Auth(validUserInfoMock, tokenMock);
		authObj.init(appMock);

		var reqMock = new Mock([]),
			resMock = new Mock(['send']);
			
			reqMock.query = {
				access_token : "",
			}

		authObj.authorise("Admin",reqMock,resMock,function(success, err){ 
			success.should.be.false;
		});
	});
})

suite("Get Roles",function(){
	
	test("Valid user",function(done){
		appMock = new Mock([
			{name:'get', return_value: 1 }
		]);
		
		tokenMock = new Mock([
			{name:'getUid',callback_args:[1]}
		]);

		validUserInfoMock = new Mock([
			{name:'getRoles',callback_args:[[ 'dummyRole' ]]}
		]);
		
		authObj = new Auth(validUserInfoMock, tokenMock);
		authObj.init(appMock);

		authObj.getRoles('', function(roles){
			roles[0].should.be.equal('dummyRole');
			tokenMock.getUid_called.should.be.true;
			validUserInfoMock.getRoles_called.should.be.true;
			done();
		})
	});

	test("No Roles",function(done){
		appMock = new Mock([
			{name:'get', return_value: 1 }
		]);
		
		tokenMock = new Mock([
			{name:'getUid', callback_args:[1]}
		]);

		validUserInfoMock = new Mock([
			{name:'getRoles',callback_args:[null]}
		]);
		
		authObj = new Auth(validUserInfoMock, tokenMock);
		authObj.init(appMock);

		authObj.getRoles('', function(roles){
			roles.should.be.false;
			tokenMock.getUid_called.should.be.true;
			validUserInfoMock.getRoles_called.should.be.true;
			done();
		})
	});

	test("Invalid User",function(done){
		appMock = new Mock([
			{name:'get', return_value: 1 }
		]);
		
		tokenMock = new Mock([
			{name:'getUid', callback_args:[null]}
		]);

		validUserInfoMock = new Mock([
			{name:'getRoles',callback_args:[null]}
		]);
		
		authObj = new Auth(validUserInfoMock, tokenMock);
		authObj.init(appMock);

		authObj.getRoles('', function(roles){
			roles.should.be.false;
			tokenMock.getUid_called.should.be.true;
			should.not.exist(validUserInfoMock.getRoles_called);
			done();
		})
	});
})


suite("Get User Details",function(){
	
	test("Valid user",function(done){
		appMock = new Mock([
			{name:'get', return_value: 1 }
		]);
		
		tokenMock = new Mock([
			{name:'getUid',callback_args:[1]}
		]);

		validUserInfoMock = new Mock([
			{name:'getDetails',callback_args:[null,true]}
		]);
		
		authObj = new Auth(validUserInfoMock, tokenMock);
		authObj.init(appMock);

		authObj.getUserDetails('', function(userDetails){
			userDetails.should.be.true;
			tokenMock.getUid_called.should.be.true;
			validUserInfoMock.getDetails_called.should.be.true;
			done();
		})
	});

	test("No UID",function(done){
		appMock = new Mock([
			{name:'get', return_value: 1 }
		]);
		
		tokenMock = new Mock([
			{name:'getUid', callback_args:[false]}
		]);

		validUserInfoMock = new Mock([
		]);
		
		validUserInfoMock = new Mock([
			{name:'getDetails',callback_args:[false]}
		]);

		authObj = new Auth(validUserInfoMock, tokenMock);
		authObj.init(appMock);

		authObj.getUserDetails('', function(userDetails){
			userDetails.should.be.false;
			tokenMock.getUid_called.should.be.true;
			done();
		})
	});

	test("Invalid User",function(done){
		appMock = new Mock([
			{name:'get', return_value: 1 }
		]);
		
		tokenMock = new Mock([
			{name:'getUid',callback_args:[1]}
		]);

		validUserInfoMock = new Mock([
			{name:'getDetails',callback_args:[null, false]}
		]);
		
		authObj = new Auth(validUserInfoMock, tokenMock);
		authObj.init(appMock);

		authObj.getUserDetails('', function(userDetails){
			userDetails.should.be.false;
			tokenMock.getUid_called.should.be.true;
			done();
		})
	});
})