GlobalStore = {}

# For example Store.for('Game')
exports.get = (type) ->
  GlobalStore[type] ?= new Store()

class Store
  constructor: ->
    @hash = {}
    @nextId = 0

  # TODO: This should take a callback
  save: (obj, id = null) ->
    id ?= @nextId++
    @hash[id] = obj
    id

  destroy: (id) ->
    delete @hash[id]

  get: (id) ->
    @hash[id]

  all: ->
    obj for id, obj of @hash