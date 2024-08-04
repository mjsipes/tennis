I was playing tennis with my mom and my sister on mothers day of summer 2024. My sister kept slamming the ball into the net so I had time to think. My sister is really not good at tennis.
If my sister challenged me to a game of tennis, she wouldn't win. But if she wanted to try, would it be better for her to challenge me to a 1 set game or a 3 set game?

I think the intuitive answer is that she should challenge me to a 1 set game. Assuming that for every given point we play, she wins with 40% probability and I win with 60% probability, I will 
most certainly win over the long run. She has a better chance of getting lucky in a short game, but not in a long one. But what exactly are her odds of winning? That is what I seek to find out in this exploration.

The results:
![probability_comparison-2](https://github.com/user-attachments/assets/e0b58fca-f225-43d9-9faf-d5ad4e728747)

To preface, this is a probability model. 
It takes in three input variables. The probability that player 1 wins a service point, the probability that player a wins a return point, and which player starts off on serve.
It also takes in a the hyperparameter of number of sets to be played. 
The model **does not** consider any historical data, it **does not** consider if the sun is in a players eyes, it **does not** consider that a player might be "hot" after a streak of win points or discouraged after a streak of loosing points, it **does not** consider if a player is tired.
The model **does** iterate through the probability tree of gamestates and adds up the nodes in which player a / player b wins. (recursion!)

The results are positively in my favor! 
Assuming that she wins each individual point with 40% probability and I win each individual point with 60% probability, she will only have a 3% chance of winning! 
I will beat her in a one set match with 97% probability. 
If we play first to two sets or first to three sets, her chances of winning are even lower.
Lets assume for sake of argument that my sister is a closely matched oponent to me, and she wins 48%. 
I only win 52% of individual points. 
In a 1 set match she still only has a 36% chance of winning. In a three set match, she has a 25% chance of winning.

I think these numbers are very interesting. I think probability is interesting. I spend a lot of my day dreaming thinking about the chances of this and that, and it makes me happy to see that as a computer science student, I have achieved the techincal ability to write a piece of code that solves some of these questions for me.


Here is a refined version of your text:

---

**The Exploration:**

By utilizing probability theory and recursive programming, I developed a tennis probability model. This model performs two key functions:

1. **Match Simulation:** The model simulates a tennis match by tracking the score and allocating points to either player A or player B. The probability of winning each point is determined by who is serving and the individual likelihood of player A or B winning the point.

2. **Probability Calculation:** For every point in the match, the model calculates the probabilities of different outcomes. It assesses the current score to determine the probability of player A or B winning the match, the set, and the game.

Example output:
<img width="941" alt="image" src="https://github.com/user-attachments/assets/a343d283-d96d-4726-87d4-36f71d622274">



