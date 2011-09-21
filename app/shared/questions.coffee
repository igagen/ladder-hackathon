exports.isCorrect = (userChoice, question) ->
  parts = (part.trim() for part in userChoice.split('/'))
  if parts.length == 2
    userChoice = parseFloat(parts[0]) / parseFloat(parts[1])
  else
    userChoice = parseFloat(parts[0])
  userChoice == question.correctAnswer
