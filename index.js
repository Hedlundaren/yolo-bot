'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const http = require('http')
//var $ = require('jquery')

// This makes it crash
//const XMLHttpRequest = require("./xmlhttprequest").XMLHttpRequest
const app = express()


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


function getWeather(sender){

    let url = 'https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/15.513/lat/58.417/data.json'
    // getJSON(url,
    //     function(err, data) {
    //         if (err !== null) {
    //             console.log('Could not find data.')
    //         } else {
    //             sendText(sender, data.approvedTime)
    //             sendText(sender, data.timeSeries[0].parameters[11].name)
    //             sendText(sender, data.timeSeries[0].parameters[11].values[0])
    //         }
    //     });
    axios
        .get(url)
        .then(({ data })=> {
            sendText(sender, data.approvedTime)
        })
        .catch((err)=> {})

    sendText(sender, "Fint väder")
}

let getJSON = function(url, callback) {
    let XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
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
function getSenderInfo(sender_id){

    let path = 'https://graph.facebook.com/' + sender_id + '?access_token=' + token

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

function randomAnswer(){
    let choice = Math.floor(Math.random() * 3)
    switch(choice){
        case 0:
            sendText(sender, text.substring(0, 100) + "? Skriv något intelligent om du ska föra en konversation med mig.")
            break;
        case 1:
            sendText(sender, "'Jag är en bajskorv och " + text.substring(0, 100) + " är det enda jag kan skriva.'")
            break;
        case 2:
            sendText(sender, "Bara göteborgare kan komma på något så dumt.")
            break;
        default:
            sendText(sender, "YOOO MOTHERFUCKER!")
            break;
    }
}

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

