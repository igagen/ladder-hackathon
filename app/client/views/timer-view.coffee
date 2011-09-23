class TimerView # extends Backbone.View
  constructor: (gameView, @duration, @playerFinish) ->
    @duration = 15
    @$timer = gameView.$("#timer")
    @$minutes = gameView.$("#timer .minutes")
    @$seconds = gameView.$("#timer .seconds")
    @renderRemainingTime(@duration)

  start: ->
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
      clearInterval @timerInterval
      console.log "TimerView#{@id} finished"
      @playerFinish()

window.TimerView = TimerView
