class PlayerView
  constructor: (@$container, player) ->
    @userId = player.userId
    @userName = player.userName
    @answers = player.answers
    @render()

  render: =>
    @$container.append """
      <div id='#{@userId}'>
      <p>
        <span class='name'>#{@userName}</span>: <span class='points'>0 pts</span>
      </p>
      <div class='answers' />
      </div>"""

    @$answers = $("##{@userId} .answers") # TODO, scope this backbone view
    for answer in @answers
      @appendAnswer(answer)
      
  appendAnswer: (correct) =>
    correctness = if correct then "correct" else "incorrect"
    @$answers.append("<div class='response #{correctness}' />")

window.PlayerView = PlayerView