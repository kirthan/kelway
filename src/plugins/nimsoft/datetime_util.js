//     Date Time Utility
//     
//     This Module is responsible for formating Date Time,
// 	   to  get the appropriate response from nimsoft
//     
//     @package    ServiceApp Plugins
//     @module     Date Time Utility
//     @author     Abhilash Hebbar

var moment = require('moment');

module.exports = NimsoftDate = {
	format: function(date){
		if(date instanceof Date){
			date = moment(date);
		}
		return date.format('YYYYDDMMHHmmss');
	},
	formatTo: function(date,format){
		date = moment(date);
		return date.format(format);
	},
	before:function(delta,what){
		return NimsoftDate.format(moment().subtract(what,delta));
	},
	thirtyMinBefore: function(){
		return NimsoftDate.format(moment().subtract('M',30))
    },
	fifteenMinBefore: function(){
		return NimsoftDate.format(moment().subtract('m',15))
    }
}