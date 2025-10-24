// Lumon Industries - Macrodata Refinement Clicker Game

class LumonGame {
    constructor() {
        this.numbers = 0;
        this.clickPower = 1;
        this.numbersPerSecond = 0;
        this.level = 1;
        this.meritTokens = 0;
        this.totalNumbersRefined = 0;

        this.automationUpgrades = [
            {
                id: 'intern',
                name: 'Stagiaire MDR',
                description: 'Un nouveau stagiaire pour trier les nombres',
                baseCost: 10,
                baseProduction: 0.1,
                count: 0,
                costMultiplier: 1.15
            },
            {
                id: 'colleague',
                name: 'Collègue de Bureau',
                description: 'Un collègue expérimenté en raffinement',
                baseCost: 100,
                baseProduction: 1,
                count: 0,
                costMultiplier: 1.15
            },
            {
                id: 'teamLead',
                name: 'Chef d\'Équipe',
                description: 'Supervise et optimise le travail',
                baseCost: 1100,
                baseProduction: 8,
                count: 0,
                costMultiplier: 1.15
            },
            {
                id: 'odDept',
                name: 'Département O&D',
                description: 'Optics & Design pour améliorer l\'efficacité',
                baseCost: 12000,
                baseProduction: 47,
                count: 0,
                costMultiplier: 1.15
            },
            {
                id: 'waffle',
                name: 'Waffle Party',
                description: 'La motivation ultime pour vos équipes',
                baseCost: 130000,
                baseProduction: 260,
                count: 0,
                costMultiplier: 1.15
            },
            {
                id: 'goatRoom',
                name: 'Salle des Chèvres',
                description: 'Un mystère qui booste la productivité',
                baseCost: 1400000,
                baseProduction: 1400,
                count: 0,
                costMultiplier: 1.15
            },
            {
                id: 'perpetuity',
                name: 'Aile de la Perpétuité',
                description: 'Le département le plus mystérieux de Lumon',
                baseCost: 20000000,
                baseProduction: 7800,
                count: 0,
                costMultiplier: 1.15
            },
            {
                id: 'boardRoom',
                name: 'Conseil d\'Administration',
                description: 'Les décideurs ultimes de Lumon',
                baseCost: 330000000,
                baseProduction: 44000,
                count: 0,
                costMultiplier: 1.15
            }
        ];

        this.efficiencyUpgrades = [
            {
                id: 'ergonomics',
                name: 'Ergonomie Améliorée',
                description: '+1 nombre par clic',
                cost: 50,
                purchased: false,
                effect: () => this.clickPower += 1
            },
            {
                id: 'keyboard',
                name: 'Clavier Mécanique',
                description: 'Double la vitesse de clic',
                cost: 500,
                purchased: false,
                effect: () => this.clickPower *= 2
            },
            {
                id: 'breakRoom',
                name: 'Accès Break Room',
                description: '+5 nombres par clic',
                cost: 2500,
                purchased: false,
                effect: () => this.clickPower += 5
            },
            {
                id: 'handbook',
                name: 'Manuel de l\'Employé',
                description: 'Double la production passive',
                cost: 10000,
                purchased: false,
                effect: () => this.calculateNPS()
            },
            {
                id: 'music',
                name: 'Système de Musique',
                description: '+10% production totale',
                cost: 50000,
                purchased: false,
                effect: () => this.calculateNPS()
            },
            {
                id: 'overtime',
                name: 'Programme Overtime',
                description: '+25% production totale',
                cost: 250000,
                purchased: false,
                effect: () => this.calculateNPS()
            },
            {
                id: 'kier',
                name: 'Bénédiction de Kier',
                description: 'Triple la production de clics',
                cost: 1000000,
                purchased: false,
                effect: () => this.clickPower *= 3
            },
            {
                id: 'enlightenment',
                name: 'Illumination Totale',
                description: 'Double TOUTE la production',
                cost: 10000000,
                purchased: false,
                effect: () => this.calculateNPS()
            }
        ];

        this.milestones = [
            { threshold: 100, message: "Vous avez atteint votre premier quota !" },
            { threshold: 1000, message: "Promotion ! Vous montez d'un niveau." },
            { threshold: 10000, message: "Excellente performance ! Une Waffle Party vous attend." },
            { threshold: 100000, message: "Performance exceptionnelle ! Accès à la salle des chèvres débloqué." },
            { threshold: 1000000, message: "Vous êtes désormais un employé exemplaire de Lumon !" }
        ];

        this.randomNumbers = [3, 7, 11, 17, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71];

        this.init();
    }

