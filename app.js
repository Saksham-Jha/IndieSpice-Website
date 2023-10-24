const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const dotenv = require('dotenv');
const app = express();
dotenv.config();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res) {
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                "merge_fields": {}
            }
        ]
    };

    const jsonData = JSON.stringify(data);

    const url = `${process.env.URL}`;

    const options = {
        method: "POST",
        auth: `${process.env.AUTH}`
    };

    const request = https.request(url, options, function (response) {
        let responseData = '';

        response.on("data", function (chunk) {
            responseData += chunk;
        });

        response.on("end", function () {
            try {
                const parsedData = JSON.parse(responseData);
                console.log(parsedData);

                if (response.statusCode === 200) {
                    res.sendFile(__dirname + "/success.html");
                } else {
                    res.sendFile(__dirname + "/failure.html");
                }
            } catch (error) {
                console.error("Error parsing JSON:", error);
                res.sendFile(__dirname + "/failure.html"); // Handle parsing error
            }
        });
    });

    request.write(jsonData);
    request.end();
});

app.post("/failure", function (req, res) {
    res.redirect("/");
});

app.listen(3000, function () {
    console.log("Server started at port 3000.");
});
