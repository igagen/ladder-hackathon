class Router extends Backbone.Router
  routes:
    "": "createOrJoinGame"
    "/": "createOrJoinGame"
    "/game/:id": "game"

  game: (id) ->
    @loadUser()
    SS.server.app.getGame id, (gameData) ->
      new GameView { user: @user, gameData: gameData, container: $("#content") }

  createOrJoinGame: ->
    @loadUser()
    SS.server.app.createOrJoinGame @user, (gameData) ->
      window.location.hash = "#/game/#{gameData.id}"
      new GameView { user: @user, gameData: gameData, container: $("#content") }

  loadUser: ->
    username = localStorage.getItem 'username'
    if username?
      @user = username
    else
      @user = prompt 'Username:'
      localStorage.setItem 'username', @user



window.Router = Router
