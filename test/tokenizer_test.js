var Tokenizer 	= require('../src/lib/tokenizer'),
	Mock 		= require('./mock'),
	should 		= require('should'),
	md5 		= require('MD5'),
	fs 			= require('fs');

var tokenizerObj, appMock, fsMockValid, validUserInfoMock;
suite("Create Token",function(){
	test("Writable FS",function(done){
		fsMockValid = new Mock([
			{
				name:'writeFile',
				return_value: null
			}
		]);
		
		appMock = new Mock([
			{name:'get', return_value: 1 }
		]);

		tokenizerObj = new Tokenizer(appMock, fsMockValid);
		tokenizerObj.createToken( '' ,function(token){
			fsMockValid.writeFile_called.should.be.true;
			done();
		})
	})
})

suite("Validate Token",function(){
	test("Valid Test",function(done){

		fsMockValid = new Mock([
			{
				name:'readFile',
				callback_args:[
					null,
					"dummy|dummy"
				]
			}
		]);
		appMock = new Mock([
			{name:'get', return_value: 1 }
		]);

		tokenizerObj = new Tokenizer(appMock, fsMockValid);
		tokenizerObj.validateToken(md5('dummydummy1'),function(isTokenValid){
			isTokenValid.should.be.true;
		})
		done();
	})

	test("Invalid User",function(done){
		done();
	})
})

suite("Destroy Token",function(){
	test("Valid User",function(done){

		appMock = new Mock([
			{name:'get', return_value: 1 }
		]);

		fsMockValid = new Mock([
			{
				name		:'unlink',
				return_value: null
			}
		]);
		tokenizerObj = new Tokenizer(appMock, fsMockValid);
		tokenizerObj.deleteToken( 'token' ,function(isTokenDeleted){
			isTokenDeleted.should.be.true;
			done();
		})
	})

	test("Invalid User",function(done){
		done();
	})
})

suite("Test Is Authorised",function(){
	test("Valid Role",function(done){

		appMock = new Mock([
			{name:'get', return_value: 1 }
		]);

		fsMockValid = new Mock([
			{
				name		:'readFile',
				callback_args:[
					null,
					"dummy|dummy"
				]
			}
		]);
		
		validUserInfoMock = new Mock([
			{	name:'getRoles', 
				callback_args:[[ 'dummyRole' ]
				]
			}
		]);
		tokenizerObj = new Tokenizer(appMock, fsMockValid, validUserInfoMock );
		tokenizerObj.isAuthorised('dummyRole','asd', function(success){
			success.should.be.true;
			done();
		})
	})

	test("Invalid Role",function(done){
		appMock = new Mock([
			{name:'get', return_value: 1 }
		]);

		fsMockValid = new Mock([
			{
				name		:'readFile',
				callback_args:[
					null,
					"dummy|dummy"
				]
			}
		]);
		validUserInfoMock = new Mock([
			{	name:'getRoles', 
				callback_args:[[ 'dummyRole' ]
				]
			}
		]);

		tokenizerObj = new Tokenizer(appMock, fsMockValid, validUserInfoMock );
		tokenizerObj.isAuthorised('SomeOtherdummyRole','asd' ,function(success){
			success.should.be.false;
			done();
		})
	})
})

suite("Test Get User ID",function(){
	test("Valid Token",function(done){
		appMock = new Mock([
			{name:'get', return_value: 1 }
		]);

		fsMockValid = new Mock([
			{
				name		:'readFile',
				callback_args:[
					null,
					"1|dummy"
				]
			}
		]);
		
		validUserInfoMock = new Mock([
			{	name:'getRoles', 
				callback_args:[[ 'dummyRole' ]
				]
			}
		]);
		tokenizerObj = new Tokenizer(appMock, fsMockValid, validUserInfoMock );
		tokenizerObj.getUid(md5('1dummy1'), function(uid){
			uid.should.equal('1');
			done();
		})
	})

	test("Invalid Token",function(done){
		appMock = new Mock([
			{name:'get', return_value: 1 }
		]);

		fsMockValid = new Mock([
			{
				name		:'readFile',
				callback_args:[
					null,
					"1rwer|dummy"
				]
			}
		]);
		
		validUserInfoMock = new Mock([
			{	name:'getRoles', 
				callback_args:[[ 'dummyRole' ]
				]
			}
		]);
		tokenizerObj = new Tokenizer(appMock, fsMockValid, validUserInfoMock );
		tokenizerObj.getUid(md5('1dummy1'), function(uid){
			uid.should.not.equal('1');
			done();
		})
	})
})


