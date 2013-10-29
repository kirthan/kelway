//     Nimsoft QOS Cache
//     
//     This module is responsible to make use of memcahed Nimsoft data.
//     
//     @package    ServiceApp Plugins
//     @module     Nimsoft QOS Cache
//     @author     Chethan K
//     @author     Abhilash Hebbar

var NimsoftQOS     	= require('./qos'),
    _ = require('underscore');

function QOSCache(app, qos){
	//  *** `public` powerStats : *** Function to get PowerStats from Cahce
	this.powerStats = function(params,callback){
		qosCache(params, 'POWER', 'powerStats', function(err,params){
			callback(err, params);
		})
	}
	
    //  *** `public` cpuStats : *** Function to get CPU Stats from Cahce
	this.cpuStats = function(params,callback){
  		qosCache(params, 'CPU', 'cpuStats', function(err,params){
			callback(err, params);
		})
    }

    //  *** `public` memoryStats : *** Function to get Memory Stats from Cache
    this.memoryStats = function(params,callback){
      	qosCache(params, 'MEMORY', 'memoryStats', function(err,params){
			callback(err, params);
		})
    }

    //  *** `public` diskStats : *** Function to get Disk Stats from cache
    this.diskStats = function(params,callback){
      	qosCache(params, 'DISK', 'diskStats', function(err,params){
			callback(err, params);
		})
    }

    //  *** `public` diskIopStats : *** Function to get Disk IopStats from Cache
    this.diskIopStats = function(params,callback){
     	qosCache(params, 'DISKIOP', 'diskIopStats', function(err,params){
			callback(err, params);
		})
    }	

    //  *** `public` qosCache : *** Generic method to handle all the cahce data
    function qosCache(params, qosName, method, callback){
    	var cache = app.plugins.cache;
		cache.get(getCacheKey(params,qosName), function(err, data){
            if(!data){
            	qos[method](params,function(err,newData){
            		console.log("Got QOS data From API");
            		callback(err, newData)
            		reloadCache(params, newData, qosName);
            	})
            } else {
		        callback(null,data)
		        cache.get(getCacheKey(params,qosName) + 'dummy', function(err, dummyData){
		        	if(!dummyData){
		        		qos[method](params,function(err,newData){
		        			reloadCache(params, newData, qosName);
            			})
		        	}
		        })
            }
        });
    }

    //  *** `private` name : *** function to reload cache
    function reloadCache(params, newData, qosName){
    	var cache = app.plugins.cache,
            cacheLifetime = app.get('MEMCACHE_NIMSOFT_DATA_TOTAL_LIFETIME'),
            cacheReloadTime = app.get('MEMCACHE_NIMSOFT_DATA_LOADING_LIFETIME');
    	cache.set(getCacheKey(params,qosName), newData, cacheLifetime,function(){})
		cache.set(getCacheKey(params,qosName) + 'dummy', 'dummy_data', cacheReloadTime,function(){})
    }

    //  *** `private` name : *** Function to get Cahce key
    function getCacheKey(params,qosName){
        return params.nimsoft_id + qosName
    }
}

module.exports = QOSCache;