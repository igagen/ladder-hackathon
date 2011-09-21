class LobbyView extends Backbone.View
  initialize: (options) ->
    @userId = options.userId
    @$container = options.container

    @render()

  fbLogin: =>
    FB.login ((response) ->
      if response.authResponse
        SS.server.app.login response.authResponse, ->
          console.log "Authentication complete"
      else
        console.log "Authentication failed"
    ), scope: "email"

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
          <h2>#{gameData.state}</h2>
          <a href='/#/game/#{gameData.id}'>Join Game</a>
          </div>
          """)


window.LobbyView = LobbyView