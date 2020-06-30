const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')

const port = process.env.PORT || 3000

const publicPath = path.join(__dirname,'../public/')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

app.use(express.static(publicPath))


io.on('connection', (socket) => {
    console.log('New WebSocket connected')

    socket.emit('message', 'Welcome to Chat App!')
    socket.broadcast.emit('message', 'A new user has joined.')

    socket.on('disconnect', (socket) => {
        io.emit('message', 'A user has left.')
    })

    socket.on('sendMessage', (message, acknowledge) => {

        const filter = new Filter()

        if (filter.isProfane(message)) {
            return acknowledge('Profanity is not allowed.')
        }

        io.emit('message',message)
        acknowledge()
    })

    socket.on('sendLocation', (location, acknowledge) => {
        io.emit('locationMessage', `https://google.com/maps?q=${location.latitude},${location.longitude}`)
        acknowledge()
    })

})



server.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})