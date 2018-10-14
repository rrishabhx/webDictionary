var express = require("express"),
    app = express(),
    request = require("request"),
    API_KEY = "da4254d7814a3d40182b22afc4f8a7e5862367bd63716f28a";

app.set("view engine", "ejs");
app.set("port", process.env.PORT || 8080);
app.use(express.static(__dirname + "/public"));

//Root route
app.get("/", function(req, res) {
    var url = "https://api.wordnik.com/v4/words.json/wordOfTheDay?api_key=" + API_KEY;
    
    request(url, function(error, response, body) {
        var data = JSON.parse(body);

        if(!error && response.statusCode === 200) {
            if(data.length === 0) {
                res.send("No results found");
            } else {
                res.render("search", {data: data});
            }
        }
    });

});

//Results route
app.get("/results", function(req, res) {
    var wordToSearch = req.query.word;
    console.log("Word to search = " + wordToSearch);
    var resultsJson = {};
    var urlDef = "https://api.wordnik.com/v4/word.json/" + wordToSearch +
        "/definitions?limit=200&includeRelated=false&useCanonical=false&includeTags=false&api_key=" + API_KEY;

    var urlExamples = "https://api.wordnik.com/v4/word.json/" + wordToSearch + 
        "/examples?includeDuplicates=false&useCanonical=false&limit=5&api_key=" + API_KEY;

    console.log("====================================================");
    console.log("Def URL: " + urlDef);
    console.log("Examples URL: " + urlExamples);
    console.log("====================================================");


    //GET definitions
    request(urlDef, function (error, response, body) {
        var definitions = JSON.parse(body);
        if (!error && response.statusCode === 200) {
            if (definitions.length === 0) {
                res.render("noresults.ejs", {wordToSearch: wordToSearch});
            } else {
                resultsJson.definitions = definitions;
                resultsJson.word = wordToSearch;
                //GET examples
                request(urlExamples, function(errorE, responseE, bodyE) {
                    var exampleData = JSON.parse(bodyE);

                    if (!errorE && responseE.statusCode === 200) {
                        if (exampleData.length === 0) {
                            res.send("No results found");
                        } else {
                            resultsJson.examples = exampleData["examples"];
                            console.log("Results Json: " + JSON.stringify(resultsJson));
                            //Sending response
                            res.render("results", {
                                resultsJson: resultsJson
                            });
                        }
                    } else {
                        console.log("error: ", error);
                    }
                });
            }
        } else {
            console.log("error: ", error);
        }
    });

});

app.listen(app.get("port"), function() {
    console.log("Online dictionary application started on IP-PORT:", app.get("port"));
});
