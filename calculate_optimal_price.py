import math

# We want to find the price that maximizes Profit = Demand * Price
# Demand formula:
# Base + (price > 6 ? -(price - 6) * 10 : 0) + (price < yesterday_price ? 1 or 2 : -1 or -2) + (competitor_price - price) * (10 or 15)

# Let's simplify and just look at expected values
# Expected yesterday effect = 0
# Expected competitor effect: 12.5 per dollar difference

# Let's plot Profit vs Price for a few scenarios

def calculate_expected_demand(base, has_competitor, comp_price, price):
    demand = base
    
    # Base Price Effect
    if price > 6:
        demand -= (price - 6) * 10
        
    # Competitor Effect
    if has_competitor:
        diff = comp_price - price
        if diff > 0:
            demand += diff * 12.5 # Average of 10-15 gain
        elif diff < 0:
            demand += diff * 12.5 # Negative diff, Average of 10-15 loss
            
    return max(0, demand)

scenarios = [
    {"name": "Low Base (130) No Comp (Sunny)", "base": 130, "comp": False, "comp_price": 0},
    {"name": "Low Base (130) Comp at $4.50 (Sunny)", "base": 130, "comp": True, "comp_price": 4.50},
    {"name": "Mid Base (180) Comp at $6.00 (Cloudy)", "base": 180, "comp": True, "comp_price": 6.00},
    {"name": "High Base (250) Comp at $7.00 (Weekend+Event)", "base": 250, "comp": True, "comp_price": 7.00},
]

for scenario in scenarios:
    print(f"\nScenario: {scenario['name']}")
    max_profit = 0
    best_price = 0
    best_demand = 0
    
    # Test prices from $3.00 to $10.00
    prices = [p/10 for p in range(30, 101, 5)] # 3.0, 3.5, 4.0 ... 10.0
    
    print("Price | Demand | Profit")
    print("-" * 25)
    for p in prices:
        d = calculate_expected_demand(scenario['base'], scenario['comp'], scenario['comp_price'], p)
        profit = d * p
        if profit > max_profit:
            max_profit = profit
            best_price = p
            best_demand = d
        print(f"${p:.2f} | {d:6.1f} | ${profit:.2f}")
        
    print(f"\nOPTIMAL: Price: ${best_price:.2f}, Demand: {best_demand:.1f}, Profit: ${max_profit:.2f}")

