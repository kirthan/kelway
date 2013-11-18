var restify = require('restify')
  , moment = require('moment');

var server = restify.createServer({}), baseValue;

server.get('.*',function(req, res) {
  var data = [] ;
    var baseValue = getBaseValue(req.url);

    for (var i = 0; i < 20; i++) {
      var sampleValue = parseInt(Math.random() * 10) + baseValue
        , sampleTime = moment().subtract('hours',i)
        , formattedTime = sampleTime.format('YYYY-DD-MM') + 'T' + sampleTime.format('hh:mm:ss') + 'Z';
      data.push({samplevalue: sampleValue, sampletime:sampleTime})
    };
    
    res.send({data:data});

})


getBaseValue = function(pathname){
  var lowWorkLoad           = 10,
      intermittentWorkLoad  = 30,
      mediumWorkLoad        = 50,
      heavyWorkLoad         = 90;

  var defaultServerValues = {
    "sql01" : {
      "C%3A%5C%2FFree%2B(in+%2525+of+Capacity)" : 60,
      "CPU+Usage+(Average%2FRate)" : lowWorkLoad,
      "Memory%20Usage" : lowWorkLoad,
      "Virtual%20Disks%2Fscsi0%3A0%2FDisk%20Average%20Read%20Requests%20Per%20Second" : lowWorkLoad
    },
     "sql02" : {
      "C%3A%5C%2FFree%2B(in+%2525+of+Capacity)" : 60,
      "CPU+Usage+(Average%2FRate)" : lowWorkLoad,
      "Memory%20Usage" : lowWorkLoad,
      "Virtual%20Disks%2Fscsi0%3A0%2FDisk%20Average%20Read%20Requests%20Per%20Second" : lowWorkLoad
    },
     "app01" : {
      "C%3A%5C%2FFree%2B(in+%2525+of+Capacity)" : 40,
      "CPU+Usage+(Average%2FRate)" : intermittentWorkLoad,
      "Memory%20Usage" : intermittentWorkLoad,
      "Virtual%20Disks%2Fscsi0%3A0%2FDisk%20Average%20Read%20Requests%20Per%20Second" : intermittentWorkLoad
    },
     "web01" : {
      "C%3A%5C%2FFree%2B(in+%2525+of+Capacity)" : 45,
      "CPU+Usage+(Average%2FRate)" : mediumWorkLoad, 
      "Memory%20Usage" : mediumWorkLoad,
      "Virtual%20Disks%2Fscsi0%3A0%2FDisk%20Average%20Read%20Requests%20Per%20Second" : mediumWorkLoad
    },
     "dc01" : {
      "C%3A%5C%2FFree%2B(in+%2525+of+Capacity)" : 30,
      "CPU+Usage+(Average%2FRate)" : mediumWorkLoad,
      "Memory%20Usage" : mediumWorkLoad,
      "Virtual%20Disks%2Fscsi0%3A0%2FDisk%20Average%20Read%20Requests%20Per%20Second" : mediumWorkLoad
    },
     "erp01" : {
      "C%3A%5C%2FFree%2B(in+%2525+of+Capacity)" : 68,
      "CPU+Usage+(Average%2FRate)" : mediumWorkLoad,
      "Memory%20Usage" : mediumWorkLoad,
      "Virtual%20Disks%2Fscsi0%3A0%2FDisk%20Average%20Read%20Requests%20Per%20Second" : mediumWorkLoad
    },
     "pay01" : {
      "C%3A%5C%2FFree%2B(in+%2525+of+Capacity)" : 85,
      "CPU+Usage+(Average%2FRate)" : heavyWorkLoad,
      "Memory%20Usage" : heavyWorkLoad,
      "Virtual%20Disks%2Fscsi0%3A0%2FDisk%20Average%20Read%20Requests%20Per%20Second" : heavyWorkLoad
    },
     "hr01" : {
      "C%3A%5C%2FFree%2B(in+%2525+of+Capacity)" : 81,
      "CPU+Usage+(Average%2FRate)" : heavyWorkLoad,
      "Memory%20Usage" : heavyWorkLoad,
      "Virtual%20Disks%2Fscsi0%3A0%2FDisk%20Average%20Read%20Requests%20Per%20Second" : heavyWorkLoad
    },
     "sap01" : {
      "C%3A%5C%2FFree%2B(in+%2525+of+Capacity)" : 85,
      "CPU+Usage+(Average%2FRate)" : heavyWorkLoad,
      "Memory%20Usage" : heavyWorkLoad,
      "Virtual%20Disks%2Fscsi0%3A0%2FDisk%20Average%20Read%20Requests%20Per%20Second" : heavyWorkLoad
    },
     "tst01" : {
      "C%3A%5C%2FFree%2B(in+%2525+of+Capacity)" : 90,
      "CPU+Usage+(Average%2FRate)" : heavyWorkLoad,
      "Memory%20Usage" : heavyWorkLoad,
      "Virtual%20Disks%2Fscsi0%3A0%2FDisk%20Average%20Read%20Requests%20Per%20Second" : heavyWorkLoad
    }
  }
  var pathArray = pathname.split("/")
    , baseValue, serverType = pathArray[6].split('-')[1]
   
    if(serverType && defaultServerValues[serverType] && pathArray[7] && defaultServerValues[serverType][pathArray[7]]){
      baseValue = defaultServerValues[serverType][pathArray[7]]
    }else {
      baseValue = parseInt(Math.random() * 80);
    }
  return baseValue;
}

server.listen('3000');
