// ==================================================
// LUMON INDUSTRIES - MDR TERMINAL v2.47
// Macrodata Refinement Simulation
// ==================================================

class LumonMDRGame {
    constructor() {
        // ===== CORE CURRENCIES =====
        this.dataPoints = 0;
        this.conformityPoints = 0;
        this.freeTime = 0;

        // ===== PASSIVE vs ACTIVE GENERATION =====
        this.passiveGeneration = 0; // DP/sec from buildings
        this.activePower = 1; // DP per manual refine

        // ===== REFINING STATS =====
        this.scanSpeed = 1500; // ms to scan a number
        this.totalRefined = 0;
        this.correctSorts = 0;
        this.incorrectSorts = 0;

        // ===== CATEGORY COUNTS =====
        this.categoryStats = {
            woe: 0,
            frolic: 0,
            dread: 0,
            malice: 0
        };

        // ===== QUOTA SYSTEM =====
        this.currentQuota = 1000;
        this.quotaProgress = 0;
        this.quotaLevel = 1;

        // ===== AUTOMATION COUNTS =====
        this.identifierCount = 0; // Auto-scan only
        this.sorterCount = 0; // Auto-sort only (if number identified)
        this.macroCount = 0; // Auto-scan AND auto-sort

        // ===== WORLD STATE =====
        this.currentWorld = 'innie'; // 'innie' or 'outie'

        // ===== NUMBER CATEGORIES (WOE/FROLIC/DREAD/MALICE) =====
        this.categories = {
            woe: {
                ranges: [[1, 20], [666, 670]],
                color: '#ff3366',
                multiplier: 1.5,
                name: 'WOE'
            },
            frolic: {
                ranges: [[21, 40], [100, 110]],
                color: '#ffdd33',
                multiplier: 1.3,
                name: 'FROLIC'
            },
            dread: {
                ranges: [[41, 60], [200, 210]],
                color: '#9933ff',
                multiplier: 2.0,
                name: 'DREAD'
            },
            malice: {
                ranges: [[61, 80], [300, 310]],
                color: '#ff8800',
                multiplier: 1.8,
                name: 'MALICE'
            }
        };

        // ===== ACTIVE NUMBERS ON SCREEN =====
        this.numbers = []; // {id, value, category, state, x, y, identified, scanning, scanProgress}
        this.nextNumberId = 1;
        this.maxNumbers = 5;
        this.spawnInterval = 3000; // 3 seconds
        this.lastSpawn = Date.now();

        // ===== SCANNING STATE =====
        this.currentScanning = null; // {numberId, startTime}
        this.hoveredNumber = null;

        // ===== DRAGGING STATE =====
        this.draggedNumber = null;

        // ===== DEPARTMENT ITEMS (Passive Generation) =====
        this.departmentItems = [
            {
                id: 'stagiaire',
                icon: '👤',
                name: 'Stagiaire',
                description: 'Nouvel employé en formation',
                baseCost: 10,
                baseProduction: 0.1,
                count: 0,
                costMultiplier: 1.15
            },
            {
                id: 'identifier',
                icon: '🔍',
                name: 'Identifier Automatique',
                description: 'Scanne les données automatiquement',
                baseCost: 50,
                baseProduction: 0.5,
                count: 0,
                costMultiplier: 1.15,
                special: 'identifier'
            },
            {
                id: 'sorter',
                icon: '📊',
                name: 'Sorter Automatique',
                description: 'Trie les données identifiées',
                baseCost: 150,
                baseProduction: 1,
                count: 0,
                costMultiplier: 1.15,
                special: 'sorter'
            },
            {
                id: 'macro',
                icon: '⚙️',
                name: 'Macro de Raffinement',
                description: 'Scan ET tri automatique',
                baseCost: 500,
                baseProduction: 3,
                count: 0,
                costMultiplier: 1.15,
                special: 'macro'
            },
            {
                id: 'coffee',
                icon: '☕',
                name: 'Machine à Café',
                description: 'Booste la productivité',
                baseCost: 1000,
                baseProduction: 5,
                count: 0,
                costMultiplier: 1.15
            },
            {
                id: 'irving',
                icon: '🖥️',
                name: 'Serveur d\'Irving',
                description: 'Traitement parallèle des données',
                baseCost: 5000,
                baseProduction: 20,
                count: 0,
                costMultiplier: 1.15
            },
            {
                id: 'cobel',
                icon: '👁️',
                name: 'Mrs. Cobel',
                description: 'Supervision intensive',
                baseCost: 25000,
                baseProduction: 100,
                count: 0,
                costMultiplier: 1.15
            }
        ];

        // ===== ACTIVE UPGRADES =====
        this.activeUpgrades = [
            {
                id: 'click1',
                icon: '👆',
                name: 'Formation de Base',
                description: 'Puissance active +1',
                cost: 100,
                purchased: false,
                effect: () => this.activePower += 1
            },
            {
                id: 'click2',
                icon: '✌️',
                name: 'Double Pression',
                description: 'Puissance active +2',
                cost: 500,
                purchased: false,
                effect: () => this.activePower += 2
            },
            {
                id: 'scan1',
                icon: '⚡',
                name: 'Scan Rapide',
                description: 'Vitesse de scan -20%',
                cost: 300,
                purchased: false,
                effect: () => this.scanSpeed *= 0.8
            },
            {
                id: 'scan2',
                icon: '⚡⚡',
                name: 'Scan Ultra-Rapide',
                description: 'Vitesse de scan -30%',
                cost: 1500,
                purchased: false,
                effect: () => this.scanSpeed *= 0.7
            }
        ];

        // ===== SYNERGY UPGRADES =====
        this.synergyUpgrades = [
            {
                id: 'syn1',
                icon: '🔗',
                name: 'Synergie Stagiaire',
                description: '+10% production pour chaque Stagiaire',
                cost: 2000,
                purchased: false,
                effect: () => {} // Applied in calculation
            },
            {
                id: 'syn2',
                icon: '🔗🔗',
                name: 'Synergie Macro',
                description: '+15% production pour chaque Macro',
                cost: 10000,
                purchased: false,
                effect: () => {} // Applied in calculation
            }
        ];

        // ===== COMBO UPGRADES =====
        this.comboUpgrades = [
            {
                id: 'combo1',
                icon: '✨',
                name: 'Bonus Précision',
                description: 'Bonus +50% si 100% précision',
                cost: 5000,
                purchased: false,
                effect: () => {} // Applied in calculation
            }
        ];

        // ===== TECH TREE (O&D) =====
        this.techTree = [
            {
                id: 'tech1',
                icon: '🎨',
                name: 'Design Ergonomique',
                description: 'Interface optimisée',
                cost: 3000,
                purchased: false,
                effect: () => this.maxNumbers += 2
            },
            {
                id: 'tech2',
                icon: '🔬',
                name: 'Analyse Avancée',
                description: 'Détection des patterns',
                cost: 8000,
                purchased: false,
                effect: () => {}
            }
        ];

        // ===== OUTIE PERKS =====
        this.outiePerks = [];

        // ===== CANVAS & PHYSICS =====
        this.canvas = document.getElementById('terminalCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();

        // ===== BIND EVENTS =====
        this.bindEvents();

        // ===== START GAME LOOP =====
        this.lastUpdate = Date.now();
        this.gameLoop();

        // ===== INITIALIZE UI =====
        this.initializeUI();
        this.renderShop();
    }

    // ===== CANVAS MANAGEMENT =====
    resizeCanvas() {
        const rect = this.canvas.parentElement.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
    }

    // ===== EVENT BINDING =====
    bindEvents() {
        // Canvas events
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        this.canvas.addEventListener('mouseleave', () => this.handleMouseLeave());

        // World switcher
        document.querySelectorAll('.world-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchWorld(e.target.dataset.world));
        });

        // Shop tabs
        document.querySelectorAll('.shop-tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchShopTab(e.target.closest('[data-shop-tab]').dataset.shopTab));
        });

