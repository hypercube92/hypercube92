// Lumon Industries - Macrodata Refinement Game
// Complete Rewrite with Matter.js Physics Engine

class LumonGame {
    constructor() {
        // Core game state
        this.numbers = 0;
        this.clickPower = 1;
        this.numbersPerSecond = 0;
        this.level = 1;
        this.meritTokens = 0;
        this.totalNumbersRefined = 0;

        // Sorting mechanics
        this.combo = 0;
        this.maxCombo = 0;
        this.totalSorted = 0;
        this.correctSorts = 0;
        this.sortTimes = [];
        this.categoryCount = { scary: 0, angry: 0, sad: 0, happy: 0 };

        // Spawn system
        this.autoSortEnabled = false;
        this.lastSpawnTime = Date.now();
        this.spawnInterval = 3000;
        this.maxNumbers = 8;

        // Selected number for sorting
        this.selectedNumber = null;

        // Number categories from Severance
        this.numberCategories = {
            scary: {
                numbers: [13, 66, 666, 99, 101, 187, 404, 911],
                color: '#d9534f',
                bonus: 2.0,
                icon: '😱',
                description: 'SCARY'
            },
            angry: {
                numbers: [8, 18, 88, 108, 188, 888],
                color: '#f0ad4e',
                bonus: 1.8,
                icon: '😠',
                description: 'ANGRY'
            },
            sad: {
                numbers: [0, 7, 21, 42, 69, 273, 365],
                color: '#5bc0de',
                bonus: 1.5,
                icon: '😢',
                description: 'SAD'
            },
            happy: {
                numbers: [3, 11, 17, 23, 29, 31, 37, 41, 43, 47, 53],
                color: '#5cb85c',
                bonus: 1.3,
                icon: '😊',
                description: 'HAPPY'
            }
        };

        // Upgrades with icons
        this.automationUpgrades = [
            {
                id: 'intern',
                icon: '👤',
                name: 'Nouvel Innie',
                description: 'Un employé fraîchement severed',
                baseCost: 10,
                baseProduction: 0.1,
                count: 0,
                costMultiplier: 1.15
            },
            {
                id: 'colleague',
                icon: '👥',
                name: 'Équipe MDR',
                description: 'Collègues dévoués au raffinement',
                baseCost: 100,
                baseProduction: 1,
                count: 0,
                costMultiplier: 1.15
            },
            {
                id: 'milchick',
                icon: '👔',
                name: 'Mr. Milchick',
                description: '🤖 Active l\'auto-tri (3+ upgrades)',
                baseCost: 1100,
                baseProduction: 8,
                count: 0,
                costMultiplier: 1.15
            },
            {
                id: 'odDept',
                icon: '🎨',
                name: 'Département O&D',
                description: 'Optics & Design',
                baseCost: 12000,
                baseProduction: 47,
                count: 0,
                costMultiplier: 1.15
            },
            {
                id: 'waffle',
                icon: '🧇',
                name: 'Waffle Party',
                description: 'La récompense ultime',
                baseCost: 130000,
                baseProduction: 260,
                count: 0,
                costMultiplier: 1.15
            },
            {
                id: 'breakRoom',
                icon: '🚪',
                name: 'Break Room',
                description: 'Correction de comportement',
                baseCost: 800000,
                baseProduction: 900,
                count: 0,
                costMultiplier: 1.15
            },
            {
                id: 'goatRoom',
                icon: '🐐',
                name: 'Salle des Chèvres',
                description: 'Le mystère des chèvres',
                baseCost: 1400000,
                baseProduction: 1400,
                count: 0,
                costMultiplier: 1.15
            },
            {
                id: 'perpetuity',
                icon: '🏛️',
                name: 'Aile Perpétuité',
                description: 'Département mystérieux',
                baseCost: 20000000,
                baseProduction: 7800,
                count: 0,
                costMultiplier: 1.15
            },
            {
                id: 'cobel',
                icon: '👩‍💼',
                name: 'Ms. Cobel',
                description: 'Manager déterminée',
                baseCost: 100000000,
                baseProduction: 25000,
                count: 0,
                costMultiplier: 1.15
            },
            {
                id: 'boardRoom',
                icon: '👔',
                name: 'Conseil Admin',
                description: 'Le pouvoir suprême',
                baseCost: 500000000,
                baseProduction: 100000,
                count: 0,
                costMultiplier: 1.15
            }
        ];

        this.efficiencyUpgrades = [
            {
                id: 'ergonomics',
                icon: '💺',
                name: 'Poste Optimisé',
                description: '+1 par tri',
                cost: 50,
                purchased: false,
                effect: () => this.clickPower += 1
            },
            {
                id: 'defiantJazz',
                icon: '🎵',
                name: 'Defiant Jazz',
                description: 'x2 puissance tri',
                cost: 500,
                purchased: false,
                effect: () => this.clickPower *= 2
            },
            {
                id: 'musicCards',
                icon: '💃',
                name: 'Music Dance',
                description: '+5 par tri',
                cost: 2500,
                purchased: false,
                effect: () => this.clickPower += 5
            },
            {
                id: 'handbook',
                icon: '📖',
                name: 'Manuel Employé',
                description: 'x2 production passive',
                cost: 10000,
                purchased: false,
                effect: () => this.calculateNPS()
            },
            {
                id: 'fingerTraps',
                icon: '🤲',
                name: 'Finger Traps',
                description: '+10% production',
                cost: 50000,
                purchased: false,
                effect: () => this.calculateNPS()
            },
            {
                id: 'overtime',
                icon: '⏰',
                name: 'Overtime',
                description: '+25% production',
                cost: 250000,
                purchased: false,
                effect: () => this.calculateNPS()
            },
            {
                id: 'kier',
                icon: '🖼️',
                name: 'Portrait Kier',
                description: 'x3 puissance tri',
                cost: 1000000,
                purchased: false,
                effect: () => this.clickPower *= 3
            },
            {
                id: 'lexington',
                icon: '✉️',
                name: 'Lettre Lexington',
                description: 'x2 production totale',
                cost: 5000000,
                purchased: false,
                effect: () => this.calculateNPS()
            },
            {
                id: 'enlightenment',
                icon: '🧠',
                name: 'Réveil Complet',
                description: 'x2 production - Union Innie/Outie',
                cost: 20000000,
                purchased: false,
                effect: () => this.calculateNPS()
            }
        ];

        this.milestones = [
            { threshold: 100, message: "Premier quota ! Mr. Milchick est fier." },
            { threshold: 1000, message: "Music Dance Experience débloqué !" },
            { threshold: 10000, message: "100% quota ! Waffle Party organisée !" },
            { threshold: 50000, message: "Finger Traps en récompense !" },
            { threshold: 100000, message: "Employé du mois ! Salle des chèvres accessible." },
            { threshold: 500000, message: "Ms. Cobel vous félicite personnellement." },
            { threshold: 1000000, message: "Secrets de l'Aile Perpétuité révélés." },
            { threshold: 5000000, message: "Le Conseil reconnaît votre dévouement." }
        ];

        this.lumonQuotes = [
            "We are mysterious and important.",
            "I find the work rewarding.",
            "The work is mysterious and important.",
            "Kier Eagan loves you.",
            "Trust the process.",
            "Your Outie chose this for you."
        ];

        // Matter.js physics setup
        this.engine = null;
        this.world = null;
        this.render = null;
        this.canvas = null;
        this.ctx = null;
        this.numberBodies = [];
        this.particles = [];

        this.init();
    }

