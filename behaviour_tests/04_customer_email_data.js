var restClient = require('./support/restclient'),
	should 	   = require('should'),
	dataPool   = require('./support/dataLoader'),
	accessToken, data;

describe('Customer email data from database', function(){
	before(function(done){
		dataPool.getDataSet("customer", function(err, res){
			data = res;
			done()
		})
	})

	after(function(done){
		done()
	})


	it('Get Mail summary',function(done){
		restClient.get(
			'/GetMailSummary?customer='+ data[0].CustomerCode,
			function(err, req, res, obj){
				if(err){ throw(err) }
					console.log(obj)
					// obj.DeletedSizeMB.should.equal(data.MailSummaryDeletedSizeMB.valid[0])
					// obj.Number.should.equal(data.MailSummaryNumber.valid[0])
					// obj.SizeMB.should.equal(data.MailSummarySizeMB.valid[0])
					// obj.TotalSizeMB.should.equal(data.MailSummaryTotalSizeMB.valid[0])
					done()
			}
		)
	})

	it('Get Mailbox list',function(done){
		restClient.get(
			'/ListMailboxes?customer='+ data[0].CustomerCode,
			function(err, req, res, obj){
				if(err){ throw(err) }
					console.log(obj)
				// obj.value[0].ActiveSyncEnabled.should.equal(data.MBActiveSyncEnabled.valid[0])
				// obj.value[0].Alias.should.equal(data.MBAlias.valid[0])
				// obj.value[0].CustomerCode.should.equal(data.MBCustomerCode.valid[0])
				// obj.value[0].DeletedItemCount.should.equal(data.MBDeletedItemCount.valid[0])
				// obj.value[0].DisplayName.should.equal(data.MBDisplayName.valid[0])
				// obj.value[0].EmailAddresses.should.equal(data.MBEmailAddresses.valid[0])
				// obj.value[0].GUID.should.equal(data.MBGUID.valid[0])
				// obj.value[0].IssueWarningQuota.should.equal(data.MBIssueWarningQuota.valid[0])
				// obj.value[0].ItemCount.should.equal(data.MBItemCount.valid[0])
				// obj.value[0].MailDatabase.should.equal(data.MBMailDatabase.valid[0])
				// obj.value[0].MapiEnabled.should.equal(data.MBMapiEnabled.valid[0])
				// obj.value[0].Name.should.equal(data.MBName.valid[0])
				// obj.value[0].OWAEnabled.should.equal(data.MBOWAEnabled.valid[0])
				// obj.value[0].PrimarySMTPAddress.should.equal(data.MBPrimarySMTPAddress.valid[0])
				// obj.value[0].ProhibitSendQuota.should.equal(data.MBProhibitSendQuota.valid[0])
				// obj.value[0].ProhibitSendReceiveQuota.should.equal(data.MBProhibitSendReceiveQuota.valid[0])
				// obj.value[0].TotalDeletedSIzeMB.should.equal(data.MBTotalDeletedSIzeMB.valid[0])
				// obj.value[0].TotalItemSizeMB.should.equal(data.MBTotalItemSizeMB.valid[0])
				// obj.value[0].TotalSizeMB.should.equal(data.MBTotalSizeMB.valid[0])

				// obj.value[1].ActiveSyncEnabled.should.equal(data.MBActiveSyncEnabled.valid[1])
				// obj.value[1].Alias.should.equal(data.MBAlias.valid[1])
				// obj.value[1].CustomerCode.should.equal(data.MBCustomerCode.valid[1])
				// obj.value[1].DeletedItemCount.should.equal(data.MBDeletedItemCount.valid[1])
				// obj.value[1].DisplayName.should.equal(data.MBDisplayName.valid[1])
				// obj.value[1].EmailAddresses.should.equal(data.MBEmailAddresses.valid[1])
				// obj.value[1].GUID.should.equal(data.MBGUID.valid[1])
				// obj.value[1].IssueWarningQuota.should.equal(data.MBIssueWarningQuota.valid[1])
				// obj.value[1].ItemCount.should.equal(data.MBItemCount.valid[1])
				// obj.value[1].MailDatabase.should.equal(data.MBMailDatabase.valid[1])
				// obj.value[1].MapiEnabled.should.equal(data.MBMapiEnabled.valid[1])
				// obj.value[1].Name.should.equal(data.MBName.valid[1])
				// obj.value[1].OWAEnabled.should.equal(data.MBOWAEnabled.valid[1])
				// obj.value[1].PrimarySMTPAddress.should.equal(data.MBPrimarySMTPAddress.valid[1])
				// obj.value[1].ProhibitSendQuota.should.equal(data.MBProhibitSendQuota.valid[1])
				// obj.value[1].ProhibitSendReceiveQuota.should.equal(data.MBProhibitSendReceiveQuota.valid[1])
				// obj.value[1].TotalDeletedSIzeMB.should.equal(data.MBTotalDeletedSIzeMB.valid[1])
				// obj.value[1].TotalItemSizeMB.should.equal(data.MBTotalItemSizeMB.valid[1])
				// obj.value[1].TotalSizeMB.should.equal(data.MBTotalSizeMB.valid[1])

				// obj.Count.should.equal(data.MBListCount.valid[0])
				done()

			}
		)
	})


	it('Get Mail Contact list',function(done){
		restClient.get(
			'/ListContacts?customer='+ data[0].CustomerCode,
			function(err, req, res, obj){
				if(err){ throw(err) }
					console.log(obj)
					// obj.value[0].Alias.should.equal(data.MCAlias.valid[0])
					// obj.value[0].CustomerCode.should.equal(data.MCCustomerCode.valid[0])
					// obj.value[0].ExternalEmailAddress.should.equal(data.MCExternalEmailAddress.valid[0])
					// obj.value[0].Name.should.equal(data.MCName.valid[0])
					// obj.value[0].PrimarySMTPAddress.should.equal(data.MCPrimarySMTPAddress.valid[0])

					// obj.value[1].Alias.should.equal(data.MCAlias.valid[1])
					// obj.value[1].CustomerCode.should.equal(data.MCCustomerCode.valid[1])
					// obj.value[1].ExternalEmailAddress.should.equal(data.MCExternalEmailAddress.valid[1])
					// obj.value[1].Name.should.equal(data.MCName.valid[1])
					// obj.value[1].PrimarySMTPAddress.should.equal(data.MCPrimarySMTPAddress.valid[1])
					
					// obj.Count.should.equal(data.MCListCount.valid[0])
					done()
			}
		)
	})

	it('Get list of distribution lists',function(done){
		restClient.get(
			'/ListDlists?customer='+ data[0].CustomerCode,
			function(err, req, res, obj){
				if(err){ throw(err) }
					console.log(obj)
					// obj.value[0].Alias.should.equal(data.DlistsAlias.valid[0])
					// obj.value[0].CustomerCode.should.equal(data.DlistsCustomerCode.valid[0])
					// obj.value[0].DisplayName.should.equal(data.DlistsDisplayName.valid[0])
					// obj.value[0].Name.should.equal(data.DlistsName.valid[0])
					// obj.value[0].PrimarySMTPAddress.should.equal(data.DlistsPrimarySMTPAddress.valid[0])
					// obj.value[0].SamAccountName.should.equal(data.DlistsSamAccountName.valid[0])

					// obj.value[1].Alias.should.equal(data.DlistsAlias.valid[1])
					// obj.value[1].CustomerCode.should.equal(data.DlistsCustomerCode.valid[0])
					// obj.value[1].DisplayName.should.equal(data.DlistsDisplayName.valid[1])
					// obj.value[1].Name.should.equal(data.DlistsName.valid[1])
					// obj.value[1].PrimarySMTPAddress.should.equal(data.DlistsPrimarySMTPAddress.valid[1])
					// obj.value[1].SamAccountName.should.equal(data.DlistsSamAccountName.valid[1])
				
					// obj.Count.should.equal(data.DlistsListCount.valid[0])
					done()
			}
		)
	})
})

