import json
import os

import joblib
from stable_baselines3 import DQN


SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(SCRIPT_DIR, "models")
OUTPUT_DIR = os.path.join(SCRIPT_DIR, "..", "src", "generated")


def _ensure_output_dir():
    os.makedirs(OUTPUT_DIR, exist_ok=True)


def _to_float_list(values):
    return [float(value) for value in values]


def export_ml_model():
    model_path = os.path.join(MODEL_DIR, "ml_model.joblib")
    encoder_path = os.path.join(MODEL_DIR, "ml_encoder.joblib")

    model = joblib.load(model_path)
    encoder = joblib.load(encoder_path)

    trees = []
    for estimator in model.estimators_:
        tree = estimator.tree_
        trees.append({
            "childrenLeft": [int(value) for value in tree.children_left.tolist()],
            "childrenRight": [int(value) for value in tree.children_right.tolist()],
            "feature": [int(value) for value in tree.feature.tolist()],
            "threshold": _to_float_list(tree.threshold.tolist()),
            "value": [float(node_value[0][0]) for node_value in tree.value.tolist()],
        })

    payload = {
        "modelType": "RandomForestRegressor",
        "nEstimators": len(model.estimators_),
        "nFeatures": int(model.n_features_in_),
        "categories": [[str(item) for item in category] for category in encoder.categories_],
        "trees": trees,
    }

    output_path = os.path.join(OUTPUT_DIR, "mlModel.generated.json")
    with open(output_path, "w", encoding="utf-8") as file:
        json.dump(payload, file, separators=(",", ":"))

    return output_path


def export_rl_model():
    model_path = os.path.join(MODEL_DIR, "dqn_coffee.zip")
    model = DQN.load(model_path)
    state_dict = model.q_net.state_dict()

    layer_keys = (
        ("q_net.0.weight", "q_net.0.bias"),
        ("q_net.2.weight", "q_net.2.bias"),
        ("q_net.4.weight", "q_net.4.bias"),
    )

    layers = []
    for weight_key, bias_key in layer_keys:
        weight = state_dict[weight_key].detach().cpu().numpy()
        bias = state_dict[bias_key].detach().cpu().numpy()
        layers.append({
            "weight": [[float(value) for value in row] for row in weight.tolist()],
            "bias": [float(value) for value in bias.tolist()],
        })

    payload = {
        "modelType": "DQN",
        "layers": layers,
    }

    output_path = os.path.join(OUTPUT_DIR, "rlModel.generated.json")
    with open(output_path, "w", encoding="utf-8") as file:
        json.dump(payload, file, separators=(",", ":"))

    return output_path


def main():
    _ensure_output_dir()
    ml_path = export_ml_model()
    rl_path = export_rl_model()
    print(f"Exported ML model to {ml_path}")
    print(f"Exported RL model to {rl_path}")


if __name__ == "__main__":
    main()
