'use strict'
const net = require('net')

const port = process.env.PORT || 2323
let loggedIn = true

const server = net.createServer((socket) => {
    console.log('Client connected')
    socket.write('Welcome to the Telnet server!\n')
    socket.on('data', (data) => {
        // Checks if Ctrl + C is pressed or else parses data to client
        if(data.toString('hex') === 'fff4fffd06'){
            socket.end()
        } else  {
            socket.write(`${handleData(data)}\n`)
        }
    })
    socket.on('end', () => {
        console.log('Client disconnected')
    })
})

function handleData(data) {
    const command = data.toString().replace(/[\r\n\t]+/, '').trim()

    if(/^>>Login \d+<<$/.test(command)){
        loggedIn = true
        return '>>Login OK<<'
    }
    else if(/^>>Login/.test(command)) {
        // Simulates wrong ID
        return '>>Login failed<<'
    }
    else if(/^>>Logout<<$/.test(command)){
        return '>>Logout OK<<'
    }
    else if(loggedIn){
        let commandMatch

        // Commands available when logged in
        if(commandMatch = /^>>(Set) (\d+) ([01])<<$/g.exec(command)) {
            const [ command, commandType, id, action ] = commandMatch
            return `>>${commandType} OK<<`
        } else if(commandMatch = /^>>(Fade) (\d+) (([01])?(\d)?(\d))<<$/g.exec(command)) {
            const [ command, commandType, id, action ] = commandMatch
            return `>>${commandType} OK<<`
        } else {
            if (command.search(/>>Set/g) !== -1) {
                return '>>Set ?<<'
            }

            if (command.search(/>>Fade/g) !== -1) {
                return '>>Fade ?<<'
            }

            // If command not found
            return '>>CMD ?<<'
        }
    }
    else {
        // Doesn't return anything if there's no one logged and the command isn't Login
        // Logs the trash to the console
        console.log(`Trash received: ${command}`)
        return ''
    }
}
server.listen(port)

console.log(`Telnet server started at ${port}`)