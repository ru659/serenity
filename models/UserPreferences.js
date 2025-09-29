const mongoose = require('mongoose');

const userPreferencesSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    favoriteThemes: {
        type: [String],
        default: []
    },
    preferredDuration: {
        type: String,
        default: "10 minutes"
    },
    bestTimeOfDay: {
        type: String,
        default: "Morning"
    },
    notifications: {
        type: Boolean,
        default: true
    },
    theme: {
        type: String,
        default: "light"
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt field on save
userPreferencesSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('UserPreferences', userPreferencesSchema);
