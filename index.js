var restify = require('restify');
var builder = require('botbuilder');
var fs = require('fs');

// Load the http module to create an http server.
var httpServer = require("./httpServer.js");

//=========================================================
// Bot Setup
//=========================================================

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function() {
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
    function(session) {
        if (!session.userData.userName) {
        	// user is visiting first time, ask user his name
            builder.Prompts.text(session, "Hello, what is your name?");
        } else {
        	// user has visited earlier, begin welcome dialog
            session.beginDialog('/Welcome');
        }
    },
    //save user name to json file and set dialog data
    function(session, results) {
        var string = "{\"name\":\"" + results.response + "\"}";
        fs.writeFile('./data/name.json', string, function(err) {
            if (err) return console.log(err);
        });
        session.userData.userName = results.response;
        // begin welcome dialog
        session.beginDialog('/Welcome');
    }
]);

bot.dialog('/Welcome', [
    function(session) {
    	// welcome user and introduce bot
        var prompt = "Hello " + session.userData.userName + ", I am a pizza bot. I can help you place your order.\n\nPlease type menu or profile for options.";
        builder.Prompts.text(session, prompt);
    },
    function(session, results) {
        session.endDialog('You have selected %s.', results.response);
    }
]);

// run HTTP server. This server is responsible for website
httpServer.runServer();
