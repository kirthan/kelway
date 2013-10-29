var substitute = require('../src/lib/substitute'),
	Mock = require('./mock'),
	should = require('should');

suite('Substitution',function(){
	var appMock;
	setup(function(){
		appMock = new Mock([{name:'get',return_value:'DUMMY'}]);
	})

	test('Single Substitution',function(){
		substitute(appMock,'${ANYTHING}').should.equal('DUMMY');
	})

	test('Multiple Substitution',function(){
		var val = substitute(appMock,["${ANYTHING}", "${ANYTHING}"]);
		val[0].should.equal('DUMMY');
	})
})