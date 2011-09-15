{Game} = require("./game")
{User} = require("./user")
Store = require("./store")
GameStore = Store.get("Game")
UserStore = Store.get("User")

getGame = (id) -> GameStore.get(id)

exports.actions =
  init: (cb) ->
    cb()

  login: (userId, cb) ->
    user = UserStore.get(userId)
    if user
      return cb(UserStore.get(userId))
    else
      return cb(new User(userId))

  getGame: (id, cb) ->
    game = getGame(id)
    if game?
      cb game.gameData()
    else
      cb { error: "No game with id '#{id}'" }

  getOpenTwoPlayerGames: (cb) ->
    gameData = (game.lobbyData() for game in GameStore.all() when game.isOpen())
    cb(gameData)

  playerStart: (params, cb) ->
    game = getGame(params.gameId)
    if game?
      game.playerStart params.userId

  playerFinish: (params, cb) ->
    game = getGame(params.gameId)
    if game?
      game.playerFinish params.userId

  answer: (params, cb) ->
    game = getGame(params.gameId)
    if game?
      cb game.answer(params.userId, params.questionId, params.answer)
    else
      cb({ error: "Invalid game ID: #{params.gameId}" })

  createSoloGame: (userId, cb) ->
    new Game userId, 3, 29, 30, true, (game) =>
      @session.channel.subscribe("game/#{game.id}")
      cb(game.gameData())

  createTwoPlayerGame: (userId, cb) ->
    new Game userId, 3, 29, 30, false, (game) =>
      @session.channel.subscribe("game/#{game.id}")
      cb(game.gameData())

  joinSpecificTwoPlayerGame: (params, cb) ->
    game = getGame(params.gameId)
    if game.isOpenForUser(params.userId)
      @session.channel.subscribe("game/#{game.id}")
      game.join(params.userId)
      cb(game.gameData())
    else
      # in case no players available, fall back to createTwoPlayerGame
      @createTwoPlayerGame(params.userId, cb)

  autoJoinTwoPlayerGame: (userId, cb) ->
    for game in GameStore.all() when game.isOpenForUser(userId)
      @session.channel.subscribe("game/#{game.id}")
      game.join(userId)
      return cb(game.gameData())

    # in case no players available, fall back to createTwoPlayerGame
    @createTwoPlayerGame(userId, cb)
