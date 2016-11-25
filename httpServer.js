exports.runServer = function() {
	// Load the http module to create an http server.
var http = require('http');
var fs = require('fs');

    // Configure our HTTP server to respond with Hello World to all requests.
    var httpServer = http.createServer(function(request, response) {
        response.writeHead(200, {
            "Content-Type": "text/plain"
        });
        var content = fs.readFileSync("./data/name.json");
        var jsonContent = JSON.parse(content);
        response.end("User Name: " + jsonContent.name);
    });

    // Listen on port 8000, IP defaults to 127.0.0.1
    httpServer.listen(8000);

    // Put a friendly message on the terminal
    console.log("Server running at http://127.0.0.1:8000/");
}