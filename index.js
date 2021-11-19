const express = require('express');

const mongoose = require('mongoose');
const Message = require('./models/messages');

const app = express();
const server = require('http').createServer(app);

const mongoDB = 'mongodb+srv://chatview:chat123view@messages.hbzua.mongodb.net/mychat-db?retryWrites=true&w=majority';

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log('connected to MongoDB')
}).catch(err => console.log(err));


const io = require('socket.io')(server,{
    cors:{ origin: "*"}
});

io.on('connection',(socket) => {
    console.log('usuario conectado');

    //Obtener todos los mensajes
    Message.find().then(result => {
        socket.emit('output-messages', result)
    })

    socket.emit('message', 'Hello to My Chat');

    /* socket.on('sendChatToServer', (message) => {
        console.log(message);

         //io.sockets.emit('sendChatToClient', message);
        socket.broadcast.emit('sendChatToClient', message);
    });*/

    socket.on('send-chat', msg => {
        //crear nuevo mensaje
        const message = new Message({ msg });
        //Guardar nuevo mensaje
        message.save().then(() => {
            //reenviar mensaje
            io.emit('message', msg)
        })
    })

    socket.on('disconnect', (socket) => {
        console.log('Usuario desconectado');
    });
});

server.listen(3000, () => {
    console.log('Server en linea');
});