GameStore = require("./store").get("Game")
{User} = require("./user")

exports.Game = class Game
  NUM_QUESTIONS: 50

  constructor: (@player1, @min, @max, @duration, @solo, cb) ->
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

    @id = GameStore.save(@)

    @users = {}
    new User @player1, (user) =>
      @users[@player1] = user
      @ratings[@player1] = @users[@player1].getRating()
      cb(@)
    
    @start() if @solo

  lobbyData: ->
    id: @id
    state: @state
    solo: @solo

  playerStart: (player) ->
    @started[player] = true
    if @started[@player1] && @started[@player2]
      @start()

  playerFinish: (player) ->
    @finished[player] = true
    if @finished[@player1] && @finished[@player2]
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

    @publish data

  startTimer: () ->
    @startTime = new Date()

  join: (player2) ->
    @player2 = player2
    @answers[@player2] = []
    @points[@player2] = 0
    @started[@player1] = false
    new User @player2, (user) =>
      @users[@player2] = user
      @ratings[@player2] = user.getRating()
      @publish { action: 'join', player: @users[@player2], rating: @ratings[@player2] }
      @ready()

  exit: (player) ->

  isOpen: ->
    @state == 'open'

  isOpenForMe: (player) ->
    @isOpen() && player != @player1

  answer: (player, questionId, userChoice) ->
    return 'invalid' unless player == @player1 || player == @player2
    return 'invalid' unless @state == 'start'
    return 'invalid' unless questionId == @answers[player].length

    question = @questions[questionId]
    if SS.shared.questions.isCorrect(userChoice, question)
      @answers[player][questionId] = 'correct'
      @points[player] += 10
      @publish { action: 'answer', player: player, answer: 'correct', points: @points[player] }
      return 'correct'
    else
      @answers[player][questionId] = 'incorrect'
      @points[player] -= 10
      @points[player] = 0 if @points[player] < 0
      @publish { action: 'answer', player: player, answer: 'incorrect', points: @points[player] }
      return 'incorrect'