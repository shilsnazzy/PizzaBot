var restify = require('restify');
var builder = require('botbuilder');
var fs = require('fs');

//=========================================================
// Bot Setup
//=========================================================

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
  
// Create chat bot
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

//=========================================================
// Bots Dialogs
//=========================================================

bot.dialog('/', [
    function (session) {
        builder.Prompts.text(session, "Hello, What is your name?");
    },
    function (session, results) {
    	var string = "{\"name\":\""+ results.response + "\"}";
   		fs.writeFile('./data/name.json', string, function (err) {
   			if (err) return console.log(err);
   			console.log('Hello World > helloworld.txt');
		}); 	
        session.send('Hello %s!', results.response);
    }
]);