    init() {
        this.loadGame();
        this.setupEventListeners();
        this.updateUI();
        this.startGameLoop();
        this.renderUpgrades();
    }

    setupEventListeners() {
        // Click button
        document.getElementById('clickButton').addEventListener('click', (e) => {
            this.handleClick(e);
        });

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

        // Auto-save every 30 seconds
        setInterval(() => this.saveGame(), 30000);
    }

    handleClick(event) {
        const earnedNumbers = this.clickPower;
        this.numbers += earnedNumbers;
        this.totalNumbersRefined += earnedNumbers;

        // Update UI
        this.updateUI();

        // Create floating number animation
        this.createFloatingNumber(event.clientX, event.clientY, earnedNumbers);

        // Random number on button
        this.updateRandomNumber();

        // Check milestones
        this.checkMilestones();
    }

    createFloatingNumber(x, y, value) {
        const floatingNum = document.createElement('div');
        floatingNum.className = 'floating-number';
        floatingNum.textContent = '+' + this.formatNumber(value);
        floatingNum.style.left = x + 'px';
        floatingNum.style.top = y + 'px';
        document.body.appendChild(floatingNum);

        setTimeout(() => {
            floatingNum.remove();
        }, 1000);
    }

    updateRandomNumber() {
        const randomNum = this.randomNumbers[Math.floor(Math.random() * this.randomNumbers.length)];
        document.querySelector('.number-value').textContent = randomNum;
    }

    calculateNPS() {
        let nps = 0;

        // Base production from automation upgrades
        this.automationUpgrades.forEach(upgrade => {
            nps += upgrade.baseProduction * upgrade.count;
        });

        // Apply efficiency multipliers
        if (this.efficiencyUpgrades.find(u => u.id === 'handbook' && u.purchased)) {
            nps *= 2;
        }
        if (this.efficiencyUpgrades.find(u => u.id === 'music' && u.purchased)) {
            nps *= 1.1;
        }
        if (this.efficiencyUpgrades.find(u => u.id === 'overtime' && u.purchased)) {
            nps *= 1.25;
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
            upgradeDiv.innerHTML = `
                <div class="upgrade-info">
                    <h3>${upgrade.name}</h3>
                    <p>${upgrade.description}</p>
                    <p>Production: ${this.formatNumber(upgrade.baseProduction)}/s</p>
                </div>
                <div class="upgrade-details">
                    <div class="upgrade-count">Possédés: ${upgrade.count}</div>
                    <div class="upgrade-cost">${this.formatNumber(cost)}</div>
                    <button class="upgrade-button" ${affordable ? '' : 'disabled'}>
                        Acheter
                    </button>
                </div>
            `;

            upgradeDiv.querySelector('button').addEventListener('click', () => {
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
            upgradeDiv.innerHTML = `
                <div class="upgrade-info">
                    <h3>${upgrade.name}</h3>
                    <p>${upgrade.description}</p>
                </div>
                <div class="upgrade-details">
                    <div class="upgrade-cost">${upgrade.purchased ? 'ACHETÉ' : this.formatNumber(upgrade.cost)}</div>
                    <button class="upgrade-button" ${affordable ? '' : 'disabled'}>
                        ${upgrade.purchased ? 'Possédé' : 'Acheter'}
                    </button>
                </div>
            `;

            if (!upgrade.purchased) {
                upgradeDiv.querySelector('button').addEventListener('click', () => {
                    this.buyEfficiencyUpgrade(upgrade.id);
                });
            }

            efficiencyContainer.appendChild(upgradeDiv);
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
            // Add passive income
            const passiveGain = this.numbersPerSecond / 10;
            this.numbers += passiveGain;
            this.totalNumbersRefined += passiveGain;

            this.updateUI();
            this.checkMilestones();
        }, 100); // Update every 100ms (10 times per second)
    }

    updateUI() {
        document.getElementById('numbers').textContent = this.formatNumber(this.numbers);
        document.getElementById('perSecond').textContent = this.formatNumber(this.numbersPerSecond);
        document.getElementById('level').textContent = this.level;
        document.getElementById('clickValue').textContent = `+${this.formatNumber(this.clickPower)} par clic`;

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
