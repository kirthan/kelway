var Mock = require('./mock');

var myMock = new Mock([
	{name:'asdf',return_value:"abhi"},
	{name:'qwer',callback_args:["i am from callback"]}
]);

console.log(myMock.asdf());
myMock.qwer(function(res){
	console.log(res);
});

console.log(myMock.asdf_called)
console.log(myMock.qwer_called)
var Mock = require('./mock'),
	should = require('should');

setup(function(){
		console.log("setup")
	})
suiteTeardown(function(){
		console.log("teardown")
	})
suite('Substitution',function(){
	var appMock;
	test('Test',function(done){
		console.log('test case');
		done();
	})
	test('Test',function(done){
		console.log('test case');
		done();
	})
	test('Test',function(done){
		console.log('test case');
		done();
	})
})

suite('Substitution',function(){
	var appMock;
	test('Test',function(done){
		console.log('test case');
		done();
	})
	test('Test',function(done){
		console.log('test case');
		done();
	})
	test('Test',function(done){
		console.log('test case');
		done();
	})
})
