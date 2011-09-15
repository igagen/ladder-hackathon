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

    @$message = @.$("#message")
    @$answer = @.$("#answer")
    @$players = @.$("#players")
    @$timer = @.$("#timer")
    @$minutes = @.$("#timer .minutes")
    @$seconds = @.$("#timer .seconds")
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

    @totalTime = @game.duration
    @elapsedTime = 0

    @renderQuestion()
    @renderPlayers()
    @renderTimer()

    SS.events.on "info", (message, channel) =>
      @[message.action](message)

    @$gameStates.hide()
    @.$(".#{@game.state}").show()

    if @game.state == 'start'
      @startTime = new Date(@game.startTime)
      @startTimer()

    if @game.state == 'finish'
      @$minutes.html("00")
      @$seconds.html("00")
      @$timer.addClass('finished')
      @renderResults()

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
    @game.startTime = o.startTime unless @game.startTime?
    @game.startTime = @startTime = new Date()

    @startTimer()
    @$gameStates.hide()
    @$started.show()
    @state = 'start'

  playerStart: ->
    SS.server.app.playerStart { userId: @userId, gameId: @game.id }, (result) =>

  playerFinish: ->
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

  answerBarForPlayer: (userId) ->
    @.$("##{userId} .answers")

  answer: (o) ->
    @.$("##{o.player} .points").html("#{o.points} pts")

    return if @userId == o.userId
    answers = @answerBarForPlayer(o.userId)
    if o.answer == 'correct'
      answers.append('<div class="response correct" />')
    else
      answers.append('<div class="response incorrect" />')

  render: ->
    template = $("#game-template")
    $(@el).html template.html()
    @$container.html('')
    @$container.prepend(@el)

  renderTimer: ->
    remainingTime = @totalTime - @elapsedTime
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

  startTimer: ->
    @timerInterval = setInterval @updateTimer, 250
    @updateTimer()

  updateTimer: =>
    currentTime = new Date()
    elapsedMillis = currentTime - @startTime
    @elapsedTime = Math.floor(elapsedMillis / 1000)
    @renderTimer()

  renderQuestion: ->
    @$explanation = @.$("#explanation")
    @$explanation.hide()
    @$explanation.html(@question.explanation)

    @$stimulus = @.$("#stimulus")
    @$stimulus.html(@question.stimulus)

    MathJax.Hub.Typeset()

  renderPlayers: ->
    @$players.html('')
    @$players.append """
      <div id='#{@game.player1.userId}'>
      <p>
        <span class='name'>#{@game.player1.userId}</span>: <span class='points'>0 pts</span>
      </p>
      <div class='answers' />
      </div>"""
    $player1Answers = @answerBarForPlayer(@game.player1.userId)
    for answer in @game.player1.answers
      if answer == 'correct'
        $player1Answers.append('<div class="response correct" />')
      else
        $player1Answers.append('<div class="response incorrect" />')

    if @game.player2?
      @$players.append """
        <div style='clear:both' />
        <div id='#{@game.player2.userId}'>
          <p>
            <span class='name'>#{@game.player2.userId}</span>: <span class='points'>0 pts</span>
          </p>
          <div class='answers' />
        </div>"""
      $player2Answers = @answerBarForPlayer(@game.player2.userId)

      for answer in @game.player2.answers
        if answer == 'correct'
          $player2Answers.append('<div class="response correct" />')
        else
          $player2Answers.append('<div class="response incorrect" />')

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
    answers = @answerBarForPlayer(@userId) 

    # Convert fractions to floating point
    userChoice = @$answer.val()

    if SS.shared.questions.isCorrect(userChoice, @question)
      @displayMessage('Correct!', 'correct')
      answers.append('<div class="response correct" />')
    else
      @displayMessage('Incorrect', 'incorrect')
      answers.append('<div class="response incorrect" />')
    
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
