//     Login Router
//     
//     @package    ServiceApp Router
//     @module     Login Router
//     @author     Abhilash Hebbar
//     @author     Chethan K
function LoginRoute(app){
	
	//  *** `public` login : *** function to route to login action
	this.login = function(req, callback){
		app.auth.login(req.params.user,req.params.pass,function(success,token,user,company,accountManager){
			if(success){
				var responseObj = {
					status			:'success',
					token 			: token,
					user 			: user,
					customer		: company,
					accountManager	: accountManager
				}
				callback(null, responseObj);
			}else{
				callback(null, {status:'failed'});
			}
		})
	}
	
	//  *** `public` logout : *** function to route to logout action
	this.logout = function(req, callback){
		if(req.query.access_token){
			app.auth.logout(req.query.access_token, function(){
				callback(null, {status:'success'});
			});
		} else {
			callback(null, { errors:['Access token not found'],status:'failed'});
		}
	}
	
	//  *** `public` getRoles : *** function to route to getRoles action
	this.getRoles = function(req, callback){
		app.auth.getRoles(req.query.access_token, function(roles){
			if(roles){
				callback(null, {status:'success', roles:roles});
			}else {
				callback(null, {status:'failed'});
			}
		});
	}
}

module.exports = LoginRoute;