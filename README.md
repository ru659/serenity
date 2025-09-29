# Serenity Wellness App

A simple wellness application featuring a meditation library and personalized preferences. Built with Node.js, Express, and vanilla HTML/CSS/JavaScript.

## Features

### 🧘‍♀️ Meditation Library
- Browse meditation sessions by category and duration
- Interactive audio players with progress tracking
- Categories: Morning Calm, Stress Relief, Sleep Journey, Focus & Clarity, Mindfulness, Gratitude
- Duration options: 5, 10, 15, 20 minutes

### ⚙️ Personalized Preferences
- Select favorite meditation themes
- Set preferred session duration
- Choose best time of day for practice
- Save preferences (stored in memory)

### 🎨 Modern UI/UX
- Responsive design for all devices
- Clean, minimalist interface
- Smooth animations and transitions
- No authentication required - simple and accessible

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **CORS** - Cross-origin resource sharing

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with Flexbox/Grid
- **Vanilla JavaScript** - No frameworks, pure JS
- **Font Awesome** - Icons

## Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Application
```bash
npm start
```

### 3. Open in Browser
Visit: http://localhost:3008

That's it! No database setup, no authentication, no complex configuration needed.

## Project Structure

```
serenity/
├── frontend/                 # Frontend files
│   ├── index.html           # Welcome page
│   ├── login.html           # Welcome/options page
│   ├── meditation.html      # Meditation library
│   ├── preferences.html     # User preferences
│   ├── styles.css           # Main stylesheet
│   └── script.js            # Frontend JavaScript
├── server.js                # Express server (includes API routes)
├── package.json             # Dependencies
└── README.md                # This file
```

## API Endpoints

### Meditation Library
- `GET /api/meditation` - Get all meditation sessions
- `GET /api/meditation/:id` - Get specific meditation

### User Preferences
- `GET /api/preferences` - Get user preferences
- `PUT /api/preferences` - Update user preferences

## Usage

### 1. Welcome Page
- Landing page with app overview
- Direct access to meditation library

### 2. Meditation Library
- Browse meditation sessions by category and duration
- Interactive audio players with:
  - Play/pause controls
  - Progress bar with seeking
  - Volume control
  - Time display
- Filter sessions by category and duration

### 3. User Preferences
- Select favorite meditation themes (multiple selection)
- Set preferred session duration
- Choose best time of day for practice
- Save preferences (stored in server memory)

## Development

### Adding New Meditation Sessions
Edit the `meditations` array in `server.js` to add new sessions:

```javascript
const meditations = [
    {
        id: 7,
        title: "New Session",
        description: "Description here",
        category: "Category Name",
        duration: 15,
        audioUrl: "https://example.com/audio.mp3"
    },
    // ... existing sessions
];
```

### Customizing Audio
Replace the placeholder audio URLs in `server.js` with actual meditation audio files. The app supports standard audio formats (MP3, WAV, etc.).

### Styling
Modify `frontend/styles.css` to customize the appearance. The CSS uses modern features like:
- CSS Grid and Flexbox for layouts
- CSS Custom Properties for theming
- Responsive design with media queries

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## License

MIT License

---

**Serenity Wellness App** - Simple, accessible wellness for everyone. 🧘‍♀️✨
