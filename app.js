var express     = require("express"),
    app         = express(),
    request    = require("request"),
    API_KEY     = "da4254d7814a3d40182b22afc4f8a7e5862367bd63716f28a";

app.set("view engine", "ejs");

app.get("/", function (req, res) {
    res.render("search");
});

app.get("/results", function (req, res) {
    var wordToSearch = req.query.word;
    var url = "https://api.wordnik.com/v4/word.json/" + wordToSearch +
    "/definitions?limit=200&includeRelated=false&useCanonical=false&includeTags=false&api_key=" + API_KEY;

    request(url, function (error, response, body) {
        var data = JSON.parse(body);

        if(!error && response.statusCode === 200) {
            res.render("results",{
                data:data, 
                word: wordToSearch
            })
        } else {
            console.log("error: ", error);
        }
    })

})


app.listen(process.env.PORT || 8080, process.env.IP || "localhost", function () {
    console.log("Online dictionary application started...")
});