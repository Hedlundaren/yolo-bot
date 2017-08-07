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


// Get user info
function getSenderInfo(sender_id){

    // let str = ''
    // let options = {
    //     host: 'https://graph.facebook.com',
    //     path: '/' + sender_id + '?access_token=' + token
    // }
    //
    // let callback = function(response) {
    //
    //     response.on('data', function (chunk) {
    //         str += chunk
    //     })
    //
    //     response.on('end', function () {
    //         console.log(req.data)
    //         console.log(str)
    //         //return str
    //     })

    //}

    //let req = http.request(options, callback).end()
    // console.log(req.data);
    // console.log(str);
    return sender_id
}

// Handling incoming messages
app.post('/webhook/', function(req, res){
    let messaging_events = req.body.entry[0].messaging
    for(let i = 0; i < messaging_events.length; i++){
        let event = messaging_events[i]
        let sender = event.sender.id
        let sender_first_name = event.sender.name()
        let sender_info = getSenderInfo(sender)

        if(event.message && event.message.text){

            let text = event.message.text
            let choice = Math.floor(Math.random() * 3)
            sendText(sender, "Hej, " + sender_first_name + ". Trevligt.");

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

