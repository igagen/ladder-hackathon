exports.get = (index) ->
    Questions[index % Questions.length]

Questions = [
  {
    stimulus: '''
      For the system of values above, all terms are non-zero. 

      $$a = {b \\over 3}$$
      $$b = 9t$$
      $$a = mt$$

      What is the value of m?
      '''
    explanation: '''
      The correct answer is 3. The first equation reads \\( a = {b \\over 3} \\). Use the second equation and substitute 9t for b.
      
      $$a = {9t \\over 3} = 3t$$

      The third equation reads \\(a = mt\\), so it follows that \\(m = 3\\).
      '''
    correctAnswer: 3
  },

  {
    stimulus: '''
      A new college student is randomly assigned to one of 120 dorm rooms. The student has an equal chance of receiving each of the rooms as an assignment. If exactly 24 of the rooms are painted yellow, what is the probability that the student will be assigned a room that is painted yellow?
      '''
    explanation: '''
      The probability of a particular event is given by the ratio of the number of situations in which that event is true to the number of total possible situations. In this case, there are 24 ways that the student can receive a yellow room (24 of the rooms are painted yellow), while there are 120 total possibilities (each of the dorm rooms).  The probability is 24/120. Dividing top and bottom by 24 gives us 1/5.
      '''
    correctAnswer: 0.2
  }
]
