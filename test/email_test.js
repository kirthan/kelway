var EmailModel = require('../src/plugins/email'),
	// Mock = require('./mock'),
	Mock = require('nodemock')
	should = require('should');

suite("Send Email",function(){
	
	test("Invalid Email Template",function(done){
		var arr =[{
			"SMTP": {
				"SERVICE": "Gmail",
				"AUTH":{
					"USER": "abhiadds@gmail.com",
					"PASS": "indianabhi"
				}
			} 
		}];
		arr = arr.shift();

		var appMock = Mock.mock("get").takes('EMAIL_TEMPLATE_DIR').returns("./dummy/").times(2);
		 	appMock.mock("get").takes('EMAIL').returns(arr).times(2);
		var emailModel = new EmailModel(appMock);
			emailModel.sendMail("dummy","","subject","omega.chetan@gmail.com","chetan");
			appMock.assert();
			done();
	})


	test("Valid Scenario",function(done){
		var arr =[{
			"SMTP": {
				"SERVICE": "Gmail",
				"AUTH":{
					"USER": "abhiadds@gmail.com",
					"PASS": "indianabhi"
				}
			} 
		}];
		arr = arr.shift();

		var appMock = Mock.mock("get").takes('EMAIL_TEMPLATE_DIR').returns("./temp_files/").times(2);
		 	appMock.mock("get").takes('EMAIL').returns(arr).times(2);
		var emailModel = new EmailModel(appMock);
			emailModel.sendMail("dummy","","subject","omega.chetan@gmail.com","chetan");
			appMock.assert();
			done();
	})

	test("InValid Email Settings",function(done){
		var arr =[{
			"SMTP": {
				"SERVICE": "Gmail",
				"AUTH":{
					"USER": "dummy@gmail.com",
					"PASS": "dummy"
				}
			} 
		}];
		arr = arr.shift();

		var appMock = Mock.mock("get").takes('EMAIL_TEMPLATE_DIR').returns("./temp_files/").times(2);
		 	appMock.mock("get").takes('EMAIL').returns(arr).times(2);
		var emailModel = new EmailModel(appMock);
			emailModel.sendMail("dummy","","subject","omega.chetan@gmail.com","chetan");
			appMock.assert();
			done();
	})
})

	