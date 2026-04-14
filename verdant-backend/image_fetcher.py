# image_fetcher.py

import os
import requests
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
from serpapi import GoogleSearch # You need to sign up for a key at serpapi.com

# --- Load environment variables ---
load_dotenv()

# --- Configuration ---
# You need a SerpApi key for image searches
SERPAPI_API_KEY = os.environ.get("SERPAPI_API_KEY")

# Replace 'DATABASE_URL' with your actual environment variable key
DATABASE_URL = os.getenv('DATABASE_URL')
if not DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable not set.")

# --- Initialize Flask App and DB for context ---
# We initialize a minimal app context just to interact with the DB model
from flask import Flask
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URL
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# --- Define the Plant Model (Must match app.py) ---
class Plant(db.Model):
    __tablename__ = 'plants'
    plant_id = db.Column(db.Integer, primary_key=True) 
    common_name = db.Column(db.String(100), nullable=False)
    scientific_name = db.Column(db.String(100), nullable=False, unique=True)
    # Include other columns if you need them, but these are essential for the script
    image_url = db.Column(db.String(500)) 

    def __repr__(self):
        return f'<Plant {self.common_name}>'

# --- Image Fetching Function (Using SerpApi) ---
def fetch_plant_image_url(plant_name):
    """Searches for a high-quality image URL using SerpApi's Google Images search."""
    if not SERPAPI_API_KEY:
        print("ERROR: SERPAPI_API_KEY not found. Skipping image fetch.")
        return None

    print(f"Searching for image of: {plant_name}")
    try:
        search = GoogleSearch({
            "q": f"High quality image of {plant_name}",
            "tbm": "isch",  # Set search type to images
            "ijn": "0",     # First page of results
            "api_key": SERPAPI_API_KEY
        })
        results = search.get_dict()
        
        # Look for the first valid image result
        if "images_results" in results and results["images_results"]:
            first_image = results["images_results"][0]
            print(f"   -> Found URL: {first_image.get('original')[:70]}...")
            return first_image.get('original')
            
    except Exception as e:
        print(f"   -> Image search failed for {plant_name}: {e}")
        return None
        
    return None

# --- Main Script Execution ---
def update_plant_images():
    with app.app_context():
        # Fetch plants that are missing an image_url
        plants_to_update = Plant.query.filter(
            Plant.image_url.is_(None) | (Plant.image_url == '')
        ).all()
        
        if not plants_to_update:
            print("All plants already have image URLs. Nothing to update.")
            return

        print(f"Found {len(plants_to_update)} plants missing image URLs. Starting fetch...")
        
        for plant in plants_to_update:
            # Use the scientific name for the best search result accuracy
            image_url = fetch_plant_image_url(plant.scientific_name)
            
            if image_url:
                plant.image_url = image_url
            
            # Optional: Add a small delay to respect API limits
            # import time; time.sleep(1) 

        # Commit all changes to the database at the end
        db.session.commit()
        print("Database update complete.")

if __name__ == '__main__':
    update_plant_images()