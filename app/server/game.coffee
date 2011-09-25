GameStore = require("./store").get("Game")
UserStore = require("./store").get("User")
{Player} = require("./player")
Questions = require("./questions")

exports.Game = class Game
  NUM_QUESTIONS: 50
  K: 24

  constructor: (session, @duration, @solo, cb) ->
    console.log "Creating new game with session:", session
    @questions = new Array(@NUM_QUESTIONS)
    
    @ratings = {}

    @player1 = new Player(session.user_id)
    @players = {}
    @players[session.user_id] = @player1

    @state = 'open'

    for i in [0...@NUM_QUESTIONS]
      @questions[i] = Questions.get(i)

    @id = GameStore.save(@)

    session.channel.subscribe("game/#{@id}")

    @start() if @solo

    cb(@)

  lobbyData: ->
    id: @id
    state: @state
    solo: @solo
    player1: @player1.lobbyData()

  gameData: ->
    id: @id
    duration: @duration
    state: @state
    questions: @questions
    player1: @player1.gameData()
    player2: @player2?.gameData()

  playerStart: (userId) ->
    player = @players[userId]
    player.started = true
    if @player1.started && @player2.started
      @start()

  playerFinish: (userId) ->
    player = @players[userId]

    if player.finished
      console.error "Player #{userId} is already finished"
      return

    player.finished = true
    if @player1.finished && (@solo || @player2.finished)
      @finish()

  publish: (data) ->
    channel = "game/#{@id}"

    console.log "Publishing game message on channel #{channel}"
    console.log data

    SS.publish.channel channel, "game", data

  ready: ->
    @state = 'ready'
    @publish { action: 'ready' }

  start: ->
    @state = 'start'
    @publish {action: 'start'}

  # Update both players ratings based on match results
  # sa, sb are the outcome values from this player's perspective (sa) and the opponents perspective (sb)
  # If this player won, sa would be 1.0 and sb would be 0.0
  # If the match was a draw, sa and sb would both be 0.5
  updateRatings: ->
    return if @solo

    user1 = @player1.user
    user2 = @player2.user

    if @player1.points > @player2.points
      sa = 1
      sb = 0
    else if @player1.points < @player2.points
      sa = 0
      sb = 1
    else
      sa = 0.5
      sb = 0.5

    ra = user1.rating
    rb = user2.rating

    qa = Math.pow(10, ra / 400)
    qb = Math.pow(10, rb / 400)

    # Expected outcomes
    ea = qa / (qa + qb)
    eb = qb / (qa + qb)

    # Calculate updated ratings
    ra = Math.round(ra + @K * (sa - ea))
    rb = Math.round(rb + @K * (sb - eb))

    @player1DeltaRating = ra - user1.rating
    @player2DeltaRating = rb - user2.rating

    user1.rating = ra
    user2.rating = rb

  winLoseOrDraw: ->
    return "Good Job!" if @solo
    if @player1.points > @player2.points
      "#{@player1.name()} Wins!"
    else if @player2.points > @player1.points
      "#{@player2.name()} Wins!"
    else
      "Draw"

  finish: ->
    if @state == 'finish'
      console.error "Game #{@id} is already finished"
      return

    @state = 'finish'

    return if @solo

    @updateRatings()

    @publish
      action: 'finish'
      result: @winLoseOrDraw()
      player1:
        id: @player1.id()
        name: @player1.name()
        rating: @player1.rating()
        deltaRating: @player1DeltaRating
      player2:
        id: @player2.id()
        name: @player2.name()
        rating: @player2.rating()
        deltaRating: @player2DeltaRating

  join: (session) ->
    @player2 = new Player(session.user_id)
    @players[session.user_id] = @player2
    session.channel.subscribe("game/#{@id}")
    @publish {action: 'join', player2: @player2.gameData()}
    @ready()

  isOpen: ->
    @state == 'open'

  isOpenForUser: (userId) ->
    @isOpen() && userId != @player1.userId

  answer: (userId, questionId, answer) ->
    return 'invalid' unless @state == 'start'

    player = @players[userId]
    return "invalid" unless player

    question = @questions[questionId]
    if SS.shared.questions.isCorrect(answer, question)
      points = player.answer(true)
      @publish {action: 'answer', userId: userId, correct: true, points: player.points}
    else
      points = player.answer(false)
      @publish {action: 'answer', userId: userId, correct: false, points: player.points}
