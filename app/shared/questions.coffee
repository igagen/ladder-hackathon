exports.get = (id) ->
    Questions[id]

Questions =
  '0':
    explanation: '''
      $$a = {b \\over 3}$$
      $$b = 9t$$
      $$a = mt$$'''

  '1':
    stimulus: '''The length of a rectangular room is 3.5 feet longer than the width.  The area of the room is 102 ft.  What is the length of the room?'''
    explanation: '''$$x = {-b \\pm \\sqrt{b^2-4ac} \\over 2a}.$$'''
    correctAnswer: 12
    