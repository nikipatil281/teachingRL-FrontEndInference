import os
import argparse
import pandas as pd
import numpy as np
import random
from stable_baselines3 import DQN
from coffee_env import CoffeeShopEnv

def main():
    parser = argparse.ArgumentParser(description="Generate a sequential CSV dataset using the trained RL agent")
    parser.add_argument("--episodes", type=int, default=40, help="Number of 28-day episodes to simulate (~1120 days)")
    args = parser.parse_args()

    models_path = "models/dqn_coffee.zip"
    export_path = "ml_assistant_data.csv"

    if not os.path.exists(models_path):
        alt_path = os.path.join(os.path.dirname(__file__), "models/dqn_coffee.zip")
        if os.path.exists(alt_path):
            models_path = alt_path
        else:
            print(f"Error: Trained model not found at {models_path}.")
            return

    print("Loading Trained RL Agent...")
    model = DQN.load(models_path)
    env = CoffeeShopEnv(market_states_path="../market_states.json")

    records = []

    print(f"Generating {args.episodes} episodes (~{args.episodes * 28} days) of sequential data...")

    for ep in range(args.episodes):
        obs, _ = env.reset()
        done = False
        
        while not done:
            # 1. Force Competitor Absence in ENTIRE day generation
            env.competitor_present = 0
            env.competitor_price = 0.0
            
            # Sync observation with environment changes (forcing no competitor)
            obs[4] = 0.0 # CompetitorPresent
            obs[5] = 0.0 # CompetitorPrice
            
            # Record state before the action
            day_of_week = env.day_mapping[int(obs[0])]
            weather = env.weather_mapping[int(obs[1])]
            inventory_start = int(env.inventory)
            nearby_event = "yes" if obs[3] == 1 else "no"
            yesterday_price = float(env.yesterday_price)

            # 2. Get RL Suggestion
            action_rl, _ = model.predict(obs, deterministic=True)
            rl_price = env._get_price_from_action(action_rl)

            # 3. Apply "-1 dollar" rule
            user_price = max(1.0, rl_price - 1.0)
            
            # Convert user_price back to action for env.step
            user_action = int(round((user_price - 1.00) / 0.50))
            user_action = max(0, min(18, user_action))

            # 4. Step Environment
            # Since we manually forced competitor_present=0, step() will compute demand without competition
            next_obs, reward, done, truncated, info = env.step(user_action)

            # Append record
            records.append({
                "Episode": ep + 1,
                "Day": env.current_day_index, # 1 to 28
                "DayOfWeek": day_of_week,
                "Weather": weather,
                "Event": nearby_event,
                "StartingInventory": inventory_start,
                "YesterdayPrice": yesterday_price,
                "CompetitorPresence": 0,
                "CompetitorPrice": 0.0,
                "UserPrice": float(user_price),
                "CupsSold": int(info["sales"]),
                "Profit": float(info["profit"]),
                "Reward": float(reward)
            })
            
            obs = next_obs

        if (ep + 1) % 10 == 0:
            print(f"Completed episode {ep + 1} / {args.episodes}...")

    # Convert to DataFrame
    df = pd.DataFrame(records)
    
    # Save the dataset
    df.to_csv(export_path, index=False)
    print(f"\nSuccessfully saved {len(df)} records to {export_path}!")
    
    # Distribution check
    print("\nUserPrice distribution:")
    print(df['UserPrice'].value_counts().sort_index())

if __name__ == "__main__":
    main()
