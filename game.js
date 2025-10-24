// Lumon Industries - Macrodata Refinement Clicker Game

class LumonGame {
    constructor() {
        this.numbers = 0;
        this.clickPower = 1;
        this.numbersPerSecond = 0;
        this.level = 1;
        this.meritTokens = 0;
        this.totalNumbersRefined = 0;

        // New sorting system
        this.numberQueue = [];
        this.maxQueueSize = 8;
        this.selectedNumber = null;
        this.combo = 0;
        this.totalSorted = 0;
        this.correctSorts = 0;
        this.sortTimes = [];
        this.categoryCount = { scary: 0, angry: 0, sad: 0, happy: 0 };
        this.autoSortEnabled = false;
        this.lastSpawnTime = Date.now();
        this.spawnInterval = 3000; // 3 seconds base

        this.automationUpgrades = [
            {
                id: 'intern',
                name: 'Nouvel Innie',
                description: 'Génère des nombres + trie manuellement',
                baseCost: 10,
                baseProduction: 0.1,
                count: 0,
                costMultiplier: 1.15
            },
            {
                id: 'colleague',
                name: 'Équipe MDR',
                description: 'Augmente la vitesse de spawn',
                baseCost: 100,
                baseProduction: 1,
                count: 0,
                costMultiplier: 1.15
            },
            {
                id: 'milchick',
                name: 'Mr. Milchick',
                description: '🤖 Active le tri automatique ! (3+ upgrades)',
                baseCost: 1100,
                baseProduction: 8,
                count: 0,
                costMultiplier: 1.15
            },
            {
                id: 'odDept',
                name: 'Département O&D',
                description: 'Optics & Design - Créateurs d\'art mystérieux',
                baseCost: 12000,
                baseProduction: 47,
                count: 0,
                costMultiplier: 1.15
            },
            {
                id: 'waffle',
                name: 'Waffle Party',
                description: 'La récompense ultime pour 100% de quota',
                baseCost: 130000,
                baseProduction: 260,
                count: 0,
                costMultiplier: 1.15
            },
            {
                id: 'breakRoom',
                name: 'Protocole Break Room',
                description: 'Correction de comportement pour productivité maximale',
                baseCost: 800000,
                baseProduction: 900,
                count: 0,
                costMultiplier: 1.15
            },
            {
                id: 'goatRoom',
                name: 'Salle des Chèvres',
                description: 'Les chèvres mystérieuses du département',
                baseCost: 1400000,
                baseProduction: 1400,
                count: 0,
                costMultiplier: 1.15
            },
            {
                id: 'perpetuity',
                name: 'Aile de la Perpétuité',
                description: 'Où Burt travaille sur des mystères anciens',
                baseCost: 20000000,
                baseProduction: 7800,
                count: 0,
                costMultiplier: 1.15
            },
            {
                id: 'cobel',
                name: 'Ms. Cobel',
                description: 'La manager déterminée de Lumon',
                baseCost: 100000000,
                baseProduction: 25000,
                count: 0,
                costMultiplier: 1.15
            },
            {
                id: 'boardRoom',
                name: 'Conseil d\'Administration',
                description: 'Le pouvoir suprême de Lumon Industries',
                baseCost: 500000000,
                baseProduction: 100000,
                count: 0,
                costMultiplier: 1.15
            }
        ];

        this.efficiencyUpgrades = [
            {
                id: 'ergonomics',
                name: 'Poste de Travail Optimisé',
                description: '+1 nombre par clic - Confort approuvé par Lumon',
                cost: 50,
                purchased: false,
                effect: () => this.clickPower += 1
            },
            {
                id: 'defiantJazz',
                name: 'Defiant Jazz',
                description: 'Double les clics - La musique qui motive',
                cost: 500,
                purchased: false,
                effect: () => this.clickPower *= 2
            },
            {
                id: 'musicCards',
                name: 'Music Dance Experience',
                description: '+5 nombres par clic - Récompense de quota',
                cost: 2500,
                purchased: false,
                effect: () => this.clickPower += 5
            },
            {
                id: 'handbook',
                name: 'Manuel de l\'Employé',
                description: 'x2 production passive - "You are a whole person"',
                cost: 10000,
                purchased: false,
                effect: () => this.calculateNPS()
            },
            {
                id: 'fingerTraps',
                name: 'Finger Traps',
                description: '+10% production - Thérapie approuvée',
                cost: 50000,
                purchased: false,
                effect: () => this.calculateNPS()
            },
            {
                id: 'overtime',
                name: 'Protocole Overtime',
                description: '+25% production - Engagement maximum',
                cost: 250000,
                purchased: false,
                effect: () => this.calculateNPS()
            },
            {
                id: 'kier',
                name: 'Portrait de Kier',
                description: 'x3 clics - "Kier nous observe et nous protège"',
                cost: 1000000,
                purchased: false,
                effect: () => this.clickPower *= 3
            },
            {
                id: 'lexington',
                name: 'Lettre de Lexington',
                description: 'x2 production totale - Connaissance interdite',
                cost: 5000000,
                purchased: false,
                effect: () => this.calculateNPS()
            },
            {
                id: 'enlightenment',
                name: 'Réveil Complet',
                description: 'x2 production - Votre Innie et Outie ne font qu\'un',
                cost: 20000000,
                purchased: false,
                effect: () => this.calculateNPS()
            }
        ];

        this.milestones = [
            { threshold: 100, message: "Premier quota atteint ! Mr. Milchick est fier de vous." },
            { threshold: 1000, message: "Excellent travail ! Accès au Music Dance Experience débloqué." },
            { threshold: 10000, message: "100% de quota ! Une Waffle Party a été organisée en votre honneur !" },
            { threshold: 50000, message: "Performance remarquable ! Vous recevez des Finger Traps en récompense." },
            { threshold: 100000, message: "Employé du mois ! Accès à la salle des chèvres débloqué." },
            { threshold: 500000, message: "Ms. Cobel vous félicite personnellement. Continuez ainsi." },
            { threshold: 1000000, message: "Vous avez découvert les secrets de l'Aile de la Perpétuité." },
            { threshold: 5000000, message: "Le Conseil d'Administration reconnaît votre dévouement à Lumon." }
        ];

        // Number categories like in Severance
        this.numberCategories = {
            scary: {
                numbers: [13, 66, 666, 99, 101, 187, 404, 911],
                color: '#d9534f',
                bonus: 2,
                description: 'SCARY'
            },
            sad: {
                numbers: [0, 7, 21, 42, 69, 273, 365],
                color: '#5bc0de',
                bonus: 1.5,
                description: 'SAD'
            },
            angry: {
                numbers: [8, 18, 88, 108, 188, 888],
                color: '#f0ad4e',
                bonus: 1.8,
                description: 'ANGRY'
            },
            happy: {
                numbers: [3, 7, 11, 17, 23, 29, 31, 37, 41, 43, 47, 53],
                color: '#5cb85c',
                bonus: 1.3,
                description: 'HAPPY'
            }
        };

        this.currentNumber = this.getRandomNumber();
        this.currentCategory = null;

        // Kier Eagan's Nine Core Principles
        this.kierPrinciples = [
            "Travail et Tempérance",
            "Calme et Compassion",
            "Alimentation et Fraternité",
            "Humilité et Dévotion",
            "Vigilance et Progrès",
            "Retenue et Modestie",
            "Courage et Discipline",
            "Intégrité et Innovation",
            "Persévérance et Unité"
        ];

        this.lumonQuotes = [
            "We are mysterious and important.",
            "I find the work rewarding.",
            "The work is mysterious and important.",
            "Kier Eagan loves you.",
            "The refinement process is sacred.",
            "Trust the process.",
            "Your Outie chose this for you."
        ];

        this.init();
    }

