class LoginView extends Backbone.View
  initialize: (options) ->
    @$container = options.container

    @render()

  fbLogin: =>
    FB.login ((response) ->
      if response.authResponse
        SS.server.app.fbLogin {userId: response.authResponse.userID, accessToken: response.authResponse.accessToken}, ->
          new LobbyView { userId: @userId, container: $("#content") }
      else
        console.log "Authentication failed"
    ), scope: "email"

  render: ->
    template = $("#template-login")
    $(@el).html template.html()
    @$container.html('')
    @$container.prepend(@el)

    @$loginButton = $("#login-button")
    @$loginButton.bind 'click', @fbLogin


window.LoginView = LoginView