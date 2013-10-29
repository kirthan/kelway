//     Nimsoft API Handler
//     
//     This Module is responsible for handling Nimsoft API
//     
//     @package    ServiceApp Plugins
//     @module     Nimsoft API Handler
//     @author     Abhilash Hebbar

function NimsoftAPI(config){
  var disabled = false;
  
  //  *** `public` disable : *** Function to disable Nimsoft API call
  this.disable = function () {
    disabled = true;
  }

  //  *** `public` enable : *** Function to enable Nimsoft API call
  this.enable = function(){
    disabled = false;
  }

  //  *** `public` request : *** Function to Nimsoft response for the 
  // Given method, path and options
  this.request = function(path,method,options,callback){
    if(config.DISABLED){
      callback({}); // Send blank object directly if disabled.
      return;
    }
    var http = require('http');
    var reqOpts = {
      host    : config.HOST,
      port    : config.PORT,
      path    : config.BASE_PATH + path,
      method  : method.toUpperCase(),
      headers : config.HEADERS,
      auth    : config.AUTH.USER + ':' + config.AUTH.PASS
    }
    var callbackCalled = false;
    var req = http.request(reqOpts,function(response){
      var data = "";
      
      response.on('data',function(result){
        data += result.toString();
      });

      response.on('end',function(){
        try{
          var jsonResult = JSON.parse(data);
          callbackCalled = true;
        }catch(e){
          console.log("Exception",e,e.stack);
          console.log('Cannot fetch data for "' + reqOpts.path + '"');
          if(!callbackCalled){
            callbackCalled = true;
            callback([])
          }
          return;
        }
        callback(jsonResult);
      })
      
      response.on('error',function(err){
        console.log(err);
        if(!callbackCalled){
          callbackCalled = true;
          callback([])
        }
      });
    });
    if(config.TIMEOUT){
      req.on('socket', function (socket) {
        socket.setTimeout(config.TIMEOUT);  
        socket.on('timeout', function() {
          req.abort();
          console.log("Request timed out");
        });
      });
    }
    req.on('error',function(err){
      console.log(err.name + ' - ' + err.message);
      callback([]);
    });
    req.end();
  }
}

module.exports = NimsoftAPI;
