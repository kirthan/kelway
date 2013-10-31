var CustomerModel = require('./model');


function Customer(app){
    
    var customerModel = CustomerModel(app);
    
    this.getParams = function(params, callback){
		params.Code = params.CustomerCode;
		delete(params.CustomerCode);
		callback(null, params)
    }
}

module.exports = Customer;