        // Severance button
        document.getElementById('severanceBtn').addEventListener('click', () => this.performSeverance());

        // Window resize
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    // ===== MOUSE HANDLERS =====
    handleMouseMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // Check if hovering over a number
        let foundHover = null;
        for (const num of this.numbers) {
            if (num.state === 'identified') continue; // Can't scan identified numbers

            const dist = Math.sqrt((mouseX - num.x) ** 2 + (mouseY - num.y) ** 2);
            if (dist < 30) {
                foundHover = num;
                break;
            }
        }

        this.hoveredNumber = foundHover;

        // Start or continue scanning
        if (foundHover && foundHover.state === 'unidentified') {
            if (!this.currentScanning || this.currentScanning.numberId !== foundHover.id) {
                // Start new scan
                this.currentScanning = {
                    numberId: foundHover.id,
                    startTime: Date.now()
                };
            }
        } else {
            // Stop scanning
            this.currentScanning = null;
        }

        // Update drag position
        if (this.draggedNumber) {
            this.draggedNumber.x = mouseX;
            this.draggedNumber.y = mouseY;
        }
    }

    handleMouseDown(e) {
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // Check if clicking on an identified number to drag it
        for (const num of this.numbers) {
            if (num.state !== 'identified') continue;

            const dist = Math.sqrt((mouseX - num.x) ** 2 + (mouseY - num.y) ** 2);
            if (dist < 30) {
                this.draggedNumber = num;
                break;
            }
        }
    }

    handleMouseUp(e) {
        if (!this.draggedNumber) return;

        const rect = this.canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // Check if dropped into a bin
        const binTargets = document.querySelectorAll('.bin-body');
        let droppedBin = null;

        binTargets.forEach(binBody => {
            const binRect = binBody.getBoundingClientRect();
            const containerRect = this.canvas.parentElement.parentElement.getBoundingClientRect();

            // Adjust for canvas position within container
            if (mouseY > this.canvas.height - 100) { // Near bottom where bins are
                const binCategory = binBody.dataset.drop;
                droppedBin = binCategory;
            }
        });

        // Alternative: check Y position - if near bottom, determine bin by X
        if (mouseY > this.canvas.height - 80) {
            const binWidth = this.canvas.width / 4;
            const binIndex = Math.floor(mouseX / binWidth);
            const bins = ['woe', 'frolic', 'dread', 'malice'];
            droppedBin = bins[binIndex];
        }

        if (droppedBin) {
            this.sortNumber(this.draggedNumber, droppedBin);
        }

        this.draggedNumber = null;
    }

    handleMouseLeave() {
        this.currentScanning = null;
        this.hoveredNumber = null;
        this.draggedNumber = null;
    }

    // ===== NUMBER MANAGEMENT =====
    spawnNumber() {
        if (this.numbers.length >= this.maxNumbers) return;

        const id = this.nextNumberId++;
        const category = this.getRandomCategory();
        const value = this.getRandomValueForCategory(category);

        const number = {
            id,
            value,
            category,
            state: 'unidentified', // 'unidentified', 'scanning', 'identified'
            x: Math.random() * (this.canvas.width - 100) + 50,
            y: 50,
            vx: (Math.random() - 0.5) * 2,
            vy: Math.random() * 1 + 0.5,
            scanProgress: 0
        };

        this.numbers.push(number);
    }

    getRandomCategory() {
        const cats = ['woe', 'frolic', 'dread', 'malice'];
        return cats[Math.floor(Math.random() * cats.length)];
    }

    getRandomValueForCategory(category) {
        const ranges = this.categories[category].ranges;
        const range = ranges[Math.floor(Math.random() * ranges.length)];
        return Math.floor(Math.random() * (range[1] - range[0] + 1)) + range[0];
    }

    identifyNumber(number) {
        number.state = 'identified';
        number.scanProgress = 0;
        this.currentScanning = null;
    }

    sortNumber(number, binCategory) {
        const correct = number.category === binCategory;

        if (correct) {
            this.correctSorts++;
            const multiplier = this.categories[number.category].multiplier;
            const reward = Math.floor(this.activePower * multiplier);
            this.dataPoints += reward;
            this.categoryStats[number.category]++;
            this.totalRefined++;
            this.quotaProgress += reward;

            // Show feedback
            this.showToast(`+${reward} DP - Correct!`);
        } else {
            this.incorrectSorts++;
            this.showToast(`Incorrect! Perte de précision`, true);
        }

        // Remove number
        this.numbers = this.numbers.filter(n => n.id !== number.id);
    }

    // ===== AUTOMATION =====
    updateAutomation(deltaTime) {
        // Identifiers: auto-scan unidentified numbers
        if (this.identifierCount > 0) {
            const unidentified = this.numbers.filter(n => n.state === 'unidentified');
            if (unidentified.length > 0) {
                const scanRate = this.identifierCount * 0.5; // seconds per scan
                const toScan = Math.min(unidentified.length, Math.ceil(scanRate * deltaTime));
                for (let i = 0; i < toScan; i++) {
                    this.identifyNumber(unidentified[i]);
                }
            }
        }

        // Sorters: auto-sort identified numbers
        if (this.sorterCount > 0) {
            const identified = this.numbers.filter(n => n.state === 'identified');
            if (identified.length > 0) {
                const sortRate = this.sorterCount * 0.3; // seconds per sort
                const toSort = Math.min(identified.length, Math.ceil(sortRate * deltaTime));
                for (let i = 0; i < toSort; i++) {
                    this.sortNumber(identified[i], identified[i].category);
                }
            }
        }

        // Macros: auto-scan AND auto-sort
        if (this.macroCount > 0) {
            const any = this.numbers.filter(n => n.state === 'unidentified' || n.state === 'identified');
            if (any.length > 0) {
                const macroRate = this.macroCount * 0.8; // seconds per complete action
                const toProcess = Math.min(any.length, Math.ceil(macroRate * deltaTime));
                for (let i = 0; i < toProcess; i++) {
                    const num = any[i];
                    if (num.state === 'unidentified') {
                        this.identifyNumber(num);
                    }
                    if (num.state === 'identified') {
                        this.sortNumber(num, num.category);
                    }
                }
            }
        }
    }

    // ===== SHOP SYSTEM =====
    renderShop() {
        // Department tab
        const departmentList = document.getElementById('departmentList');
        departmentList.innerHTML = '';
        this.departmentItems.forEach(item => {
            const cost = this.getUpgradeCost(item);
            const affordable = this.dataPoints >= cost;

            const div = document.createElement('div');
            div.className = `shop-item ${affordable ? 'affordable' : ''}`;
            div.innerHTML = `
                <div class="shop-item-header">
                    <span class="shop-item-icon">${item.icon}</span>
                    <div class="shop-item-title">
                        <h4>${item.name}</h4>
                        <span class="shop-item-count">Owned: ${item.count}</span>
                    </div>
                </div>
                <p class="shop-item-desc">${item.description}</p>
                <div class="shop-item-footer">
                    <span class="shop-item-cost">${this.formatNumber(cost)} DP</span>
                    <button class="shop-item-btn" ${!affordable ? 'disabled' : ''}>
                        ACHETER
                    </button>
                </div>
            `;

            div.querySelector('button').addEventListener('click', () => this.purchaseDepartment(item));
            departmentList.appendChild(div);
        });

        // Active upgrades tab
        this.renderUpgradesList('activeUpgradesList', this.activeUpgrades);
        this.renderUpgradesList('synergyUpgradesList', this.synergyUpgrades);
        this.renderUpgradesList('comboUpgradesList', this.comboUpgrades);

        // Tech tree tab
        this.renderUpgradesList('techTree', this.techTree);
    }

    renderUpgradesList(containerId, upgrades) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = '';
        upgrades.forEach(upgrade => {
            if (upgrade.purchased) return; // Hide purchased upgrades

            const affordable = this.dataPoints >= upgrade.cost;

            const div = document.createElement('div');
            div.className = `shop-item ${affordable ? 'affordable' : ''}`;
            div.innerHTML = `
                <div class="shop-item-header">
                    <span class="shop-item-icon">${upgrade.icon}</span>
                    <div class="shop-item-title">
                        <h4>${upgrade.name}</h4>
                    </div>
                </div>
                <p class="shop-item-desc">${upgrade.description}</p>
                <div class="shop-item-footer">
                    <span class="shop-item-cost">${this.formatNumber(upgrade.cost)} DP</span>
                    <button class="shop-item-btn" ${!affordable ? 'disabled' : ''}>
                        ACHETER
                    </button>
                </div>
            `;

            div.querySelector('button').addEventListener('click', () => this.purchaseUpgrade(upgrade));
            container.appendChild(div);
        });
    }

    purchaseDepartment(item) {
        const cost = this.getUpgradeCost(item);
        if (this.dataPoints < cost) return;

        this.dataPoints -= cost;
        item.count++;

        // Update automation counts
        if (item.special === 'identifier') this.identifierCount++;
        if (item.special === 'sorter') this.sorterCount++;
        if (item.special === 'macro') this.macroCount++;

        this.calculatePassiveGeneration();
        this.renderShop();
        this.showNotification(`Acheté: ${item.name}`);
    }

    purchaseUpgrade(upgrade) {
        if (this.dataPoints < upgrade.cost || upgrade.purchased) return;

        this.dataPoints -= upgrade.cost;
        upgrade.purchased = true;
        upgrade.effect();

        this.renderShop();
        this.showNotification(`Débloqué: ${upgrade.name}`);
    }

    getUpgradeCost(item) {
        return Math.floor(item.baseCost * Math.pow(item.costMultiplier, item.count));
    }

    calculatePassiveGeneration() {
        let total = 0;
        this.departmentItems.forEach(item => {
            total += item.baseProduction * item.count;
        });

        // Apply synergies
        if (this.synergyUpgrades[0]?.purchased) {
            const stagiaireItem = this.departmentItems.find(i => i.id === 'stagiaire');
            if (stagiaireItem) {
                total += stagiaireItem.baseProduction * stagiaireItem.count * 0.1;
            }
        }

        if (this.synergyUpgrades[1]?.purchased) {
            const macroItem = this.departmentItems.find(i => i.id === 'macro');
            if (macroItem) {
                total += macroItem.baseProduction * macroItem.count * 0.15;
            }
        }

        this.passiveGeneration = total;
    }

    // ===== SHOP TAB SWITCHING =====
    switchShopTab(tabName) {
        document.querySelectorAll('.shop-tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.shop-tab-content').forEach(content => content.classList.remove('active'));

        const btn = document.querySelector(`[data-shop-tab="${tabName}"]`);
        const content = document.getElementById(`${tabName}Tab`);

        if (btn) btn.classList.add('active');
        if (content) content.classList.add('active');
    }

    // ===== WORLD SWITCHING =====
    switchWorld(world) {
        this.currentWorld = world;

        document.querySelectorAll('.world-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-world="${world}"]`).classList.add('active');

        const gameContainer = document.querySelector('.game-container');
        const outieWorld = document.getElementById('outieWorld');

        if (world === 'outie') {
            gameContainer.style.display = 'none';
            outieWorld.classList.remove('hidden');
        } else {
            gameContainer.style.display = 'grid';
            outieWorld.classList.add('hidden');
        }
    }

    // ===== SEVERANCE (PRESTIGE) =====
    performSeverance() {
        if (this.dataPoints < 100000) return;

        const cpGained = Math.floor(this.dataPoints / 10000);
        this.conformityPoints += cpGained;

        // Reset
        this.dataPoints = 0;
        this.numbers = [];
        this.departmentItems.forEach(item => item.count = 0);
        this.activeUpgrades.forEach(up => up.purchased = false);
        this.synergyUpgrades.forEach(up => up.purchased = false);
        this.comboUpgrades.forEach(up => up.purchased = false);
        this.techTree.forEach(up => up.purchased = false);

        this.activePower = 1;
        this.scanSpeed = 1500;
        this.identifierCount = 0;
        this.sorterCount = 0;
        this.macroCount = 0;
        this.maxNumbers = 5;

        this.calculatePassiveGeneration();
        this.renderShop();

        this.showNotification(`SEVERANCE COMPLETE: +${cpGained} Conformity Points`);
    }

    // ===== GAME LOOP =====
    gameLoop() {
        const now = Date.now();
        const deltaTime = (now - this.lastUpdate) / 1000; // seconds
        this.lastUpdate = now;

        // Passive generation
        if (this.passiveGeneration > 0) {
            this.dataPoints += this.passiveGeneration * deltaTime;
        }

        // Spawn numbers
        if (now - this.lastSpawn > this.spawnInterval) {
            this.spawnNumber();
            this.lastSpawn = now;
        }

        // Update scanning progress
        if (this.currentScanning) {
            const number = this.numbers.find(n => n.id === this.currentScanning.numberId);
            if (number) {
                const elapsed = now - this.currentScanning.startTime;
                number.scanProgress = elapsed / this.scanSpeed;

                if (number.scanProgress >= 1) {
                    this.identifyNumber(number);
                }
            }
        }

        // Update automation
        this.updateAutomation(deltaTime);

        // Update numbers physics (simple gravity)
        this.numbers.forEach(num => {
            if (num === this.draggedNumber) return; // Don't update dragged number

            num.vy += 0.2; // gravity
            num.y += num.vy;
            num.x += num.vx;

            // Bounce off walls
            if (num.x < 30 || num.x > this.canvas.width - 30) {
                num.vx *= -0.8;
                num.x = Math.max(30, Math.min(this.canvas.width - 30, num.x));
            }

            // Bounce off floor (but not too low)
            if (num.y > this.canvas.height - 150) {
                num.vy *= -0.6;
                num.y = this.canvas.height - 150;
                num.vx *= 0.95; // friction
            }

            // Don't go off top
            if (num.y < 30) {
                num.y = 30;
                num.vy = 0;
            }
        });

        // Render
        this.render();

        // Update UI
        this.updateUI();

        // Continue loop
        requestAnimationFrame(() => this.gameLoop());
    }

    // ===== RENDERING =====
    render() {
        // Clear canvas
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw numbers
        this.numbers.forEach(num => {
            this.ctx.save();

            // Position
            this.ctx.translate(num.x, num.y);

            if (num.state === 'unidentified') {
                // Draw [???] with scan progress
                this.ctx.fillStyle = '#00ff41';
                this.ctx.font = 'bold 20px "IBM Plex Mono", monospace';
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';
                this.ctx.fillText('[???]', 0, 0);

                // Scan progress circle
                if (num.scanProgress > 0) {
                    this.ctx.strokeStyle = '#00ff41';
                    this.ctx.lineWidth = 3;
                    this.ctx.beginPath();
                    this.ctx.arc(0, 0, 35, -Math.PI / 2, -Math.PI / 2 + (num.scanProgress * Math.PI * 2));
                    this.ctx.stroke();
                }

                // Glow if hovering
                if (this.hoveredNumber === num) {
                    this.ctx.shadowColor = '#00ff41';
                    this.ctx.shadowBlur = 20;
                    this.ctx.strokeStyle = '#00ff41';
                    this.ctx.lineWidth = 2;
                    this.ctx.beginPath();
                    this.ctx.arc(0, 0, 35, 0, Math.PI * 2);
                    this.ctx.stroke();
                    this.ctx.shadowBlur = 0;
                }

            } else if (num.state === 'identified') {
                // Draw actual number with category color
                const category = this.categories[num.category];
                this.ctx.fillStyle = category.color;
                this.ctx.font = 'bold 24px "IBM Plex Mono", monospace';
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';
                this.ctx.fillText(num.value.toString(), 0, 0);

                // Category label
                this.ctx.font = '10px "IBM Plex Mono", monospace';
                this.ctx.fillText(category.name, 0, 20);

                // Border
                this.ctx.strokeStyle = category.color;
                this.ctx.lineWidth = 2;
                this.ctx.beginPath();
                this.ctx.arc(0, 0, 35, 0, Math.PI * 2);
                this.ctx.stroke();

                // Glow if being dragged
                if (this.draggedNumber === num) {
                    this.ctx.shadowColor = category.color;
                    this.ctx.shadowBlur = 30;
                    this.ctx.strokeStyle = category.color;
                    this.ctx.lineWidth = 4;
                    this.ctx.beginPath();
                    this.ctx.arc(0, 0, 40, 0, Math.PI * 2);
                    this.ctx.stroke();
                    this.ctx.shadowBlur = 0;
                }
            }

            this.ctx.restore();
        });

        // Draw instruction text
        if (this.numbers.length === 0) {
            this.ctx.fillStyle = '#00aa2b';
            this.ctx.font = '16px "IBM Plex Mono", monospace';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('En attente de données...', this.canvas.width / 2, this.canvas.height / 2);
        }
    }

    // ===== UI UPDATES =====
    updateUI() {
        // Top bar stats
        document.getElementById('dataPoints').textContent = this.formatNumber(Math.floor(this.dataPoints));
        document.getElementById('dpPerSec').textContent = this.formatNumber(this.passiveGeneration, 1) + '/sec';
        document.getElementById('activePower').textContent = this.activePower + '/refine';
        document.getElementById('conformityPoints').textContent = this.conformityPoints;

        // Left sidebar stats
        document.getElementById('scanSpeed').textContent = (this.scanSpeed / 1000).toFixed(1) + 's';
        document.getElementById('identifierCount').textContent = this.identifierCount;
        document.getElementById('sorterCount').textContent = this.sorterCount;
        document.getElementById('macroCount').textContent = this.macroCount;

        const accuracy = this.totalRefined > 0 ? (this.correctSorts / this.totalRefined * 100) : 100;
        document.getElementById('accuracy').textContent = accuracy.toFixed(1) + '%';
        document.getElementById('totalRefined').textContent = this.formatNumber(this.totalRefined);

        // Category counts
        document.getElementById('woeCount').textContent = this.categoryStats.woe;
        document.getElementById('frolicCount').textContent = this.categoryStats.frolic;
        document.getElementById('dreadCount').textContent = this.categoryStats.dread;
        document.getElementById('maliceCount').textContent = this.categoryStats.malice;

        // Quota
        const quotaPercent = Math.min(100, (this.quotaProgress / this.currentQuota) * 100);
        document.getElementById('quotaFill').style.width = quotaPercent + '%';
        document.getElementById('quotaText').textContent = `${this.formatNumber(this.quotaProgress)} / ${this.formatNumber(this.currentQuota)}`;

        // Terminal load
        document.getElementById('terminalLoad').textContent = `Load: ${this.numbers.length}/${this.maxNumbers}`;

        // Severance button
        const severanceBtn = document.getElementById('severanceBtn');
        severanceBtn.disabled = this.dataPoints < 100000;

        // Free time (outie world)
        document.getElementById('freeTime').textContent = this.freeTime;

        // Update shop affordability
        this.updateShopAffordability();
    }

    updateShopAffordability() {
        document.querySelectorAll('.shop-item').forEach(item => {
            const costText = item.querySelector('.shop-item-cost')?.textContent;
            if (!costText) return;

            const cost = parseFloat(costText.replace(/[^0-9.]/g, ''));
            const affordable = this.dataPoints >= cost;

            item.classList.toggle('affordable', affordable);
            const btn = item.querySelector('.shop-item-btn');
            if (btn) btn.disabled = !affordable;
        });
    }

    // ===== UI INITIALIZATION =====
    initializeUI() {
        this.switchShopTab('department');
    }

    // ===== NOTIFICATIONS =====
    showNotification(message) {
        const notif = document.getElementById('notification');
        notif.textContent = message;
        notif.classList.add('show');
        setTimeout(() => notif.classList.remove('show'), 3000);
    }

    showToast(message, isError = false) {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.style.borderColor = isError ? '#ff3366' : '#00ff41';
        toast.style.color = isError ? '#ff3366' : '#00ff41';
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2000);
    }

    // ===== UTILITY =====
    formatNumber(num, decimals = 0) {
        if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B';
        if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
        if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
        return num.toFixed(decimals);
    }
}

// ===== START GAME =====
window.addEventListener('DOMContentLoaded', () => {
    window.game = new LumonMDRGame();
});
