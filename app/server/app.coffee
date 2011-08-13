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

  constructor: (@player1, @min, @max, @duration) ->
    @id = NextGameId++
    @questions = new Array(@NUM_QUESTIONS)
    @player2 = null
    @answers = {}
    @answers[@player1] = []
    @points = {}
    @points[@player1] = 0
    @started = {}
    @started[@player1] = false
    @finished = {}
    @finished[@player1] = false
    @state = 'open'

    for i in [0...@NUM_QUESTIONS]
      @questions[i] = new Question(@min, @max)

    Games[@id] = @

  playerStart: (player) ->
    @started[player] = true
    if @started[@player1] && @started[@player2]
      @start()

  playerFinish: (player) ->
    @finished[player] = true
    if @finished[@player1] && @finished[@player2]
      @finish()

  broadcast: (data) ->
    SS.publish.broadcast "game/#{@id}", data

  ready: ->
    @state = 'ready'
    @broadcast { action: 'ready' }

  start: ->
    @state = 'start'
    @startTimer(30)
    @broadcast { action: 'start', startTime: @startTime }

  finish: ->
    @state = 'finish'
    @broadcast { action: 'finish' }

  startTimer: (seconds) ->
    @startTime = new Date()

  join: (player2) ->
    @player2 = player2
    @answers[@player2] = []
    @points[@player2] = 0
    @started[@player1] = false
    @broadcast { action: 'join', player: @player2 }
    @ready()

  exit: (player) ->

  isOpen: ->
    @state == 'open'

  answer: (player, questionId, answer) ->
    return 'invalid' unless player == @player1 || player == @player2
    return 'invalid' unless @state == 'start'
    return 'invalid' unless questionId == @answers[player].length

    question = @questions[questionId]
    if question.x == parseFloat(answer)
      @answers[player][questionId] = 'correct'
      @broadcast { action: 'answer', player: player, answer: 'correct' }
      return 'correct'
    else
      @answers[player][questionId] = 'incorrect'
      @broadcast { action: 'answer', player: player, answer: 'incorrect' }
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

  getGame: (id, cb) ->
    game = Games[id]
    if game?
      cb game
    else
      cb { error: "No game with id '#{id}'" }

  playerStart: (params, cb) ->
    game = Games[params.gameId]
    if game?
      game.playerStart params.user

  playerFinish: (params, cb) ->
    game = Games[params.gameId]
    if game?
      game.playerFinish params.user

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

    return cb(new Game(player, 11, 19, 30))
