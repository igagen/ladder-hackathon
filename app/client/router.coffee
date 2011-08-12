Index = 0
Username = 'user'

class Router extends Backbone.Router
  routes:
    "": "root"
    "/": "root"
    "/game": "createOrJoinGame"

  root: ->

  createOrJoinGame: ->
    username = "#{Username}#{Index++}"
    SS.server.app.createOrJoinGame username, (gameData) ->
      game = new Game { id: gameData.id, gameData: gameData }
      new GameView { model: game, gameData: gameData, container: $("#content") }


window.Router = Router
