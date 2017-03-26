'use strict'
const net = require('net')

const port = process.env.PORT || 2323

const server = net.createServer((socket) => {
    console.log('Client connected')
    socket.write('Welcome to the Telnet server!\n')
    socket.on('data', (data) => {
        socket.write(`Message sent from client: ${data}`)
    })
})

server.listen(port)

console.log(`Telnet server started at ${port}`)