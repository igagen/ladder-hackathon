

class GameView extends Backbone.View
  events:
    "click #confirm-button": "confirmAnswer"
    "click .start.button": "playerStart"

  initialize: (options) ->
    $(window).bind "keypress", @handleKeyPress

    @user = options.user
    @game = options.gameData
    @$container = options.container

    @render()

    @$message = @.$("#message")
    @$answer = @.$("#answer")
    @$players = @.$("#players")
    @$timer = @.$("#timer")
    @$minutes = @.$("#timer .minutes")
    @$seconds = @.$("#timer .seconds")
    @$confirmButton = @.$("#confirm")
    @$gameStates= @.$(".game-state")
    @$open = @.$(".open")
    @$ready = @.$(".ready")
    @$started = @.$(".start")
    @$finished = @.$(".finish")
    @$result = @.$(".finish h2")

    @currentQuestion = @game.answers[@user].length
    @question = @game.questions[@currentQuestion]

    @totalTime = @game.duration
    @elapsedTime = 0

    @renderQuestion()
    @renderPlayers()
    @renderTimer()

    SS.events.on "game/#{@game.id}", (event) =>
      console.debug event
      @[event.action](event)

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
    @game.player2 = o.player.username
    @game.points[@game.player2] = 0
    @game.ratings[@game.player2] = o.rating
    @renderPlayers()
    @displayMessage("#{@game.player2} has joined!", "correct")

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
    SS.server.app.playerStart { user: @user, gameId: @game.id }, (result) =>

  playerFinish: ->
    SS.server.app.playerFinish { user: @user, gameId: @game.id }, (result) =>

  renderResults: (o) ->
    if @game.points[@game.player1] > @game.points[@game.player2]
      @$result.html("#{@game.player1} wins!")
    else if @game.points[@game.player2] > @game.points[@game.player1]
      @$result.html("#{@game.player2} wins!")
    else
      @$result.html("Draw")

    if o?
      @game.ratings[@game.player1] = o.ratings[@game.player1]
      @game.ratings[@game.player2] = o.ratings[@game.player2]
      @.$("##{@game.player1} .rating").html(o.ratings[@game.player1])
      @.$("##{@game.player2} .rating").html(o.ratings[@game.player2])

  finish: (o) ->
    @$gameStates.hide()
    @$finished.show()
    @state = 'finish'
    @renderResults(o)

  answer: (o) ->
    @game.points[o.player] = o.points
    @.$("##{o.player} .points").html("#{o.points} pts")

    return if @user == o.player
    answers = @.$("##{o.player} .answers")
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
    # @a = @.$("#a")
    # @a.html(@question.a)
    # @b = @.$("#b")
    # @b.html(@question.b)
    @$explanation = @.$("#explanation")
    SS.server.app.question '0', (question) =>
      @$explanation.html(question.explanation)
      MathJax.Hub.Typeset()

  renderPlayers: ->
    @$players.html('')
    @$players.append "<div id='#{@game.player1}'><p><span class='name'>#{@game.player1}</span> (<span class='rating'>#{@game.ratings[@game.player1]}</span>): <span class='points'>0 pts</span></p><div class='answers' /></div>"
    player1Answers = @.$("##{@game.player1} .answers")
    for answer in @game.answers[@game.player1]
      if answer == 'correct'
        player1Answers.append('<div class="response correct" />')
      else
        player1Answers.append('<div class="response incorrect" />')

    if @game.player2?
      @$players.append "<div style='clear:both' /><div id='#{@game.player2}'><p><span class='name'>#{@game.player2}</span> (<span class='rating'>#{@game.ratings[@game.player2]}</span>): <span class='points'>0 pts</span></p><div class='answers' /></div>" if @game.player2?
      player2Answers = @.$("##{@game.player2} .answers")
      if @game.answers[@game.player2]?
        for answer in @game.answers[@game.player2]
          if answer == 'correct'
            player2Answers.append('<div class="response correct" />')
          else
            player2Answers.append('<div class="response incorrect" />')

  handleKeyPress: (event) =>
    if event.keyCode == 13
      @confirmAnswer()

  advanceQuestion: ->
    @currentQuestion++
    @currentQuestion = 0 if @currentQuestion >= @game.questions.length
    @question = @game.questions[@currentQuestion]
    @$answer.val('')

  confirmAnswer: =>
    return unless @state == 'start'
    answers = @.$("##{@user} .answers")
    if parseFloat(@$answer.val()) == @question.x
      @displayMessage('Correct!', 'correct')
      answers.append('<div class="response correct" />')
    else
      @displayMessage('Incorrect', 'incorrect')
      answers.append('<div class="response incorrect" />')

    SS.server.app.answer { user: @user, gameId: @game.id, questionId: @currentQuestion, answer: @$answer.val() }, (result) ->

    @advanceQuestion()
    @renderQuestion()

  displayMessage: (message, klass = "") ->
    @$message.html(message)
    @$message.attr('class', klass)
    setTimeout (=> @$message.addClass('hidden')), 3000


window.GameView = GameView
