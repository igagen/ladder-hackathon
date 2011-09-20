UserStore = require("./store").get("User")

exports.Player = class Player
  constructor: (userId) ->
    @user = UserStore.get(userId)
    @name = @user.name
    @points = 0
    @started = false
    @finished = false
    @answers = []

  answer: (correct) ->
    @answers.push(correct)
    if correct
      @points += 10
    else
      @points -= 10
      @points = 0 if @points < 0
    @points

  playerData: ->
    userId: @user.id
    userName: @name
    answers: @answers
    points: @points
