{Game} = require("./game")
{User} = require("./user")
Store = require("./store")
GameStore = Store.get("Game")
UserStore = Store.get("User")

https = require("https")

# Constants

GAME_DURATION = 15

# Helpers

getGame = (id) -> GameStore.get(id)

getFacebookUser = (userId, accessToken, cb) ->
  https.get {host: "graph.facebook.com", path: "/#{userId}?access_token=#{accessToken}"}, (res) ->
    data = ''
    res.on "data", (d) ->
      data += d

    res.on "end", ->
      cb(JSON.parse(data))

# Actions

exports.actions =
  init: (cb) ->
    cb()

  # TODO: Don't send access token to server, especially over a non-encrypted web socket connection
  # The right way to do this is to capture the access token on the server from Facebook's
  # signed request POST that gets sent on initial app load.
  fbLogin: (params, cb) ->
    user = UserStore.get(params.userId)
    if user
      @saveUserSession params.userId, params.accessToken, cb
    else
      getFacebookUser params.userId, params.accessToken, (facebookUser) =>
        new User params.userId, facebookUser.name, =>
          @session.channel.unsubscribeAll()
          @saveUserSession params.userId, params.accessToken, cb

  saveUserSession: (userId, accessToken, cb) ->
    @session.setUserId userId, =>
      @clearOpenGames ->
      @session.attributes = {accessToken: accessToken}
      @session.save cb

  getGame: (id, cb) ->
    game = getGame(id)
    if game?
      cb game.gameData()
    else
      cb { error: "No game with id '#{id}'" }

  getLobbyData: (cb) ->
    openGames = (game.lobbyData() for game in GameStore.all() when game.isOpen())
    topPlayers = UserStore.all().sort (user1, user2) -> user2.rating - user1.rating
    topPlayers.length = 10 if topPlayers.length > 10
    lobbyData =
      openGames: openGames
      topPlayers: topPlayers
    cb(lobbyData)

  playerStart: (params, cb) ->
    game = getGame(params.gameId)
    if game?
      game.playerStart params.userId
      cb({success: "Player #{params.userId} started game #{params.gameId}"})
    else
      cb({error: "Couldn't find game with id: #{params.gameId}"})

  playerFinish: (params, cb) ->
    game = getGame(params.gameId)
    if game?
      game.playerFinish @session.user_id
      cb({success: "Player #{@session.user_id} finished game #{params.gameId}"})
    else
      cb({error: "Couldn't find game with id: #{params.gameId}"})

  playerUnsubscribe: (gameId, cb) ->
    @session.channel.unsubscribe("game/#{gameId}")
    console.log "Player #{@session.user_id} unsubscribed from game #{@gameId}"
    cb()

  answer: (params, cb) ->
    game = getGame(params.gameId)
    if game?
      cb game.answer(params.userId, params.questionId, params.answer)
    else
      cb({ error: "Invalid game ID: #{params.gameId}" })

  createSoloGame: (cb) ->
    new Game @session, GAME_DURATION, true, (game) =>
      cb(game.gameData())

  createTwoPlayerGame: (cb) ->
    new Game @session, GAME_DURATION, false, (game) =>
      cb(game.gameData())

  joinSpecificTwoPlayerGame: (params, cb) ->
    game = getGame(params.gameId)
    if game.isOpenForUser(@session.user_id)

      game.join(@session)
      cb(game.gameData())
    else
      # in case no players available, fall back to createTwoPlayerGame
      @createTwoPlayerGame(cb)

  autoJoinTwoPlayerGame: (cb) ->
    for game in GameStore.all() when game.isOpenForUser(@session.user_id)
      game.join(@session)
      return cb(game.gameData())

    # in case no players available, fall back to createTwoPlayerGame
    @createTwoPlayerGame(cb)

  # Clear any open games for this user
  clearOpenGames: (cb) ->
    for game in GameStore.all() when game.isOpen() && game.userId1 == @session.user_id
      GameStore.destroy(game.id)
    cb() if cb?
