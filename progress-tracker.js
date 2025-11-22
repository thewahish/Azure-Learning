/**
 * Azure Learning - ADHD-Friendly Progress Tracking System
 * Designed for dopamine optimization and overwhelm prevention
 */

class AzureLearningTracker {
    constructor() {
        this.gameState = this.loadProgress();
        this.achievements = this.initializeAchievements();
        this.questMap = this.initializeQuests();
        this.setupEventListeners();
        this.initializeADHDFeatures();
    }

    // Initialize default game state
    initializeGameState() {
        return {
            // Player Stats
            playerName: '',
            level: 1,
            totalXP: 0,
            currentSessionXP: 0,
            streak: 0,
            
            // Progress Tracking
            completedQuests: [],
            currentQuest: 'boot-first-vm',
            unlockedPaths: ['vm-quest'],
            
            // Achievement System
            badges: [],
            milestones: [],
            
            // ADHD-Specific Tracking
            sessionTime: 0,
            focusBreaks: 0,
            lastActiveDate: new Date().toDateString(),
            preferredSessionLength: 15, // minutes
            
            // Learning Preferences
            preferredLearningStyle: 'mixed', // visual, hands-on, mixed
            difficultyPreference: 'adaptive', // easy, adaptive, challenge
            
            // Motivation Tracking
            motivationLevel: 5, // 1-10 scale
            lastAchievementDate: null,
            encouragementNeeded: false,
            
            // Analytics
            totalTimeSpent: 0,
            questsAttempted: 0,
            questsCompleted: 0,
            averageSessionLength: 0
        };
    }

    // Initialize achievement system
    initializeAchievements() {
        return {
            // VM Mastery Path
            'first-vm-deployed': {
                name: 'First VM Deployed',
                description: 'Successfully created your first virtual machine',
                icon: '🚀',
                xp: 100,
                rarity: 'common'
            },
            'vm-connector': {
                name: 'VM Connector',
                description: 'Connected to a VM via RDP/SSH',
                icon: '🔗',
                xp: 150,
                rarity: 'common'
            },
            'scale-master': {
                name: 'Scale Master',
                description: 'Scaled a VM up and down',
                icon: '📈',
                xp: 200,
                rarity: 'uncommon'
            },
            
            // Storage Achievements
            'storage-explorer': {
                name: 'Storage Explorer',
                description: 'Created your first storage account',
                icon: '🗃️',
                xp: 100,
                rarity: 'common'
            },
            'file-uploader': {
                name: 'File Uploader',
                description: 'Successfully uploaded files to blob storage',
                icon: '📁',
                xp: 150,
                rarity: 'common'
            },
            
            // Database Achievements  
            'database-creator': {
                name: 'Database Creator',
                description: 'Set up your first Azure SQL database',
                icon: '🗄️',
                xp: 200,
                rarity: 'uncommon'
            },
            
            // Network Achievements
            'network-architect': {
                name: 'Network Architect',
                description: 'Created a virtual network',
                icon: '🌐',
                xp: 250,
                rarity: 'uncommon'
            },
            
            // Security Achievements
            'security-guard': {
                name: 'Security Guard',
                description: 'Configured basic security settings',
                icon: '🔒',
                xp: 300,
                rarity: 'rare'
            },
            
            // Milestone Achievements
            'week-warrior': {
                name: 'Week Warrior',
                description: 'Maintained a 7-day learning streak',
                icon: '🔥',
                xp: 500,
                rarity: 'rare'
            },
            'focus-champion': {
                name: 'Focus Champion',
                description: 'Completed 10 focused learning sessions',
                icon: '🎯',
                xp: 400,
                rarity: 'rare'
            },
            'azure-explorer': {
                name: 'Azure Explorer',
                description: 'Completed all beginner quests',
                icon: '🗺️',
                xp: 1000,
                rarity: 'epic'
            }
        };
    }

