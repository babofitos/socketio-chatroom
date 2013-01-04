var express = require('express')
  , app = express()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server)
  , usernames = {}

server.listen(process.env.PORT || 1337)

app.configure(function() {
  app.set('port', process.env.PORT || 1337)
  app.set('views', __dirname + '/views')
  app.set('view engine', 'jade')
  app.use(express.bodyParser())
  app.use(app.router)
  app.use(express.static(__dirname + "/public"))
})

app.get('/', function(req, res) {
  res.render('index')
})

// app.post('/', function(req, res) {
//   var chatName = req.body.name
//   res.send(200)
//   setChat(chatName)
// })

io.sockets.on('connection', function(socket) {
  socket.on('adduser', function(username) {
    socket.username = username
    usernames[username] = username
  })

  io.sockets.emit('entrance', {message: 'A new chatter is online.'})

  socket.on('disconnect', function() {
    io.sockets.emit('exit', {message: 'A chatter disconnected.'})
  })
  
  socket.on('chat', function(data) {
    io.sockets.emit('chat', {message:usernames[socket.username]+': ' + data.message})
  })
})

// function setChat(chatName) {
//   io.sockets.on('connection', function(socket) {
//     console.log('hit')
//     if (!usernames[socket.id]) usernames[socket.id] = chatName
//     socket.on('chat', function(data) {
//       io.sockets.emit('chat', {message:usernames[socket.id]+': ' + data.message})
//     })
//   })
//   console.log(usernames)
// }
