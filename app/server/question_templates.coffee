exports.interpolationSyntax = /\[\[(.+?)\]\]/g

join = (arr) ->
  if arr.length == 2
    "#{arr[0]} and #{arr[1]}"
  else
    last = arr.pop()
    "#{arr.join ", "}, and #{last}"

exports.questionTemplates = [
  {
    description: "Algebra: One Variable"
    stimulus: '''
      If \\( [[ a ]][[ var_name ]] - [[ b ]] = [[ c ]] \\), then \\( [[ d ]][[ var_name ]] + [[ e ]] = \\)
      '''
    explanation: '''
      We can start by solving directly for [[ var_name ]]:
        $$ [[ a ]][[ var_name ]] - [[ b ]] = [[ c ]] $$
        $$ [[ a ]][[ var_name ]] = [[ c ]] + [[ b ]] $$
        $$ [[ a ]][[ var_name ]] = [[ b_plus_c ]] $$
        $$ [[ var_name ]] = { [[ b_plus_c ]] \\over [[ a ]] } $$
        $$ [[ var_name ]] = [[ v ]] $$
      
      Then substitute [[ var_name ]] into the second expression:
      
        $$ [[ d ]][[ var_name ]] + [[ e ]] = $$
        $$ [[ d ]]([[ v ]]) + [[ e]] = [[ correctAnswer ]] $$
      '''
    variations: ->
      parameterizations = [
        {var_name: "x", v: 4, a: 3, b: 7, d: 2, e: 5}
        {var_name: "y", v: 2, a: 7, b: 11, d: 3, e: 2}
      ]
      for p in parameterizations
        p.c = p.a * p.v - p.b
        p.b_plus_c = p.b + p.c
        p.correctAnswer = p.d * p.v + p.e
        p
  },
  
  {
    description: 'Isosceles Triangles'
    stimulus: '''
      Two of the interior angles of a certain triangle are equal in measure.
      If two of the triangle's sides have lengths [[ small ]] and [[ big ]], what is the greatest
      possible value for the triangle's perimeter?
      '''
    explanation: '''
      The fact that two of the triangle's interior angles are congruent means that the triangle is
      isosceles, so two of its sides are also congruent. We know that two of its sides are
      [[ small ]] and [[ big ]], so there are only two possible options: 
      
        $$ [[ small ]]-[[ small ]]-[[ big ]] $$ or 
        $$ [[ small ]]-[[ big ]]-[[ big ]]  $$
      
      Since the second option will clearly result in a larger perimeter, the greatest possible
      value for the triangle's perimeter is [[ small ]] + [[ big ]] + [[ big ]], or [[ correctAnswer ]].
      '''
    variations: ->
      parameterizations = [
        [40, 60]
        [50, 75]
        [80, 90]
      ]
      for p in parameterizations
        [small, big] = p
        small: small
        big: big
        correctAnswer: big * 2 + small
  },
      
  {
    description: 'Midpoints on the Number Line'
    stimulus: '''
      On a number line, point A lies at [[ a ]] and point B lies at [[ b ]]. 
      What is the coordinate of the point that is exactly halfway between points A and B?
      '''
    explanation:
      '''
      The point on a number line halfway between [[ a ]] and [[ b ]] will be the average of the two numbers.
      The average of [[ a ]] and [[ b ]] is the sum of the numbers divided by 2:
      
        $$ {[[ a ]] + [[ b ]] \\over 2} = {[[ sum ]] \\over 2} = [[ correctAnswer ]] $$ 
      
      Alternately, you could subtract [[ a ]] from [[ b ]] to get the distance between the points ([[ diff ]]) 
      and divide that distance by 2 to arrive at [[ halfdiff ]]:
      
        $$ {[[ b ]] - [[ a ]] \\over 2} =  {[[ diff ]] \\over 2} = [[ halfdiff ]] $$
      
      
      This is how far the halfway point will 
      be from either of the two outside points:
      
       $$ [[ a ]] + [[ halfdiff ]] = [[ correctAnswer ]] $$ or
       $$ [[ b ]] - [[ halfdiff ]] = [[ correctAnswer ]] $$
      '''
    variations: ->
      tuples = [ 
        [3, 17],
        [44, 51],
        [33, 49],
        [100, 135]
      ]
      tuples.map (tuple) ->
        [a, b] = tuple

        a: a
        b: b
        diff: b - a
        halfdiff: (b - a) / 2
        sum: a + b
        correctAnswer: (a + b) / 2
  },
  
  {
    description: "Difference of Squares"
    stimulus: '''
      Given:
        
        $$[[ v1 ]]^2 - [[ v2 ]]^2 = [[ big ]]$$
        $$[[ v1 ]] + [[ v2 ]] = [[ n ]]$$
      
      What is the value of [[ v1 ]] - [[ v2 ]]?
      '''
    explanation: '''
      The key insight here is the difference of squares factorization.

        $$[[ v1 ]]^2 - [[ v2 ]]^2 = [[ big ]]$$
        $$([[ v1 ]] - [[ v2]])([[ v1 ]] + [[ v2 ]]) = [[ big ]]$$
        
      Then subsitute the value for \\( [[ v1 ]] + [[ v2 ]] \\)

        $$([[ v1 ]] - [[ v2]])([[ n ]]) = [[ big ]]$$
        $$[[ v1 ]] - [[ v2 ]] = { [[ big ]] \\over [[ n ]] } = [[ correctAnswer ]]$$
  
      
      '''
    variations: -> 
      parameterizations = [
        {
          correctAnswer: 4
          n: 10
          v1: "a"
          v2: "b"
        },        
        {
          correctAnswer: 9
          n: 11
          v1: "x"
          v2: "y"
        },
        {
          correctAnswer: 3
          n: 17
          v1: "m"
          v2: "n"
        },
      ]
      
      parameterizations.map (p) ->
        p.big = p.correctAnswer * p.n
        p
  },

  {
    description: "Substitution & Factoring"
    stimulus: '''
      If \\( f(x) = [[ c ]] + {x^2 \\over [[ nn ]] } \\) and \\( f([[ n ]]k) = [[ b ]]k \\),
      what is the least possible value for \\(k\\)?
      '''
    explanation: '''
      Substituting \\([[ n ]]k\\) for \\(x\\), we get that \\(f([[ n ]]k) = [[ c ]] + {([[ n ]]k)^2 \\over [[ nn ]] }\\). 
      We're also told that \\(f([[ n ]]k) = [[ b ]]k\\), so we can set the two expressions equal.
      
      $$[[ c ]] + {([[ n ]]k)^2 \\over [[ nn ]]} = [[ b ]]k$$
      $$[[ c ]] + { [[ nn ]]k^2 \\over [[ nn ]]} = [[ b ]]k$$
      $$[[ c ]] + k^2 = [[ b ]]k$$
      $$k^2 - [[ b ]]k + [[ c ]] = 0$$
      $$(k - [[ small ]])(k - [[ big ]]) = 0$$
      $$k = { [[ small ]], [[ big ]] }$$

      So the two possible values for \\(k\\) are [[ small ]] and [[ big ]], and thus [[ small ]] is the least possible solution.
    '''
    variations: ->
      parameterizations = [
        {
          small: 3
          big: 5
          n: 4
        },
        {
          small: 2
          big: 7
          n: 3
        },
        {
          small: 6
          big: 7
          n: 5
        },
      ]
      
      parameterizations.map (p) ->
        p.b = p.big + p.small
        p.c = p.big * p.small
        p.nn = p.n * p.n
        p.correctAnswer = p.small
        p
  },

  {
    description: "Probability"
    stimulus: '''
      A new college student is randomly assigned to one of [[ big ]] dorm rooms.
      The student has an equal chance of receiving each of the rooms as an assignment.
      If exactly [[ small ]] of the rooms are painted [[ color ]], what is the probability that 
      the student will be assigned a room that is painted [[ color ]]?
      '''
    explanation: '''
      The probability of a particular event is given by the ratio of the number of situations in which that event is true 
      to the number of total possible situations. 
      
      In this case, there are [[ small ]] ways that the student can receive a [[ color ]] room 
      ([[ small ]] of the rooms are painted [[ color ]]), while there are [[ big ]] total possibilities (each of the dorm rooms).  
      The probability is [[ small ]]/[[ big ]]. Dividing top and bottom by [[ small ]] gives us 1/[[ quotient ]].
      '''
    variations: ->
      parameterizations = [
        {
          small: 24
          big: 120
          color: "yellow"
        },
        {
          small: 14
          big: 56
          color: "orange"
        }
        {
          small: 19
          big: 190
          color: "blue"
        }
      ]
      
      parameterizations.map (p) ->
        p.quotient = p.big / p.small
        p.correctAnswer = p.small / p.big
        p
  }  
  
  {
    description: "System of Equations"
    stimulus: '''
      For the system of values above, all terms are non-zero. 

      $$a = {b \\over [[ littleValue ]] }$$
      $$b = [[ bigValue ]]t$$
      $$a = mt$$

      What is the value of m?
      '''
    explanation: '''
      The correct answer is [[ correctAnswer]]. The first equation reads \\( a = {b \\over [[ littleValue ]] } \\).
      Use the second equation and substitute [[ bigValue ]]t for b.
      
      $$a = { [[ bigValue ]]t \\over [[ littleValue ]] } = [[ correctAnswer ]]t$$

      The third equation reads \\(a = mt\\), so it follows that \\(m = [[ correctAnswer ]]\\).
      '''
    variations: ->
      parameterizations = [
        {
          bigValue: 9
          littleValue: 3
        }
        {
          bigValue: 10
          littleValue: 2
        }
        {
          bigValue: 18
          littleValue: 3
        }
      ]
      parameterizations.map (p) ->
        p.correctAnswer = p.bigValue / p.littleValue
        p
  },  
  
  {
    description: "Geometric Sequences"
    stimulus: '''
      The first two terms of a sequence are a and [[ jumpValue ]]a, and each term after the
      first is [[ jumpValue ]] times the preceding term.
      If the sum of the first four terms of the sequence is [[ bigSum ]], what is the value of a?
      '''
    explanation: '''
      Since each term is [[ jumpValue ]] times the preceding term, the first four terms of this sequence are [[ terms ]].
      The sum of these four terms is [[ sum ]]a. We're told that the first four terms add to [[ bigSum ]],
      so we know that [[ sum ]]a = [[ bigSum ]], which means:
      $$a = { [[ bigSum ]] \\over [[ sum ]] } = [[ correctAnswer ]]$$
      '''
    variations: ->
      parameterizations = [
        {
          jumpValue: 4
          correctAnswer: 6
        }
        {
          jumpValue: 3
          correctAnswer: 7
        }
        {
          jumpValue: -2
          correctAnswer: -13
        }
      ]
      parameterizations.map (val) ->
        sum = 0
        n = 1
        elements = []
        for i in [0...4]
          sum += n
          elements.push "#{n}a"
          n *= val.jumpValue
        val.sum = sum
        val.terms = join elements
        val.bigSum = sum * val.correctAnswer
        val
        
  },
]
