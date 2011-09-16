class LobbyView extends Backbone.View
  initialize: (options) ->
    @userId = options.userId
    @$container = options.container

    @render()

  render: ->
    template = $("#template-lobby")
    $(@el).html template.html()
    @$container.html('')
    @$container.prepend(@el)

    @$gamesElem = @.$("#games")

    SS.server.app.getOpenTwoPlayerGames (games) =>
      for gameData in games
        @$gamesElem.append("""
          <div class='game'>
          <h2>#{gameData.state}</h2>
          <a href='/#/game/#{gameData.id}'>Join Game</a>
          </div>
          """)


window.LobbyView = LobbyView