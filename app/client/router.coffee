class Router extends Backbone.Router
  routes:
    "": "createOrJoinGame"
    "/": "createOrJoinGame"
    "/game/:id": "game"

  game: (id) ->
    @loadUser()
    SS.server.app.getGame id, (gameData) =>
      new GameView { user: @user, gameData: gameData, container: $("#content") }

  createOrJoinGame: ->
    @loadUser()
    SS.server.app.createOrJoinGame @user, (gameData) =>
      window.location.hash = "#/game/#{gameData.id}"

  loadUser: ->
    user = localStorage.getItem 'user'
    if user?
      @user = user
    else
      @user = prompt 'Username:'
      localStorage.setItem 'user', @user


window.Router = Router
