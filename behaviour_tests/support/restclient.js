var restify = require('restify');

module.exports = restify.createJsonClient({
	url: 'http://localhost:4444'
});