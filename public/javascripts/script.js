var socket = io.connect(window.location.href)

var nameBox = document.getElementById('namebox')
nameBox.onkeypress = function pickName(e) {
  var key = e.keyCode || e.charCode
    , httpRequest
    , name

  if ( key === 13 && document.querySelector('#namebox > input').value ) {
    nameBox.className += 'hidden'
    document.getElementById('dampener').className += 'hidden'

    name = document.querySelector('#namebox > input').value

    //ajax name to backend
    httpRequest = new XMLHttpRequest()
    httpRequest.onreadystatechange = function() {
      if (httpRequest.readyState === 4) {
        if (httpRequest.status === 200) {
          socket.on('chat', function (data) {
            createMessage('chat', data.message)
          })
        }
      }
    }
    httpRequest.open('POST', window.location.href, true)
    httpRequest.setRequestHeader('Content-Type', 'application/json');
    httpRequest.send(JSON.stringify({name:name}))
  }
}

socket.on('entrance', function (data) {
  createMessage('entrance', data.message)
})

socket.on('exit', function (data) {
  createMessage('exit', data.message)
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