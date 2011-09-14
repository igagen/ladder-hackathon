UserStore = require("./store").get("User")

exports.User = class User
  K: 24

  constructor: (@username, cb) ->
    key = "user:#{@username}:rating"

    UserStore.save(@, @username)

    R.get key, (error, data) =>
      if data?
        @rating = parseFloat(data)
      else
        @rating = 1000
        @setRating(@rating)

      cb(@)

  getRating: ->
    @rating

  setRating: (rating) ->
    @rating = rating
    R.set "user:#{@username}:rating", @rating

  # Update both players ratings based on match results
  # sa, sb are the outcome values from this player's perspective (sa) and the opponents perspective (sb)
  # If this player won, sa would be 1.0 and sb would be 0.0
  # If the match was a draw, sa and sb would both be 0.5
  updateRatings: (user2, sa, sb) ->
    ra = @getRating()
    rb = user2.getRating()

    qa = Math.pow(10, ra / 400)
    qb = Math.pow(10, rb / 400)

    # Expected outcomes
    ea = qa / (qa + qb)
    eb = qb / (qa + qb)

    # Calculate updated ratings
    ra = Math.floor(ra + @K * (sa - ea))
    rb = Math.floor(rb + @K * (sb - eb))

    @setRating ra
    user2.setRating rb