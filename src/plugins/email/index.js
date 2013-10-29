//     Email
//     
//     This Module is responsible for sending an email, 
//	   Given necessary inputs like To, From, Subject etc..
// 	   It is a generic function used by all the Email related actions 
//		
//     
//     @package    ServiceApp Plugins
//     @module     Email
//     @author     Abhilash Hebbar

var nodemailer = require("nodemailer"),
	m    	   = require('mustache'),
	fs 		   = require('fs'),
	moment	   = require('moment');

function MailService(app){
	//  *** `private` smtp : *** Holds smtp details taken from configuration.
	var smtp = app.get('EMAIL').SMTP,
	smtpOpts, // container to hold smtp host and port number
	mailService = this; // local reference to the same object
	
	if(smtp.SERVICE){ // Two ways to access smtp protocol
		smtpOpts = {
			service : smtp.SERVICE,
			auth	: {
				user: smtp.AUTH.USER,
				pass: smtp.AUTH.PASS
			}
		}
	}else{
		smtpOpts = {
			host: smtp.HOST,
			port: smtp
		}
	}
	
	//  *** `private` smtpTransport : *** nodejs counter part of smtp protocol
	var smtpTransport = nodemailer.createTransport("SMTP",smtpOpts);

	//  *** `private` sendMail : *** Send Email by processing the given details
	this.sendMail = function(template, params, subject, toEmail, toName, errCount){
		
		fs.readFile(app.get('EMAIL_TEMPLATE_DIR') + template + '.html', function(err,data){
			if(err){
				console.log('Cannot read Template. File - ' + 	// Get Email template 
					app.get('EMAIL_TEMPLATE_DIR') + template + '.html');
				return;
			}
			//  *** `private` html : *** mustache rendering of the given html template
			var html = m.to_html(data.toString(), params);

			//  *** `private` mailOptions : *** Holds necessary details to send a mail to given recepient
			var mailOptions = { 
			    from    : '"Kelway" <' + app.get('EMAIL').FROM + '>',
				to      : '"' + toName + '"<' + toEmail + '>',
				subject : subject,
				html    : html
			}

			smtpTransport.sendMail(mailOptions,function(err,res){ // sendmail is an utility function from nodemailer
				if(err){
					if(errCount && errCount >= app.get('EMAIL').RETRY_COUNT){ // check for the failure count and retry sending accordingly
						console.log('Problem sending email.',err);
						var fileData = 'To: ' + toName + '<' + toEmail + '>' + "\n";
						fileData += 'Time: ' + moment().format('DD/MM/YYYY hh:mm:ss') + "\n";
						fileData += 'Subject: ' + subject + "\n";
						fileData += 'Message: ' + html  + "\n";
						var filename = app.get('FAILED_EMAILS_DIR') + '/' + moment().format('YYYYMMDD hh:mm:ss') + '.log';
						fs.writeFile(filename,fileData,function(err){
							// do nothing :)
						})
					}
					else{
						console.log('Email not sent. Will retry again. (To: ' + toName + '<' + toEmail + '>)');

						setTimeout(function(){
							if(errCount){
								errCount++;
							} 
							else{
								errCount = 1;
							} 
							mailService.sendMail(template, params, subject, toEmail, toName, errCount)
						},app.get('EMAIL').RETRY_INTERVAL * 1000) // Retry interval in seconds
					}
				} 
				else{
					console.log('Email sent. To: ' + toName + '<' + toEmail + '>');
				} 
			})
		})
	}
}

module.exports = MailService;