'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const http = require('http')
const axios = require('axios')
const admin = require("firebase-admin");
const websearch = require("./websearch.js");

// This makes it crash
//const XMLHttpRequest = require("./xmlhttprequest").XMLHttpRequest
const app = express()


app.set('port', (process.env.PORT || 5000))

// Allows us to process data
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

// ROUTES
app.get('/', function (req, res) {

    res.send("Hi I am a chatbot")
})

let token = "EAAbqignfEwoBABzHXXS2GtsYwdf1vKXVg7Rbin0ycwg7N4eAsSllEeBETKsH50KjtZBWAXjvpmXhM9dOCkSMxsHTYM8V6cuKoPgQIOQDqsnXijfivqWejpP9wDskcZBZBeIsEX8B9vpvaFe1wtadWLhzM9kXTCpkarYPUe74QZDZD"

// Facebook
app.get('/webhook/', function (req, res) {
    if (req.query['hub.verify_token'] === "yoloswag") {
        res.send(req.query['hub.challenge'])
    }
    res.send("Wrong token")
})

app.get('/test/', function (req, res) {
    res.send(websearch.test())
})


function sendPosition(sender, lon, lat) {
    // Todo
}

function addMemory(sender, mem) {
    // Todo
}

function eniro(sender, search) {
    let profile = 'Hedlundaren'
    let key = '6958719642243260042'
    let url = 'https://api.eniro.com/cs/search/basic?profile=' + profile + '&key=' + key + '&country=se&version=1.1.3&search_word=' + search + '&geo_area=linkoping'
    let text = ''
    axios
        .get(url)
        .then(({data}) => {
            text += 'Totalt: ' + data.adverts.length.toString() + 'st\n'
            for (let i = 0; i < data.adverts.length; i++) {
                text += (i + 1) + '. 🏯 \n' + data.adverts[i].companyInfo.companyName + '\n'
                if (!data.adverts[i].address.streetName || data.adverts[i].address.streetName === ' ')
                    text += 'Saknar gatuadress.\n'
                else
                    text += data.adverts[i].address.streetName + '\n'
                if (data.adverts[i].phoneNumbers.length > 0 || data.adverts[i].phoneNumbers[0] === ' ')
                    text += data.adverts[i].phoneNumbers[0].phoneNumber + '\n'
                else text += 'Saknar telefon.\n'
            }
            sendText(sender, text.substring(0, 620))
        })
        .catch((err) => {
        })
}

function inspiringQuote(sender) {
    let url = 'https://api.forismatic.com/api/1.0/?method=getQuote&format=json&jsonp=parseQuote&lang=en'
    axios
        .get(url)
        .then(({data}) => {
            let text = ''
            if (data.quoteAuthor) text += data.quoteText + '\n-' + data.quoteAuthor
            else text += data.quoteText + '\n-Unknown'
            sendText(sender, text)
        })
        .catch((err) => {
        })
}

function yesNoImageURL(sender) {
    let url = 'https://yesno.wtf/api/'

    axios
        .get(url)
        .then(({data}) => {

            sendImage(sender, data.image)
        })
        .catch((err) => {
        })
}

function sendUglyImage(sender) {

    let url = 'https://graph.facebook.com/' + sender + '?access_token=' + token
    axios
        .get(url)
        .then(({data}) => {
            sendImage(sender, data.profile_pic)
        })
        .catch((err) => {
        })
}

function inSpace(sender) {
    let url = 'http://api.open-notify.org/astros.json'

    axios
        .get(url)
        .then(({data}) => {
            let space_people = '';
            space_people += 'Totalt: ' + data.number + 'st \n'
            for (let i = 0; i < data.number; i++) {
                space_people += (i + 1) + '. ' + data.people[i].name + '\n'
            }
            sendText(sender, space_people)
        })
        .catch((err) => {
        })
}

function howManyJobs(sender) {
    let url = 'https://feeds.mynetworkglobal.com/json/linkoping'
    axios
        .get(url)
        .then(({data}) => {
            sendText(sender, data.positions.length.toString() + ' lediga jobb.')
        })
        .catch((err) => {
        })
}

function getJobs(sender) {
    let url = 'https://feeds.mynetworkglobal.com/json/linkoping'
    axios
        .get(url)
        .then(({data}) => {

            let job_list = ""
            for (let i = 0; i < data.positions.length; i++) {
                job_list += (i + 1) + '. ' + data.positions[i].jobtype.name + '\n'
            }
            sendText(sender, job_list.substring(0, 620))

        })
        .catch((err) => {
        })
}

function getClosestBusStop(sender) {
    let lat = 58.417467
    let lon = 15.51318
    let url = 'https://api.resrobot.se/v2/location.nearbystops?key=d3065482-2d49-42bf-abfc-28d7eb387ec1&originCoordLat=' + lat + '&originCoordLong=' + lon + '&format=json'
    axios
        .get(url)
        .then(({data}) => {
            sendText(sender, data.StopLocation[0].name + '. Ligger ' + data.StopLocation[0].dist + 'm bort. ')
        })
        .catch((err) => {
        })
}

