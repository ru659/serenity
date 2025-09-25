const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'frontend')));

// Sample meditation data (in-memory storage)
const meditations = [
    {
        id: 1,
        title: "Morning Calm",
        description: "Start your day with clarity and intention.",
        category: "Morning Calm",
        duration: 10,
        audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav"
    },
    {
        id: 2,
        title: "Stress Relief",
        description: "Let go of tension and reconnect with your breath.",
        category: "Stress Relief",
        duration: 15,
        audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav"
    },
    {
        id: 3,
        title: "Sleep Journey",
        description: "Drift into restful sleep with gentle guidance.",
        category: "Sleep Journey",
        duration: 20,
        audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav"
    },
    {
        id: 4,
        title: "Focus & Clarity",
        description: "Enhance your concentration and mental clarity.",
        category: "Focus & Clarity",
        duration: 15,
        audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav"
    },
    {
        id: 5,
        title: "Mindfulness Practice",
        description: "Cultivate present-moment awareness and inner peace.",
        category: "Mindfulness",
        duration: 10,
        audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav"
    },
    {
        id: 6,
        title: "Gratitude Meditation",
        description: "Open your heart to appreciation and joy.",
        category: "Gratitude",
        duration: 5,
        audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav"
    }
];

// Simple user preferences storage (in-memory)
let userPreferences = {
    favoriteThemes: [],
    preferredDuration: "10 minutes",
    bestTimeOfDay: "Morning"
};

// API Routes
app.get('/api/meditation', (req, res) => {
    const { category, duration } = req.query;
    let filteredMeditations = meditations;

    if (category) {
        filteredMeditations = filteredMeditations.filter(m => m.category === category);
    }

    if (duration) {
        filteredMeditations = filteredMeditations.filter(m => m.duration === parseInt(duration));
    }

    res.json(filteredMeditations);
});

app.get('/api/meditation/:id', (req, res) => {
    const meditation = meditations.find(m => m.id === parseInt(req.params.id));
    if (!meditation) {
        return res.status(404).json({ message: 'Meditation not found' });
    }
    res.json(meditation);
});

app.get('/api/preferences', (req, res) => {
    res.json(userPreferences);
});

app.put('/api/preferences', (req, res) => {
    const { favoriteThemes, preferredDuration, bestTimeOfDay } = req.body;
    
    if (favoriteThemes !== undefined) userPreferences.favoriteThemes = favoriteThemes;
    if (preferredDuration !== undefined) userPreferences.preferredDuration = preferredDuration;
    if (bestTimeOfDay !== undefined) userPreferences.bestTimeOfDay = bestTimeOfDay;

    res.json(userPreferences);
});

// Serve static files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'login.html'));
});

app.get('/meditation', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'meditation.html'));
});

app.get('/preferences', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'preferences.html'));
});

const PORT = process.env.PORT || 3006;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Visit: http://localhost:${PORT}`);
});
