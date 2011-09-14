class Router extends Backbone.Router
  routes:
    "": "lobby"
    "/": "lobby"
    "/create_or_join": "createOrJoin"
    "/game/:id": "game"
    "/lobby": "lobby"

  game: (id) ->
    @loadUser()
    SS.server.app.getGame id, (gameData) =>
      new GameView { user: @user, gameData: gameData, container: $("#content") }

  lobby: ->
    @loadUser()
    new LobbyView { user: @user, container: $("#content") }

  createOrJoin: ->
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
