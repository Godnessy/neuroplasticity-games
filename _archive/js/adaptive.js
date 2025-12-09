const Adaptive = {
    targetAccuracy: 0.75,
    windowSize: 10,
    
    calculateSessionAccuracy(session) {
        if (!session || !session.answers || session.answers.length === 0) {
            return 0;
        }
        const correct = session.answers.filter(a => a.correct).length;
        return correct / session.answers.length;
    },

    shouldAdvanceLevel(session) {
        if (!session || session.answers.length < 5) {
            return false;
        }
        const accuracy = this.calculateSessionAccuracy(session);
        return accuracy >= 0.80;
    },

    shouldReduceDifficulty(session) {
        if (!session || session.answers.length < 5) {
            return false;
        }
        const accuracy = this.calculateSessionAccuracy(session);
        return accuracy < 0.60;
    },

    getRecommendedAction(session, currentLevel) {
        const accuracy = this.calculateSessionAccuracy(session);
        
        if (accuracy >= 0.80 && session.answers.length >= 10) {
            return {
                action: 'advance',
                reason: `Accuracy ${Math.round(accuracy * 100)}% - ready for next level!`,
                nextLevel: Math.min(currentLevel + 1, 12)
            };
        }
        
        if (accuracy < 0.60 && session.answers.length >= 5) {
            return {
                action: 'simplify',
                reason: `Accuracy ${Math.round(accuracy * 100)}% - adding more support`,
                adjustments: this.getScaffolds(currentLevel, accuracy)
            };
        }
        
        return {
            action: 'continue',
            reason: `Accuracy ${Math.round(accuracy * 100)}% - in the optimal learning zone`,
            nextLevel: currentLevel
        };
    },

    getScaffolds(level, accuracy) {
        const scaffolds = [];
        
        if (accuracy < 0.40) {
            scaffolds.push('showNumbers');
            scaffolds.push('extendTime');
            scaffolds.push('showHints');
        } else if (accuracy < 0.60) {
            scaffolds.push('showNumbers');
            scaffolds.push('extendTime');
        }
        
        return scaffolds;
    },

    adjustTimeLimit(baseTime, recentAnswers) {
        if (!baseTime || !recentAnswers || recentAnswers.length < 3) {
            return baseTime;
        }
        
        const avgResponseTime = recentAnswers.reduce((sum, a) => sum + a.responseTime, 0) / recentAnswers.length;
        const recentAccuracy = recentAnswers.filter(a => a.correct).length / recentAnswers.length;
        
        if (recentAccuracy >= 0.80 && avgResponseTime < baseTime * 0.5) {
            return Math.max(baseTime * 0.8, 8);
        }
        
        if (recentAccuracy < 0.60 || avgResponseTime > baseTime * 0.9) {
            return Math.min(baseTime * 1.25, 30);
        }
        
        return baseTime;
    },

    getPerformanceTrend(sessions) {
        if (!sessions || sessions.length < 2) {
            return 'insufficient_data';
        }
        
        const recent = sessions.slice(-5);
        const accuracies = recent.map(s => this.calculateSessionAccuracy(s));
        
        let improving = 0;
        for (let i = 1; i < accuracies.length; i++) {
            if (accuracies[i] > accuracies[i - 1]) improving++;
            else if (accuracies[i] < accuracies[i - 1]) improving--;
        }
        
        if (improving >= 2) return 'improving';
        if (improving <= -2) return 'declining';
        return 'stable';
    },

    calculateOptimalDifficulty(progress) {
        const levelAccuracies = progress.levelAccuracies || {};
        const currentLevel = progress.currentLevel || 1;
        
        const currentAccuracy = levelAccuracies[currentLevel];
        if (currentAccuracy === undefined) {
            return currentLevel;
        }
        
        if (currentAccuracy >= 0.85 && currentLevel < 12) {
            return currentLevel + 1;
        }
        
        if (currentAccuracy < 0.50 && currentLevel > 1) {
            return currentLevel - 1;
        }
        
        return currentLevel;
    },

    generateProgressReport(progress, sessions) {
        const report = {
            currentLevel: progress.currentLevel,
            overallAccuracy: progress.totalQuestions > 0 
                ? Math.round((progress.totalCorrect / progress.totalQuestions) * 100) 
                : 0,
            totalPlayTime: progress.totalPlayTime,
            sessionsCompleted: progress.sessionsCount,
            trend: this.getPerformanceTrend(sessions),
            levelBreakdown: {},
            areasForImprovement: [],
            strengths: []
        };
        
        for (const [level, accuracy] of Object.entries(progress.levelAccuracies || {})) {
            report.levelBreakdown[level] = Math.round(accuracy * 100);
            
            if (accuracy < 0.70) {
                report.areasForImprovement.push({
                    level: parseInt(level),
                    accuracy: Math.round(accuracy * 100)
                });
            } else if (accuracy >= 0.85) {
                report.strengths.push({
                    level: parseInt(level),
                    accuracy: Math.round(accuracy * 100)
                });
            }
        }
        
        const weakAreas = Storage.getWeakAreas();
        report.specificDifficulties = weakAreas.map(area => {
            const [level, combo] = area.key.split('_');
            return {
                level: parseInt(level),
                type: combo,
                errorRate: area.errorRate
            };
        });
        
        return report;
    },

    estimateTimeToCompletion(progress) {
        const currentLevel = progress.currentLevel || 1;
        const remainingLevels = 12 - currentLevel;
        const avgTimePerLevel = progress.totalPlayTime / Math.max(1, currentLevel - 1);
        
        return remainingLevels * avgTimePerLevel;
    }
};



