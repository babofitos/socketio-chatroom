var socket = io.connect(window.location.href)

socket.on('connect', function (data) {
  socket.emit('adduser', prompt("What's your name?"))
  socket.emit('entrance')
})

socket.on('entrance', function (data) {
  console.log('hit')
  createMessage('entrance', data)
})

socket.on('exit', function (data) {
  createMessage('exit', data.message)
})

socket.on('chat', function (data) {
  createMessage('chat', data)
})


function createMessage(type, message) {
  var li = document.createElement('LI')
  li.innerHTML = message
  document.getElementById('chatbox').appendChild(li)
}

var chatInput = document.getElementById('chatinput')
chatInput.onkeypress = function(e) {
  var key = e.keyCode || e.charCode
    , inputVal

  if ( key === 13 && chatInput.value) { //enter
    inputVal = chatInput.value
    chatInput.value = ''
    socket.emit('chat', {message:inputVal})
  }
}