const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const socket = require('socket.io')
const routers = require('./routes/routes')
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/', routers);

const uri = 'mongodb+srv://dattalade:dattalade@cluster0.fade8bn.mongodb.net/connect?retryWrites=true&w=majority'
mongoose.connect(uri);
console.log('Connected to the database');

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const io = socket(server, {
  cors: {
    origin: 'https://infinity-connect.vercel.app',
    credentials: true
  }
})

global.onlineChatters = new Map();

io.on("connection", (socket) => {
  global.chatSocket = socket

  socket.on("add-user", (userId) => {
    onlineChatters.set(userId, socket.id)
    // console.log("Socket recieved from : " + userId)
  })

  socket.on("send-msg", (data) => {
    const sendSocket = onlineChatters.get(data.to)
    if (sendSocket) {
      socket.to(sendSocket).emit("recieve-msg", { message: data.message, time: new Date(), to: data.to, from: data.from, socketNeed: data.socketNeed })
    }
  })
})
