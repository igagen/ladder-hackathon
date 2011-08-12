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
    @answers = @.$(".answers")
    @confirmButton = @.$("#confirm")
    @question = @game.questions[@game.currentQuestion]

    @renderQuestion()

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

  handleKeyPress: (event) =>
    if event.keyCode == 13
      @confirmAnswer()

  advanceQuestion: ->
    @game.currentQuestion++
    @game.currentQuestion = 0 if @game.currentQuestion >= @game.questions.length
    @question = @game.questions[@game.currentQuestion]
    @answer.val('')

  confirmAnswer: =>
    if parseFloat(@answer.val()) == @question.x
      @displayMessage('Correct!', 'correct')
      @answers.append('<div class="response correct" />')
    else
      @displayMessage('Incorrect', 'incorrect')
      @answers.append('<div class="response incorrect" />')

    @advanceQuestion()
    @renderQuestion()

  displayMessage: (message, klass = "") ->
    @message.html(message)
    @message.attr('class', klass)
    setTimeout (=> @message.addClass('hidden')), 3000


window.GameView = GameView
