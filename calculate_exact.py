import json
import math

with open('market_states.json', 'r') as f:
    states = json.load(f)

def get_exact_optimal_price(state):
    base = int(state['Footfall'].split()[0])
    has_comp = state['Competitor'] == 'yes'
    
    comp_price = 0
    if has_comp:
        w = state['Weather']
        if w == 'rainy': comp_price = 5.00
        elif w == 'cloudy': comp_price = 6.00
        else: comp_price = 4.50
        
        if state['Day of the week'] in ('Saturday','Sunday'): comp_price += 0.75
        if state['Event'] == 'yes': comp_price += 0.75

    max_profit = 0
    best_price = 0

    prices = [p/10 for p in range(30, 151, 5)] # 3.0 to 15.0
    for p in prices:
        demand = base
        
        # Penalties is 20
        if p > 6: demand -= (p - 6) * 20
        
        # Comp
        if has_comp:
            diff = comp_price - p
            if diff > 0: demand += diff * 12.5
            elif diff < 0: demand += diff * 12.5 
            
        demand = max(0, demand)
        profit = demand * p
        if profit > max_profit:
            max_profit = profit
            best_price = p
            
    return best_price

for state in states:
    opt = get_exact_optimal_price(state)
    # The user wants exact perfect prices, so min and max will be exactly the same optimal value
    state['Min Price'] = f"{opt:.2f}"
    state['Max Price'] = f"{opt:.2f}"

with open('market_states.json', 'w') as f:
    json.dump(states, f, indent=2)

print("Exact mathematical optimums saved into market_states.json")

