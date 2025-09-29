// Global variables
let currentMeditations = [];
let currentUser = null;
let authToken = localStorage.getItem('authToken');

// API Base URL - dynamically use the same port as the server
const API_BASE = `${window.location.protocol}//${window.location.host}/api`;

// Authentication helper functions
function getAuthHeaders() {
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
    };
}

function isAuthenticated() {
    return authToken !== null;
}

function setAuthToken(token) {
    authToken = token;
    localStorage.setItem('authToken', token);
}

function clearAuth() {
    authToken = null;
    localStorage.removeItem('authToken');
    currentUser = null;
}

// Utility functions
function showError(message) {
    alert(message);
}

function showLoading(show = true) {
    const loadingElement = document.getElementById('loading');
    if (loadingElement) {
        loadingElement.style.display = show ? 'block' : 'none';
    }
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Authentication functions
async function registerUser(username, email, password) {
    try {
        showLoading(true);
        const response = await fetch(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password })
        });

        const data = await response.json();

        if (response.ok) {
            setAuthToken(data.token);
            currentUser = data.user;
            return { success: true, message: data.message };
        } else {
            return { success: false, message: data.message };
        }
    } catch (error) {
        console.error('Registration error:', error);
        return { success: false, message: 'Network error. Please try again.' };
    } finally {
        showLoading(false);
    }
}

async function loginUser(email, password) {
    try {
        showLoading(true);
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            setAuthToken(data.token);
            currentUser = data.user;
            return { success: true, message: data.message };
        } else {
            return { success: false, message: data.message };
        }
    } catch (error) {
        console.error('Login error:', error);
        return { success: false, message: 'Network error. Please try again.' };
    } finally {
        showLoading(false);
    }
}

function logoutUser() {
    clearAuth();
    window.location.href = 'login.html';
}

// Simple navigation functions
function goToMeditation() {
    if (!isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }
    window.location.href = 'meditation.html';
}

function goToPreferences() {
    if (!isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }
    window.location.href = 'preferences.html';
}

// Meditation functions
async function loadMeditations() {
    try {
        showLoading(true);
        const response = await fetch(`${API_BASE}/meditation`);
        const data = await response.json();

        currentMeditations = data;
        renderMeditations(data);
    } catch (error) {
        console.error('Load meditations error:', error);
        showError('Network error. Please try again.');
    } finally {
        showLoading(false);
    }
}

