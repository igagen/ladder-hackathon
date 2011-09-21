GameStore = require("./store").get("Game")
{Player} = require("./player")

exports.Game = class Game
  NUM_QUESTIONS: 50

  constructor: (@userId1, @min, @max, @duration, @solo, cb) ->
    @questions = new Array(@NUM_QUESTIONS)
    
    @ratings = {}

    @player1 = new Player(@userId1)
    @players = {}
    @players[@userId1] = @player1

    @state = 'open'

    for i in [0...@NUM_QUESTIONS]
      @questions[i] = SS.shared.questions.get(i)

    @id = GameStore.save(@)

    @start() if @solo

    console.log "Game.create(#{@userId1})"

    cb(@)

  lobbyData: ->
    id: @id
    state: @state
    solo: @solo

  gameData: ->
    id: @id
    duration: @duration
    state: @state
    questions: @questions
    player1: @player1.playerData()
    player2: @player2?.playerData()

  playerStart: (userId) ->
    player = @players[userId]
    player.started = true
    if @player1.started && @player2.started
      @start()

  playerFinish: (userId) ->
    player = @players[userId]
    player.finished = true
    # WRONG
    if @player1.finished && (@solo || @player2.finished)
      @finish()

  publish: (data) ->
    SS.publish.channel "game/#{@id}", "info", data

  ready: ->
    @state = 'ready'
    @publish { action: 'ready' }

  start: ->
    @state = 'start'
    @startTimer()
    @publish { action: 'start', startTime: @startTime }

  updateRatings: ->
    if @player1.points > @player2.points
      sa = 1
      sb = 0
    else if @player1.points < @player2.points
      sa = 0
      sb = 1
    else
      sa = 0.5
      sb = 0.5

    #@users[@userId1].updateRatings(@users[@userId2], sa, sb)

  gameResults: ->
    return "Good Job!" if @solo
    if @player1.points > @player2.points
      "#{@player1.name} wins!"
    else if @player2.points > @player1.points
      "#{@player2.name} wins!"
    else
      "Draw"

  finish: ->
    @state = 'finish'

    # @updateRatings()

    # data.ratings[@userId1] = @users[@userId1].getRating()
    # data.ratings[@userId2] = @users[@userId2].getRating()

    @publish
      action: 'finish'
      result: @gameResults()

  startTimer: () ->
    @startTime = new Date()

  join: (userId2) ->
    console.log "Game.join(#{userId2})"
    @player2 = new Player(userId2)
    @players[userId2] = @player2
    @publish { action: 'join', player2: @player2.playerData() }
    @ready()

  exit: (userId) ->

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
      @publish { action: 'answer', userId: userId, correct: true, points: player.points }
    else
      points = player.answer(false)
      @publish { action: 'answer', userId: userId, correct: false, points: player.points }
