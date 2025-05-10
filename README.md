# Tennis Probability Exploration

**Live Demo: https://tennis-sipes.vercel.app/**

### Introduction
I was playing tennis with my mom and my sister on mothers day of summer 2024. My sister kept slamming the ball into the net so I had time to think. My sister is really not good at tennis.
If my sister challenged me to a game of tennis, she wouldn't win. But if she wanted to try, would it be better for her to challenge me to a 1 set game or a 3 set game?
I think the intuitive answer is that she should challenge me to a 1 set game. Assuming that for every given point we play, she wins with 40% probability and I win with 60% probability, I will 
most certainly win over the long run. She has a better chance of getting lucky in a short game, but not in a long one. But what exactly are her odds of winning? That is what I seek to find out in this exploration.

### Results:
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

I think these numbers are very interesting. I think probability is interesting. I spend a lot of my day dreaming thinking about the chances of this and that, and it makes me happy to see that as a computer science student, I have achieved the technical ability to write a piece of code that solves some of these questions for me.

### Exploration
By utilizing probability theory and recursive programming, I developed a tennis probability model. This model performs two key functions:
1. **Match Simulation:** The model simulates a tennis match by tracking the score and allocating points to either player A or player B. The probability of winning each point is determined by who is serving and the individual likelihood of player A or B winning the point.
2. **Probability Calculation:** For every point in the match, the model calculates the probabilities of different outcomes. It assesses the current score to determine the probability of player A or B winning the match, the set, and the game.

### Example Output
Here is an example output for a simulated 1-set match:
<img width="941" alt="image" src="https://github.com/user-attachments/assets/a343d283-d96d-4726-87d4-36f71d622274">
- Each row represents the state of the game during one point.
- The score is illustrated in the set, game, and point columns, with Player A's points on the left and Player B's on the right.
- `p_a_w_m`: Probability that A wins the match.
- `p_b_w_m`: Probability that B wins the match.
- `p_a_w_s`: Probability that A wins the set.
- `p_b_w_s`: Probability that B wins the set.
- `p_a_w_g`: Probability that A wins the game.
- `p_b_w_g`: Probability that B wins the game.
- `server`: Indicates which player is serving during that point.
- `message`: Explains the outcome of the point.
- `d_p_a_w_m`: The change in the probability that A wins the match.

### Interesting Takeaways
In the provided example, both players are equally matched and have an equal chance of winning each individual point. The most interesting takeaway is that different points impact the game more significantly than others. 

Consider the first four points, highlighted in blue. At the start of the match, both players have an equal chance of winning the match, set, and game. (Note that in this example, the match is first to one set, so the probabilities of winning the match and set are the same.)

Player A wins the first point. Player A's probability of winning the game increases from 50% to 66%, and their probability of winning the set and match goes from 50% to 54%. Now, look at the third point. Player B wins the previous point, making the score even again, and all probabilities return to 50%. Player A then wins the third point. Player A's probability of winning the game jumps from 50% to 69%, and their probability of winning the set and match increases from 50% to 55%. 

### Conclusion
The third point impacted the outcome of the game more dramatically than the first point did. Why? The third point occurred later in the game and it was a close game. This is interesting to me and also intuitive. 
Consider a basketball game with these scenarios:
1. It is the first quarter, the score is 0-0, and Team A scores a point.
2. It is near the end of the fourth quarter, Team B is leading 100-80, and Team A scores a point.
3. It is near the end of the fourth quarter, the score is 100-100, and Team A scores a point.

Which point is more important to the game? While a point is worth the same in each scenario, the point in the third scenario impacts the game much more dramatically than the other two.
I define **importance** as follows:

**Importance:** The extent to which the outcome of the game is expected to change as a result of the current point.

In the tennis probability model, it is clear that some points are more important than others. The more important points occur closer to the end of the match. Points such as match point, set point, game point, and deuce are much more crucial than others.

### Next Steps
The next steps for this project are to analyze historical tennis match data. The objectives are as follows:
1. **Determine Match Outcomes:** Identify the winner of a professional match: Player A or Player B.
2. **Analyze Winning Margins:** If Player A wins, determine the margin of victory.
3. **Point Win Percentages:** Calculate the percentage of points won by each player. Analyze how much the outcome depends on serving.
4. **Point Win Trends:** Examine how point win percentages change over the course of the match, providing insights into factors like player fatigue.
5. **Ranking Point Importance:** Utilize the definition of importance to rank points and assess whether a player performs better on more important points compared to less important ones. This analysis could offer insights into how players handle pressure.
