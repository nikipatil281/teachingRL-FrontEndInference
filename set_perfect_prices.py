import json
import random

with open('market_states.json', 'r') as f:
    states = json.load(f)

for state in states:
    base = int(state['Footfall'].split()[0])
    has_comp = state['Competitor'] == 'yes'
    
    # Based on the exact -20 penalty simulations we ran earlier:
    exact_optimal = 0
    
    if has_comp:
        if base == 130: exact_optimal = 6.00
        elif base == 150: exact_optimal = 6.00
        elif base == 170: exact_optimal = 6.00
        elif base == 180: exact_optimal = 6.00
        elif base == 200: exact_optimal = 6.00
        elif base == 220: exact_optimal = 6.50
        elif base == 230: exact_optimal = 6.50
        elif base == 250: exact_optimal = 7.00
    else:
        if base == 130: exact_optimal = 6.00
        elif base == 150: exact_optimal = 6.50
        elif base == 170: exact_optimal = 7.00
        elif base == 180: exact_optimal = 7.50
        elif base == 200: exact_optimal = 8.00
        elif base == 220: exact_optimal = 8.50
        elif base == 230: exact_optimal = 8.50
        elif base == 250: exact_optimal = 9.00
        
    # User requested: "give a range of 0.5 extra or 0.5 less than perfect"
    # Let's randomly decide whether to float up or down from perfect to create the range
    if random.choice([True, False]):
        min_p = exact_optimal - 0.50
        max_p = exact_optimal
    else:
        min_p = exact_optimal
        max_p = exact_optimal + 0.50
        
    state['Min Price'] = f"{min_p:.2f}"
    state['Max Price'] = f"{max_p:.2f}"

with open('market_states.json', 'w') as f:
    json.dump(states, f, indent=2)

print("Perfect math bounds applied to JSON.")
