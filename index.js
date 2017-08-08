'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const http = require('http')
const axios = require('axios')
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

app.get('/test/', function(req, res){
    let url = 'https://graph.facebook.com/1375896805858790?access_token=' + token

    axios
        .get(url)
        .then(({ data })=> {

            res.send(data)
        })
        .catch((err)=> {})
})


function getWeather(sender){
    let url = 'https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/15.513/lat/58.417/data.json'
    axios
        .get(url)
        .then(({ data })=> {
            let params = data.timeSeries[0].parameters
            let temp, sky, rain, snow, wind, thunder = -1
            let weather_message = ""

            for(let i = 0; i < params.length; i++){
                if(params[i].name === "t"){ // Temperature
                    temp = params[i].values[0]
                    weather_message += "Just nu är det " + temp + " grader hemma.";
                }else if(params[i].name === "tcc_mean"){ // Cloudy
                    sky = params[i].values[0]
                    if(sky < 3) weather_message += "☀"
                    else if(sky < 3) weather_message += "⛅"
                    else weather_message += "☁"
                }else if(params[i].name === "pmean"){ // Rain
                    rain = params[i].values[0]
                    if(rain < 3) weather_message += "☔"
                }else if(params[i].name === "ws"){ // Wind
                    wind = params[i].values[0]
                    if(wind > 5) weather_message += "💨"
                }else if(params[i].name === "tstm"){  // Thunder
                    thunder = params[i].values[0]
                    if(thunder > 50) weather_message += "⚡"
                }
            }

            if(temp < 0 && rain > 0){
                snow = rain
                rain = 0
                if(snow > 0) weather_message += "❄⛄"
            }

            sendText(sender, weather_message)


        })
        .catch((err)=> {})
}

// Get user info
function getSenderInfo(sender){

    let path = 'https://graph.facebook.com/' + sender+ '?access_token=' + token
    axios
        .get(url)
        .then(({ data })=> {

            let first_name = data.first_name
            let last_name = data.last_name
            let profile_pic = data.profile_pic
            let locale = data.locale
            let timezone = data.timezone
            let gender = data.gender

            sendText(sender, "Hi, " + first_name + ". \n")
        })
        .catch((err)=> {})

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

            getSenderInfo(sender)
            if(words[0] === "v"){
                getWeather(sender)
            }

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