    // Initialize quest mapping
    initializeQuests() {
        return {
            // VM Quest Path
            'boot-first-vm': {
                name: 'Boot Your First VM',
                path: 'vm-quest',
                difficulty: 1,
                estimatedTime: 12,
                xp: 100,
                prerequisites: [],
                achievements: ['first-vm-deployed'],
                nextQuests: ['connect-conquer']
            },
            'connect-conquer': {
                name: 'Connect & Conquer',
                path: 'vm-quest',
                difficulty: 2,
                estimatedTime: 10,
                xp: 150,
                prerequisites: ['boot-first-vm'],
                achievements: ['vm-connector'],
                nextQuests: ['scale-army']
            },
            'scale-army': {
                name: 'Scale Your Army',
                path: 'vm-quest',
                difficulty: 3,
                estimatedTime: 15,
                xp: 200,
                prerequisites: ['connect-conquer'],
                achievements: ['scale-master'],
                nextQuests: ['web-app-boss']
            },
            
            // Storage Hunt Path
            'storage-vault': {
                name: 'Find the Storage Vault',
                path: 'storage-hunt',
                difficulty: 1,
                estimatedTime: 8,
                xp: 100,
                prerequisites: [],
                achievements: ['storage-explorer'],
                nextQuests: ['upload-treasures']
            }
        };
    }

    // Load progress from localStorage
    loadProgress() {
        try {
            const saved = localStorage.getItem('azureLearningProgress');
            if (saved) {
                const loaded = JSON.parse(saved);
                // Ensure new properties exist
                return { ...this.initializeGameState(), ...loaded };
            }
        } catch (error) {
            console.warn('Could not load saved progress:', error);
        }
        return this.initializeGameState();
    }

    // Save progress to localStorage
    saveProgress() {
        try {
            localStorage.setItem('azureLearningProgress', JSON.stringify(this.gameState));
            this.logAnalytics('progress_saved');
        } catch (error) {
            console.error('Could not save progress:', error);
        }
    }

    // Award XP with visual feedback
    awardXP(amount, reason = '') {
        this.gameState.totalXP += amount;
        this.gameState.currentSessionXP += amount;
        
        // Check for level up
        const newLevel = Math.floor(this.gameState.totalXP / 1000) + 1;
        if (newLevel > this.gameState.level) {
            this.gameState.level = newLevel;
            this.showLevelUpAnimation();
        }
        
        this.showXPGain(amount, reason);
        this.updateUI();
        this.saveProgress();
    }

    // Unlock achievement with celebration
    unlockAchievement(achievementId) {
        if (this.gameState.badges.includes(achievementId)) {
            return; // Already unlocked
        }
        
        const achievement = this.achievements[achievementId];
        if (!achievement) return;
        
        this.gameState.badges.push(achievementId);
        this.gameState.lastAchievementDate = new Date().toISOString();
        
        // Award XP
        this.awardXP(achievement.xp, achievement.name);
        
        // Show achievement popup
        this.showAchievementUnlock(achievement);
        
        // Check for milestone achievements
        this.checkMilestoneAchievements();
        
        this.saveProgress();
    }

    // Complete quest with full reward system
    completeQuest(questId) {
        if (this.gameState.completedQuests.includes(questId)) {
            return; // Already completed
        }
        
        const quest = this.questMap[questId];
        if (!quest) return;
        
        // Mark as completed
        this.gameState.completedQuests.push(questId);
        this.gameState.questsCompleted++;
        
        // Award XP
        this.awardXP(quest.xp, quest.name);
        
        // Unlock achievements
        quest.achievements.forEach(achievementId => {
            this.unlockAchievement(achievementId);
        });
        
        // Unlock next quests
        quest.nextQuests.forEach(nextQuestId => {
            this.unlockQuest(nextQuestId);
        });
        
        // Show completion celebration
        this.showQuestCompletion(quest);
        
        // Update motivation
        this.updateMotivation(1);
        
        this.saveProgress();
    }

    // ADHD-specific features
    initializeADHDFeatures() {
        // Focus session timer
        this.focusTimer = null;
        this.breakTimer = null;
        this.sessionStartTime = null;
        
        // Attention tracking
        this.setupAttentionTracking();
        
        // Automatic encouragement
        this.setupEncouragement();
        
        // Break reminders
        this.setupBreakReminders();
    }

