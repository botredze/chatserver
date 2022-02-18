const express = require("express");

const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const port = 3000;
const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});
httpServer.listen(port, "127.0.0.1");


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.js')
})

io.on('connection', (socket) => {
    let userName = null;
    function chatMessage({user, message}) {
        socket.broadcast.emit('chat-message', {user, message})
    }

    socket.on('typing', function () {
        socket.broadcast.emit('typing', {id:socket.id, userName});
    })
    socket.on('stop_typing', ()=>{
        socket.broadcast.emit('stop_typing', socket.id);
    })
    socket.on('joined', (name)=>{
        userName = name;
    })

    socket.on('chat-message', chatMessage)

    socket.on('disconnect', () => {
        console.log("User disconnecting on your channel")
    })

})

