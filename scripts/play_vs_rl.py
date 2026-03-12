import pandas as pd
import numpy as np
import json
import random
from stable_baselines3 import DQN
from coffee_env import CoffeeShopEnv

def get_json_price(env, market_states):
    weather_str = env.weather_mapping[env.weather]
    event_str = 'yes' if env.nearby_event == 1 else 'no'
    comp_str = 'yes' if env.competitor_present == 1 else 'no'
    day_name = env.day_mapping[env.day_of_week]
    
    state = next((s for s in market_states 
                   if s['Weather'].lower() == weather_str.lower()
                   and s['Event'].lower() == event_str
                   and s['Competitor'].lower() == comp_str
                   and s['Day of the week'] == day_name), None)
                   
    if state and 'Min Price' in state and 'Max Price' in state:
        context = {
            "price": env.yesterday_price,
            "yesterday_price": env.yesterday_price,
            "competitor_price": env.competitor_price,
            "inventory": env.inventory
        }
        try:
            min_p = float(env._js_eval(str(state['Min Price']), context))
            max_p = float(env._js_eval(str(state['Max Price']), context))
        except:
            min_p, max_p = 5.0, 6.0
            
        # Pick a random price between min and max
        raw = random.uniform(min_p, max_p)
        # Round to nearest 0.50
        return round(raw * 2.0) / 2.0
    return 5.50

def sync_envs(master, slaves):
    for slave in slaves:
        slave.day_of_week = master.day_of_week
        slave.weather = master.weather
        slave.nearby_event = master.nearby_event
        slave.competitor_present = master.competitor_present
        slave.competitor_price = master.competitor_price
        slave.current_day_index = master.current_day_index

def main():
    try:
        model = DQN.load("models/dqn_coffee.zip")
    except Exception as e:
        print("Model not found. Train first.")
        return

    with open("../market_states.json", "r") as f:
        market_states = json.load(f)

    env_user = CoffeeShopEnv(market_states_path="../market_states.json")
    env_json = CoffeeShopEnv(market_states_path="../market_states.json")
    env_rl = CoffeeShopEnv(market_states_path="../market_states.json")
    
    obs_user, _ = env_user.reset(seed=42)
    obs_json, _ = env_json.reset(seed=42)
    obs_rl,   _ = env_rl.reset(seed=42)

    done = False
    day = 1
    
    total_rewards = {"User": 0, "JSON": 0, "RL": 0}
    total_profits = {"User": 0, "JSON": 0, "RL": 0}

    print("\n" + "="*65)
    print("      ☕ WELCOME TO THE CAFE Reinforcement Learning SHOWDOWN ☕")
    print("="*65)
    print("You will play 28 days against the baseline JSON strategy")
    print("and our trained AI Agent.")
    print("Your goal: Maximize your Total Reward Points!\n")

    while not done and day <= 28:
        # Sync conditions from user env to others to ensure everyone plays the EXACT same market
        sync_envs(env_user, [env_json, env_rl])
        
        # RL obs: [DayOfWeek, Weather, Inventory, NearbyEvent, CompetitorPresent, CompetitorPrice, YesterdayPrice]
        obs_rl = np.array([
            env_rl.day_of_week,
            env_rl.weather,
            env_rl.inventory,
            env_rl.nearby_event,
            env_rl.competitor_present,
            env_rl.competitor_price,
            env_rl.yesterday_price
        ], dtype=np.float32)

        # 1. RL Agent Decision
        action_rl, _ = model.predict(obs_rl, deterministic=True)
        price_rl = env_rl._get_price_from_action(action_rl)

        # 2. JSON Agent Decision
        price_json = get_json_price(env_json, market_states)
        action_json = int((price_json - 1.0) / 0.50)
        action_json = max(0, min(18, action_json))

        # 3. User Decision
        weather_str = env_user.weather_mapping[env_user.weather]
        event_str = "Yes" if env_user.nearby_event else "No"
        comp_str = f"Yes (${env_user.competitor_price:.2f})" if env_user.competitor_present else "No"
        day_str = env_user.day_mapping[env_user.day_of_week]
        
        print(f"\n--- DAY {day} ({day_str}) ---")
        print(f"Weather: {weather_str} | Event: {event_str} | Comp: {comp_str}")
        print(f"Your Inventory: {env_user.inventory} | Yest. Price: ${env_user.yesterday_price:.2f}\n")
        
        while True:
            try:
                user_input = input("Enter your price ($1.00 to $10.00): ")
                price_user = float(user_input)
                price_user = round(price_user * 2.0) / 2.0
                if 1.00 <= price_user <= 10.00:
                    break
                print("Price must be between 1.00 and 10.00.")
            except ValueError:
                print("Please enter a valid number.")
                
        action_user = int((price_user - 1.0) / 0.50)
        
        # 4. Step all envs
        _, reward_user, done, _, info_user = env_user.step(action_user)
        _, reward_json, _, _, info_json = env_json.step(action_json)
        _, reward_rl, _, _, info_rl = env_rl.step(action_rl)
        
        # 5. Tally and Print Results
        total_rewards["User"] += reward_user
        total_rewards["JSON"] += reward_json
        total_rewards["RL"] += reward_rl
        
        total_profits["User"] += info_user["profit"]
        total_profits["JSON"] += info_json["profit"]
        total_profits["RL"] += info_rl["profit"]

        print(f"\n[RESULTS DAY {day}]")
        if day % 7 == 0:
            print(f"⚠️  End of week! Storage penalty of $0.50 per cup applied for remaining inventory.")
        
        print(f"{'Player':<10} | {'Price':<8} | {'Sales':<6} | {'Profit':<8} | {'Reward Pts':<10} | {'Inv Left':<8}")
        print("-" * 65)
        print(f"{'You':<10} | ${price_user:<7.2f} | {info_user['sales']:<6} | ${info_user['profit']:<7.2f} | {reward_user:<10.2f} | {env_user.inventory:<8}")
        print(f"{'JSON':<10} | ${price_json:<7.2f} | {info_json['sales']:<6} | ${info_json['profit']:<7.2f} | {reward_json:<10.2f} | {env_json.inventory:<8}")
        print(f"{'RL Agent':<10} | ${price_rl:<7.2f} | {info_rl['sales']:<6} | ${info_rl['profit']:<7.2f} | {reward_rl:<10.2f} | {env_rl.inventory:<8}")
        
        day += 1

    print("\n" + "="*65)
    print("               🏆 FINAL STANDINGS 🏆")
    print("="*65)
    print(f"{'Rank':<5} | {'Player':<10} | {'Total Profit':<15} | {'Total Reward Points':<15}")
    print("-" * 65)
    
    standings = sorted([
        ("You", total_profits["User"], total_rewards["User"]),
        ("JSON Base", total_profits["JSON"], total_rewards["JSON"]),
        ("RL Agent", total_profits["RL"], total_rewards["RL"])
    ], key=lambda x: x[2], reverse=True)
    
    for rank, (name, prof, rew) in enumerate(standings):
        print(f"{(rank+1):<5} | {name:<10} | ${prof:<14.2f} | {rew:<15.2f}")
    
    print("\n")

if __name__ == "__main__":
    main()
