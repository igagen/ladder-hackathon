class GameView extends Backbone.View
  id: 'game'

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
    @$player1Img = @.$("#player1-image")
    @$player2Img = @.$("#player2-image")
    @$player1Name = @.$("#player1-summary .name")
    @$player1Rating = @.$("#player1-summary .rating")
    @$player1DeltaRating = @.$("#player1-summary .delta-rating")
    @$player2Name = @.$("#player2-summary .name")
    @$player2Rating = @.$("#player2-summary .rating")
    @$player2DeltaRating = @.$("#player2-summary .delta-rating")
    @$advanceButton = @.$("#advance-button")
    @$gameStates= @.$(".game-state")
    @$open = @.$(".open")
    @$ready = @.$(".ready")
    @$started = @.$(".start")
    @$finished = @.$(".finish")
    @$result = @.$(".finish h2")
    @inExplanation = false

    @continueToNextQuestion() # load first question

    # TODO: clean up?
    @playerViews = {}

    @renderPlayers()

    SS.events.on "game", (message, channel) =>
      console.log "#{@game.id}: GameView received #{message.action} on #{channel}:", message

      if channel == "game/#{@game.id}"
        console.log "#{@game.id}: Handling #{message.action}"
        @[message.action](message)
      else
        console.log "#{@game.id}: Received game action #{message.action} for wrong game id: #{channel}"

    @$gameStates.hide()
    @.$(".#{@game.state}").show()

    @state = @game.state

    $(window).bind 'hashchange', =>

  remove: =>
    if @game.state == 'open'
      SS.server.app.clearOpenGames =>
        console.log "#{@game.id}: Finished clearing open games for user:", @userId

    $(@el).remove()

  join: (o) ->
    @game.player2 = o.player2
    @renderPlayers()
    @displayMessage("#{@game.player2.name} has joined!", "correct")

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
    console.log "#{@game.id}: begin playerStart"
    SS.server.app.playerStart { userId: @userId, gameId: @game.id }, (result) =>
      console.log "#{@game.id}: end playerStart:", result

  playerFinish: =>
    return if @solo
    console.log "#{@game.id}: begin playerFinish"
    SS.server.app.playerFinish { userId: @userId, gameId: @game.id }, (result) =>
      console.log "#{@game.id}: end playerFinish:", result

  finish: (o) ->
    SS.events.unsubscribe 'game'
    SS.server.app.playerUnsubscribe @game.id, (result) =>
      console.log "Player #{@userId} unsubscribed from game #{@game.id}"

    return if @solo

    console.log "#{@game.id}: Finished game", o

    @$gameStates.hide()
    @$finished.show()
    @state = 'finish'
    @$result.html o.result

    @$player1Img.attr('src', "http://graph.facebook.com/#{o.player1.id}/picture")
    @$player2Img.attr('src', "http://graph.facebook.com/#{o.player2.id}/picture")
    @$player1Name.html("#{o.player1.name}:")
    @$player2Name.html("#{o.player2.name}:")
    @$player1Rating.html(o.player1.rating - o.player1.deltaRating)
    @$player2Rating.html(o.player2.rating - o.player2.deltaRating)
    @$player1DeltaRating.html("#{if o.player1.deltaRating >= 0 then '+' else ''}#{o.player1.deltaRating}")
    @$player2DeltaRating.html("#{if o.player2.deltaRating >= 0 then '+' else ''}#{o.player2.deltaRating}")

    setTimeout (=>
      @$player1DeltaRating.addClass('update')
      if o.player1.deltaRating >= 0
        console.log "#{@game.id}: Player 1 gained rank"
        @$player1Rating.addClass('positive')
        @$player1DeltaRating.addClass('positive')
      else
        console.log "#{@game.id}: Player 1 lost rank"
        @$player1Rating.addClass('negative')
        @$player1DeltaRating.addClass('negative')

      
      @$player2DeltaRating.addClass('update')
      if o.player2.deltaRating >= 0
        console.log "#{@game.id}: Player 2 gained rank"
        @$player2Rating.addClass('positive') 
        @$player2DeltaRating.addClass('positive') 
      else
        console.log "#{@game.id}: Player 2 lost rank"
        @$player2Rating.addClass('negative')
        @$player2DeltaRating.addClass('negative')

      setTimeout (=>
        @$player1Rating.html(o.player1.rating)
        @$player1DeltaRating.removeClass('update')
        # @$player1DeltaRating.addClass('hidden')
        @$player2Rating.html(o.player2.rating)
        @$player2DeltaRating.removeClass('update')
        # @$player2DeltaRating.addClass('hidden')
      ), 400
    ), 1500

  # This handles a server broadcast of a player's answer.
  answer: (o) ->
    playerView = @playerViews[o.userId]
    playerView.updatePoints(o.points)

    return if @userId == o.userId

    playerView.appendAnswer(o.correct)

  render: ->
    console.log "-----------------------------------------------------------------------------------"
    console.log "#{@game.id}: Rendering game view"

    template = $("#template-game")
    $(@el).html template.html()
    @$container.html('')
    @$container.prepend(@el)

  renderPlayer: (player) ->
    container = @$players
    playerView = new PlayerView(container, player)
    @playerViews[player.id] = playerView

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

    console.log "#{@game.id}: begin confirmAnswer"
    SS.server.app.answer { userId: @userId, gameId: @game.id, questionId: @currentQuestion, answer: @$answer.val() }, (result) =>
      console.log "#{@game.id}: end confirmAnswer:", result

  displayMessage: (message, klass = "") ->
    @$message.html(message)
    @$message.attr('class', klass)
    setTimeout (=> @$message.addClass('hidden')), 3000


window.GameView = GameView
