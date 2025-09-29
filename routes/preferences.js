const express = require('express');
const UserPreferences = require('../models/UserPreferences');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Get user preferences
router.get('/', authMiddleware, async (req, res) => {
    try {
        let userPreferences = await UserPreferences.findOne({ userId: req.user._id });
        
        // If no preferences exist, create default ones
        if (!userPreferences) {
            userPreferences = new UserPreferences({
                userId: req.user._id
            });
            await userPreferences.save();
        }

        res.json(userPreferences);
    } catch (error) {
        console.error('Get preferences error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update user preferences
router.put('/', authMiddleware, async (req, res) => {
    try {
        const { favoriteThemes, preferredDuration, bestTimeOfDay, notifications, theme } = req.body;
        
        let userPreferences = await UserPreferences.findOne({ userId: req.user._id });
        
        // If no preferences exist, create new ones
        if (!userPreferences) {
            userPreferences = new UserPreferences({
                userId: req.user._id
            });
        }

        // Update fields if provided
        if (favoriteThemes !== undefined) userPreferences.favoriteThemes = favoriteThemes;
        if (preferredDuration !== undefined) userPreferences.preferredDuration = preferredDuration;
        if (bestTimeOfDay !== undefined) userPreferences.bestTimeOfDay = bestTimeOfDay;
        if (notifications !== undefined) userPreferences.notifications = notifications;
        if (theme !== undefined) userPreferences.theme = theme;

        await userPreferences.save();
        res.json(userPreferences);
    } catch (error) {
        console.error('Update preferences error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Reset preferences to default
router.post('/reset', authMiddleware, async (req, res) => {
    try {
        await UserPreferences.findOneAndUpdate(
            { userId: req.user._id },
            {
                favoriteThemes: [],
                preferredDuration: "10 minutes",
                bestTimeOfDay: "Morning",
                notifications: true,
                theme: "light"
            },
            { upsert: true, new: true }
        );

        res.json({ message: 'Preferences reset to default' });
    } catch (error) {
        console.error('Reset preferences error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
