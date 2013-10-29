//json_reader File No more used

// var ConfReader = require('../src/lib/conf_reader/json_reader'),
//     Mock = require('./mock'),
//     should = require('should');

// suite("Configuration Reader[JSON Based]",function(){
//     var confReader, appMock, fsMockInvalid,fsMockValid;

//     setup(function(){
//         appMock = new Mock(['get','set']);
//         fsMockInvalid = new Mock([{name:'readFile',callback_args:[true,null]}]);
//         fsMockValid = new Mock([{name:'readFile',callback_args:[null,'{"asdf":"qwer"}']}]);
//     });

//     suite("Negative test",function(){
//         test("File not exists",function(){
//             confReader = new ConfReader('', fsMockInvalid, fsMockInvalid);
//             (function(){
//                 confReader.configure(appMock,function(){});
//             }).should.throw()
//         })
//     });

//     suite("Configuration Setup",function(){
//         test("Simple",function(done){
//             confReader = new ConfReader('',fsMockValid, fsMockValid);
//             confReader.configure(appMock,function(){
//                 appMock.set_called.should.be.true;
//                 done();
//             });
//         })
//     });
// })