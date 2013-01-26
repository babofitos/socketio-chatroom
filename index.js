var express = require('express')
  , app = express()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server)

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

io.sockets.on('connection', function(socket) {
  socket.on('adduser', function(username) {
    socket.set('nickname', username)
  })

  socket.on('entrance', function(data) {
    //send msg to everyone except for sender
    socket.broadcast.emit('entrance', 'A new chatter is online.')
  })
  
  socket.on('disconnect', function() {
    io.sockets.emit('exit', {message: 'A chatter disconnected.'})
  })
  
  socket.on('chat', function(data) {
    socket.get('nickname', function(err, name) {
      socket.emit('chat', name+ ': ' + data.message)
      socket.broadcast.emit('chat', name + ': ' + data.message)
    })
  })
})

