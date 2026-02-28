import pandas as pd
import numpy as np
import random

# Configuration
NUM_ROWS = 1000
BASE_DEMAND = 100
# drastic elasticity: customers HATE high prices now.
# At $1 above base, demand drops by 40. 
PRICE_ELASTICITY = -40  
BASE_PRICE = 4.00

def generate_data():
    data = []
    
    days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    weathers = ['Sunny', 'Rainy', 'Cloudy', 'Hot']
    
    for _ in range(NUM_ROWS):
        day = random.choice(days)
        weather = random.choice(weathers)
        nearby_event = 1 if random.random() < 0.2 else 0
        holiday = 1 if random.random() < 0.05 else 0
        
        # Competitor presence (for monopoly training, we filter 0 later, but let's mix it)
        competitor_presence = 1 if random.random() < 0.3 else 0
        competitor_price = round(random.uniform(2.5, 5.0), 2) if competitor_presence else 0
        
        # Player sets price
        # Random price between 2.00 and 8.00 to give the model range
        price_set_by_player = round(random.uniform(2.00, 8.00), 2)
        
        # Calculate Demand (Synthetic Ground Truth)
        # Base
        demand = BASE_DEMAND
        
        # Price Effect (The crucial part)
        price_diff = price_set_by_player - BASE_PRICE
        demand += price_diff * PRICE_ELASTICITY 
        
        # Weather Effect
        if weather == 'Rainy': demand *= 0.7
        if weather == 'Hot': demand *= 1.2
        if weather == 'Cloudy': demand *= 0.9
        
        # Event Effect
        if nearby_event: demand *= 1.5
        
        # Weekend/Holiday
        if day in ['Saturday', 'Sunday']: demand *= 1.3
        if holiday: demand *= 1.4
        
        # Competitor Effect (if present)
        if competitor_presence:
            if price_set_by_player > competitor_price:
                demand *= 0.5 # Losing customers
            elif price_set_by_player < competitor_price:
                demand *= 1.2 # Stealing customers
        
        # Inventory (Constraints)
        # Random inventory, sometimes constraining
        inventory_units = random.randint(50, 500)
        
        # Actual Sales (Customers)
        num_customers = max(0, int(demand))
        num_customers = min(num_customers, inventory_units) # Capped by inventory
        
        # Add noise
        num_customers = int(num_customers * random.uniform(0.9, 1.1))
        
        data.append({
            'day_of_week': day,
            'inventory_units': inventory_units,
            'competitor_presence': competitor_presence,
            'competitor_price': competitor_price,
            'weather': weather,
            'nearby_event': nearby_event,
            'holiday': holiday,
            'price_set_by_player': price_set_by_player,
            'num_customers': num_customers
        })
        
    df = pd.DataFrame(data)
    df.to_csv('../coffee_shop_data.csv', index=False)
    print("Generated coffee_shop_data.csv with realistic demand curves.")

if __name__ == "__main__":
    generate_data()
