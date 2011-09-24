class PlayerView
  constructor: (@$container, player) ->
    @userId = player.id
    @userName = player.name
    @answers = player.answers
    @render()

  render: =>
    @$playerDiv = $ """
      <div id='player-#{@userId}' class='player'>
        <img src="http://graph.facebook.com/#{@userId}/picture" />
        <div class='answers' />
        <p><span class='name'>#{@userName}</span>: <span class='points'>0 pts</span></p>
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