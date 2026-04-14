import os
import io
import json
import base64
import torch
import torch.nn as nn
from torchvision import transforms, models
from PIL import Image
from flask import Flask, jsonify, request
from flask_mysqldb import MySQL
from flask_cors import CORS
from dotenv import load_dotenv

# 1. SETUP & PATHS
# Silences unnecessary warnings
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
load_dotenv()

app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, 'models', 'plantmodel.pth')
CLASS_PATH = os.path.join(BASE_DIR, 'classes.json')

# 2. LOAD CLASS NAMES FROM TRAINED JSON
try:
    with open(CLASS_PATH, "r") as f:
        CLASS_NAMES = json.load(f)
    print(f"✅ Loaded {len(CLASS_NAMES)} classes from classes.json")
except Exception as e:
    print(f"❌ Critical Error: Could not load classes.json. Run train.py first! {e}")
    CLASS_NAMES = []

# 3. DEFINE ARCHITECTURE (Matches your train.py ResNet18)
def get_plant_model(num_classes):
    model = models.resnet18(weights=None) 
    num_ftrs = model.fc.in_features
    model.fc = nn.Linear(num_ftrs, num_classes)
    return model

device = torch.device('cpu')
model_instance = get_plant_model(num_classes=len(CLASS_NAMES))

try:
    state_dict = torch.load(MODEL_PATH, map_location=device)
    model_instance.load_state_dict(state_dict)
    model_instance.eval()
    print(f"✅ PyTorch Model loaded successfully!")
except Exception as e:
    print(f"❌ Critical Model Load Error: {e}")

# 4. DATABASE CONFIG
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'root' 
app.config['MYSQL_DB'] = 'planthub'
mysql = MySQL(app)

# 5. IMAGE PREPROCESSING (Matches val_transforms in train.py)
def preprocess_image(base64_data):
    img_bytes = base64.b64decode(base64_data)
    img = Image.open(io.BytesIO(img_bytes)).convert('RGB')
    transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225]),
    ])
    return transform(img).unsqueeze(0)

# 6. API ENDPOINTS
@app.route('/api/python/search', methods=['GET'])
def search_plants():
    query = request.args.get('q', '')
    try:
        cur = mysql.connection.cursor()
        search_sql = "SELECT plant_id, common_name, scientific_name, description, image_url FROM plants WHERE common_name LIKE %s"
        cur.execute(search_sql, (f"%{query}%",))
        rows = cur.fetchall()
        cur.close()
        return jsonify([{"id":r[0],"name":r[1],"scientificName":r[2],"description":r[3],"image":r[4]} for r in rows])
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/identify-plant', methods=['POST'])
def identify_plant():
    data = request.get_json()
    base64_image = data.get('image_data')
    if not base64_image: 
        return jsonify({"error": "No image provided"}), 400

    try:
        # A. AI PREDICTION
        input_tensor = preprocess_image(base64_image)
        with torch.no_grad():
            outputs = model_instance(input_tensor)
            probs = torch.nn.functional.softmax(outputs[0], dim=0)
            confidence, predicted = torch.max(probs, 0)
            
            predicted_name = CLASS_NAMES[predicted.item()]
            conf_percent = confidence.item() * 100

        # --- TERMINAL LOGGING (Check this while testing) ---
        print(f"\n--- AI Identification ---")
        print(f"Predicted: {predicted_name}")
        print(f"Confidence: {conf_percent:.2f}%")

        # B. DATABASE FETCH
        cur = mysql.connection.cursor()
        # Using LIKE to account for minor spacing/case differences between folders and DB
        cur.execute("SELECT plant_id, common_name, scientific_name, description, image_url FROM plants WHERE common_name LIKE %s", (f"%{predicted_name}%",))
        row = cur.fetchone()
        cur.close()

        if row:
            return jsonify([{ 
                "id": row[0], 
                "name": row[1], 
                "scientificName": row[2], 
                "description": row[3], 
                "image": row[4],
                "confidence": f"{conf_percent:.1f}%"
            }])
        
        # C. FALLBACK (AI works, but name doesn't match MySQL)
        print(f"⚠️ Warning: '{predicted_name}' not found in MySQL 'plants' table.")
        return jsonify([{
            "id": 0,
            "name": predicted_name,
            "scientificName": "Identified Species",
            "description": f"The AI identified this as {predicted_name} ({conf_percent:.1f}%), but no matching record was found in your database.",
            "image": "https://via.placeholder.com/300?text=No+Database+Match"
        }])

    except Exception as e:
        print(f"❌ Server Error: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    print("🚀 PlantHub Backend running on http://localhost:5001")
    app.run(debug=True, port=5001)