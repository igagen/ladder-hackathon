class Router extends Backbone.Router
  routes:
    "": "lobby"
    "/": "lobby"
    "/login": "login"
    "/lobby": "lobby"
    "/solo": "solo"
    "/multi/:id": "multi"
    "/game/:id": "joinGame"

  # Routes

  login: ->
    new LoginView {container: $("#content")}

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
        new LoginView {container: $("#content")}

  fbLoadUser: (cb) =>
    # For some reason FB.getLoginStatus sometimes hangs and never fires the callback
    timeout = setTimeout (-> cb(false)), 2000

    FB.getLoginStatus ((response) =>
      clearTimeout(timeout)
      if response.authResponse
        @userId = response.authResponse.userID
        @accessToken = response.authResponse.accessToken
        SS.server.app.fbLogin {userId: @userId, accessToken: @accessToken}, => cb(true)
      else
        cb(false)
    ), true


window.Router = Router
