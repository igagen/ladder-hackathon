exports.interpolationSyntax = /\[\[(.+?)\]\]/g

join = (arr) ->
  if arr.length == 2
    "#{arr[0]} and #{arr[1]}"
  else
    last = arr.pop()
    "#{arr.join ", "}, and #{last}"

fraction = (n, d) ->
  "{ #{n} \\over #{d} }"

exports.questionTemplates = [
  {
    description: "Word Problems (Marbles)"
    stimulus:
      '''
      A jar contains red, white, and blue marbles.  There are [[ red ]]
      red marbles.  There are \\( 1/[[ wr ]] \\) as many white marbles as
      blue marbles.  \\( 1/[[ br ]] \\) of all the marbles are blue.  How
      many marbles are there?
      '''
    explanation:
      '''
      Let n = the total number of marbles, and use r, w, and b to represent
      the number of red, white, and blue marbles.  Start by translating the
      facts we know:
      
        $$ n = r + w + b $$
        $$ r = [[ red ]] $$
        $$ w = [[ fraction(1, wr) ]]b $$
        $$ b = [[ fraction(1, br) ]]n $$
        
      We want to solve for n, and eliminate other variables.  Start by substituting
      for r, w, and b in the first equation:
      
        $$ n = [[ red ]] + [[ fraction(1, wr) ]]b + [[ fraction(1, br) ]]n $$
      
      We still need to eliminate \\( b \\), so we use \\( b = [[ fraction(1, br) ]]n \\):
      
        $$ n = [[ red ]] + [[ fraction(1, wr) ]]([[ fraction(1, br) ]]n) + [[ fraction(1, br) ]]n $$
        $$ n - {1 \\over [[ wr*br ]] }n - {1 \\over [[ br ]] }n = [[ red ]] $$ 
        $$ n * (1 - {1 \\over [[ wr*br ]] } - {1 \\over [[ br ]] }) = [[ red ]] $$ 
        $$ n * ([[ frac1 ]] - [[ frac2 ]] - [[ frac3 ]]) = [[ red ]] $$
        $$ n * [[ frac_sum ]] = [[ red ]] $$
        $$ n = [[ inverse_frac_sum ]] * [[ red ]] = [[ wr*br ]] * [[ red / (wr*br - wr - 1) ]] = [[ correctAnswer ]] $$
        
      (FYI, the breakdown of marbles is [[ red ]] red, [[ white ]] white, and [[ blue ]] blue.)
      '''
    variations: ->
      # use coprime tuples whose product < 100
      parameterizations = [
        {wr: 3, br: 4}
        {wr: 3, br: 5}
        {wr: 3, br: 7}
        {wr: 4, br: 5}
        {wr: 4, br: 7}
        {wr: 5, br: 6}
      ]
      for p in parameterizations
        wr = p.wr
        br = p.br
        p.minAnswer = p.wr * br
        p.n = p.correctAnswer = Math.floor(100 / p.minAnswer) * p.minAnswer
        p.blue = p.correctAnswer / br
        p.white = p.blue / wr
        p.red = p.n - (p.white + p.blue)
        p.frac1 = fraction(wr*br, wr*br)
        p.frac2 = fraction(1, wr*br)
        p.frac3 = fraction(wr, wr*br)
        p.frac_sum = fraction(wr*br - wr - 1, wr*br)
        p.inverse_frac_sum = fraction(wr*br, wr*br - wr - 1)
        p.fraction = fraction
        p
  },

  {
    description: "Function Composition"
    stimulus:
      '''
      Let the function h be defined as \\( h(x) = x^2 + [[ c ]] \\). If y is a positive number
      in which \\( h([[ n ]]y) = [[ n ]]h(y) \\), what is the value of y?
      '''
    explanation:
      '''
        Apply the definition of h(x) to both sides of the second equation:
        
          $$ h(x) = x^2 + [[ c ]] $$
          $$ h([[ n ]]y) = [[ n ]]h(y) $$
          $$ ([[ n ]]y)^2 + [[ c ]] = [[ n ]](y^2 + [[ c ]]) $$
          
        Solve for y, avoiding unnecessary multiplication by dividing both sides by [[ n ]]
        early in the process:

          $$ ([[ n ]] * [[ n ]])y^2 + [[ c ]] = [[ n ]]y^2 + [[ n ]] * [[ c ]] $$
          $$ [[ n ]]y^2 + { [[ c ]] \\over [[ n ]] } = y^2 + [[ c ]] $$
          $$ [[ n ]]y^2 + [[ c / n ]] = y^2 + [[ c ]] $$
          $$ [[ n - 1]]y^2 = [[ c ]] - [[ c / n ]] = [[ c - c/n ]] $$
          $$ y^2 = { [[ c - c/n ]] \\over [[ n - 1 ]] } = [[ (c - c/n) / (n - 1) ]]$$
          $$ y = [[ correctAnswer ]] $$
        
      '''
    variations: ->
      parameterizations = [
        {correctAnswer: 3, n: 7}
        {correctAnswer: 4, n: 3}
        {correctAnswer: 5, n: 4}
        {correctAnswer: 6, n: 5}
      ]
      for p in parameterizations
        p.c = (p.correctAnswer * p.correctAnswer) * p.n
        p.c_over_n = p.c / p.n
        p
  },
  
  {
    description: "Percentages"
    stimulus:
      '''
      If [[ small ]]% of a = b% of [[ big ]] and \\( b > 0 \\), what is the value of \\( a \\over b \\)?
      '''
    explanation:
      '''
      Set up the equation, multiply by 100 to simplify the arithmetic, then solve for \\( a \\over b \\).
      
        $$ ([[ small ]]\\%) * a = (b\\%) * [[ big ]] $$
        $$ { [[ small ]] \\over 100} * a = { b \\over 100} * [[ big ]] $$
        $$ [[ small ]] * a = b * [[ big ]] $$
        $$ a = b * { [[ big ]] \\over [[small]] } $$
        $$ { a \\over b } = { [[ big ]] \\over [[small]] } = [[ correctAnswer ]] $$
      '''
    variations: ->
      parameterizations = [
        {small: 45, correctAnswer: 2}
        {small: 15, correctAnswer: 6}
        {small: 22, correctAnswer: 4}
        {small: 12, correctAnswer: 7}
      ]
      for p in parameterizations
        p.big = p.small * p.correctAnswer
        p
  },
  
  {
    description: "Exponents"
    stimulus:
      '''
      If \\( a ^ [[ var1 ]] * a ^ [[ var1 ]] = a ^ { [[ val1_times_2 ]] } \\)
      and \\( (a ^ { [[ e ]] } ) ^ { [[ var2 ]] } = a ^ { [[ val2_times_e ]] } \\), what is the 
      value of \\( [[ var1 ]] - [[ var2 ]] \\)?
      '''
    explanation:
      '''
      This is really two problems in one.  First, solve each problem separately.
    
      Solve for [[ var1 ]] first, using the property that multiplying powers of the same
      base is equivalent to adding the exponents.
    
        $$ a ^ [[ var1 ]] * a ^ [[ var1 ]] = a ^ { [[ val1_times_2 ]] } $$
        $$ a ^ { [[ var1 ]] + [[ var1 ]] } = a ^ { [[ val1_times_2 ]] } $$
        $$ [[ var1 ]] + [[ var1 ]] = [[ val1_times_2 ]] $$
        $$ [[ var1 ]] = [[ val1 ]] $$
        
      Now solve for [[ var2 ]], using the property that taking a power to another power is
      equivalent to multiplying the exponents:
      
        $$ (a ^ { [[ e ]] } ) ^ { [[ var2 ]] } = a ^ { [[ val2_times_e ]] } $$
        $$ a ^ { [[ e ]] * [[ var2 ]] } = a ^ { [[ val2_times_e ]] } $$
        $$ [[ e ]] * [[ var2 ]] = [[ val2_times_e ]] $$
        $$ [[ var2 ]] = [[ val2 ]] $$
        
      Since \\( [[ var1 ]] = [[ val1 ]] \\) and \\( [[ var2 ]] = [[ val2 ]] \\):
      
        $$ [[ var1 ]] - [[ var2 ]] = [[ correctAnswer ]] $$

      '''
    variations: ->
      parameterizations = [
        {var1: "x", var2: "y", val1: 5, val2: 2, e: 7}
        {var1: "x", var2: "y", val1: 15, val2: 8, e: 3}
        {var1: "x", var2: "y", val1: 12, val2: 6, e: -2}
        {var1: "m", var2: "n", val1: 8, val2: 3, e: 5}
      ]
      for p in parameterizations
        p.val1_times_2 = p.val1 * 2
        p.val2_times_e = p.val2 * p.e
        p.correctAnswer =  p.val1 - p.val2
        p
  },
 
  {
    description: "Fractions"
    stimulus: '''
      On a hot summer day, [[ person ]] sold [[ n ]] cups of lemonade. 
      [[ Pronoun]] sold \\( [[ a ]] \\) of the lemonade before lunch, 
      \\( [[ b ]] \\) during lunch, \\( [[ c ]] \\) in the afternoon, 
      and the remaining cups in the evening. How many cups did [[ person ]] sell in the evening?  
      '''
    explanation: '''
      Start by computing the number of cups sold in each slot other than the evening:
      
        $$ ([[ a ]] * [[ n ]]) + ([[ b ]] * [[ n ]]) + ([[ c ]] * [[ n ]]) = $$
        $$ [[ sold1 ]] + [[ sold2 ]] + [[ sold3 ]]= $$
        $$ [[ sold_before_dinner ]] $$
        
      Then, we know that [[ person ]] sold all the remaining cups during the evening:
      
        $$ [[ n ]] - [[ sold_before_dinner ]] = [[ correctAnswer ]] $$
      '''
    variations: ->
      parameterizations = [
        {aa: 8, bb: 7, cc: 4, n: 56, person: "Mary", Pronoun: "She"}
        {aa: 3, bb: 5, cc: 15, n: 45, person: "James", Pronoun: "He"}
      ]
      for p in parameterizations
        p.a = "{ 1 \\over #{p.aa} }"
        p.b = "{ 1 \\over #{p.bb} }"
        p.c = "{ 1 \\over #{p.cc} }"
        p.sold1 = p.n / p.aa
        p.sold2 = p.n / p.bb
        p.sold3 = p.n / p.cc
        p.sold_before_dinner = p.sold1 + p.sold2 + p.sold3
        p.correctAnswer = p.n - p.sold_before_dinner
        p
  },
  
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
        {var_name: "m", v: 3, a: 4, b: 8, d: 4, e: 7}
        {var_name: "n", v: 5, a: 5, b: 9, d: 2, e: 9}
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
