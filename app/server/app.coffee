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
    @answers = {}
    @answers[@player1] = []
    @state = 'open'

    for i in [0...@NUM_QUESTIONS]
      @questions[i] = new Question(@min, @max)

    Games[@id] = @

    @startTimer(180) # This will eventually go somewhere else

  start: ->
    @state = 'started'

  finish: ->
    @state = 'finished'

  startTimer: (seconds) ->
    @startTime = new Date()
    @duration = seconds

  join: (player2) ->
    @player2 = player2
    @answers[@player2] = []
    @state = 'started'
    SS.publish.broadcast "game/#{@id}", { action: 'join', player: @player2 }
    return @

  exit: (player) ->

  isOpen: ->
    @state == 'open'

  answer: (player, questionId, answer) ->
    return 'invalid' unless player == @player1 || player == @player2
    #return 'invalid' unless @state == 'started'
    return 'invalid' unless questionId == @answers[player].length

    question = @questions[questionId]
    if question.x == parseFloat(answer)
      @answers[player][questionId] = 'correct'
      SS.publish.broadcast "game/#{@id}", { action: 'answer', player: player, answer: 'correct' }
      return 'correct'
    else
      @answers[player][questionId] = 'incorrect'
      SS.publish.broadcast "game/#{@id}", { action: 'answer', player: player, answer: 'incorrect' }
      return 'incorrect'


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

  getGame: (id, cb) ->
    game = Games[id]
    if game?
      cb game
    else
      cb { error: "No game with id '#{id}'" }

  answer: (params, cb) ->
    game = Games[params.gameId]
    if game?
      cb game.answer(params.user, params.questionId, params.answer)
    else
      cb({ error: "Invalid game ID: #{params.gameId}" })

  createOrJoinGame: (player, cb) ->
    for own id, game of Games
      if game.isOpen() && player != game.player1
        game.join(player)
        return cb(game)

    return cb(new Game(player, 11, 19))
