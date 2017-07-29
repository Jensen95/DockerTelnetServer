'use strict'
const net = require('net')
const debug = require('debug')('zense:server')

const port = process.env.PORT || 10001
let loggedIn = true

const server = net.createServer((socket) => {
    debug('Client connected')
    socket.write('Welcome to the Telnet server!\n')
    socket.on('data', (data) => {
        // Checks if Ctrl + C is pressed or else parses data to client
        if(data.toString('hex') === 'fff4fffd06'){
            socket.end()
        } else  {
            debug(`Debug: ${handleData(data)}\n`)
            socket.write(`${handleData(data)}\n`)
        }
    })
    socket.on('end', () => {
        debug('Client disconnected')
    })
})

function handleData(data) {
    const command = data.toString().replace(/[\r\n\t]+/, '').trim()

    const debug = require('debug')('zense:server:handleData')

    debug(`Got command, ${command}`)

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
        } else if(commandMatch = /^>>(Scene Run) (.+)<<$/g.exec(command)) {
            const [ command, commandType, action ] = commandMatch
            return `>>${commandType} OK<<`
        } else {
            if (command.search(/>>Set/g) !== -1) {
                return '>>Set ?<<'
            }

            if (command.search(/>>Fade/g) !== -1) {
                return '>>Fade ?<<'
            }

            if (command.search(/>>Scene Run/g) !== -1) {
                return '>>Scene Run ?<<'
            }

            // If command not found
            return '>>CMD ?<<'
        }
    }
    else {
        // Doesn't return anything if there's no one logged and the command isn't Login
        // Logs the trash to the console
        debug(`Trash received: ${command}`)
        return ''
    }
}
server.listen(port)

debug(`Telnet server started at ${port}`)