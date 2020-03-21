const express = require('express')
const app = express()

// constants
PORT = 3000

// config
app.use(express.json())


app.get('/', function (req, res) {
    res.send('This is the fulfillment service for the localho(r)st chatbot!')
})

app.post('/localhorst-bot-fulfilment', function (req, res) {
    console.log('received post call with json')
    res.json(req.body)
})

console.log(`running on ${PORT}`)
app.listen(PORT)
