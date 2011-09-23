class LobbyView extends Backbone.View
  id: 'lobby'

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

    @$fbLogin = @.$("#fb-login")
    @$fbLogin.bind 'click', @fbLogin

    SS.server.app.getOpenTwoPlayerGames (games) =>
      for gameData in games
        @$gamesElem.append("""
          <div class='game'>
            <img src='http://graph.facebook.com/#{gameData.player1.id}/picture' />
            <div class='join-container'>
              <a class='join button' href='/#/game/#{gameData.id}'>Join Challenge</a>
              <div class='player'>#{gameData.player1.name} (#{gameData.player1.rating})</div>
            </div>
            <div class='clear' />
          </div>
          """)


window.LobbyView = LobbyView