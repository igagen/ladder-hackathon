class LobbyView extends Backbone.View
  initialize: (options) ->
    @userId = options.userId
    @$container = options.container

    @render()

  fbLogin: =>
    FB.login ((response) ->
      if response.authResponse
        console.log "Welcome!  Fetching your information.... "
        FB.api "/me", (response) ->
          console.log "Good to see you, " + response.name + "."
          FB.logout (response) ->
            console.log "Logged out."
      else
        console.log "User cancelled login or did not fully authorize."
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