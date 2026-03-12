import os
import argparse
from stable_baselines3 import DQN
from stable_baselines3.common.env_checker import check_env
from stable_baselines3.common.evaluation import evaluate_policy
from coffee_env import CoffeeShopEnv

def main():
    parser = argparse.ArgumentParser(description="Train a DQN agent to play the Coffee Shop simulation")
    parser.add_argument("--timesteps", type=int, default=1000000, help="Number of timesteps to train")
    parser.add_argument("--eval_episodes", type=int, default=100, help="Number of episodes to evaluate")
    args = parser.parse_args()

    # Define paths
    models_dir = "models"
    models_path = f"{models_dir}/dqn_coffee.zip"
    
    os.makedirs(models_dir, exist_ok=True)

    # 1. Initialize custom environment
    env = CoffeeShopEnv(market_states_path="../market_states.json")

    # Validate the environment to ensure Gym compatibility
    print("Checking environment compatibility...")
    check_env(env, warn=True)
    print("Environment check passed!")

    # 2. Setup the DQN Model
    # MlpPolicy is a standard multi-layer perceptron neural network
    model = DQN(
        "MlpPolicy", 
        env, 
        verbose=1,
        learning_rate=0.0005,
        buffer_size=50000,
        learning_starts=5000,
        batch_size=128,
        tau=1.0, 
        gamma=0.99, 
        target_update_interval=500,
        exploration_fraction=0.15, # Explores 20% of the training duration
        exploration_initial_eps=1.0,
        exploration_final_eps=0.05
    )

    # 3. Train the Model
    print(f"\nTraining DQN Agent for {args.timesteps} timesteps...")
    model.learn(total_timesteps=args.timesteps, progress_bar=True)

    # 4. Save
    print(f"\nSaving model to {models_path}...")
    model.save(models_path)

    # 5. Evaluate the newly trained model
    print("\nEvaluating trained policy...")
    # Wrap in a new env to ensure determinism
    eval_env = CoffeeShopEnv(market_states_path="../market_states.json")
    mean_reward, std_reward = evaluate_policy(model, eval_env, n_eval_episodes=args.eval_episodes)
    print(f"Mean Reward over {args.eval_episodes} games: {mean_reward:.2f} +/- {std_reward:.2f}")

if __name__ == "__main__":
    main()