    init() {
        this.loadGame();
        this.setupEventListeners();
        this.updateUI();
        this.startGameLoop();
        this.renderUpgrades();
        this.showRandomQuote();
        this.spawnInitialNumbers();
    }

    showRandomQuote() {
        const quote = this.lumonQuotes[Math.floor(Math.random() * this.lumonQuotes.length)];
        this.showNotification(quote);
    }

    setupEventListeners() {
        // Save button
        document.getElementById('saveButton').addEventListener('click', () => {
            this.saveGame();
            this.showNotification('Progression sauvegardée !');
        });

        // Tabs
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', () => {
                const targetTab = tab.dataset.tab;
                this.switchTab(targetTab);
            });
        });

        // Prestige button
        document.getElementById('prestigeButton').addEventListener('click', () => {
            this.performPrestige();
        });

        // Bin click handlers
        document.querySelectorAll('.bin-body').forEach(bin => {
            bin.addEventListener('click', () => {
                const category = bin.dataset.bin;
                this.sortNumber(category);
            });
        });

        // Auto-save every 30 seconds
        setInterval(() => this.saveGame(), 30000);
    }

    spawnInitialNumbers() {
        // Spawn 3 numbers to start
        for (let i = 0; i < 3; i++) {
            this.spawnNumber();
        }
    }

    spawnNumber() {
        if (this.numberQueue.length >= this.maxQueueSize) return;

        const number = this.getRandomNumber();
        const category = this.getNumberCategory(number);

        this.numberQueue.push({
            value: number,
            category: category ? category.name : null,
            id: Date.now() + Math.random()
        });

        this.renderQueue();
    }

    renderQueue() {
        const queueContainer = document.getElementById('numberQueue');
        queueContainer.innerHTML = '';

        this.numberQueue.forEach(numberObj => {
            const numberEl = document.createElement('div');
            numberEl.className = `number-item ${numberObj.category || ''}`;
            numberEl.textContent = numberObj.value;
            numberEl.dataset.numberId = numberObj.id;

            numberEl.addEventListener('click', () => {
                this.selectNumber(numberObj);
            });

            queueContainer.appendChild(numberEl);
        });
    }

    selectNumber(numberObj) {
        // Deselect all
        document.querySelectorAll('.number-item').forEach(el => {
            el.classList.remove('selected');
        });

        // Select this number
        this.selectedNumber = numberObj;
        const numberEl = document.querySelector(`[data-number-id="${numberObj.id}"]`);
        if (numberEl) {
            numberEl.classList.add('selected');
        }

        // Highlight correct bin
        this.highlightCorrectBin(numberObj.category);
    }

    highlightCorrectBin(category) {
        // Remove all highlights
        document.querySelectorAll('.bin').forEach(bin => {
            bin.classList.remove('highlight');
        });

        // Highlight the correct bin
        if (category) {
            const correctBin = document.querySelector(`.${category}-bin`);
            if (correctBin) {
                correctBin.classList.add('highlight');
            }
        }
    }

    sortNumber(targetCategory) {
        if (!this.selectedNumber) {
            this.showNotification('Sélectionnez d\'abord un nombre !');
            return;
        }

        const isCorrect = this.selectedNumber.category === targetCategory;
        const number = this.selectedNumber.value;

        // Remove from queue
        this.numberQueue = this.numberQueue.filter(n => n.id !== this.selectedNumber.id);

        // Calculate reward
        let reward = this.clickPower;

        if (isCorrect) {
            const category = this.numberCategories[targetCategory];
            if (category) {
                reward *= category.bonus;
            }
            this.combo++;
            this.correctSorts++;
            this.categoryCount[targetCategory]++;

            // Combo bonus
            if (this.combo > 1) {
                reward *= (1 + (this.combo * 0.1)); // +10% per combo
            }

            // Show success
            this.showReward(`✓ Correct ! ${this.numberCategories[targetCategory].description} +${this.formatNumber(reward)}`);
        } else {
            // Wrong category - lose combo
            reward = this.clickPower * 0.5; // Penalty
            this.combo = 0;
            this.showReward(`✗ Mauvaise catégorie ! +${this.formatNumber(reward)} seulement`);
        }

        this.numbers += reward;
        this.totalNumbersRefined += reward;
        this.totalSorted++;

        // Track sort speed
        this.sortTimes.push(Date.now());
        if (this.sortTimes.length > 10) {
            this.sortTimes.shift();
        }

        // Clear selection
        this.selectedNumber = null;
        document.querySelectorAll('.number-item').forEach(el => {
            el.classList.remove('selected');
        });
        document.querySelectorAll('.bin').forEach(bin => {
            bin.classList.remove('highlight');
        });

        this.renderQueue();
        this.updateUI();
        this.updateCategoryCounters();
        this.checkMilestones();
    }

    updateCategoryCounters() {
        Object.keys(this.categoryCount).forEach(cat => {
            const el = document.getElementById(`${cat}Count`);
            if (el) {
                el.textContent = this.categoryCount[cat];
            }
        });
    }

    getSortSpeed() {
        if (this.sortTimes.length < 2) return 0;

        const timeSpan = (this.sortTimes[this.sortTimes.length - 1] - this.sortTimes[0]) / 1000 / 60; // minutes
        return Math.round(this.sortTimes.length / timeSpan);
    }

    getAccuracy() {
        if (this.totalSorted === 0) return 100;
        return Math.round((this.correctSorts / this.totalSorted) * 100);
    }

    getRandomNumber() {
        // Get all numbers from all categories
        const allNumbers = Object.values(this.numberCategories).flatMap(cat => cat.numbers);
        return allNumbers[Math.floor(Math.random() * allNumbers.length)];
    }

    getNumberCategory(number) {
        for (const [categoryName, category] of Object.entries(this.numberCategories)) {
            if (category.numbers.includes(number)) {
                return { name: categoryName, ...category };
            }
        }
        return null;
    }


    calculateNPS() {
        let nps = 0;

        // Base production from automation upgrades
        this.automationUpgrades.forEach(upgrade => {
            nps += upgrade.baseProduction * upgrade.count;
        });

        // Check if automation should be enabled
        const totalAutomation = this.automationUpgrades.reduce((sum, u) => sum + u.count, 0);
        this.autoSortEnabled = totalAutomation >= 3; // Enable auto-sort when you have 3+ automation upgrades

        // Adjust spawn rate based on automation
        if (totalAutomation > 0) {
            this.spawnInterval = Math.max(1000, 3000 - (totalAutomation * 200)); // Faster spawns with more automation
        }

        // Apply efficiency multipliers
        if (this.efficiencyUpgrades.find(u => u.id === 'handbook' && u.purchased)) {
            nps *= 2;
        }
        if (this.efficiencyUpgrades.find(u => u.id === 'fingerTraps' && u.purchased)) {
            nps *= 1.1;
        }
        if (this.efficiencyUpgrades.find(u => u.id === 'overtime' && u.purchased)) {
            nps *= 1.25;
        }
        if (this.efficiencyUpgrades.find(u => u.id === 'lexington' && u.purchased)) {
            nps *= 2;
        }
        if (this.efficiencyUpgrades.find(u => u.id === 'enlightenment' && u.purchased)) {
            nps *= 2;
        }

        // Merit tokens bonus
        nps *= (1 + this.meritTokens * 0.1);

        this.numbersPerSecond = nps;
    }

    buyAutomationUpgrade(upgradeId) {
        const upgrade = this.automationUpgrades.find(u => u.id === upgradeId);
        if (!upgrade) return;

        const cost = this.getUpgradeCost(upgrade);

        if (this.numbers >= cost) {
            this.numbers -= cost;
            upgrade.count++;
            this.calculateNPS();
            this.updateUI();
            this.renderUpgrades();
            this.saveGame();
        }
    }

    buyEfficiencyUpgrade(upgradeId) {
        const upgrade = this.efficiencyUpgrades.find(u => u.id === upgradeId);
        if (!upgrade || upgrade.purchased) return;

        if (this.numbers >= upgrade.cost) {
            this.numbers -= upgrade.cost;
            upgrade.purchased = true;
            upgrade.effect();
            this.calculateNPS();
            this.updateUI();
            this.renderUpgrades();
            this.saveGame();
        }
    }

    getUpgradeCost(upgrade) {
        return Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, upgrade.count));
    }

    renderUpgrades() {
        // Render automation upgrades
        const automationContainer = document.getElementById('automation');
        automationContainer.innerHTML = '';

        this.automationUpgrades.forEach(upgrade => {
            const cost = this.getUpgradeCost(upgrade);
            const affordable = this.numbers >= cost;

            const upgradeDiv = document.createElement('div');
            upgradeDiv.className = `upgrade-item ${affordable ? 'affordable' : ''}`;
            upgradeDiv.dataset.upgradeId = upgrade.id;
            upgradeDiv.dataset.upgradeType = 'automation';
            upgradeDiv.innerHTML = `
                <div class="upgrade-info">
                    <h3>${upgrade.name}</h3>
                    <p>${upgrade.description}</p>
                    <p>Production: ${this.formatNumber(upgrade.baseProduction)}/s</p>
                </div>
                <div class="upgrade-details">
                    <div class="upgrade-count">Possédés: ${upgrade.count}</div>
                    <div class="upgrade-cost">${this.formatNumber(cost)}</div>
                    <button class="upgrade-button" data-upgrade-id="${upgrade.id}">
                        Acheter
                    </button>
                </div>
            `;

            const button = upgradeDiv.querySelector('button');
            button.disabled = !affordable;
            button.addEventListener('click', () => {
                this.buyAutomationUpgrade(upgrade.id);
            });

            automationContainer.appendChild(upgradeDiv);
        });

        // Render efficiency upgrades
        const efficiencyContainer = document.getElementById('efficiency');
        efficiencyContainer.innerHTML = '';

        this.efficiencyUpgrades.forEach(upgrade => {
            const affordable = this.numbers >= upgrade.cost && !upgrade.purchased;

            const upgradeDiv = document.createElement('div');
            upgradeDiv.className = `upgrade-item ${affordable ? 'affordable' : ''} ${upgrade.purchased ? 'maxed' : ''}`;
            upgradeDiv.dataset.upgradeId = upgrade.id;
            upgradeDiv.dataset.upgradeType = 'efficiency';
            upgradeDiv.innerHTML = `
                <div class="upgrade-info">
                    <h3>${upgrade.name}</h3>
                    <p>${upgrade.description}</p>
                </div>
                <div class="upgrade-details">
                    <div class="upgrade-cost">${upgrade.purchased ? 'ACHETÉ' : this.formatNumber(upgrade.cost)}</div>
                    <button class="upgrade-button" data-upgrade-id="${upgrade.id}">
                        ${upgrade.purchased ? 'Possédé' : 'Acheter'}
                    </button>
                </div>
            `;

            const button = upgradeDiv.querySelector('button');
            button.disabled = !affordable;
            if (!upgrade.purchased) {
                button.addEventListener('click', () => {
                    this.buyEfficiencyUpgrade(upgrade.id);
                });
            }

            efficiencyContainer.appendChild(upgradeDiv);
        });
    }

    updateUpgradeButtons() {
        // Update automation upgrade buttons
        this.automationUpgrades.forEach(upgrade => {
            const cost = this.getUpgradeCost(upgrade);
            const affordable = this.numbers >= cost;

            const upgradeDiv = document.querySelector(`.upgrade-item[data-upgrade-type="automation"][data-upgrade-id="${upgrade.id}"]`);
            if (upgradeDiv) {
                const button = upgradeDiv.querySelector('button');
                if (button) {
                    button.disabled = !affordable;
                }

                // Update affordable class
                if (affordable) {
                    upgradeDiv.classList.add('affordable');
                } else {
                    upgradeDiv.classList.remove('affordable');
                }
            }
        });

        // Update efficiency upgrade buttons
        this.efficiencyUpgrades.forEach(upgrade => {
            const affordable = this.numbers >= upgrade.cost && !upgrade.purchased;

            const upgradeDiv = document.querySelector(`.upgrade-item[data-upgrade-type="efficiency"][data-upgrade-id="${upgrade.id}"]`);
            if (upgradeDiv) {
                const button = upgradeDiv.querySelector('button');
                if (button) {
                    button.disabled = !affordable;
                }

                // Update affordable class
                if (affordable) {
                    upgradeDiv.classList.add('affordable');
                } else {
                    upgradeDiv.classList.remove('affordable');
                }
            }
        });
    }

    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(tabName).classList.add('active');
    }

    performPrestige() {
        if (this.totalNumbersRefined < 1000000) {
            this.showNotification('Vous devez raffiner au moins 1,000,000 nombres avant la Severance.');
            return;
        }

        if (!confirm('Êtes-vous sûr de vouloir subir la Severance ? Toute votre progression sera réinitialisée en échange de Jetons de Mérite permanents.')) {
            return;
        }

        // Calculate merit tokens
        const newTokens = Math.floor(Math.sqrt(this.totalNumbersRefined / 100000));
        this.meritTokens += newTokens;

        // Reset game
        this.numbers = 0;
        this.clickPower = 1;
        this.numbersPerSecond = 0;
        this.level = 1;
        this.totalNumbersRefined = 0;

        // Reset upgrades
        this.automationUpgrades.forEach(upgrade => {
            upgrade.count = 0;
        });
        this.efficiencyUpgrades.forEach(upgrade => {
            upgrade.purchased = false;
        });

        this.calculateNPS();
        this.updateUI();
        this.renderUpgrades();
        this.saveGame();

        this.showNotification(`Severance effectuée ! Vous avez gagné ${newTokens} Jetons de Mérite !`);
    }

    checkMilestones() {
        this.milestones.forEach(milestone => {
            if (this.totalNumbersRefined >= milestone.threshold && !milestone.reached) {
                milestone.reached = true;
                this.showReward(milestone.message);

                if (milestone.threshold >= 1000) {
                    this.level = Math.floor(Math.log10(this.totalNumbersRefined)) - 1;
                }
            }
        });
    }

    showReward(message) {
        const rewardEl = document.getElementById('rewardMessage');
        rewardEl.textContent = message;
        rewardEl.classList.remove('hidden');

        setTimeout(() => {
            rewardEl.classList.add('hidden');
        }, 5000);
    }

    showNotification(message) {
        const notificationEl = document.getElementById('notification');
        notificationEl.textContent = message;
        notificationEl.classList.remove('hidden');

        setTimeout(() => {
            notificationEl.classList.add('hidden');
        }, 3000);
    }

    startGameLoop() {
        setInterval(() => {
            const now = Date.now();

            // Add passive income
            const passiveGain = this.numbersPerSecond / 10;
            this.numbers += passiveGain;
            this.totalNumbersRefined += passiveGain;

            // Spawn new numbers periodically
            if (now - this.lastSpawnTime >= this.spawnInterval) {
                this.spawnNumber();
                this.lastSpawnTime = now;
            }

            // Auto-sort if automation is enabled
            if (this.autoSortEnabled && this.numberQueue.length > 0) {
                const numberToSort = this.numberQueue[0];
                if (numberToSort.category) {
                    this.selectedNumber = numberToSort;
                    this.sortNumber(numberToSort.category);
                }
            }

            this.updateUI();
            this.checkMilestones();
        }, 100); // Update every 100ms (10 times per second)
    }

    updateUI() {
        document.getElementById('numbers').textContent = this.formatNumber(this.numbers);
        document.getElementById('perSecond').textContent = this.formatNumber(this.numbersPerSecond);
        document.getElementById('level').textContent = this.level;

        // Update sorting stats
        const comboEl = document.getElementById('comboCount');
        if (comboEl) comboEl.textContent = this.combo;

        const accuracyEl = document.getElementById('accuracy');
        if (accuracyEl) accuracyEl.textContent = this.getAccuracy();

        const sortSpeedEl = document.getElementById('sortSpeed');
        if (sortSpeedEl) sortSpeedEl.textContent = this.getSortSpeed();

        // Update quota (percentage to next milestone)
        const nextMilestone = this.milestones.find(m => !m.reached);
        if (nextMilestone) {
            const progress = Math.min((this.totalNumbersRefined / nextMilestone.threshold) * 100, 100);
            document.getElementById('quota').textContent = progress.toFixed(1) + '%';
        } else {
            document.getElementById('quota').textContent = '100%';
        }

        // Update prestige info
        document.getElementById('meritTokens').textContent = this.meritTokens;
        const potentialTokens = Math.floor(Math.sqrt(this.totalNumbersRefined / 100000));
        document.getElementById('potentialTokens').textContent = potentialTokens;

        const prestigeButton = document.getElementById('prestigeButton');
        prestigeButton.disabled = this.totalNumbersRefined < 1000000;

        // Update upgrade buttons state
        this.updateUpgradeButtons();
    }

    formatNumber(num) {
        if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
        if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
        if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
        if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
        return Math.floor(num).toString();
    }

    saveGame() {
        const saveData = {
            numbers: this.numbers,
            clickPower: this.clickPower,
            numbersPerSecond: this.numbersPerSecond,
            level: this.level,
            meritTokens: this.meritTokens,
            totalNumbersRefined: this.totalNumbersRefined,
            automationUpgrades: this.automationUpgrades,
            efficiencyUpgrades: this.efficiencyUpgrades,
            milestones: this.milestones
        };

        localStorage.setItem('lumonSave', JSON.stringify(saveData));
    }

    loadGame() {
        const saveData = localStorage.getItem('lumonSave');

        if (saveData) {
            try {
                const data = JSON.parse(saveData);

                this.numbers = data.numbers || 0;
                this.clickPower = data.clickPower || 1;
                this.numbersPerSecond = data.numbersPerSecond || 0;
                this.level = data.level || 1;
                this.meritTokens = data.meritTokens || 0;
                this.totalNumbersRefined = data.totalNumbersRefined || 0;

                // Load upgrades
                if (data.automationUpgrades) {
                    data.automationUpgrades.forEach((savedUpgrade, index) => {
                        if (this.automationUpgrades[index]) {
                            this.automationUpgrades[index].count = savedUpgrade.count;
                        }
                    });
                }

                if (data.efficiencyUpgrades) {
                    data.efficiencyUpgrades.forEach((savedUpgrade, index) => {
                        if (this.efficiencyUpgrades[index]) {
                            this.efficiencyUpgrades[index].purchased = savedUpgrade.purchased;
                        }
                    });
                }

                if (data.milestones) {
                    data.milestones.forEach((savedMilestone, index) => {
                        if (this.milestones[index]) {
                            this.milestones[index].reached = savedMilestone.reached;
                        }
                    });
                }

                // Recalculate production
                this.calculateNPS();

                this.showNotification('Bienvenue de retour chez Lumon Industries !');
            } catch (e) {
                console.error('Erreur lors du chargement de la sauvegarde:', e);
            }
        }
    }
}

// Start the game when the page loads
window.addEventListener('DOMContentLoaded', () => {
    new LumonGame();
});
