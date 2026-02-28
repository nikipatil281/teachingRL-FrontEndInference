import pandas as pd

df = pd.read_csv('../coffee_shop_data.csv')

print("Data Summary:")
print(f"Total Rows: {len(df)}")

# Check average customers for low vs high prices
low_price = df[df['price_set_by_player'] < 4.5]
high_price = df[df['price_set_by_player'] > 5.5]

print(f"\nAvg Customers (Price < 4.50): {low_price['num_customers'].mean():.2f}")
print(f"Avg Revenue (Price < 4.50): {(low_price['num_customers'] * low_price['price_set_by_player']).mean():.2f}")

print(f"\nAvg Customers (Price > 5.50): {high_price['num_customers'].mean():.2f}")
print(f"Avg Revenue (Price > 5.50): {(high_price['num_customers'] * high_price['price_set_by_player']).mean():.2f}")

# Check correlation
print(f"\nCorrelation (Price vs Customers): {df['price_set_by_player'].corr(df['num_customers']):.4f}")
print(f"Correlation (Weather vs Customers): {df['weather'].astype('category').cat.codes.corr(df['num_customers']):.4f}")
