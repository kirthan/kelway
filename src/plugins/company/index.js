//     Company
//     
//     This Module is mainly responsible for before/after actions,
//     associated with company model and also basic CRUD operations. 
//     
//     @package    ServiceApp Plugins
//     @module     Company
//     @author     Chethan K

var CompanyModel = require('./model');

function Company(app){
    //  *** `private` companyModel : *** Holds company model object
    var companyModel = CompanyModel(app);

    //  *** `public` getCompany : *** Function to get company details, Given ID
    this.getCompany = function(companyID, callback){

        companyModel.findOne({_id:companyID }, function(err,companyDetails){
            if(err){
                throw new Error('Cannot Find company. ' + err);
            }
            if(companyDetails){
                callback(companyDetails);
            }else {
                callback(false);
            }
        });
    }

    //  *** `public` addCompany : *** Function to add new company
    this.addCompany = function(params, callback){

        companyModel(params).save(function(err,company){
            if(err){
                throw new Error('Cannot save company. ' + err);
            }
            callback(company);
        });
    }
}

module.exports = Company;

