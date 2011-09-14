class Router extends Backbone.Router
  routes:
    "": "lobby"
    "/": "lobby"
    "/solo": "solo"
    "/multi/:id": "multi"
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
      SS.server.app.joinTwoPlayerGame @user, (gameData) =>
        @game(gameData)
    else
      SS.server.app.getGame id, (gameData) =>
        @game(gameData)

  game: (gameData) ->
    new GameView { user: @user, gameData: gameData, container: $("#content") }

  loadUser: ->
    user = localStorage.getItem 'user'
    if user?
      @user = user
    else
      @user = prompt 'Username:'
      localStorage.setItem 'user', @user


window.Router = Router
