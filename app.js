const express = require("express")
const bp = require("body-parser")
const request = require("request")
const https = require("https")

const app = express();

app.use(bp.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
})

app.post("/", function (req, res) {
    let fName = req.body.fname;
    let lName = req.body.lname;
    let email = req.body.email;

    let data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: fName,
                    LNAME: lName
                }
            }
        ]
    }
    const jsonData = JSON.stringify(data);
    const url = "https://us8.api.mailchimp.com/3.0/lists/ea3c6b1939";
    const options = {
        method: "POST",
        auth: "deepak:800c18fb7bb88dc5869374ec7a215c01-us8"
    }
    const request = https.request(url, options, function (response) {
        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        }
        else {
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", function (data) {
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);
    request.end();
});

app.post("/failure", function (req, res) {
    res.redirect("/");
})

app.listen(3000, function () {
    console.log("server is running")
})


// 800c18fb7bb88dc5869374ec7a215c01-us8
// https://us6.mailchimp.com/account/api/
// ea3c6b1939.