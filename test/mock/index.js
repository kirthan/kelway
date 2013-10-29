var _ = require('underscore');

module.exports = function(functs,properties){

	this.addFunct = function(name,retval,callback_args){
		this[name] = function(){
			var callback = arguments[arguments.length - 1]; // Assume last function is the callback
			this[ name + '_called' ] = true;
			if(retval) return retval;
			if(typeof callback === 'function') callback.apply(callback,callback_args);
		}
	}


	for (var i = 0; i < functs.length; i++) {
		var fnDesc = functs[i];
		if(_.isString(fnDesc)){
			this.addFunct(fnDesc);
		} else {
			this.addFunct(fnDesc.name,fnDesc.return_value,fnDesc.callback_args);
		}
	};
}