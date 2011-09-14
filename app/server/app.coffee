NextGameId = 0
NextUserId = 0
Games = {}
Users = {}

class User
  K: 24

  constructor: (@username, cb) ->
    key = "user:#{@username}:rating"
    Users[@username] = @
    R.get key, (error, data) =>
      if data?
        @rating = parseFloat(data)
      else
        @rating = 1000
        @setRating(@rating)

      cb(@)

  getRating: ->
    @rating

  setRating: (rating) ->
    @rating = rating
    R.set "user:#{@username}:rating", @rating

  # Update both players ratings based on match results
  # sa, sb are the outcome values from this player's perspective (sa) and the opponents perspective (sb)
  # If this player won, sa would be 1.0 and sb would be 0.0
  # If the match was a draw, sa and sb would both be 0.5
  updateRatings: (user2, sa, sb) ->
    ra = @getRating()
    rb = user2.getRating()

    qa = Math.pow(10, ra / 400)
    qb = Math.pow(10, rb / 400)

    # Expected outcomes
    ea = qa / (qa + qb)
    eb = qb / (qa + qb)

    # Calculate updated ratings
    ra = Math.floor(ra + @K * (sa - ea))
    rb = Math.floor(rb + @K * (sb - eb))

    @setRating ra
    console.log "Updated #{@username} rating to: #{ra}"
    user2.setRating rb
    console.log "Updated #{user2.username} rating to: #{rb}"

class Question
  constructor: (min, max) ->
    @a = min + Math.ceil(Math.random() * (max - min))
    @b = min + Math.ceil(Math.random() * (max - min))
    @x = @a * @b

class Game
  NUM_QUESTIONS: 50

  constructor: (@player1, @min, @max, @duration, @solo, cb) ->
    @id = NextGameId++
    @questions = new Array(@NUM_QUESTIONS)
    @player2 = null
    @answers = {}
    @answers[@player1] = []
    @points = {}
    @points[@player1] = 0
    @ratings = {}
    @started = {}
    @started[@player1] = false
    @finished = {}
    @finished[@player1] = false
    @state = 'open'

    for i in [0...@NUM_QUESTIONS]
      @questions[i] = SS.shared.questions.get(i)

    Games[@id] = @

    @users = {}
    new User @player1, (user) =>
      @users[@player1] = user
      @ratings[@player1] = @users[@player1].getRating()
      cb(@)
    
    @start() if @solo

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
    @startTimer(180)
    @broadcast { action: 'start', startTime: @startTime }

  updateRatings: ->
    if @points[@player1] > @points[@player2]
      sa = 1
      sb = 0
    else if @points[@player1] < @points[@player2]
      sa = 0
      sb = 1
    else
      sa = 0.5
      sb = 0.5

    @users[@player1].updateRatings(@users[@player2], sa, sb)
    @ratings[@player1] = @users[@player1].getRating()
    @ratings[@player2] = @users[@player2].getRating()

  finish: ->
    @state = 'finish'
    data =
      action: 'finish'
      ratings: {}

    @updateRatings()

    data.ratings[@player1] = @users[@player1].getRating()
    data.ratings[@player2] = @users[@player2].getRating()

    @broadcast data

  startTimer: (seconds) ->
    @startTime = new Date()

  join: (player2) ->
    @player2 = player2
    @answers[@player2] = []
    @points[@player2] = 0
    @started[@player1] = false
    new User @player2, (user) =>
      @users[@player2] = user
      @ratings[@player2] = user.getRating()
      @broadcast { action: 'join', player: @users[@player2], rating: @ratings[@player2] }
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
      @points[player] += 10
      @broadcast { action: 'answer', player: player, answer: 'correct', points: @points[player] }
      return 'correct'
    else
      @answers[player][questionId] = 'incorrect'
      @points[player] -= 10
      @points[player] = 0 if @points[player] < 0
      @broadcast { action: 'answer', player: player, answer: 'incorrect', points: @points[player] }
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

  createSoloGame: (player, cb) ->
    new Game player, 3, 29, 180, true, (game) ->
      cb(game)

  createTwoPlayerGame: (player, cb) ->
    new Game player, 3, 29, 180, false, (game) ->
      cb(game)

  joinGame: (player, cb) ->
    # BROKEN FOR THE MOMENT
    for own id, game of Games
      if game.isOpen() && player != game.player1
        game.join(player)
        return cb(game)

