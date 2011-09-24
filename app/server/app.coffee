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
          @saveUserSession params.userId, params.accessToken, cb

  saveUserSession: (userId, accessToken, cb) ->
    @session.setUserId userId, =>
      @clearOpenGames userId, ->
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
    lobbyData =
      openGames: openGames
      topPlayers: UserStore.all()
    console.log "getLobbyData:", lobbyData
    cb(lobbyData)

  playerStart: (params, cb) ->
    console.log "playerStart", params
    game = getGame(params.gameId)
    console.log "game:", game
    if game?
      game.playerStart params.userId
      cb({success: "Player #{params.userId} started game #{params.gameId}"})
    else
      cb({error: "Couldn't find game with id: #{params.gameId}"})

  playerFinish: (params, cb) ->
    game = getGame(params.gameId)
    if game?
      game.playerFinish params.userId
      console.log "Player #{params.userId} finished game #{params.gameId}"
      cb({success: "Player #{params.userId} finished game #{params.gameId}"})
    else
      console.log "Couldn't find game with id: #{params.gameId}" 
      cb({error: "Couldn't find game with id: #{params.gameId}"})

  answer: (params, cb) ->
    game = getGame(params.gameId)
    if game?
      cb game.answer(params.userId, params.questionId, params.answer)
    else
      cb({ error: "Invalid game ID: #{params.gameId}" })

  createSoloGame: (userId, cb) ->
    new Game userId, 60, true, (game) =>
      @session.channel.subscribe("game/#{game.id}")
      cb(game.gameData())

  createTwoPlayerGame: (userId, cb) ->

    console.log "createTwoPlayerGame:", userId
    new Game userId, 60, false, (game) =>
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
    console.log "autoJoinTwoPlayerGame:", userId
    for game in GameStore.all() when game.isOpenForUser(userId)
      @session.channel.subscribe("game/#{game.id}")
      game.join(userId)
      return cb(game.gameData())

    # in case no players available, fall back to createTwoPlayerGame
    @createTwoPlayerGame(userId, cb)

  # Clear any open games for this user
  clearOpenGames: (userId, cb) ->
    for game in GameStore.all() when game.isOpen() && game.userId1 == userId
      console.log "Clearing open game: #{game.id}, for user: #{userId}"
      GameStore.destroy(game.id)
    cb() if cb?
