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

    @$games = @.$("#games")
    @$leaders = @.$("#leaders ol")

    @$fbLogin = @.$("#fb-login")
    @$fbLogin.bind 'click', @fbLogin

    SS.server.app.getLobbyData (lobbyData) =>
      for game in lobbyData.openGames
        @$games.append("""
          <div class='game'>
            <img src='http://graph.facebook.com/#{game.player1.id}/picture' />
            <div class='join-container'>
              <a class='join button' href='/#/game/#{game.id}'>Join Challenge</a>
              <div class='player'>#{game.player1.name} (#{game.player1.rating})</div>
            </div>
            <div class='clear' />
          </div>
          """)

      for player in lobbyData.topPlayers
        @$leaders.append("""
          <li class='player'>
            <img class='avatar' src="http://graph.facebook.com/#{player.id}/picture" />
            <span>#{player.rating}</span> - #{player.name}
          </li>
        """)


window.LobbyView = LobbyView