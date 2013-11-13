var restify = require('restify')
  , moment = require('moment');

var server = restify.createServer({});

server.get('.*',function(req, res) {
  var data = []
    , baseValue = parseInt(Math.random() * 80);

  for (var i = 0; i < 20; i++) {
    var sampleValue = parseInt(Math.random() * 20) + baseValue
      , sampleTime = moment().subtract('hours',i)
      , formattedTime = sampleTime.format('YYYY-DD-MM') + 'T' + sampleTime.format('hh:mm:ss') + 'Z';
    data.push({samplevalue: sampleValue, sampletime:sampleTime})
  };
  res.send({data:data});
})

server.listen('3000');
