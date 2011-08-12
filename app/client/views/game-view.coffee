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

  render: ->
    template = $("#game-template")
    $(@el).html template.html()
    @container.html('')
    @container.prepend(@el)

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
