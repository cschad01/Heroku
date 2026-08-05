const http = require("http");
const url = require("url");

var port = process.env.PORT || 3000;
// var port = 8080;   // Uncomment if running locally

console.log("Server starting...");

http.createServer(function(req, res) {

    res.writeHead(200, {"Content-Type": "text/html"});

    // Home page
    if (req.url == "/") {

        res.write("<html>");
        res.write("<body>");

        res.write("<h1>Massachusetts Place/ZIP Search</h1>");
        // submit action that opens the process page
        res.write("<form action='/process' method='get'>");

        // text input for us to serach after
        res.write("Enter a place or zip code: ");
        res.write("<input type='text' name='search'>");

        res.write("<input type='submit' value='Search'>");

        res.write("</form>");
        res.write("</body>");
        res.write("</html>");

        res.end();
    }

    // Process page
    else if (req.url.startsWith("/process")) {

        let query = url.parse(req.url, true).query;
        let search = query.search;

        console.log("User entered: " + search);

        // see if the first character the user entered is a number
        if (!isNaN(search.charAt(0))) {
            console.log("Searching by ZIP code");
        }
        else {
            console.log("Searching by place");
        }

        res.write("<h2>Search received.</h2>");
        res.write("<p>Check the console for the results.</p>");
        res.end();
    }

}).listen(port);

console.log("Server running on port " + port);
