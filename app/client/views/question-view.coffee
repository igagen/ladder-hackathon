class QuestionView
  constructor: (@question, container) ->
    @$stimulus = container.$("#stimulus")
    @$explanation = container.$("#explanation")

  render: =>
    @$stimulus.html(@question.stimulus)
    @$explanation.hide()
    @$explanation.html(@question.explanation)
    MathJax.Hub.Typeset()

  showExplanation: =>
    @$explanation.show()

window.QuestionView = QuestionView
