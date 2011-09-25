id = 0
class TimerView # extends Backbone.View
  constructor: (gameView, @duration, @playerFinish) ->
    @$timer = gameView.$("#timer")
    @$minutes = gameView.$("#timer .minutes")
    @$seconds = gameView.$("#timer .seconds")
    @id = id++
    console.log "Constructing timer view:", @id
    @renderRemainingTime(@duration)
    @stopped = true

  start: ->
    @stopped = false
    currentTime = new Date().getTime() 
    @endTime = new Date(currentTime + @duration * 1000)
    @timerInterval = setInterval @renderTimer, 250

  renderTimer: =>
    currentTime = new Date()
    remainingMillis = @endTime - currentTime 
    remainingTime = Math.floor(remainingMillis / 1000)
    @renderRemainingTime(remainingTime)

  renderRemainingTime: (remainingTime) ->
    if remainingTime > 0
      remainingMinutes = Math.floor(remainingTime / 60)
      remainingSeconds = Math.floor(remainingTime % 60)
      # zero pad
      remainingMinutes = "0" + remainingMinutes if remainingMinutes < 10
      remainingSeconds = "0" + remainingSeconds if remainingSeconds < 10

      @$minutes.html(remainingMinutes)
      @$seconds.html(remainingSeconds)
    else
      @$minutes.html("00")
      @$seconds.html("00")
      @$timer.addClass('finished')

      console.log "Clearing timer interval:", @timerInterval

      clearInterval @timerInterval

      if @stopped == true
        console.error "Timer is already stopped"
      else
        @playerFinish()
        @stopped = true

window.TimerView = TimerView
