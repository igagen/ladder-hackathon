exports.get = (index) ->
    Questions[index % Questions.length]


exports.isCorrect = (userChoice, question) ->
  parts = (part.trim() for part in userChoice.split('/'))
  if parts.length == 2
    userChoice = parseFloat(parts[0]) / parseFloat(parts[1])
  else
    userChoice = parseFloat(parts[0])

  userChoice == question.correctAnswer

Questions = [
  {
    stimulus: '''
      The first two terms of a sequence are a and 4a, and each term after the first is 4 times the preceding term. If the sum of the first 4 terms of the sequence is 510, what is the value of a?
      '''
    explanation: '''
      Since each term is 4 times the preceding term, the first four terms of this sequence are a, 4a, 16a, and 64a. The sum of these four terms is 85a. We're told that the first four terms add to 510, so we know that 85a = 510, which means:
      $$a = {510 \\over 85} = 6$$
      '''
    correctAnswer: 6
  },

  {
    stimulus: '''If \\( f(x) = 15 + {x^2 \\over 9} \\) and \\( f(3k) = 8k \\), what is the least possible value for \\(k\\)?'''
    explanation: '''
      Substituting \\(3k\\) for \\(x\\), we get that \\(f(3k) = 15 + {(3k)^2 \\over 9}\\). We're also told that \\(f(3k) = 8k\\), so we can set the two expressions equal.
      
      $$15 + {(3k)^2 \\over 9} = 8k$$
      $$15 + {9k^2 \\over 9} = 8k$$
      $$15 + k^2 = 8k$$
      $$k^2 - 8k + 15 = 0$$
      $$(k - 5)(k - 3) = 0$$
      $$k = {5, 3}$$

      So the two possible values for \\(k\\) are 3 and 5, and thus 3 is the least possible solution.
    '''
    correctAnswer: 3
  },

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
