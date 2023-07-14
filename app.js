const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const dotenv = require('dotenv');
const app = express();
dotenv.config();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.get("/",function(req,res){
    res.sendFile(__dirname + "/index.html");
})

app.post("/",function(req,res){
    const email  = req.body.email;
    // console.log(email);

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed"
            }
            
        ]
    };

    const jsonData = JSON.stringify(data);

    const url = `${process.env.URL}` ;

    const options = {
        method: "POST",
        auth: `${process.env.AUTH}`
    }
    const request = https.request(url,options, function(response){

        if(response.statusCode===200){
            res.sendFile(__dirname + "/success.html");
        }
        else res.sendFile(__dirname + "/failure.html");

        response.on("data",function(data){
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);
    request.end();

});

app.post("/failure",function(req,res){
    res.redirect("/");
})
app.listen(3000,function(){
    console.log("Server started at port 3000.");
});

// API key: f534c86d4b3f45ba246bb8c2fec4a57f-us21
// Audience ID: dfa1f2552c