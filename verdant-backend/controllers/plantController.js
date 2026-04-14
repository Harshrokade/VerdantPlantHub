const Plant = require('../models/Plant'); // MongoDB Atlas Model
const { mysqlPool } = require('../config/db'); // MySQL Pool exported from db.js

exports.getPlants = async (req, res, next) => {
  try {
    const { search, category } = req.query;

    // --- CASE 1: SEARCHING (Use MySQL) ---
    if (search) {
      console.log(`🔎 MySQL Search for: ${search}`);
      
      // SQL Aliases used to match the keys required by the Frontend PlantModal
      const sql = `
        SELECT 
          plant_id AS id, 
          common_name AS name, 
          scientific_name, 
          regional_name, 
          description, 
          care_guide, 
          location, 
          medicinal_benefits, 
          image_url 
        FROM plants 
        WHERE common_name LIKE ? OR scientific_name LIKE ? OR regional_name LIKE ?
      `;
      
      const queryParam = `%${search}%`;
      const [rows] = await mysqlPool.execute(sql, [queryParam, queryParam, queryParam]);
      
      return res.status(200).json({ 
        success: true, 
        count: rows.length, 
        plants: rows 
      });
    }

    // --- CASE 2: CATEGORY FILTER / DEFAULT LOAD (Use MongoDB Atlas) ---
    const filter = {};
    if (category && category !== 'All') {
        filter.cat = category;
    }

    const plants = await Plant.find(filter).sort({ name: 1 });
    
    res.status(200).json({ 
      success: true, 
      count: plants.length, 
      plants 
    });

  } catch (error) {
    console.error("Controller Error:", error);
    res.status(500).json({ success: false, message: "Database fetch failed" });
  }
};

// Fetch single plant by ID (supports both Atlas and MySQL IDs)
exports.getPlant = async (req, res, next) => {
  try {
    const id = req.params.id;

    // First try finding in MongoDB Atlas
    let plant = await Plant.findOne({ plantId: Number(id) });
    
    // Fallback: If not found, check MySQL
    if (!plant) {
      const [rows] = await mysqlPool.execute("SELECT * FROM plants WHERE plant_id = ?", [id]);
      plant = rows[0];
    }

    if (!plant) {
      return res.status(404).json({ success: false, message: 'Plant not found' });
    }

    res.status(200).json({ success: true, plant });
  } catch (error) {
    next(error);
  }
};