    // Start focused learning session
    startFocusSession(duration = 15) {
        this.sessionStartTime = Date.now();
        this.gameState.preferredSessionLength = duration;
        
        // Visual focus mode
        document.body.classList.add('focus-mode');
        
        // Timer for break reminder
        this.focusTimer = setTimeout(() => {
            this.suggestBreak();
        }, duration * 60 * 1000);
        
        this.showNotification('🎯 Focus session started! You got this!', 'success');
    }

    // Suggest break with ADHD-friendly options
    suggestBreak() {
        const breakOptions = [
            'Take a 5-minute walk 🚶',
            'Do some quick stretches 🤸',
            'Drink some water 💧',
            'Look at something far away 👀',
            'Take 10 deep breaths 🫁'
        ];
        
        const randomBreak = breakOptions[Math.floor(Math.random() * breakOptions.length)];
        
        if (confirm(`Great focus! Time for a quick break.\n\nSuggestion: ${randomBreak}\n\nReady for a 5-minute break?`)) {
            this.startBreak();
        }
    }

    // Start break timer
    startBreak() {
        this.gameState.focusBreaks++;
        document.body.classList.add('break-mode');
        
        this.breakTimer = setTimeout(() => {
            this.endBreak();
        }, 5 * 60 * 1000);
        
        this.showNotification('⏸️ Break time! Your brain deserves a rest.', 'info');
    }

    // End break and resume focus
    endBreak() {
        document.body.classList.remove('break-mode');
        this.showNotification('🚀 Break over! Ready to continue learning?', 'success');
        
        // Offer to continue or finish session
        if (confirm('Feeling refreshed? Continue with another focus session?')) {
            this.startFocusSession();
        } else {
            this.endSession();
        }
    }

    // Track attention and provide adaptive feedback
    setupAttentionTracking() {
        let lastActivity = Date.now();
        let inactivityWarning = false;
        
        // Track user activity
        document.addEventListener('click', () => {
            lastActivity = Date.now();
            inactivityWarning = false;
        });
        
        document.addEventListener('keypress', () => {
            lastActivity = Date.now();
            inactivityWarning = false;
        });
        
        // Check for inactivity
        setInterval(() => {
            const timeSinceActivity = Date.now() - lastActivity;
            
            if (timeSinceActivity > 3 * 60 * 1000 && !inactivityWarning) { // 3 minutes
                inactivityWarning = true;
                this.showGentleNudge();
            }
        }, 30 * 1000); // Check every 30 seconds
    }

    // Show gentle nudge for ADHD attention
    showGentleNudge() {
        const nudges = [
            "Still there? No pressure - take your time! 😊",
            "Hey! Need a different approach to this lesson?",
            "Feeling stuck? Try the visual learning path instead!",
            "Want to switch to a different quest? Follow your curiosity!",
            "Brain feeling foggy? Maybe time for a quick movement break?"
        ];
        
        const randomNudge = nudges[Math.floor(Math.random() * nudges.length)];
        this.showNotification(randomNudge, 'gentle');
    }

    // Setup encouragement system
    setupEncouragement() {
        // Daily check-in
        const lastActive = new Date(this.gameState.lastActiveDate);
        const today = new Date();
        
        if (today.toDateString() !== lastActive.toDateString()) {
            // New day - update streak or reset
            const daysDiff = Math.floor((today - lastActive) / (1000 * 60 * 60 * 24));
            
            if (daysDiff === 1) {
                this.gameState.streak++;
                this.showNotification(`🔥 ${this.gameState.streak} day streak! You're on fire!`, 'success');
            } else if (daysDiff > 1) {
                this.gameState.streak = 1;
                this.showNotification("Welcome back! Every restart is a fresh beginning 🌟", 'gentle');
            }
            
            this.gameState.lastActiveDate = today.toDateString();
        }
    }

    // Adaptive difficulty adjustment
    adjustDifficulty() {
        const recentPerformance = this.calculateRecentPerformance();
        
        if (recentPerformance < 0.3) {
            // Struggling - offer easier content
            this.gameState.encouragementNeeded = true;
            this.showNotification("Want to try an easier quest first? No shame in building confidence! 💪", 'gentle');
        } else if (recentPerformance > 0.8) {
            // Excelling - offer harder content  
            this.showNotification("You're crushing it! Ready for a challenge quest? 🚀", 'success');
        }
    }

