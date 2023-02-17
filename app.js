const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');
const { url } = require('inspector');

const app = express();

// load static files folder
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// request the home "/" route
app.get('/', function (req, res) {
    res.sendFile(__dirname + "/signup.html");
})

app.post('/', function (req, res) {
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);
    const url = 'https://us18.api.mailchimp.com/3.0/lists/d62bcb715c';
    const options = {
        method: 'POST',
        auth: 'ADD_YOUR_API_KEY'
    }

    const request = https.request(url, options, function (respone) {
        if (respone.statusCode === 200) {
            res.sendFile(__dirname + '/success.html');
        } else {
            res.sendFile(__dirname + '/failure.html');
        }

        respone.on('data', function (data) {
            console.log(JSON.parse(data));
        })
    })


    // Write data to request body
    request.write(jsonData);
    request.end();
});

app.post('/failure', function (req, res) {
    res.redirect('/');
})

app.listen(process.env.PORT || 3000, function () {
    console.log('Server is running on port 3000.')
})
