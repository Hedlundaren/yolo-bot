'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()
const http = require('http')

app.set('port', (process.env.PORT || 5000))

// Allows us to process data
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

// ROUTES
app.get('/', function(req, res){
    res.send("Hi I am a chatbot")
})

let token = "EAAbqignfEwoBABzHXXS2GtsYwdf1vKXVg7Rbin0ycwg7N4eAsSllEeBETKsH50KjtZBWAXjvpmXhM9dOCkSMxsHTYM8V6cuKoPgQIOQDqsnXijfivqWejpP9wDskcZBZBeIsEX8B9vpvaFe1wtadWLhzM9kXTCpkarYPUe74QZDZD"

// Facebook
app.get('/webhook/', function(req, res){
    if(req.query['hub.verify_token'] === "yoloswag"){
        res.send(req.query['hub.challenge'])
    }
    res.send("Wrong token")
})


function getWeather(sender_id){

    let url = "https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/15.513/lat/58.417/data.json"
    getJSON(url,
        function(err, data) {
            if (err !== null) {
                console.log('Could not find data.')
            } else {
                sendText(sender_id, data.approvedTime)
            }
        });
}

let getJSON = function(url, callback) {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
        let status = xhr.status;
        if (status === 200) {
            callback(null, xhr.response);
        } else {
            callback(status);
        }
    };
    xhr.send();
};



// Get user info
function getSenderInfo(sender){

    let path = 'https://graph.facebook.com/' + sender + '?access_token=' + token

    let static_person = {
        "first_name": "Simon",
        "last_name": "Hedlund",
        "profile_pic": "https://scontent.xx.fbcdn.net/v/t31.0-1/p720x720/10571916_10202977758112166_356411672595479729_o.jpg?oh=b35a6213528fefa2f43e77f3e79a03db&oe=5A2D2531",
        "locale": "en_PI",
        "timezone": 2,
        "gender": "male"
    }

    sendText(sender, static_person.first_name)

}

// Handling incoming messages
app.post('/webhook/', function(req, res){
    let messaging_events = req.body.entry[0].messaging
    for(let i = 0; i < messaging_events.length; i++){
        let event = messaging_events[i]
        let sender = event.sender.id
        let time = event.sender.timestamp

        if(event.message && event.message.text){

            let text = event.message.text.substring(0,100)
            let words = text.split(' ')
            let answer = "Hej, " + words[0] + ". Trevligt.\n"
            getWeather(sender)

            switch(words[0]){
                case "happy":
                    answer += ":)"
                    break
                case "sad":
                    answer += ":("
                    break
                case "angry":
                    answer += ">:("
                    break
                case "thumb":
                    answer += "(Y)"
                    break
                case "cool":
                    answer += "8-)"
                    break
                case "love":
                    answer += "<3"
                    break
                case "peace":
                    answer += "✌"
                    break
                case "sun":
                    answer += "☀"
                    break
                case "partsun":
                    answer += "⛅"
                    break
                case "cloud":
                    answer += "☁"
                    break
                case "rain":
                    answer += "☔"
                    break
                case "snow":
                    answer += "❄⛄"
                    break
                case "windy":
                    answer += "💨"
                    break
                case "lightning":
                    answer += "⚡"
                    break
                default:
                    break;
            }
            sendText(sender, answer)
        }
    }
    res.sendStatus(200)
})


function sendText(sender, text){
    let messageData = {text: text}
    request({
        url: "https://graph.facebook.com/v2.6/me/messages",
        qs: {access_token : token},
        method: "POST",
        json: {
            recipient: {id: sender},
            message: messageData
        }
    }, function(error, response, body){
        if(error){
            console.log("sending error")
        } else if(response.body.error){
            console.log("response body error")
        }
    })
}

app.listen(app.get('port'), function(){
    console.log("running: port")
})

