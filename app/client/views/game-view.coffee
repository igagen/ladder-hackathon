class TimerView # extends Backbone.View
  constructor: (gameView, @duration, @playerFinish) ->
    @duration = 300
    @$timer = gameView.$("#timer")
    @$minutes = gameView.$("#timer .minutes")
    @$seconds = gameView.$("#timer .seconds")
    @renderRemainingTime(@duration)

  start: ->
    currentTime = new Date().getTime() 
    @endTime = new Date(currentTime + @duration * 1000)
    @timerInterval = setInterval @renderTimer, 250

  renderTimer: =>
    currentTime = new Date()
    remainingMillis = @endTime - currentTime 
    remainingTime = Math.floor(remainingMillis / 1000)
    @renderRemainingTime(remainingTime)

  renderRemainingTime: (remainingTime) ->
    if remainingTime > 0
      remainingMinutes = Math.floor(remainingTime / 60)
      remainingSeconds = Math.floor(remainingTime % 60)
      # zero pad
      remainingMinutes = "0" + remainingMinutes if remainingMinutes < 10
      remainingSeconds = "0" + remainingSeconds if remainingSeconds < 10

      @$minutes.html(remainingMinutes)
      @$seconds.html(remainingSeconds)
    else
      @$minutes.html("00")
      @$seconds.html("00")
      @$timer.addClass('finished')
      clearInterval @timerInterval
      @playerFinish()

class PlayerView
  constructor: (@$container, player) ->
    @userId = player.userId
    @answers = player.answers
    @render()

  render: =>
    @$container.append """
      <div id='#{@userId}'>
      <p>
        <span class='name'>#{@userId}</span>: <span class='points'>0 pts</span>
      </p>
      <div class='answers' />
      </div>"""

    @$answers = $("##{@userId} .answers") # TODO, scope this backbone view
    for answer in @answers
      @appendAnswer(answer)
      
  appendAnswer: (correct) =>
    correctness = if correct then "correct" else "incorrect"
    @$answers.append("<div class='response #{correctness}' />")

 
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

    @advanceQuestion() # load first question
    # @currentQuestion = @game.answers[@user].length
    # @question = @game.questions[@currentQuestion]

    ############ 
    # TODO: clean up?
    @playerViews = {}
    ############

    @renderQuestion()
    @renderPlayers()

    SS.events.on "info", (message, channel) =>
      @[message.action](message)

    @$gameStates.hide()
    @.$(".#{@game.state}").show()

    @state = @game.state

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

  renderResults: (o) ->
    player1 = @game.player1
    player2 = @game.player2
    if player1.points > player2.points
      @$result.html("#{player1.userId} wins!")
    else if player2.points > player1.points
      @$result.html("#{player2.userId} wins!")
    else
      @$result.html("Draw")

    # if o?
    #   @game.ratings[@game.player1] = o.ratings[@game.player1]
    #   @game.ratings[@game.player2] = o.ratings[@game.player2]
    #   @.$("##{@game.player1} .rating").html(o.ratings[@game.player1])
    #   @.$("##{@game.player2} .rating").html(o.ratings[@game.player2])

  finish: (o) ->
    @$gameStates.hide()
    @$finished.show()
    @state = 'finish'
    @renderResults(o)

  # This handles a server broadcast of a player's answer
  answer: (o) ->
    @.$("##{o.player} .points").html("#{o.points} pts")

    return if @userId == o.userId

    ######### playerView stuff
    console.log("appendAnswer from showExplanation")
    @playerViews[o.userId].appendAnswer(o.correct)
    #########
    
 
  render: ->
    template = $("#template-game")
    $(@el).html template.html()
    @$container.html('')
    @$container.prepend(@el)

  renderQuestion: ->
    @$explanation = @.$("#explanation")
    @$explanation.hide()
    @$explanation.html(@question.explanation)

    @$stimulus = @.$("#stimulus")
    @$stimulus.html(@question.stimulus)

    MathJax.Hub.Typeset()


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

  advanceQuestion: ->
    if @currentQuestion?
      @currentQuestion++
    else
      @currentQuestion = 0
    @currentQuestion = 0 if @currentQuestion >= @game.questions.length
    @question = @game.questions[@currentQuestion]
    @$answer.val('')

  handleAdvance: =>
    if !@inExplanation
      @showExplanation()
      @confirmAnswer()
      @inExplanation = true
      @$advanceButton.val("Advance")
    else
      @continueToNextQuestion()
      @inExplanation = false
      @$advanceButton.val("Confirm")

  showExplanation: =>
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
    
    @$explanation.show()

  confirmAnswer: =>
    SS.server.app.answer { userId: @userId, gameId: @game.id, questionId: @currentQuestion, answer: @$answer.val() }, (result) ->

  continueToNextQuestion: =>
    @advanceQuestion()
    @renderQuestion()

  displayMessage: (message, klass = "") ->
    @$message.html(message)
    @$message.attr('class', klass)
    setTimeout (=> @$message.addClass('hidden')), 3000


window.GameView = GameView
