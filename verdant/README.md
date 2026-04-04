# 🌿 Verdant — Virtual Medicinal Plants Hub

A beautifully crafted React application for exploring medicinal plants, traditional remedies, and botanical wisdom from Ayurvedic and world herbal traditions.

## ✨ Features

- **Plant Encyclopedia** — 15 detailed medicinal plant profiles with dosage, preparation, and safety info
- **Traditional Remedies** — 12 time-tested herbal preparations (golden milk, kadha, tonics, etc.)
- **Symptom Finder** — Enter symptoms to instantly find matching plants and remedies
- **Favorites** — Save your favorite plants for quick access (persisted in localStorage)
- **Herbal Journal (Notes)** — Write personal notes linked to specific plants, track observations
- **Botanical Glossary** — 15 key Ayurvedic and herbal medicine terms explained
- **Plant Detail Modal** — Full profiles with properties, preparation, dosage, and caution info
- **Smooth Transitions** — Page animations, card hover effects, modal transitions
- **Fully Responsive** — Works on desktop, tablet, and mobile

## 🎨 Design

- **Color Palette**: White + Dark Green + Parrot Green
- **Typography**: Playfair Display (headings) + DM Sans (body)
- **CSS Modules** for scoped, maintainable styles
- **localStorage** persistence for favorites and notes

## 🚀 Quick Start

### Prerequisites
- Node.js v16+ installed
- npm or yarn

### Installation

```bash
# 1. Navigate to the project folder
cd verdant

# 2. Install dependencies
npm install

# 3. Start the development server
npm start
```

The app will open at **http://localhost:3000**

### Build for Production

```bash
npm run build
```

## 📁 File Structure

```
verdant/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Navbar.jsx           # Sticky navigation with mobile menu
│   │   ├── Navbar.module.css
│   │   ├── PlantCard.jsx        # Reusable plant card with favorites
│   │   ├── PlantCard.module.css
│   │   ├── PlantModal.jsx       # Full-screen plant detail modal
│   │   └── PlantModal.module.css
│   ├── pages/
│   │   ├── Home.jsx             # Landing page with hero + categories
│   │   ├── Home.module.css
│   │   ├── Plants.jsx           # Filterable plant grid
│   │   ├── Plants.module.css
│   │   ├── Remedies.jsx         # Accordion remedy list
│   │   ├── Remedies.module.css
│   │   ├── SymptomFinder.jsx    # Symptom-to-plant/remedy matcher
│   │   ├── SymptomFinder.module.css
│   │   ├── Favorites.jsx        # Saved plants page
│   │   ├── Favorites.module.css
│   │   ├── Notes.jsx            # Personal herbal journal
│   │   ├── Notes.module.css
│   │   ├── Glossary.jsx         # Botanical terms glossary
│   │   └── Glossary.module.css
│   ├── data/
│   │   └── plants.js            # All plant, remedy, and glossary data
│   ├── hooks/
│   │   ├── useLocalStorage.js   # Persistent state hook
│   │   └── useToast.js          # Toast notification system
│   ├── styles/
│   │   └── globals.css          # CSS variables, base styles, utilities
│   ├── App.jsx                  # Root component with routing & state
│   └── index.js                 # React entry point
├── package.json
└── README.md
```

## 💡 Adding More Plants

Edit `src/data/plants.js` and add objects to the `plants` array following this structure:

```js
{
  id: 16,
  name: "Plant Name",
  sci: "Scientific name",
  emoji: "🌿",
  cat: "Category",           // Must match a category in categories array
  tags: ["Tag1", "Tag2"],
  desc: "Description...",
  origin: "Region",
  part: "Leaf/Root/etc",
  flavor: "Taste description",
  preparation: "How to use",
  dosage: "Recommended dosage",
  caution: "Safety notes",
  rating: 4,                 // 1–5
  featured: false,           // Show on homepage?
  symptoms: ["symptom1"],    // Used by Symptom Finder
  color: "#c8edc8"           // Card background tint
}
```

## ⚠️ Disclaimer

This application is for **educational purposes only**. The information provided is not intended to diagnose, treat, cure, or prevent any disease. Always consult a qualified healthcare practitioner before using any medicinal herb.
