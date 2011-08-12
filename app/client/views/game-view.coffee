class GameView extends Backbone.View
  events:
    "click #confirm-button": "confirmAnswer"

  initialize: (options) ->
    $(window).bind "keypress", @handleKeyPress

    @user = options.user
    @game = options.gameData
    @container = options.container

    @render()

    @message = @.$("#message")
    @answer = @.$("#answer")
    @players = @.$("#players")
    @timer = @.$("#timer")
    @minutes = @.$("#timer .minutes")
    @seconds = @.$("#timer .seconds")
    @confirmButton = @.$("#confirm")
    @currentQuestion = @game.answers[@user].length
    @question = @game.questions[@currentQuestion]

    @renderQuestion()
    @renderPlayers()

    SS.events.on "game/#{@game.id}", (event) =>
      console.debug "Event: #{event}"
      if event.action == 'join'
        @game.player2 = event.player
        @players.append "<div style='clear:both' /><div id='#{@game.player2}'><p><span class='name'>#{@game.player2}</span>: <span class='points'>0 pts</span></p><div class='answers' /></div>"
      else if event.action == 'answer' && event.player != @user
        answers = @.$("##{event.player} .answers")
        if event.answer == 'correct'
          answers.append('<div class="response correct" />')
        else
          answers.append('<div class="response incorrect" />')

    @startTimer()

  render: ->
    template = $("#game-template")
    $(@el).html template.html()
    @container.html('')
    @container.prepend(@el)

  renderTimer: ->
    remainingTime = @totalTime - @elapsedTime
    if remainingTime > 0
      remainingMinutes = Math.floor(remainingTime / 60)
      remainingSeconds = Math.floor(remainingTime % 60)
      # zero pad
      remainingMinutes = "0" + remainingMinutes if remainingMinutes < 10
      remainingSeconds = "0" + remainingSeconds if remainingSeconds < 10

      @minutes.html(remainingMinutes)
      @seconds.html(remainingSeconds)
    else
      @minutes.html("00")
      @seconds.html("00")
      @timer.addClass('finished')
      clearInterval @timerInterval


  startTimer: ->
    @startTime = new Date(@game.startTime)
    @totalTime = @game.duration
    @elapsedTime = 0
    @timerInterval = setInterval @updateTimer, 250
    @updateTimer()

  updateTimer: =>
    currentTime = new Date()
    elapsedMillis = currentTime - @startTime
    @elapsedTime = Math.floor(elapsedMillis / 1000)
    @renderTimer()

  renderQuestion: ->
    @a = @.$("#a")
    @a.html(@question.a)
    @b = @.$("#b")
    @b.html(@question.b)

  renderPlayers: ->
    @players.html('')
    @players.append "<div id='#{@game.player1}'><p><span class='name'>#{@game.player1}</span>: <span class='points'>0 pts</span></p><div class='answers' /></div>"
    player1Answers = @.$("##{@game.player1} .answers")
    for answer in @game.answers[@game.player1]
      if answer == 'correct'
        player1Answers.append('<div class="response correct" />')
      else
        player1Answers.append('<div class="response incorrect" />')

    if @game.player2?
      @players.append "<div style='clear:both' /><div id='#{@game.player2}'><p><span class='name'>#{@game.player2}</span>: <span class='points'>0 pts</span></p><div class='answers' /></div>" if @game.player2?
      player2Answers = @.$("##{@game.player2} .answers")
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
    @answer.val('')

  confirmAnswer: =>
    answers = @.$("##{@user} .answers")
    if parseFloat(@answer.val()) == @question.x
      @displayMessage('Correct!', 'correct')
      answers.append('<div class="response correct" />')
    else
      @displayMessage('Incorrect', 'incorrect')
      answers.append('<div class="response incorrect" />')

    SS.server.app.answer { user: @user, gameId: @game.id, questionId: @currentQuestion, answer: @answer.val() }, (result) ->

    @advanceQuestion()
    @renderQuestion()

  displayMessage: (message, klass = "") ->
    @message.html(message)
    @message.attr('class', klass)
    setTimeout (=> @message.addClass('hidden')), 3000


window.GameView = GameView
