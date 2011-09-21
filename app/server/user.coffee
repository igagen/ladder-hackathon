UserStore = require("./store").get("User")

exports.User = class User
  K: 24

  constructor: (@id, @name, cb) ->
    @rating = 1000
    UserStore.save(@, @id)

    cb(@)
