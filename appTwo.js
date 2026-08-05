const http = require("http");
const url = require("url");
const dns = require("node:dns");

dns.setServers(["1.1.1.1", "8.8.8.8"]);

const fs = require("fs");
const readline = require("readline");
const MongoClient = require('mongodb').MongoClient;
const mongoURL = "mongodb+srv://cschad01_db_user:0Y1OTOiX4ERfdpFg@cluster0.ujctirb.mongodb.net/?retryWrites=true&w=majority";

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

    MongoClient.connect(mongoURL, function(err, db) {

        if (err) {
            console.log("Connection error: " + err);
            res.end("Database connection error");
            return;
        }

        console.log("Connected to MongoDB");

       let dbo = db.db("MassZips");
       let collection = dbo.collection("places");
       let theQuery;

    //    checl to see if the first character is a number
    // if it is then its a zip code
        if (!isNaN(search.charAt(0))) {
            console.log("Searching by ZIP code");
            theQuery = { zips: search };
        }
        // serachign by place
        else {
            console.log("Searching by place");
            theQuery = { place: search };
        }

        collection.find(theQuery).toArray(function(err, items) {

            if (err) {
                console.log("Search error: " + err);
                res.write("<h2>Database search error</h2>");
            }

            // if nothing is returned then nothing was found
            else if (items.length == 0) {
                console.log("No matching place or ZIP code was found.");
                res.write("<h2>No match found</h2>");
            }
            else {
                // print out and log the place with the associated zip codes.
                for (let i = 0; i < items.length; i++) {
                    console.log("Place: " + items[i].place);
                    console.log("ZIP codes: " + items[i].zips.join(", "));

                    res.write("<h2>" + items[i].place + "</h2>");
                    res.write(
                        "<p>ZIP Codes: " +
                        items[i].zips.join(", ") +
                        "</p>"
                    );
                }
            }
            res.end();
            db.close();
        });
    });
}

}).listen(port);

console.log("Server running on port " + port);
