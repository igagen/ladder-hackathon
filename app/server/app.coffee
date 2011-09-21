{Game} = require("./game")
{User} = require("./user")
Store = require("./store")
GameStore = Store.get("Game")
UserStore = Store.get("User")

https = require("https")

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

  login: (userId, cb) ->
    user = UserStore.get(userId)
    if user
      @session.setUserId user.id, cb
    else
      new User userId, userId, => @session.setUserId userId, cb

  # TODO: Don't send access token to server, especially over a non-encrypted web socket connection
  # The right way to do this is to capture the access token on the server from Facebook's
  # signed request POST that gets sent on initial app load.
  fbLogin: (params, cb) ->
    console.log "fbLogin", params

    user = UserStore.get(params.userId)
    if user
      @saveUserSession params.userId, params.accessToken, cb
    else
      getFacebookUser params.userId, params.accessToken, (facebookUser) =>
        new User params.userId, facebookUser.name, =>
          @saveUserSession params.userId, params.accessToken, cb
  
  saveUserSession: (userId, accessToken, cb) ->
    @session.setUserId userId, =>
      @session.attributes = {accessToken: accessToken}
      @session.save cb

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
    console.log "Session:", @session
    new Game userId, 3, 29, 30, true, (game) =>
      @session.channel.subscribe("game/#{game.id}")
      cb(game.gameData())

  createTwoPlayerGame: (userId, cb) ->
    new Game userId, 3, 29, 30, false, (game) =>
      @session.channel.subscribe("game/#{game.id}")
      cb(game.gameData())

  joinSpecificTwoPlayerGame: (params, cb) ->
    game = getGame(params.gameId)
    if game.isOpenForUser(@session.user_id)
      @session.channel.subscribe("game/#{game.id}")
      game.join(@session.user_id)
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
