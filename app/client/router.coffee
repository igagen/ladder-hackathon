class Router extends Backbone.Router
  routes:
    "": "lobby"
    "/": "lobby"
    "/solo": "solo"
    "/multi/:id": "multi"
    "/game/:id": "joinGame"
    "/lobby": "lobby"

  lobby: ->
    @loadUser()
    new LobbyView { user: @user, container: $("#content") }

  solo: ->
    @loadUser()
    SS.server.app.createSoloGame @user, (gameData) =>
      @game(gameData)

  multi: (id) ->
    @loadUser()
    if id == "new" 
      SS.server.app.createTwoPlayerGame @user, (gameData) =>
        @game(gameData)
    else if id == "join" 
      SS.server.app.autoJoinTwoPlayerGame @user, (gameData) =>
        @game(gameData)

  game: (gameData) ->
    @loadUser()
    new GameView { user: @user, gameData: gameData, container: $("#content") }

  joinGame: (id) ->
    @loadUser()
    SS.server.app.joinSpecificTwoPlayerGame {id: id, user: @user}, (gameData) =>
      @game(gameData)

  loadUser: ->
    user = localStorage.getItem 'user'
    if user?
      @user = user
    else
      @user = prompt 'Username:'
      localStorage.setItem 'user', @user


window.Router = Router
