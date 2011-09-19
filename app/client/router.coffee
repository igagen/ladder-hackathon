class Router extends Backbone.Router
  routes:
    "": "lobby"
    "/": "lobby"
    "/solo": "solo"
    "/multi/:id": "multi"
    "/game/:id": "joinGame"
    "/lobby": "lobby"

  lobby: ->
    @loadUser =>
      new LobbyView { userId: @userId, container: $("#content") }

  solo: ->
    @loadUser =>
      SS.server.app.createSoloGame @userId, (gameData) =>
        @game(gameData)

  multi: (id) ->
    @loadUser =>
      if id == "new"
        SS.server.app.createTwoPlayerGame @userId, (gameData) =>
          @game(gameData)
      else if id == "join"
        SS.server.app.autoJoinTwoPlayerGame @userId, (gameData) =>
          @game(gameData)

  game: (gameData) ->
    @loadUser =>
      new GameView { userId: @userId, gameData: gameData, container: $("#content") }

  joinGame: (id) ->
    @loadUser =>
      SS.server.app.joinSpecificTwoPlayerGame {gameId: id, userId: @userId}, (gameData) =>
        @game(gameData)

  loadUser: (cb) ->
    userId = localStorage.getItem 'userId'
    if userId?
      @userId = userId
      cb()
    else
      @userId = prompt 'Username:'
      localStorage.setItem 'userId', @userId
      SS.server.app.login @userId, cb


window.Router = Router
