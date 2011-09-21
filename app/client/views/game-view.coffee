class GameView extends Backbone.View
  events:
    "click #advance-button": "handleAdvance"
    "click .start.button": "playerStart"

  initialize: (options) ->
    $(window).bind "keypress", @handleKeyPress

    @userId = options.userId
    @game = options.gameData

    @$container = options.container

    @render()
    @timerView = new TimerView(@, @game.duration, @playerFinish)

    @$message = @.$("#message")
    @$answer = @.$("#answer")

    @$players = @.$("#players")
    @$advanceButton = @.$("#advance-button")
    @$gameStates= @.$(".game-state")
    @$open = @.$(".open")
    @$ready = @.$(".ready")
    @$started = @.$(".start")
    @$finished = @.$(".finish")
    @$result = @.$(".finish h2")
    @inExplanation = false

    @continueToNextQuestion() # load first question

    ############ 
    # TODO: clean up?
    @playerViews = {}
    ############

    @renderPlayers()

    SS.events.on "info", (message, channel) =>
      console.log "Game info", message
      @[message.action](message)

    @$gameStates.hide()
    @.$(".#{@game.state}").show()

    @state = @game.state

    $(window).bind 'hashchange', =>
      SS.server.app.clearOpenGames @userId, ->
        console.log "Finished clearing open games for user:", @userId

  join: (o) ->
    @game.player2 = o.player2
    @renderPlayers()
    @displayMessage("#{@game.player2.userId} has joined!", "correct")

  open: ->
    @$gameStates.hide()
    @$open.show()
    @state = 'open'

  ready: ->
    @$gameStates.hide()
    @$ready.show()
    @state = 'ready'

  start: (o) ->
    @timerView.start()
    @$gameStates.hide()
    @$started.show()
    @state = 'start'

  playerStart: ->
    SS.server.app.playerStart { userId: @userId, gameId: @game.id }, (result) =>

  playerFinish: =>
    SS.server.app.playerFinish { userId: @userId, gameId: @game.id }, (result) =>

  finish: (o) ->
    @$gameStates.hide()
    @$finished.show()
    @state = 'finish'
    @$result.html o.result

  # This handles a server broadcast of a player's answer.  It's slightly 
  # awkward that the server comes through here first.
  answer: (o) ->
    ######### playerView stuff
    playerView = @playerViews[o.userId]
    playerView.updatePoints(o.points)

    return if @userId == o.userId

    playerView.appendAnswer(o.correct)
    #########
    
  render: ->
    template = $("#template-game")
    $(@el).html template.html()
    @$container.html('')
    @$container.prepend(@el)


  ############
  # TODO: construct PlayerView's only when player joins
  renderPlayer: (player) ->
    container = @$players
    playerView = new PlayerView(container, player)
    @playerViews[player.userId] = playerView
  #############

  renderPlayers: ->
    @$players.html('')
    @renderPlayer(@game.player1)
    if @game.player2
      @$players.append "<div style='clear:both' />"
      @renderPlayer(@game.player2)

  handleKeyPress: (event) =>
    if event.keyCode == 13
      @handleAdvance()

  continueToNextQuestion: ->
    if @currentQuestion?
      @currentQuestion++
    else
      @currentQuestion = 0
    @currentQuestion = 0 if @currentQuestion >= @game.questions.length
    @question = @game.questions[@currentQuestion]
    @$answer.val('')
    @questionView = new QuestionView(@question, @)
    @questionView.render()

  handleAdvance: =>
    if !@inExplanation
      @confirmAnswer()
      @inExplanation = true
      @$advanceButton.val("Advance")
    else
      @continueToNextQuestion()
      @inExplanation = false
      @$advanceButton.val("Confirm")

  confirmAnswer: =>
    return unless @state == 'start'

    # Convert fractions to floating point
    userChoice = @$answer.val()

    correct = SS.shared.questions.isCorrect(userChoice, @question)
    if correct
      @displayMessage('Correct!', 'correct')
    else
      @displayMessage('Incorrect', 'incorrect')

    ######### playerView stuff
    @playerViews[@userId].appendAnswer(correct)
    #########
    
    @questionView.showExplanation()

    SS.server.app.answer { userId: @userId, gameId: @game.id, questionId: @currentQuestion, answer: @$answer.val() }, (result) ->

  displayMessage: (message, klass = "") ->
    @$message.html(message)
    @$message.attr('class', klass)
    setTimeout (=> @$message.addClass('hidden')), 3000


window.GameView = GameView
