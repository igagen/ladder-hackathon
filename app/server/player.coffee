UserStore = require("./store").get("User")

exports.Player = class Player
  constructor: (userId) ->
    @user = UserStore.get(userId)
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

  lobbyData: ->
    id: @id()
    name: @name()
    rating: @rating()

  gameData: ->
    id: @id()
    name: @name()
    rating: @rating()
    answers: @answers
    points: @points

  id: -> @user.id
  name: -> @user.name
  rating: -> @user.rating