function getWeather(sender) {

    58.586802, 16.180616

    let url_malm = 'https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/15.513/lat/58.417/data.json'
    let url_nkpg = 'https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/16.1806/lat/58.5868/data.json'
    axios
        .get(url_nkpg)
        .then(({data}) => {
                let params = data.timeSeries[0].parameters
                let temp, sky, rain, snow, wind, thunder = -1
                let weather_message = ""

                for (let i = 0; i < params.length; i++) {
                    if (params[i].name === "t") { // Temperature
                        temp = params[i].values[0]
                        weather_message += "Just nu är det " + temp + " grader hemma. ";
                    }
                }
                for (let i = 0; i < params.length; i++) {

                    if (params[i].name === "tcc_mean") { // Cloudy
                        sky = params[i].values[0]
                        if (sky < 3) weather_message += "☀"
                        else if (sky < 6) weather_message += "⛅"
                        else weather_message += "☁"
                    } else if (params[i].name === "pmean") { // Rain
                        rain = params[i].values[0]
                        if (rain > 0) weather_message += "☔"
                    } else if (params[i].name === "ws") { // Wind
                        wind = params[i].values[0]
                        if (wind > 5) weather_message += "💨"
                    } else if (params[i].name === "tstm") {  // Thunder
                        thunder = params[i].values[0]
                        if (thunder > 50) weather_message += "⚡"
                    }
                }

                if (temp < 0 && rain > 0) {
                    snow = rain
                    rain = 0
                    if (snow > 0) weather_message += "❄⛄"
                }

                sendText(sender, weather_message)
            }
        )
        .catch((err) => {
        })
}

// Get user info
function getSenderInfo(sender) {

    let url = 'https://graph.facebook.com/' + sender + '?access_token=' + token
    axios
        .get(url)
        .then(({data}) => {

            let first_name = data.first_name
            let last_name = data.last_name
            let profile_pic = data.profile_pic
            let locale = data.locale
            let timezone = data.timezone
            let gender = data.gender

            sendText(sender, "Hej, " + first_name + ". :)\n")
        })
        .catch((err) => {
        })
}

// Handling incoming messages
app.post('/webhook/', function (req, res) {
    let messaging_events = req.body.entry[0].messaging
    for (let i = 0; i < messaging_events.length; i++) {
        let event = messaging_events[i]
        let sender = event.sender.id

        if (event.message && event.message.text) {

            let text = event.message.text.substring(0, 300).toLowerCase()
            let words = text.split(' ')
            let answer = ''

            if (words[0] === "hej" || words[0] === "tja" || words[0] === "yo")
                getSenderInfo(sender)
            else if (words[0] === "v" || words[0] === "väder")
                getWeather(sender)
            else if (words[0] === "vgd" || words[0] === "vgd?")
                sendText(sender, "Inget, sj? 🐣")
            else if (words[0] === "käften" || words[0] === "håll")
                sendText(sender, "Amen durå!")
            else if ((words[0] === "vart" || words[0] === "var") && (words[1] === "är" || words[1] === "e") && (words[2] === "jag" || words[2] === "jag?"))
                sendText(sender, "I livet: Dina bästa år. \nI världen: Här. ")
            else if ((words[0] === "vart" || words[0] === "var") && (words[1] === "är" || words[1] === "e") && (words[2] === "simon" || words[2] === "simon?" || words[2] === "kicken" || words[2] === "kicken?"))
                sendText(sender, "Hos din mamma💃")
            else if ((words[0] === "vart" || words[0] === "var") && (words[1] === "är" || words[1] === "e") && (words[2] === "albin" || words[2] === "albin?"))
                sendText(sender, "Seglar säkert⛵")
            else if ((words[0] === "vart" || words[0] === "var") && (words[1] === "är" || words[1] === "e") && (words[2] === "sandra" || words[2] === "sandra?" || words[2] === "bajs" || words[2] === "bajs?"))
                sendText(sender, "Styrelsemöte.")
            else if ((words[0] === "vart" || words[0] === "var") && (words[1] === "är" || words[1] === "e"))
                sendText(sender, "Fråga Reidar, han känner nog nån som vet.")
            else if (words[0] === "jobb")
                howManyJobs(sender)
            else if (words[0] === "lista")
                getJobs(sender)
            else if (words[0] === "buss")
                getClosestBusStop(sender)
            else if (words[0] === "space")
                inSpace(sender)
            else if (words[0] === "bild")
                sendImage(sender, "https://www.zoo.se/media/catalog/product/cache/2/image/9df78eab33525d08d6e5fb8d27136e95/k/a/kanin_utsida_3.jpg")
            else if (words[0] === "yesno")
                yesNoImageURL(sender)
            else if (words[0] === "ful")
                sendUglyImage(sender)
            else if (words[0] === "insp" || words[0] === "inspirera")
                inspiringQuote(sender)
            else if (words[0] === "e" || words[0] === "eniro" || words[0] === "sök")
                eniro(sender, words[1])
            else
                sendText(sender, "Va? 8-)")

            switch (words[0]) {
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


function httpRequest() {


}

function sendText(sender, text) {
    let messageData = {text: text}
    request({
        url: "https://graph.facebook.com/v2.6/me/messages",
        qs: {access_token: token},
        method: "POST",
        json: {
            recipient: {id: sender},
            message: messageData
        }
    }, function (error, response, body) {
        if (error) {
            console.log("sending error")
        } else if (response.body.error) {
            console.log("response body error")
        }
    })
}

function sendImage(sender, imageURL) {
    request({
        url: "https://graph.facebook.com/v2.6/me/messages",
        qs: {access_token: token},
        method: "POST",
        json: {
            recipient: {id: sender},
            message: {
                attachment: {
                    type: "image",
                    payload: {
                        url: imageURL
                    }
                }
            }
        }
    }, function (error, response, body) {
        if (error) {
            console.log("sending error")
        } else if (response.body.error) {
            console.log("response body error")
        }
    })
}

app.listen(app.get('port'), function () {
    console.log("running: port")
})

