const express = require('express')
const app = express()

// constants
PORT = 3000


app.get('/', function (req, res) {
    res.send('This is the fulfillment service for the localho(r)st chatbot!')
})

app.post('/localhorst-bot-fulfilment', function (req, res) {
    res.send('This is the fulfillment service for the localho(r)st chatbot!')
})

console.log(`running on ${PORT}`)
app.listen(PORT)
