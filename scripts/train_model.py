import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from skl2onnx import convert_sklearn
from skl2onnx.common.data_types import FloatTensorType, StringTensorType
import onnx

# 1. Load Data
# Assuming the CSV is in the parent folder or same folder. Adjust path as needed.
try:
    df = pd.read_csv('../../coffee_shop_data.csv')
except FileNotFoundError:
    print("Error: coffee_shop_data.csv not found in parent directory. Please ensure it exists.")
    exit(1)

print(f"Loaded {len(df)} rows from CSV.")

# 2. Preprocessing
# We want to predict 'num_customers' (to then calculate revenue) or 'revenue' directly?
# The CSV has 'num_customers'. We can predict customers and then multiply by price.
# Or we can predict revenue if we had it. Let's predict 'num_customers' as it's cleaner demand.

# Features: 'price_set_by_player', 'weather', 'nearby_event'
# 'day_of_week' might be useful too.

df_monopoly = df[df['competitor_presence'] == 0].copy()
print(f"Training on {len(df_monopoly)} monopoly rows.")

X = df_monopoly[['price_set_by_player', 'weather', 'nearby_event']]
y = df_monopoly['num_customers']

# Define preprocessor
categorical_features = ['weather']
numerical_features = ['price_set_by_player', 'nearby_event']

preprocessor = ColumnTransformer(
    transformers=[
        ('num', 'passthrough', numerical_features),
        ('cat', OneHotEncoder(handle_unknown='ignore'), categorical_features)
    ])

# 3. Define Model
# Random Forest Regressor
model = Pipeline(steps=[
    ('preprocessor', preprocessor),
    ('regressor', RandomForestRegressor(n_estimators=100, random_state=42))
])

# 4. Train
print("Training Random Forest model...")
model.fit(X, y)
print("Training complete.")

# 5. Export to ONNX
# Input names: price, weather, nearby_event
# Note: The order must match the X dataframe columns
initial_types = [
    ('price_set_by_player', FloatTensorType([None, 1])),
    ('weather', StringTensorType([None, 1])),
    ('nearby_event', FloatTensorType([None, 1]))
]

print("Converting to ONNX...")
onnx_model = convert_sklearn(model, initial_types=initial_types)

# 6. Save
import os
output_path = '../public/model.onnx'
# output_path = '../coffee-rl-app/public/model.onnx' # OLD INCORRECT PATH
os.makedirs(os.path.dirname(output_path), exist_ok=True)

with open(output_path, "wb") as f:
    f.write(onnx_model.SerializeToString())

print(f"Model saved to {output_path}")
print("Done.")
