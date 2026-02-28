# Chat Conversation

Note: _This is purely the output of the chat conversation and does not contain any raw data, codebase snippets, etc. used to generate the output._

### User Input

Chat by the way, how is the number of customers decided? what's the logic - dependent on day or weather?

*Grep searched codebase*

*Viewed [MarketEngine.js](file:///Users/NIKITA/Desktop/otherWork/RL_SIMULATION_COPIES/RL_Simulation/coffee-rl-app/src/logic/MarketEngine.js) *

### Planner Response

Yes, the number of customers (referred to as "demand" in the code) is highly dependent on both the weather and the day! The logic is determined in the [calculateDemand](cci:1://file:///Users/NIKITA/Desktop/otherWork/RL_SIMULATION_COPIES/RL_Simulation/coffee-rl-app/src/logic/MarketEngine.js:0:0-47:2) function inside [src/logic/MarketEngine.js](cci:7://file:///Users/NIKITA/Desktop/otherWork/RL_SIMULATION_COPIES/RL_Simulation/coffee-rl-app/src/logic/MarketEngine.js:0:0-0:0). 

Here is exactly how the customer count is calculated step-by-step:

**1. The Base Customers**
The day always starts with a baseline demand of **120** potential customers. 

**2. Weather Impacts**
The weather heavily influences whether people want coffee (hot drinks are very popular on cold/rainy days):
- **Rainy:** +60 customers
- **Cloudy:** +30 customers
- **Sunny:** +10 customers
- **Hot:** -10 customers (Softened penalty so it doesn't instantly zero out)

**3. Day & Event Impacts**
- **Weekends:** If it's a Saturday or Sunday, you get a **+20** customer boost (people are more relaxed and out and about).
- **Events:** If there is a "nearby event" (which happens on Fridays and Saturdays), you get an additional **+40** customer boost due to the foot traffic.

**4. Your Price Penalty**
Customers are sensitive to price. For every $1 you charge, you lose 15 potential customers (`- (price * 15)`).

**5. Competitor Multiplier**
If a competitor is present, your demand is further multiplied based on how your price compares to theirs:
- **Major Undercut** (Your price > $0.50 cheaper than theirs): You steal their customers **(Demand x 1.6)**
- **Match / Slight Undercut:** **(Demand x 1.2)**
- **Slightly Expensive** (Your price > theirs): You lose core customers **(Demand x 0.6)**
- **Very Expensive** (Your price > $1.00 more than theirs): You lose almost everyone **(Demand x 0.1)**

Finally, the total calculated demand is floored to the nearest whole number to give you your final customer count for the day. So, a rainy Saturday with an event would see a massive influx of potential customers, whereas a hot Monday would be quite slow!