    // Calculate recent performance
    calculateRecentPerformance() {
        const recentQuests = this.gameState.completedQuests.slice(-5);
        const recentSuccess = recentQuests.length / Math.min(5, this.gameState.questsAttempted);
        return recentSuccess || 0;
    }

    // Show visual notifications
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `adhd-notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 4000);
    }

    // Show XP gain animation
    showXPGain(amount, reason) {
        const xpElement = document.createElement('div');
        xpElement.className = 'xp-gain-animation';
        xpElement.innerHTML = `
            <div class="xp-amount">+${amount} XP</div>
            <div class="xp-reason">${reason}</div>
        `;
        
        document.body.appendChild(xpElement);
        
        setTimeout(() => {
            xpElement.classList.add('animate');
        }, 100);
        
        setTimeout(() => {
            document.body.removeChild(xpElement);
        }, 2000);
    }

    // Analytics and insights
    logAnalytics(event, data = {}) {
        const analyticsData = {
            timestamp: new Date().toISOString(),
            event,
            sessionTime: this.gameState.sessionTime,
            level: this.gameState.level,
            totalXP: this.gameState.totalXP,
            ...data
        };
        
        // Store analytics locally (could be sent to server)
        const analytics = JSON.parse(localStorage.getItem('azureAnalytics') || '[]');
        analytics.push(analyticsData);
        localStorage.setItem('azureAnalytics', JSON.stringify(analytics.slice(-1000))); // Keep last 1000 events
    }

    // Generate ADHD-friendly progress report
    generateProgressReport() {
        const report = {
            // Positive reinforcement stats
            totalAchievements: this.gameState.badges.length,
            currentStreak: this.gameState.streak,
            levelsGained: this.gameState.level - 1,
            
            // Time management insights
            averageSessionTime: this.calculateAverageSessionTime(),
            totalFocusTime: this.gameState.totalTimeSpent,
            breaksTaken: this.gameState.focusBreaks,
            
            // Learning insights
            preferredLearningTimes: this.identifyOptimalLearningTimes(),
            strongestSkills: this.identifyStrengths(),
            recommendedNextSteps: this.generateRecommendations(),
            
            // Motivation tracking
            recentMomentum: this.calculateMomentum(),
            celebrationMoments: this.getRecentAchievements()
        };
        
        return report;
    }

    // Update UI with current state
    updateUI() {
        // Update player stats
        const levelElement = document.getElementById('player-level');
        if (levelElement) levelElement.textContent = this.gameState.level;
        
        const xpElement = document.getElementById('current-xp');
        if (xpElement) xpElement.textContent = this.gameState.totalXP;
        
        const badgeCountElement = document.getElementById('badge-count');
        if (badgeCountElement) badgeCountElement.textContent = this.gameState.badges.length;
        
        // Update XP bar
        const xpFillElement = document.getElementById('xp-fill');
        if (xpFillElement) {
            const currentLevelXP = this.gameState.totalXP % 1000;
            const percentage = (currentLevelXP / 1000) * 100;
            xpFillElement.style.width = percentage + '%';
        }
        
        // Update quest states in sidebar
        this.updateQuestStates();
    }

    // Setup event listeners
    setupEventListeners() {
        // Auto-save on visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.saveProgress();
            }
        });
        
        // Auto-save on page unload
        window.addEventListener('beforeunload', () => {
            this.saveProgress();
        });
    }
}

// Initialize the tracking system
const azureTracker = new AzureLearningTracker();

// Global functions for the game interface
function completeQuest(questId) {
    azureTracker.completeQuest(questId);
}

function startFocusSession(duration = 15) {
    azureTracker.startFocusSession(duration);
}

function awardXP(amount, reason) {
    azureTracker.awardXP(amount, reason);
}

function unlockAchievement(achievementId) {
    azureTracker.unlockAchievement(achievementId);
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AzureLearningTracker;
}