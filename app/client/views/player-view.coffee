class PlayerView
  constructor: (@$container, player) ->
    @userId = player.userId
    @userName = player.userName
    @answers = player.answers
    @render()

  render: =>
    @$playerDiv = $ """
      <div id='player-#{@userId}'>
      <p>
        <span class='name'>#{@userName}</span>: <span class='points'>0 pts</span>
      </p>
      <div class='answers' />
      </div>"""
    @$points = $(@$playerDiv.find(".points"))
    @$container.append @$playerDiv

    @$answers = $("#player-#{@userId} .answers") # TODO, scope this backbone view
    for answer in @answers
      @appendAnswer(answer)

  updatePoints: (points) =>
    @$points.html("#{points} pts")

  appendAnswer: (correct) =>
    correctness = if correct then "correct" else "incorrect"
    @$answers.append("<div class='response #{correctness}' />")

window.PlayerView = PlayerView