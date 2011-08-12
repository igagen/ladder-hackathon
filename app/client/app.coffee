# Client-side Code

# Bind to socket events
SS.socket.on 'disconnect', ->  $('#message').text('SocketStream server is down :-(')
SS.socket.on 'reconnect', ->   $('#message').text('SocketStream server is up :-)')

# This method is called automatically when the websocket connection is established. Do not rename/delete
exports.init = ->

  # Make a call to the server to retrieve a message
  SS.server.app.init (response) ->

  SS.events.on 'newMessage', (message) ->

exports.createOrJoinGame = (playerUserName, cb) ->
  debugger
  SS.server.app.createOrJoinGame playerUserName, cb