function renderMeditations(meditations) {
    const grid = document.getElementById('meditationGrid');
    const noResults = document.getElementById('noResults');

    if (meditations.length === 0) {
        grid.innerHTML = '';
        noResults.style.display = 'block';
        return;
    }

    noResults.style.display = 'none';
    grid.innerHTML = meditations.map(meditation => `
        <div class="meditation-card">
            <div class="card-content">
                <h3 class="card-title">${meditation.title}</h3>
                <p class="card-description">${meditation.description}</p>
                <div class="audio-player">
                    <div class="player-controls">
                        <button class="play-btn" onclick="playMeditation('${meditation._id}')">
                            <i class="fas fa-play"></i>
                        </button>
                        <div class="progress-container">
                            <div class="progress-bar">
                                <div class="progress"></div>
                            </div>
                        </div>
                        <div class="time-display">
                            <span>0:00</span>
                            <span>/</span>
                            <span>${meditation.duration}:00</span>
                        </div>
                        <button class="volume-btn">
                            <i class="fas fa-volume-up"></i>
                        </button>
                        <input type="range" class="volume-slider" min="0" max="100" value="50">
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function playMeditation(meditationId) {
    const meditation = currentMeditations.find(m => m._id === meditationId);
    if (!meditation) return;

    // For demo purposes, we'll use placeholder audio
    // In a real app, you would use the actual audioUrl from the meditation object
    const audioUrl = 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'; // Placeholder
    
    showAudioModal(meditation, audioUrl);
}

function showAudioModal(meditation, audioUrl) {
    const modal = document.getElementById('audioModal');
    const title = document.getElementById('modalTitle');
    const audioPlayer = document.getElementById('audioPlayer');
    
    title.textContent = meditation.title;
    audioPlayer.src = audioUrl;
    
    modal.classList.add('active');
    setupAudioPlayer(audioPlayer, meditation.duration);
}

function closeAudioModal() {
    const modal = document.getElementById('audioModal');
    const audioPlayer = document.getElementById('audioPlayer');
    
    audioPlayer.pause();
    audioPlayer.currentTime = 0;
    modal.classList.remove('active');
}

function setupAudioPlayer(audioElement, duration) {
    const playBtn = document.getElementById('playBtn');
    const progress = document.getElementById('progress');
    const currentTimeSpan = document.getElementById('currentTime');
    const durationSpan = document.getElementById('duration');
    const volumeSlider = document.getElementById('volumeSlider');
    const volumeBtn = document.getElementById('volumeBtn');

    // Set duration
    durationSpan.textContent = formatTime(duration * 60);

    // Play/Pause functionality
    playBtn.addEventListener('click', () => {
        if (audioElement.paused) {
            audioElement.play();
            playBtn.innerHTML = '<i class="fas fa-pause"></i>';
        } else {
            audioElement.pause();
            playBtn.innerHTML = '<i class="fas fa-play"></i>';
        }
    });

    // Update progress bar
    audioElement.addEventListener('timeupdate', () => {
        const progressPercent = (audioElement.currentTime / (duration * 60)) * 100;
        progress.style.width = `${progressPercent}%`;
        currentTimeSpan.textContent = formatTime(audioElement.currentTime);
    });

    // Click on progress bar to seek
    const progressBar = document.querySelector('.progress-bar');
    progressBar.addEventListener('click', (e) => {
        const rect = progressBar.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const width = rect.width;
        const clickPercent = clickX / width;
        audioElement.currentTime = clickPercent * (duration * 60);
    });

    // Volume control
    volumeSlider.addEventListener('input', (e) => {
        audioElement.volume = e.target.value / 100;
    });

    // Mute/unmute
    volumeBtn.addEventListener('click', () => {
        if (audioElement.volume > 0) {
            audioElement.volume = 0;
            volumeSlider.value = 0;
            volumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
        } else {
            audioElement.volume = 0.5;
            volumeSlider.value = 50;
            volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
        }
    });

    // Reset when audio ends
    audioElement.addEventListener('ended', () => {
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
        progress.style.width = '0%';
        currentTimeSpan.textContent = '0:00';
    });
}

// Filter functions
function setupFilters() {
    const categoryFilter = document.getElementById('categoryFilter');
    const durationFilter = document.getElementById('durationFilter');

    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterMeditations);
    }
    if (durationFilter) {
        durationFilter.addEventListener('change', filterMeditations);
    }
}

function filterMeditations() {
    const category = document.getElementById('categoryFilter').value;
    const duration = document.getElementById('durationFilter').value;

    let filtered = currentMeditations;

    if (category) {
        filtered = filtered.filter(m => m.category === category);
    }

    if (duration) {
        filtered = filtered.filter(m => m.duration === parseInt(duration));
    }

    renderMeditations(filtered);
}

// Preferences functions
async function loadPreferences() {
    if (!isAuthenticated()) {
        showError('Please login to view preferences');
        window.location.href = 'login.html';
        return;
    }

    try {
        showLoading(true);
        const response = await fetch(`${API_BASE}/preferences`, {
            headers: getAuthHeaders()
        });

        if (response.status === 401) {
            clearAuth();
            showError('Session expired. Please login again.');
            window.location.href = 'login.html';
            return;
        }

        const data = await response.json();
        populatePreferencesForm(data);
    } catch (error) {
        console.error('Load preferences error:', error);
        showError('Network error. Please try again.');
    } finally {
        showLoading(false);
    }
}

function populatePreferencesForm(preferences) {
    // Set favorite themes
    const themeCheckboxes = document.querySelectorAll('input[name="favoriteThemes"]');
    themeCheckboxes.forEach(checkbox => {
        checkbox.checked = preferences.favoriteThemes?.includes(checkbox.value) || false;
    });

    // Set preferred duration
    const durationSelect = document.getElementById('preferredDuration');
    if (durationSelect) {
        durationSelect.value = preferences.preferredDuration || '10 minutes';
    }

    // Set best time of day
    const timeRadios = document.querySelectorAll('input[name="bestTimeOfDay"]');
    timeRadios.forEach(radio => {
        radio.checked = radio.value === preferences.bestTimeOfDay;
    });
}

async function savePreferences(formData) {
    if (!isAuthenticated()) {
        showError('Please login to save preferences');
        window.location.href = 'login.html';
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/preferences`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(formData),
        });

        if (response.status === 401) {
            clearAuth();
            showError('Session expired. Please login again.');
            window.location.href = 'login.html';
            return;
        }

        const data = await response.json();
        alert('Preferences saved successfully!');
    } catch (error) {
        console.error('Save preferences error:', error);
        showError('Network error. Please try again.');
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication on protected pages
    if (window.location.pathname.includes('meditation') || window.location.pathname.includes('preferences')) {
        if (!isAuthenticated()) {
            window.location.href = 'login.html';
            return;
        }
    }

    // Login page
    if (window.location.pathname.includes('login')) {
        setupAuthForms();
    }

    // Meditation page
    if (window.location.pathname.includes('meditation')) {
        loadMeditations();
        setupFilters();
    }

    // Preferences page
    if (window.location.pathname.includes('preferences')) {
        loadPreferences();
        
        const preferencesForm = document.getElementById('preferencesForm');
        if (preferencesForm) {
            preferencesForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const formData = new FormData(preferencesForm);
                
                const preferences = {
                    favoriteThemes: Array.from(document.querySelectorAll('input[name="favoriteThemes"]:checked')).map(cb => cb.value),
                    preferredDuration: formData.get('preferredDuration'),
                    bestTimeOfDay: formData.get('bestTimeOfDay'),
                    notifications: formData.get('notifications') === 'on',
                    theme: formData.get('theme')
                };
                
                await savePreferences(preferences);
            });
        }
    }
});

function setupAuthForms() {
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(loginForm);
            const email = formData.get('email');
            const password = formData.get('password');
            
            const result = await loginUser(email, password);
            if (result.success) {
                alert(result.message);
                window.location.href = 'meditation.html';
            } else {
                showError(result.message);
            }
        });
    }

    // Register form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(registerForm);
            const username = formData.get('username');
            const email = formData.get('email');
            const password = formData.get('password');
            
            const result = await registerUser(username, email, password);
            if (result.success) {
                alert(result.message);
                window.location.href = 'meditation.html';
            } else {
                showError(result.message);
            }
        });
    }
}

// Close modal when clicking outside
document.addEventListener('click', (e) => {
    const modal = document.getElementById('audioModal');
    if (e.target === modal) {
        closeAudioModal();
    }
});
