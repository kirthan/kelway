//     Nimsoft QOS
//     
//     This module is responsible to make a call to Nimsoft API handler 
//     
//     @package    ServiceApp Plugins
//     @module     Nimsoft QOS
//     @author     Abhilash Hebbar

var _ = require('underscore');

function NimsoftQOS (apiConfig, nimsoftAPI, NimsoftTime) {
    
    //  *** `private` formatSample : *** Function to format sample data
    function formatSample(sample){
        var retval = {},
        time = NimsoftTime.formatTo(sample.sampletime,'DD/MM/YYYY HH:mm');
        retval['time'] = time;
        retval['value'] = sample.samplevalue;
        return retval;
    }

    //  *** `public` powerStats : *** Function to get Power stats from Nimsoft API
    this.powerStats = function(origParams,callback){
      getQOS('POWER',origParams.nimsoft_id,function(data){
        var status = data.shift(),
            params = {};
        if(status && status.samplevalue > 0){
            params.power_status = 'online';
        }else{
            params.power_status = 'offline';
        }
        callback(null,params);
      })
    }

  //  *** `public` cpuStats : *** Function to  get CPU stats from Nimsoft API 
  this.cpuStats = function(origParams,callback){
      getQOS('CPU',origParams.nimsoft_id,function(data){
        var sampleValues = _.map(data,formatSample),
            params = {};
        params.cpu_usage = sampleValues;
        callback(null,params);
      })
    }

    //  *** `public` memoryStats : *** Function to get Memory stats from Nimsoft API
    this.memoryStats = function(origParams,callback){
      getQOS('MEMORY',origParams.nimsoft_id,function(data){
        var sampleValues = _.map(data,formatSample),
            params = {};
        params.memory_usage = sampleValues;
        callback(null,params);
      })
    }

    //  *** `public` diskStats : *** Function to get Disk stats from Nimsoft API
    this.diskStats = function(origParams,callback){
      getQOS('DISK',origParams.nimsoft_id,function(data){
        var sampleValues = _.map(data,formatSample),
            params = {};
        params.disk_usage = sampleValues;
        callback(null,params);
      })
    }

    //  *** `public` diskIopStats : *** Function to get DiskIopStats from Nimsoft API
    this.diskIopStats = function(origParams,callback){
      getQOS('DISKIOP',origParams.nimsoft_id,function(data){
        var sampleValues = _.map(data,formatSample),
            params = {};
        params.diskIop_usage = sampleValues;
        callback(null,params);
      })
    }

    //  *** `public` getQOS : *** Function to get QOS data from Nimsoft API
    function getQOS(qosName,nimsoftID,callback){
      console.log("Getting "+ qosName +" QOS data for '" + nimsoftID + "'...");

      // var nimsoftAPI = new NimsoftAPI(apiConfig),
        var qosURL = "/qos/data/name/" + apiConfig.QOS[qosName].NAME + 
              '/' + nimsoftID + '/' + apiConfig.QOS[qosName].TARGET +
              '/lastday/now/0'; // get them all + apiConfig.NO_SAMPLES;

      console.log('QOS Data URL: ' + qosURL);

        nimsoftAPI.request(qosURL,'get',{},function(res){
          if(!res.data){
            console.log('Got Blank data from QOS for url ' + qosURL);
            callback([]);
          }else{
            callback(_.last(res['data'],apiConfig.NO_SAMPLES));
          }
        });
    }
}

module.exports = NimsoftQOS;