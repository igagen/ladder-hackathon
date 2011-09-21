# HTTP Middleware Config
# ----------------------

# Version 2.0

# This file defines how incoming HTTP requests are handled

# CUSTOM MIDDLEWARE

# Hook-in your own custom HTTP middleware to modify or respond to requests before they're passed to the SocketStream HTTP stack

facebookSignedRequest = ->
  (request, response, next) ->
    if request.method == 'POST'
      if request.body.signed_request
        request.facebookSession = getFacebookSession(request.body.signed_request)
    
    next()

# Extract Facebook session information from a signed request
getFacebookSession = (signedRequest) ->
  [hmac, encodedData] = signedRequest.split('.')
  JSON.parse(new Buffer(encodedData, 'base64').toString('ascii'))

# CONNECT MIDDLEWARE

connect = require('connect')

# Stack for Primary Server
exports.primary =
  [
    connect.bodyParser()
    facebookSignedRequest()
  ]

# Stack for Secondary Server
exports.secondary = []