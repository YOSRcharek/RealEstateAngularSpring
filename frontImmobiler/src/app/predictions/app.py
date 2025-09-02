from flask import Flask, request, jsonify
import joblib
import pandas as pd
import os
# 🔹 Charger les fichiers sauvegardés


BASE_DIR = os.path.dirname(os.path.abspath(__file__))

model = joblib.load(os.path.join(BASE_DIR, "random_forest_tn_model.pkl"))
imputer = joblib.load(os.path.join(BASE_DIR, "imputer.pkl"))
encoder = joblib.load(os.path.join(BASE_DIR, "encoder.pkl"))

# Colonnes numériques
num_cols = ["Area", "room", "bathroom", "garage", "garden", "pool", "furnished", "air_conditioning"]

app = Flask(__name__)

# Pour autoriser Angular à appeler cette API
from flask_cors import CORS
CORS(app)

@app.route("/predict", methods=["POST"])
def predict_price():
    data = request.json  # Recevoir le JSON envoyé depuis Angular
    
    # Convertir en DataFrame
    df = pd.DataFrame([data])
    
    # Gérer les valeurs manquantes
    df[num_cols] = imputer.transform(df[num_cols])
    df["location"] = df["location"].fillna("Unknown")
    
    # Encoder location
    location_encoded = encoder.transform(df[["location"]])
    location_cols = encoder.get_feature_names_out(["location"])
    location_df = pd.DataFrame(location_encoded, columns=location_cols, index=df.index)
    
    # Créer X_final
    X_final = pd.concat([df[num_cols], location_df], axis=1)
    
    # Prédiction
    prix_estime = model.predict(X_final)[0]
    
    return jsonify({"prix_estime_tnd": float(prix_estime)})

if __name__ == "__main__":
    app.run(debug=True)
