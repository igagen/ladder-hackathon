class Router extends Backbone.Router
  routes:
    "": "lobby"
    "/": "lobby"
    "/lobby": "lobby"
    "/solo": "solo"
    "/multi/:id": "multi"
    "/game/:id": "joinGame"

  # Routes

  lobby: ->
    @authenticate => new LobbyView { userId: @userId, container: $("#content") }

  solo: ->
    @authenticate =>
      SS.server.app.createSoloGame @userId, (gameData) =>
        @game(gameData)

  multi: (id) ->
    @authenticate id, =>
      if id == "new"
        SS.server.app.createTwoPlayerGame @userId, (gameData) =>
          @game(gameData)
      else if id == "join"
        SS.server.app.autoJoinTwoPlayerGame @userId, (gameData) =>
          @game(gameData)

  joinGame: (id) ->
    @authenticate id, =>
      SS.server.app.joinSpecificTwoPlayerGame {gameId: id, userId: @userId}, (gameData) =>
        @game(gameData)

  # Helpers

  game: (gameData) ->
    new GameView { userId: @userId, gameData: gameData, container: $("#content") }

  authenticate: (params, action) =>
    action = params unless action? # support calling with no params
    @fbLoadUser (authenticated) =>
      if authenticated
        action(params)
      else
        alert 'Login'
        new LoginView {container: $("#content")}

  loadUser: (cb) ->
    if @userId?
      cb()
    else
      @userId = prompt 'Username:'
      SS.server.app.login @userId, cb

  fbLoadUser: (cb) =>
    FB.getLoginStatus (response) =>
      if response.authResponse
        @userId = response.authResponse.userID
        @accessToken = response.authResponse.accessToken
        SS.server.app.fbLogin {userId: @userId, accessToken: @accessToken}, => cb(true)
      else
        cb(false)


window.Router = Router