    init() {
        this.loadGame();
        this.setupCanvas();
        this.setupPhysics();
        this.setupEventListeners();
        this.renderShop();
        this.startGameLoop();
        this.showRandomQuote();

        // Spawn initial numbers
        setTimeout(() => {
            for (let i = 0; i < 3; i++) {
                setTimeout(() => this.spawnNumber(), i * 500);
            }
        }, 1000);
    }

    setupCanvas() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');

        // Set canvas size
        const container = this.canvas.parentElement;
        this.canvas.width = container.clientWidth;
        this.canvas.height = container.clientHeight;

        // Handle resize
        window.addEventListener('resize', () => {
            const container = this.canvas.parentElement;
            this.canvas.width = container.clientWidth;
            this.canvas.height = container.clientHeight;
        });

        // Canvas click handler
        this.canvas.addEventListener('click', (e) => this.handleCanvasClick(e));
    }

    setupPhysics() {
        // Create Matter.js engine
        const Engine = Matter.Engine;
        const World = Matter.World;
        const Bodies = Matter.Bodies;

        this.engine = Engine.create();
        this.world = this.engine.world;
        this.engine.world.gravity.y = 0.5; // Gentle gravity

        // Create ground
        const ground = Bodies.rectangle(
            this.canvas.width / 2,
            this.canvas.height + 25,
            this.canvas.width,
            50,
            { isStatic: true }
        );
        World.add(this.world, ground);

        // Create walls
        const leftWall = Bodies.rectangle(-25, this.canvas.height / 2, 50, this.canvas.height, { isStatic: true });
        const rightWall = Bodies.rectangle(this.canvas.width + 25, this.canvas.height / 2, 50, this.canvas.height, { isStatic: true });
        World.add(this.world, [leftWall, rightWall]);
    }

    setupEventListeners() {
        // Save button
        document.getElementById('saveButton').addEventListener('click', () => {
            this.saveGame();
            this.showNotification('💾 Progression sauvegardée !');
        });

        // Shop tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const tab = btn.dataset.tab;
                this.switchShopTab(tab);
            });
        });

        // Bin clicks
        document.querySelectorAll('.bin').forEach(bin => {
            bin.addEventListener('click', () => {
                const category = bin.dataset.category;
                this.sortNumber(category);
            });
        });

        // Prestige button
        const prestigeBtn = document.getElementById('prestigeButton');
        if (prestigeBtn) {
            prestigeBtn.addEventListener('click', () => this.performPrestige());
        }

        // Auto-save every 30 seconds
        setInterval(() => this.saveGame(), 30000);
    }

    spawnNumber() {
        if (this.numberBodies.length >= this.maxNumbers) return;

        const number = this.getRandomNumber();
        const category = this.getNumberCategory(number);

        // Random spawn position at top
        const x = Math.random() * (this.canvas.width - 100) + 50;
        const y = -50;

        // Create physics body
        const Bodies = Matter.Bodies;
        const body = Bodies.circle(x, y, 30, {
            restitution: 0.6,
            friction: 0.1,
            density: 0.001
        });

        // Add to world
        Matter.World.add(this.world, body);

        // Store number data
        const numberObj = {
            body: body,
            value: number,
            category: category ? category.name : null,
            color: category ? category.color : '#6aba9a',
            selected: false,
            id: Date.now() + Math.random()
        };

        this.numberBodies.push(numberObj);
    }

    handleCanvasClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Check if clicked on a number
        for (let numObj of this.numberBodies) {
            const pos = numObj.body.position;
            const dist = Math.sqrt((x - pos.x) ** 2 + (y - pos.y) ** 2);

            if (dist < 35) {
                // Deselect all
                this.numberBodies.forEach(n => n.selected = false);

                // Select this one
                numObj.selected = true;
                this.selectedNumber = numObj;

                // Highlight correct bin
                this.highlightBin(numObj.category);

                // Create particle effect
                this.createParticles(pos.x, pos.y, numObj.color);
                return;
            }
        }
    }

    highlightBin(category) {
        // Remove all highlights
        document.querySelectorAll('.bin').forEach(bin => {
            bin.classList.remove('highlight');
        });

        // Highlight correct bin
        if (category) {
            const bin = document.querySelector(`.${category}-bin`);
            if (bin) bin.classList.add('highlight');
        }
    }

    sortNumber(targetCategory) {
        if (!this.selectedNumber) {
            this.showNotification('⚠️ Sélectionnez d\'abord un nombre !');
            return;
        }

        const numObj = this.selectedNumber;
        const isCorrect = numObj.category === targetCategory;

        // Calculate reward
        let reward = this.clickPower;

        if (isCorrect) {
            const category = this.numberCategories[targetCategory];
            reward *= category.bonus;

            // Combo bonus
            this.combo++;
            if (this.combo > this.maxCombo) this.maxCombo = this.combo;
            if (this.combo > 1) {
                reward *= (1 + (this.combo * 0.1)); // +10% per combo
            }

            this.correctSorts++;
            this.categoryCount[targetCategory]++;

            this.showReward(`✓ ${category.description} ! +${this.formatNumber(reward)} (Combo ${this.combo}x)`);
        } else {
            reward *= 0.5; // Penalty
            this.combo = 0;
            this.showReward(`✗ Erreur ! +${this.formatNumber(reward)} seulement`);
        }

        this.numbers += reward;
        this.totalNumbersRefined += reward;
        this.totalSorted++;

        // Track sort speed
        this.sortTimes.push(Date.now());
        if (this.sortTimes.length > 10) this.sortTimes.shift();

        // Remove from physics world
        Matter.World.remove(this.world, numObj.body);
        this.numberBodies = this.numberBodies.filter(n => n.id !== numObj.id);

        // Create explosion particles
        this.createExplosion(numObj.body.position.x, numObj.body.position.y, numObj.color, isCorrect);

        // Clear selection
        this.selectedNumber = null;
        document.querySelectorAll('.bin').forEach(bin => bin.classList.remove('highlight'));

        this.checkMilestones();
        this.updateUI();
    }

    createParticles(x, y, color) {
        for (let i = 0; i < 5; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 3,
                vy: (Math.random() - 0.5) * 3,
                life: 1,
                color: color,
                size: Math.random() * 4 + 2
            });
        }
    }

    createExplosion(x, y, color, success) {
        const count = success ? 20 : 10;
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count;
            const speed = Math.random() * 3 + 2;
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 1,
                color: success ? color : '#666',
                size: Math.random() * 6 + 3
            });
        }
    }

    getRandomNumber() {
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

    renderCanvas() {
        // Clear canvas
        this.ctx.fillStyle = '#0a1a0a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw grid
        this.ctx.strokeStyle = '#1a2a2a';
        this.ctx.lineWidth = 1;
        for (let i = 0; i < this.canvas.width; i += 50) {
            this.ctx.beginPath();
            this.ctx.moveTo(i, 0);
            this.ctx.lineTo(i, this.canvas.height);
            this.ctx.stroke();
        }
        for (let i = 0; i < this.canvas.height; i += 50) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, i);
            this.ctx.lineTo(this.canvas.width, i);
            this.ctx.stroke();
        }

        // Draw particles
        this.particles.forEach((p, index) => {
            this.ctx.fillStyle = p.color;
            this.ctx.globalAlpha = p.life;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.globalAlpha = 1;

            // Update particle
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.1; // Gravity
            p.life -= 0.02;

            if (p.life <= 0) {
                this.particles.splice(index, 1);
            }
        });

        // Draw numbers
        this.numberBodies.forEach(numObj => {
            const pos = numObj.body.position;
            const angle = numObj.body.angle;

            this.ctx.save();
            this.ctx.translate(pos.x, pos.y);
            this.ctx.rotate(angle);

            // Draw circle
            this.ctx.fillStyle = numObj.selected ? '#fff' : numObj.color;
            this.ctx.strokeStyle = numObj.selected ? numObj.color : '#fff';
            this.ctx.lineWidth = numObj.selected ? 4 : 2;
            this.ctx.beginPath();
            this.ctx.arc(0, 0, 30, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.stroke();

            // Draw number
            this.ctx.fillStyle = numObj.selected ? numObj.color : '#0a1a0a';
            this.ctx.font = 'bold 20px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(numObj.value, 0, 0);

            // Glow effect if selected
            if (numObj.selected) {
                this.ctx.shadowBlur = 20;
                this.ctx.shadowColor = numObj.color;
            }

            this.ctx.restore();
        });
    }

    calculateNPS() {
        let nps = 0;

        // Base production
        this.automationUpgrades.forEach(upgrade => {
            nps += upgrade.baseProduction * upgrade.count;
        });

        // Auto-sort system
        const totalAutomation = this.automationUpgrades.reduce((sum, u) => sum + u.count, 0);
        this.autoSortEnabled = totalAutomation >= 3;

        // Adjust spawn rate
        if (totalAutomation > 0) {
            this.spawnInterval = Math.max(1000, 3000 - (totalAutomation * 150));
        }

        // Efficiency multipliers
        if (this.efficiencyUpgrades.find(u => u.id === 'handbook' && u.purchased)) nps *= 2;
        if (this.efficiencyUpgrades.find(u => u.id === 'fingerTraps' && u.purchased)) nps *= 1.1;
        if (this.efficiencyUpgrades.find(u => u.id === 'overtime' && u.purchased)) nps *= 1.25;
        if (this.efficiencyUpgrades.find(u => u.id === 'lexington' && u.purchased)) nps *= 2;
        if (this.efficiencyUpgrades.find(u => u.id === 'enlightenment' && u.purchased)) nps *= 2;

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
            this.renderShop();
            this.saveGame();
            this.showNotification(`✓ ${upgrade.icon} ${upgrade.name} acheté !`);
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
            this.renderShop();
            this.saveGame();
            this.showNotification(`✓ ${upgrade.icon} ${upgrade.name} acheté !`);
        }
    }

    getUpgradeCost(upgrade) {
        return Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, upgrade.count));
    }

    renderShop() {
        // Render automation upgrades
        const automationList = document.getElementById('automationList');
        automationList.innerHTML = '';

        this.automationUpgrades.forEach(upgrade => {
            const cost = this.getUpgradeCost(upgrade);
            const affordable = this.numbers >= cost;

            const item = document.createElement('div');
            item.className = `shop-item ${affordable ? 'affordable' : ''}`;
            item.innerHTML = `
                <div class="shop-item-header">
                    <span class="shop-item-icon">${upgrade.icon}</span>
                    <div class="shop-item-title">
                        <h4>${upgrade.name}</h4>
                        <div class="shop-item-count">Possédés: ${upgrade.count}</div>
                    </div>
                </div>
                <div class="shop-item-desc">${upgrade.description}</div>
                <div class="shop-item-footer">
                    <span class="shop-item-cost">💎 ${this.formatNumber(cost)}</span>
                    <button class="shop-item-btn" ${affordable ? '' : 'disabled'}>
                        Acheter
                    </button>
                </div>
            `;

            const btn = item.querySelector('button');
            btn.disabled = !affordable;
            btn.addEventListener('click', () => this.buyAutomationUpgrade(upgrade.id));

            automationList.appendChild(item);
        });

        // Render efficiency upgrades
        const efficiencyList = document.getElementById('efficiencyList');
        efficiencyList.innerHTML = '';

        this.efficiencyUpgrades.forEach(upgrade => {
            const affordable = this.numbers >= upgrade.cost && !upgrade.purchased;

            const item = document.createElement('div');
            item.className = `shop-item ${affordable ? 'affordable' : ''} ${upgrade.purchased ? 'maxed' : ''}`;
            item.innerHTML = `
                <div class="shop-item-header">
                    <span class="shop-item-icon">${upgrade.icon}</span>
                    <div class="shop-item-title">
                        <h4>${upgrade.name}</h4>
                        <div class="shop-item-count">${upgrade.purchased ? '✓ Possédé' : 'Disponible'}</div>
                    </div>
                </div>
                <div class="shop-item-desc">${upgrade.description}</div>
                <div class="shop-item-footer">
                    <span class="shop-item-cost">${upgrade.purchased ? '✓ ACHETÉ' : '💎 ' + this.formatNumber(upgrade.cost)}</span>
                    <button class="shop-item-btn" ${affordable ? '' : 'disabled'}>
                        ${upgrade.purchased ? 'Possédé' : 'Acheter'}
                    </button>
                </div>
            `;

            const btn = item.querySelector('button');
            btn.disabled = !affordable;
            if (!upgrade.purchased) {
                btn.addEventListener('click', () => this.buyEfficiencyUpgrade(upgrade.id));
            }

            efficiencyList.appendChild(item);
        });
    }

    switchShopTab(tabName) {
        // Update buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabName);
        });

        // Update content
        document.querySelectorAll('.shop-tab').forEach(tab => {
            tab.classList.toggle('active', tab.id === tabName);
        });
    }

    performPrestige() {
        if (this.totalNumbersRefined < 1000000) {
            this.showNotification('⚠️ Il faut 1M de nombres raffinés !');
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
        this.combo = 0;
        this.totalSorted = 0;
        this.correctSorts = 0;
        this.sortTimes = [];
        this.categoryCount = { scary: 0, angry: 0, sad: 0, happy: 0 };
        this.totalNumbersRefined = 0;

        // Reset upgrades
        this.automationUpgrades.forEach(u => u.count = 0);
        this.efficiencyUpgrades.forEach(u => u.purchased = false);

        // Clear physics world
        this.numberBodies.forEach(numObj => {
            Matter.World.remove(this.world, numObj.body);
        });
        this.numberBodies = [];

        this.calculateNPS();
        this.renderShop();
        this.saveGame();
        this.showNotification(`🧠 Severance effectuée ! +${newTokens} Jetons de Mérite !`);
    }

    checkMilestones() {
        this.milestones.forEach(milestone => {
            if (this.totalNumbersRefined >= milestone.threshold && !milestone.reached) {
                milestone.reached = true;
                this.showReward(`🎉 ${milestone.message}`);
                this.level = Math.floor(Math.log10(this.totalNumbersRefined)) || 1;
            }
        });
    }

    showReward(message) {
        const toast = document.getElementById('rewardMessage');
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
    }

    showNotification(message) {
        const notification = document.getElementById('notification');
        notification.textContent = message;
        notification.classList.add('show');
        setTimeout(() => notification.classList.remove('show'), 3000);
    }

    showRandomQuote() {
        const quote = this.lumonQuotes[Math.floor(Math.random() * this.lumonQuotes.length)];
        this.showNotification(quote);
    }

    getSortSpeed() {
        if (this.sortTimes.length < 2) return 0;
        const timeSpan = (this.sortTimes[this.sortTimes.length - 1] - this.sortTimes[0]) / 1000 / 60;
        return Math.round(this.sortTimes.length / timeSpan) || 0;
    }

    getAccuracy() {
        if (this.totalSorted === 0) return 100;
        return Math.round((this.correctSorts / this.totalSorted) * 100);
    }

    startGameLoop() {
        const gameLoop = () => {
            const now = Date.now();

            // Update physics
            Matter.Engine.update(this.engine, 1000 / 60);

            // Render canvas
            this.renderCanvas();

            // Spawn new numbers
            if (now - this.lastSpawnTime >= this.spawnInterval) {
                this.spawnNumber();
                this.lastSpawnTime = now;
            }

            // Auto-sort
            if (this.autoSortEnabled && this.numberBodies.length > 0 && !this.selectedNumber) {
                const numObj = this.numberBodies[0];
                if (numObj.category) {
                    this.selectedNumber = numObj;
                    numObj.selected = true;
                    setTimeout(() => this.sortNumber(numObj.category), 100);
                }
            }

            // Passive income
            const passiveGain = this.numbersPerSecond / 60;
            this.numbers += passiveGain;
            this.totalNumbersRefined += passiveGain;

            // Update UI (throttled to 10 FPS)
            if (now % 6 < 2) {
                this.updateUI();
            }

            requestAnimationFrame(gameLoop);
        };

        gameLoop();
    }

    updateUI() {
        // Stats
        document.getElementById('numbers').textContent = this.formatNumber(this.numbers);
        document.getElementById('perSecond').textContent = this.formatNumber(this.numbersPerSecond);
        document.getElementById('level').textContent = this.level;
        document.getElementById('accuracy').textContent = this.getAccuracy() + '%';
        document.getElementById('comboCount').textContent = this.combo + 'x';

        // Category counts
        Object.keys(this.categoryCount).forEach(cat => {
            const el = document.getElementById(`${cat}Count`);
            if (el) el.textContent = this.categoryCount[cat];
        });

        // Quota
        const nextMilestone = this.milestones.find(m => !m.reached);
        if (nextMilestone) {
            const progress = Math.min((this.totalNumbersRefined / nextMilestone.threshold) * 100, 100);
            document.getElementById('quota').textContent = progress.toFixed(1) + '%';
        } else {
            document.getElementById('quota').textContent = '100%';
        }

        // Auto-sort status
        const autoStatus = document.getElementById('autoStatus');
        if (autoStatus) {
            autoStatus.textContent = this.autoSortEnabled ? 'ON' : 'OFF';
            autoStatus.style.color = this.autoSortEnabled ? '#5cb85c' : '#d9534f';
        }

        // Spawn rate
        const spawnRate = document.getElementById('spawnRate');
        if (spawnRate) {
            spawnRate.textContent = (this.spawnInterval / 1000).toFixed(1) + 's';
        }

        // Prestige info
        document.getElementById('meritTokens').textContent = this.meritTokens;
        const potentialTokens = Math.floor(Math.sqrt(this.totalNumbersRefined / 100000));
        document.getElementById('potentialTokens').textContent = potentialTokens;

        const prestigeBtn = document.getElementById('prestigeButton');
        if (prestigeBtn) {
            prestigeBtn.disabled = this.totalNumbersRefined < 1000000;
        }

        // Update shop button states
        this.updateShopButtons();
    }

    updateShopButtons() {
        // Update automation buttons
        this.automationUpgrades.forEach(upgrade => {
            const cost = this.getUpgradeCost(upgrade);
            const affordable = this.numbers >= cost;
            const buttons = document.querySelectorAll(`[data-upgrade-id="${upgrade.id}"]`);
            buttons.forEach(btn => {
                btn.disabled = !affordable;
                const item = btn.closest('.shop-item');
                if (item) {
                    item.classList.toggle('affordable', affordable);
                }
            });
        });

        // Update efficiency buttons
        this.efficiencyUpgrades.forEach(upgrade => {
            const affordable = this.numbers >= upgrade.cost && !upgrade.purchased;
            const buttons = document.querySelectorAll(`[data-upgrade-id="${upgrade.id}"]`);
            buttons.forEach(btn => {
                btn.disabled = !affordable;
                const item = btn.closest('.shop-item');
                if (item) {
                    item.classList.toggle('affordable', affordable);
                }
            });
        });
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
            combo: this.combo,
            maxCombo: this.maxCombo,
            totalSorted: this.totalSorted,
            correctSorts: this.correctSorts,
            categoryCount: this.categoryCount,
            automationUpgrades: this.automationUpgrades.map(u => ({ id: u.id, count: u.count })),
            efficiencyUpgrades: this.efficiencyUpgrades.map(u => ({ id: u.id, purchased: u.purchased })),
            milestones: this.milestones.map(m => ({ threshold: m.threshold, reached: m.reached }))
        };

        localStorage.setItem('lumonSave', JSON.stringify(saveData));
    }

    loadGame() {
        const saveData = localStorage.getItem('lumonSave');
        if (!saveData) return;

        try {
            const data = JSON.parse(saveData);

            this.numbers = data.numbers || 0;
            this.clickPower = data.clickPower || 1;
            this.numbersPerSecond = data.numbersPerSecond || 0;
            this.level = data.level || 1;
            this.meritTokens = data.meritTokens || 0;
            this.totalNumbersRefined = data.totalNumbersRefined || 0;
            this.combo = data.combo || 0;
            this.maxCombo = data.maxCombo || 0;
            this.totalSorted = data.totalSorted || 0;
            this.correctSorts = data.correctSorts || 0;
            this.categoryCount = data.categoryCount || { scary: 0, angry: 0, sad: 0, happy: 0 };

            // Load upgrades
            if (data.automationUpgrades) {
                data.automationUpgrades.forEach(saved => {
                    const upgrade = this.automationUpgrades.find(u => u.id === saved.id);
                    if (upgrade) upgrade.count = saved.count;
                });
            }

            if (data.efficiencyUpgrades) {
                data.efficiencyUpgrades.forEach(saved => {
                    const upgrade = this.efficiencyUpgrades.find(u => u.id === saved.id);
                    if (upgrade) upgrade.purchased = saved.purchased;
                });
            }

            if (data.milestones) {
                data.milestones.forEach(saved => {
                    const milestone = this.milestones.find(m => m.threshold === saved.threshold);
                    if (milestone) milestone.reached = saved.reached;
                });
            }

            this.calculateNPS();
            this.showNotification('💾 Bienvenue de retour chez Lumon !');
        } catch (e) {
            console.error('Erreur chargement sauvegarde:', e);
        }
    }
}

// Start game when DOM is ready
window.addEventListener('DOMContentLoaded', () => {
    new LumonGame();
});
