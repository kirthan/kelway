//     Memcached
//     
//     This module is responsible for creating,
//     clear interface for memcahce actions.
//     
//     @package    ServiceApp Plugins
//     @module     Memcached
//     @author     Chethan K


var nMemcached = require('memcached');

function Memcached(app){

    //  *** `private` memVars : *** Holds memcache settings
    var memVars 				= app.get('MEMCACHE'),
    	memcahcedServerExists 	= false,
    	options = 
    	{
	    	timeout: memVars.TIME_OUT,
			retries: memVars.RETRIES
    	},
		memcached = new nMemcached(
	    	memVars.HOST + ":" + memVars.PORT, options
	    );

    //  *** `private` intervalID : *** Holds 'id' for a timer action.
    // 'checkMemcahceServer' function executes on every 1000ms till intervalID is cleared.
    var intervalID = setInterval(function(){
        if(!memcahcedServerExists && !memVars.DISABLED){
            console.log("Check for Memcached Server.");
            checkMemcahceServer(function(){
            })
        } else {
            clearInterval(intervalID);
        }
    }, 1000);

   //  *** `private` checkMemcahceServer : *** Function to check for a memcache server continuously, If it is not UP during start of the application. 
    checkMemcahceServer = function(callback){
        memcached.set("tick","dummy", 10,function (err) {
            if(err){
                console.log("Can not find Memcahce Server.", err);
            } else {
                console.log("Memcached Server Found");
                memcahcedServerExists = true;
                clearInterval(intervalID);
            }
            callback();
        })
    }

    //  *** `private` get : *** Function to get a value from memcache server for a given key
    this.get = function(key, callback){
        if(memcahcedServerExists && !memVars.DISABLED){
            memcached.get(key,function(err, data) {
                if(!err){
                    console.log('Get Data From Cache.', key);
                    callback(err, data);
                } else {
                    callback(true, null)
                }
            })
        }else {
            callback(true, null)
        }
    }

    //  *** `private` set : *** Function to set a key/value to memcache server.
    this.set = function(key, val, lifetime, callback){
        if(memcahcedServerExists && !memVars.DISABLED){
            memcached.set(key, val, lifetime, function(err, data){
                if(!err){
                    console.log('Set Data to Cache.' , key);
                    callback(err, data);
                } else {
                    callback(true, null)
                }
            })
        }else {
            callback(true, null)
        }
    }
}
module.exports = Memcached;