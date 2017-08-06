'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')

const app = express()

app.set('port', (process.env.PORT || 5000))

// Allows us to process data
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

// ROUTES
app.get('/', function(req, res){
    res.send("Hi I am a chatbot")
})

//let token = "EAAbqignfEwoBAByuzb8lqhRlZCjqmKZBhr7FjSMDPcK9DZBU9xHAR1IXcZA47ehTG0t2849WRBjh1DTL026rNQ1rZCIDgavqC280vEtHrg1ZBq6dRgtDSQc8CIbwGMOAoZBBh90ZAZBmkyT3Y9lISFV1OT66t2fSZAlj1SGuZBAOhUSkAZDZD"
let token = "EAAbqignfEwoBAKgmfV5aIjnnhKNjXFzGQnK2lHJn69u6AoIgAjp65ZC8HYCsHTkpllK5oZCAMVsZBNzowiy5ZBowpN3mXPERnrBoI0gpuDCO2AggN1RrIB3QJVzHE9kKrsHskJSRx0ZA8sjPS60MVZAZAnsjzrmnX22FEPYh4Aw7gZDZD"
// Facebook
app.get('/webhook/', function(req, res){
    if(req.query['hub.verify_token'] === "yoloswag"){
        res.send(req.query['hub.challenge'])
    }
    res.send("Wrong token")
})



app.post('/webhook/', function(req, res){
    let messaging_events = req.body.entry[0].messaging
    for(let i = 0; i < messaging_events.length; i++){
        let event = messaging_events[i]
        let sender = event.sender.id
        if(event.message && event.message.text){
            let text = event.message.text
            sendText(sender, "Text echo: " + text.substring(0, 100))
        }
    }
    res.sendStatus(200)
})

function sendText(sender, text){
    let messageData = {text: text}
    request({
        url: "https://yolo-bot.herokuapp.com/",
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

