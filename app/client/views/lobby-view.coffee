class LobbyView extends Backbone.View
  initialize: (options) ->
    $(window).bind "keypress", @handleKeyPress

    @user = options.user
    @$container = options.container

    @render()

  render: ->
    template = $("#lobby-template")
    $(@el).html template.html()
    @$container.html('')
    @$container.prepend(@el)


window.LobbyView = LobbyView
