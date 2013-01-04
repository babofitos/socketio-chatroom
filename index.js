var express = require('express')
  , app = express()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server)
  , usernames = {}
  , chatName

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

app.post('/', function(req, res) {
  chatName = req.body.name
  res.send(200)
})

io.sockets.on('connection', function(socket) {
  io.sockets.emit('entrance', {message: 'A new chatter is online.'})

  socket.on('disconnect', function() {
    io.sockets.emit('exit', {message: 'A chatter disconnected.'})
  })
  
  socket.on('chat', function(data) {
    if (!usernames[socket.id]) usernames[socket.id] = chatName
    io.sockets.emit('chat', {message:usernames[socket.id]+': ' + data.message})
  })

})
