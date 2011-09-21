# HTTP Middleware Config
# ----------------------

# Version 2.0

# This file defines how incoming HTTP requests are handled

# CUSTOM MIDDLEWARE

# Hook-in your own custom HTTP middleware to modify or respond to requests before they're passed to the SocketStream HTTP stack

getFacebookSession = (signedRequest) ->
  [hmac, encodedData] = signedRequest.split('.')
  JSON.parse(new Buffer(encodedData, 'base64').toString('ascii'))

facebookSession = ->
  (request, response, next) ->
    for name, value of request.cookies
      match = name.match(/fbsr_(\d+)/)
      if match?
        appId = match[1]
        request.facebookSession = getFacebookSession(value)

    next()

# CONNECT MIDDLEWARE

connect = require('connect')

# Stack for Primary Server
exports.primary =
  [
    connect.cookieParser()
    facebookSession()
  ]

# Stack for Secondary Server
exports.secondary = []