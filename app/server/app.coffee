NextGameId = 0
NextUserId = 0
Games = {}
Users = {}

class User
  constructor: (@username) ->
    @id = NextUserId++
class Question
  constructor: (min, max) ->
    @a = min + Math.ceil(Math.random() * (max - min))
    @b = min + Math.ceil(Math.random() * (max - min))
    @x = @a * @b

class Game
  NUM_QUESTIONS: 50
  constructor: (@player1, @min, @max) ->
    @id = NextGameId++
    @questions = new Array(@NUM_QUESTIONS)
    @player2 = null
    @currentQuestion = 0

    for i in [0...@NUM_QUESTIONS]
      @questions[i] = new Question(@min, @max)

    Games[@id] = @

  join: (player2) ->
    return { error: 'Game is not open' } unless isOpen()
    @player2 = player2
    return @

  isOpen: ->
    @player2?


exports.actions =
  init: (cb) ->
    cb()

  login: (username, cb) ->
    user = Users[username]
    if user
      return cb(Users[username])
    else
      return cb(new User(username))

  sendMessage: (message, cb) ->
    if message.length > 0
      SS.publish.broadcast 'newMessage', message
      cb true
    else
      cb false

  square: (number, cb) ->
    cb(number * number)

  createOrJoinGame: (playerUserName, cb) ->
    player = Users[playerUserName]
    unless player?
      @login playerUserName, (user) ->
        player = user

    if player?
      for game in Games
        if game.isOpen()
          game.join(player)
          return cb(game, 'joined')
      return cb(new Game(player, 11, 19))
    else
      cb({ error: 'invalid player username' })
