var CsvUserInfo = require('../src/lib/user_info/csv_user_info'),
	Mock = require('./mock'),
	should = require('should');

var fsMockValid;

suite("Login",function(){
	test("Valid User",function(done){
		fsMockValid = new Mock([
			{
				name:'readFile',
				callback_args:[
					null,
					"ID,Name,Email,Password,Roles\n1,somename,someemail@email.com,somepassword,admin|superAdmin\n2,somename2,someemail2@email.com,somepassword2,admin|superAdmin"
				]
			}
		]);
		
		CsvUserInfoObj = new CsvUserInfo('',fsMockValid);
		
		CsvUserInfoObj.login('somename','somepassword', function(loginsuccess, uid){
			loginsuccess.should.be.true;
			uid.should.equal('1');
			done();
		});
	})

	test("Invalid User",function(done){

		fsMockValid = new Mock([
			{
				name:'readFile',
				callback_args:[
					null,
					"ID,Name,Email,Password,Roles\n1,somename,someemail@email.com,somepassword,admin\n2,somename2,someemail2@email.com,somepassword2,admin"
				]
			}
		]);
		
		CsvUserInfoObj = new CsvUserInfo('',fsMockValid);
		
		CsvUserInfoObj.login('someothername','someotherpassword', function(loginsuccess, uid){
			loginsuccess.should.be.false;
			should.not.exist(uid);
			done();
		});
	})
})

suite("Get Roles",function(){
	test("Valid User",function(done){
		fsMockValid = new Mock([
			{
				name:'readFile',
				callback_args:[
					null,
					"ID,Name,Email,Password,Roles\n1,somename,someemail@email.com,somepassword,admin|superAdmin\n2,somename2,someemail2@email.com,somepassword2,admin|superAdmin"
				]
			}
		]);

		CsvUserInfoObj = new CsvUserInfo('',fsMockValid);

		CsvUserInfoObj.getRoles('1', function(roles){
			roles[0].should.equal('admin');
			done();
		});
	})

	test("Invalid User",function(){

	})
})

suite("Get Info",function(){
	test("Valid User",function(done){

		fsMockValid = new Mock([
			{
				name:'readFile',
				callback_args:[
					null,
					"ID,Name,Email,Password,Roles\n1,somename,someemail@email.com,somepassword,admin|superAdmin\n2,somename2,someemail2@email.com,somepassword2,admin|superAdmin"
				]
			}
		]);

		CsvUserInfoObj = new CsvUserInfo('',fsMockValid);

		CsvUserInfoObj.getDetails('1', function(userDetail){
			userDetail.should.have.property('Name', 'somename');
			userDetail.Roles[0].should.equal('admin');
			done();
		});
	})

	test("Invalid User",function(){

	})
})