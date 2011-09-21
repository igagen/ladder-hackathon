_ = require('../../lib/client/3.underscore.js')
{questionTemplates, interpolationSyntax} = require "./question_templates"

exports.get = (index) ->
    Questions[index % Questions.length]

Questions = do ->  
  _.templateSettings =
    interpolate : interpolationSyntax

  convert = (s, data) -> _.template(s) data

  questions = []
  for qt in questionTemplates
    for variation in qt.variations()
      questions.push
        stimulus: convert qt.stimulus, variation
        explanation: convert qt.explanation, variation
        correctAnswer: variation.correctAnswer
  _(questions).sortBy -> Math.random()
