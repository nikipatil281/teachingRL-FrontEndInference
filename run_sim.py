import json
import math

with open('market_states.json', 'r') as f:
    states = json.load(f)

def test_state(state):
    base = int(state['Footfall'].split()[0])
    has_comp = state['Competitor'] == 'yes'
    
    # Estimate avg comp price
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
    best_demand = 0

    prices = [p/10 for p in range(30, 101, 5)] # 3.0 to 10.0
    for p in prices:
        # Base demand
        demand = base
        
        # Penalties
        if p > 6: demand -= (p - 6) * 10
        
        # Comp
        if has_comp:
            diff = comp_price - p
            if diff > 0: demand += diff * 12.5
            elif diff < 0: demand += diff * 12.5 # Negative diff
            
        demand = max(0, demand)
        profit = demand * p
        if profit > max_profit:
            max_profit = profit
            best_price = p
            best_demand = demand
            
    return {
        'base': base, 'weather': state['Weather'], 'event': state['Event'],
        'comp': state['Competitor'], 'comp_price': comp_price,
        'best_price': best_price, 'profit': max_profit, 'demand': best_demand,
        'min_p': state['Min Price'], 'max_p': state['Max Price']
    }

results = []
seen = set()
for s in states:
    sig = f"{s['Weather']}-{s['Event']}-{s['Competitor']}-{s['Day of the week'] in ('Saturday','Sunday')}"
    if sig not in seen:
        seen.add(sig)
        results.append(test_state(s))

# Group by Base
bases = sorted(list(set([r['base'] for r in results])))

print("OPTIMAL PRICES - MAXIMUM THEORETICAL AVERAGE PROFIT")
print("===================================================\n")

for b in bases:
    print(f"--- Base Footfall: {b} ---")
    for r in [x for x in results if x['base'] == b]:
        comp_str = f"Comp@${r['comp_price']:.2f}" if r['comp'] == 'yes' else "No Comp"
        print(f"Weather: {r['weather']:<6} | Event: {r['event']:<3} | {comp_str:<15}")
        print(f"  -> Best Price: ${r['best_price']:0.2f} (Dem: {r['demand']:0.1f}, Profit: ${r['profit']:0.2f})")
        print(f"  -> Old Range : {r['min_p']} to {r['max_p']}\n")

