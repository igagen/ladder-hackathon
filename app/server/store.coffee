GlobalStore = {}

# For example Store.for('Game')
exports.get = (type) ->
  GlobalStore[type] ?= new Store()

class Store
  constructor: ->
    @hash = {}
    @nextId = 0
  
  save: (obj, id = null) ->
    id ?= @nextId++
    @hash[id] = obj
    id

  get: (id) ->
    @hash[id]

  all: ->
    obj for id, obj of @hash

# in other modules
# GameStore = Store.for("Game")
# UserStore = Store.for("User")

# GameStore.save(game)

# GameStore.get(gameId)
