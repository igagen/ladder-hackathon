{Game} = require("./game")
{User} = require("./user")
Store = require("./store")
GameStore = Store.get("Game")
UserStore = Store.get("User")

getGame = (id) -> GameStore.get(id)

exports.actions =
  init: (cb) ->
    cb()

  login: (username, cb) ->
    user = UserStore.get(username)
    if user
      return cb(UserStore.get(username))
    else
      return cb(new User(username))

  getGame: (id, cb) ->
    game = getGame(id)
    if game?
      cb game
    else
      cb { error: "No game with id '#{id}'" }

  getOpenTwoPlayerGames: (cb) ->
    gameData = (game.lobbyData() for game in GameStore.all() when game.isOpen())
    cb(gameData)

  playerStart: (params, cb) ->
    game = getGame(params.gameId)
    if game?
      game.playerStart params.user

  playerFinish: (params, cb) ->
    game = getGame(params.gameId)
    if game?
      game.playerFinish params.user

  answer: (params, cb) ->
    game = getGame(params.gameId)
    if game?
      cb game.answer(params.user, params.questionId, params.answer)
    else
      cb({ error: "Invalid game ID: #{params.gameId}" })

  createSoloGame: (player, cb) ->
    new Game player, 3, 29, 30, true, (game) =>
      @session.channel.subscribe("game/#{game.id}")
      cb(game)

  createTwoPlayerGame: (player, cb) ->
    new Game player, 3, 29, 30, false, (game) =>
      @session.channel.subscribe("game/#{game.id}")
      cb(game)

  joinSpecificTwoPlayerGame: (params, cb) ->
    game = getGame(params.id)
    if game.isOpenForMe(params.user)
      @session.channel.subscribe("game/#{game.id}")
      game.join(params.user)
      cb(game)
    else
      # in case no players available, fall back to createTwoPlayerGame
      @createTwoPlayerGame(params.user, cb)

  autoJoinTwoPlayerGame: (player, cb) ->
    for game in GameStore.all() when game.isOpenForMe(player)
      @session.channel.subscribe("game/#{game.id}")
      game.join(player)
      return cb(game)

    # in case no players available, fall back to createTwoPlayerGame
    @createTwoPlayerGame(player, cb)
