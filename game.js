// ==================================================
// LUMON INDUSTRIES - MDR TERMINAL v4.0
// Macrodata Refinement Simulation - AUDITED VERSION
// ==================================================

class LumonMDRGame {
    constructor() {
        // ===== CORE CURRENCIES =====
        this.dataPoints = 0;
        this.conformityPoints = 0;
        this.freeTime = 0;

        // ===== PASSIVE vs ACTIVE GENERATION =====
        this.passiveGeneration = 0;
        this.activePower = 1;

        // ===== REFINING STATS =====
        this.totalRefined = 0;
        this.correctSorts = 0;
        this.incorrectSorts = 0;

        // ===== GRID SYSTEM (Optimized with 2D array) =====
        this.gridCols = 10;
        this.gridRows = 20;
        this.grid = []; // 2D array for O(1) access
        this.allCells = []; // Flat array for iteration

        // ===== SCAN MECHANICS =====
        this.scanSpeed = 2000; // ms - plus long au début
        this.scanRadius = 80; // pixels - plus grand au début
        this.scanZoneLevel = 1;

        // ===== CLUSTER MECHANICS =====
        this.clusterSize = 1;

        // ===== RESPAWN MECHANICS =====
        this.respawnTime = 1500; // ms - plus rapide au début
        this.emptySlots = [];

        // ===== COMBO SYSTEM =====
        this.currentCombo = 0;
        this.maxCombo = 0;
        this.comboTimer = null;
        this.lastDropCategory = null;
        this.lastDropTime = 0;
        this.comboDecayTime = 4000; // 4 secondes pour maintenir le combo

        // ===== CATEGORY SYSTEM =====
        this.categoryStats = { woe: 0, frolic: 0, dread: 0, malice: 0 };
        this.categories = {
            woe: {
                ranges: [[1, 25], [666, 669]],
                color: '#ff3366',
                multiplier: 1.5,
                name: 'WOE'
            },
            frolic: {
                ranges: [[26, 50], [100, 111]],
                color: '#ffdd33',
                multiplier: 1.3,
                name: 'FROLIC'
            },
            dread: {
                ranges: [[51, 75], [200, 222]],
                color: '#9933ff',
                multiplier: 2.0,
                name: 'DREAD'
            },
            malice: {
                ranges: [[76, 99], [300, 333]],
                color: '#ff8800',
                multiplier: 1.8,
                name: 'MALICE'
            }
        };

        // ===== QUOTA SYSTEM =====
        this.currentQuota = 500; // Plus accessible
        this.quotaProgress = 0;
        this.quotaLevel = 1;

        // ===== AUTOMATION COUNTS =====
        this.identifierCount = 0;
        this.sorterCount = 0;
        this.macroCount = 0;

        // ===== WORLD STATE =====
        this.currentWorld = 'innie';

        // ===== DEPARTMENT ITEMS (Rebalanced) =====
        this.departmentItems = [
            {
                id: 'stagiaire',
                icon: '👤',
                name: 'Stagiaire',
                description: 'Génère 0.1 DP/sec',
                baseCost: 15,
                baseProduction: 0.1,
                count: 0,
                costMultiplier: 1.13
            },
            {
                id: 'identifier',
                icon: '🔍',
                name: 'Identifier Auto',
                description: 'Scanne 1 numéro toutes les 2s',
                baseCost: 75,
                baseProduction: 0.5,
                count: 0,
                costMultiplier: 1.13,
                special: 'identifier'
            },
            {
                id: 'sorter',
                icon: '📊',
                name: 'Sorter Auto',
                description: 'Trie 1 numéro toutes les 3s',
                baseCost: 200,
                baseProduction: 1,
                count: 0,
                costMultiplier: 1.13,
                special: 'sorter'
            },
            {
                id: 'macro',
                icon: '⚙️',
                name: 'Macro Complet',
                description: 'Scan + Tri auto',
                baseCost: 750,
                baseProduction: 3,
                count: 0,
                costMultiplier: 1.13,
                special: 'macro'
            },
            {
                id: 'coffee',
                icon: '☕',
                name: 'Machine à Café',
                description: 'Booste le département',
                baseCost: 2000,
                baseProduction: 8,
                count: 0,
                costMultiplier: 1.13
            },
            {
                id: 'irving',
                icon: '🖥️',
                name: 'Serveur d\'Irving',
                description: 'Traitement parallèle',
                baseCost: 10000,
                baseProduction: 40,
                count: 0,
                costMultiplier: 1.13
            },
            {
                id: 'cobel',
                icon: '👁️',
                name: 'Mrs. Cobel',
                description: 'Supervision totale',
                baseCost: 50000,
                baseProduction: 200,
                count: 0,
                costMultiplier: 1.13
            }
        ];

        // ===== ACTIVE UPGRADES (Rebalanced) =====
        this.activeUpgrades = [
            {
                id: 'power1',
                icon: '👆',
                name: 'Formation de Base',
                description: 'Puissance active +1',
                cost: 50,
                purchased: false,
                effect: () => this.activePower += 1
            },
            {
                id: 'power2',
                icon: '✌️',
                name: 'Expertise Avancée',
                description: 'Puissance active +2',
                cost: 300,
                purchased: false,
                effect: () => this.activePower += 2
            },
            {
                id: 'power3',
                icon: '💪',
                name: 'Maîtrise Complète',
                description: 'Puissance active +5',
                cost: 1500,
                purchased: false,
                effect: () => this.activePower += 5
            },
            {
                id: 'power4',
                icon: '🔥',
                name: 'Expert Lumon',
                description: 'Puissance active +10',
                cost: 8000,
                purchased: false,
                effect: () => this.activePower += 10
            },
            {
                id: 'scan1',
                icon: '⚡',
                name: 'Scan Rapide',
                description: 'Vitesse scan -25%',
                cost: 200,
                purchased: false,
                effect: () => this.scanSpeed *= 0.75
            },
            {
                id: 'scan2',
                icon: '⚡⚡',
                name: 'Scan Ultra',
                description: 'Vitesse scan -40%',
                cost: 1000,
                purchased: false,
                effect: () => this.scanSpeed *= 0.6
            },
            {
                id: 'scan3',
                icon: '⚡⚡⚡',
                name: 'Scan Instantané',
                description: 'Vitesse scan -60%',
                cost: 5000,
                purchased: false,
                effect: () => this.scanSpeed *= 0.4
            },
            {
                id: 'zone1',
                icon: '🎯',
                name: 'Zone Étendue',
                description: 'Rayon scan +40%',
                cost: 250,
                purchased: false,
                effect: () => { this.scanRadius *= 1.4; this.scanZoneLevel++; }
            },
            {
                id: 'zone2',
                icon: '🎯🎯',
                name: 'Zone Large',
                description: 'Rayon scan +80%',
                cost: 1200,
                purchased: false,
                effect: () => { this.scanRadius *= 1.8; this.scanZoneLevel++; }
            },
            {
                id: 'zone3',
                icon: '🎯🎯🎯',
                name: 'Zone Massive',
                description: 'Rayon scan +120%',
                cost: 6000,
                purchased: false,
                effect: () => { this.scanRadius *= 2.2; this.scanZoneLevel++; }
            },
            {
                id: 'cluster1',
                icon: '🔗',
                name: 'Cluster Duo',
                description: 'Sélection: 2 adjacents',
                cost: 400,
                purchased: false,
                effect: () => this.clusterSize = 2
            },
            {
                id: 'cluster2',
                icon: '🔗🔗',
                name: 'Cluster Groupe',
                description: 'Sélection: 4 adjacents',
                cost: 2000,
                purchased: false,
                effect: () => this.clusterSize = 4
            },
            {
                id: 'cluster3',
                icon: '🔗🔗🔗',
                name: 'Cluster Étendu',
                description: 'Sélection: 8 adjacents',
                cost: 10000,
                purchased: false,
                effect: () => this.clusterSize = 8
            },
            {
                id: 'cluster4',
                icon: '🔗🔗🔗🔗',
                name: 'Cluster Massif',
                description: 'Sélection: 15 adjacents',
                cost: 50000,
                purchased: false,
                effect: () => this.clusterSize = 15
            },
            {
                id: 'respawn1',
                icon: '⏱️',
                name: 'Respawn Rapide',
                description: 'Réapparition -25%',
                cost: 500,
                purchased: false,
                effect: () => this.respawnTime *= 0.75
            },
            {
                id: 'respawn2',
                icon: '⏱️⏱️',
                name: 'Respawn Ultra',
                description: 'Réapparition -40%',
                cost: 2500,
                purchased: false,
                effect: () => this.respawnTime *= 0.6
            },
            {
                id: 'respawn3',
                icon: '⏱️⏱️⏱️',
                name: 'Respawn Instant',
                description: 'Réapparition -60%',
                cost: 12000,
                purchased: false,
                effect: () => this.respawnTime *= 0.4
            }
        ];

        // ===== SYNERGY UPGRADES (Rebalanced) =====
        this.synergyUpgrades = [
            {
                id: 'syn1',
                icon: '🌟',
                name: 'Synergie Stagiaire',
                description: '+10% prod/Stagiaire',
                cost: 1500,
                purchased: false
            },
            {
                id: 'syn2',
                icon: '🌟🌟',
                name: 'Synergie Macro',
                description: '+15% prod/Macro',
                cost: 7500,
                purchased: false
            },
            {
                id: 'combo1',
                icon: '💥',
                name: 'Bonus Combo ×2',
                description: 'Combo 3+ = ×2',
                cost: 3000,
                purchased: false
            },
            {
                id: 'combo2',
                icon: '💥💥',
                name: 'Bonus Combo ×3',
                description: 'Combo 5+ = ×3',
                cost: 15000,
                purchased: false
            },
            {
                id: 'combo3',
                icon: '💥💥💥',
                name: 'Bonus Combo ×5',
                description: 'Combo 10+ = ×5',
                cost: 75000,
                purchased: false
            },
            {
                id: 'cluster_same',
                icon: '🎨',
                name: 'Clusters Colorés',
                description: '+60% chance adjacents même catégorie',
                cost: 5000,
                purchased: false
            },
            {
                id: 'cluster_bonus',
                icon: '✨',
                name: 'Bonus Cluster',
                description: '+20% par numéro au-delà de 2',
                cost: 10000,
                purchased: false
            }
        ];

        // ===== TECH TREE =====
        this.techTree = [
            {
                id: 'tech1',
                icon: '📈',
                name: 'Grille Étendue',
                description: '+5 rangées',
                cost: 3000,
                purchased: false,
                effect: () => { this.gridRows += 5; this.initializeGrid(); }
            },
            {
                id: 'tech2',
                icon: '🔬',
                name: 'Scan Persistant',
                description: 'Scan continue hors zone',
                cost: 6000,
                purchased: false
            }
        ];

        // ===== CANVAS SETUP =====
        this.canvas = document.getElementById('terminalCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();

        // Mouse tracking
        this.mouseX = 0;
        this.mouseY = 0;

        // ===== PERFORMANCE =====
        this.cellWidth = 0;
        this.cellHeight = 0;

        // ===== INITIALIZE =====
        this.initializeGrid();
        this.bindEvents();
        this.initializeUI();
        this.renderShop();

        // ===== START GAME LOOP =====
        this.lastUpdate = Date.now();
        this.gameLoop();
    }

    // ===== GRID INITIALIZATION (Optimized) =====
    initializeGrid() {
        this.grid = [];
        this.allCells = [];

        // Create 2D array for O(1) access
        for (let row = 0; row < this.gridRows; row++) {
            this.grid[row] = [];
            for (let col = 0; col < this.gridCols; col++) {
                const cell = {
                    id: row * this.gridCols + col,
                    gridX: col,
                    gridY: row,
                    value: null,
                    category: null,
                    state: 'empty',
                    scanProgress: 0,
                    scanStartTime: null,
                    wiggleOffset: Math.random() * Math.PI * 2,
                    isEmpty: true
                };

                this.grid[row][col] = cell;
                this.allCells.push(cell);
            }
        }

        // Fill 60% initially
        const toFill = Math.floor(this.allCells.length * 0.6);
        for (let i = 0; i < toFill; i++) {
            this.spawnNumberAtRandomPosition();
        }

        this.resizeCanvas();
    }

    spawnNumberAtRandomPosition() {
        const emptyCells = this.allCells.filter(cell => cell.isEmpty);
        if (emptyCells.length === 0) return;

        const cell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        this.spawnNumberAtCell(cell);
    }

    spawnNumberAtCell(cell) {
        const category = this.getRandomCategory(cell);
        const value = this.getRandomValueForCategory(category);

        cell.value = value;
        cell.category = category;
        cell.state = 'unidentified';
        cell.isEmpty = false;
        cell.scanProgress = 0;
        cell.scanStartTime = null;
    }

    getRandomCategory(cell) {
        const clusterUpgrade = this.synergyUpgrades.find(u => u.id === 'cluster_same');

        if (clusterUpgrade && clusterUpgrade.purchased && Math.random() < 0.6) {
            const neighbors = this.getNeighbors(cell.gridX, cell.gridY);
            const identifiedNeighbors = neighbors.filter(n => !n.isEmpty && n.category);

            if (identifiedNeighbors.length > 0) {
                return identifiedNeighbors[0].category;
            }
        }

        const cats = ['woe', 'frolic', 'dread', 'malice'];
        return cats[Math.floor(Math.random() * cats.length)];
    }

    getRandomValueForCategory(category) {
        const ranges = this.categories[category].ranges;
        const range = ranges[Math.floor(Math.random() * ranges.length)];
        return Math.floor(Math.random() * (range[1] - range[0] + 1)) + range[0];
    }

    // ===== CANVAS MANAGEMENT =====
    resizeCanvas() {
        const rect = this.canvas.parentElement.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;

        this.cellWidth = this.canvas.width / this.gridCols;
        this.cellHeight = this.canvas.height / this.gridRows;
    }

    // ===== EVENT BINDING =====
    bindEvents() {
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('click', (e) => this.handleClick(e));
        this.canvas.addEventListener('mouseleave', () => this.handleMouseLeave());

        document.querySelectorAll('.world-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchWorld(e.target.dataset.world));
        });

        document.querySelectorAll('.shop-tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchShopTab(e.target.closest('[data-shop-tab]').dataset.shopTab));
        });

        document.getElementById('severanceBtn').addEventListener('click', () => this.performSeverance());

        window.addEventListener('resize', () => this.resizeCanvas());
    }

    // ===== MOUSE HANDLERS =====
    handleMouseMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        this.mouseX = e.clientX - rect.left;
        this.mouseY = e.clientY - rect.top;
    }

    handleClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const gridX = Math.floor(mouseX / this.cellWidth);
        const gridY = Math.floor(mouseY / this.cellHeight);

        if (gridX < 0 || gridX >= this.gridCols || gridY < 0 || gridY >= this.gridRows) return;

        const cell = this.grid[gridY][gridX];

        if (cell && !cell.isEmpty && cell.state === 'identified') {
            // Auto-sort avec cluster
            const cluster = this.selectCluster(cell);
            const category = cell.category;
            this.sortCluster(cluster, category);
        }
    }

    handleMouseLeave() {
        // Optionnel : arrêter le scan hors canvas
    }

    // ===== SCANNING (Fixed - continuous scan) =====
    scanNumbersInRadius() {
        const now = Date.now();
        const persistentScan = this.techTree.find(t => t.id === 'tech2')?.purchased;

        for (const cell of this.allCells) {
            if (cell.isEmpty || cell.state === 'identified') continue;

            const cellCenterX = cell.gridX * this.cellWidth + this.cellWidth / 2;
            const cellCenterY = cell.gridY * this.cellHeight + this.cellHeight / 2;

            const dist = Math.sqrt(
                (this.mouseX - cellCenterX) ** 2 +
                (this.mouseY - cellCenterY) ** 2
            );

            const inRadius = dist <= this.scanRadius;

            if (inRadius || (persistentScan && cell.state === 'scanning')) {
                if (cell.state === 'unidentified') {
                    cell.state = 'scanning';
                    if (!cell.scanStartTime) {
                        cell.scanStartTime = now;
                    }
                }

                if (cell.state === 'scanning') {
                    const elapsed = now - cell.scanStartTime;
                    cell.scanProgress = Math.min(1, elapsed / this.scanSpeed);

                    if (cell.scanProgress >= 1) {
                        cell.state = 'identified';
                        cell.scanProgress = 0;
                        cell.scanStartTime = null;
                    }
                }
            } else {
                // Hors zone et pas de scan persistant
                if (cell.state === 'scanning' && !persistentScan) {
                    cell.state = 'unidentified';
                    cell.scanProgress = 0;
                    cell.scanStartTime = null;
                }
            }
        }
    }

    // ===== CLUSTER SELECTION (Optimized) =====
    selectCluster(startCell) {
        const cluster = [startCell];
        const visited = new Set([startCell.id]);
        const queue = [startCell];

        while (queue.length > 0 && cluster.length < this.clusterSize) {
            const current = queue.shift();
            const neighbors = this.getNeighbors(current.gridX, current.gridY);

            for (const neighbor of neighbors) {
                if (visited.has(neighbor.id)) continue;
                if (neighbor.isEmpty || neighbor.state !== 'identified') continue;

                visited.add(neighbor.id);
                cluster.push(neighbor);
                queue.push(neighbor);

                if (cluster.length >= this.clusterSize) break;
            }
        }

        return cluster;
    }

    getNeighbors(gridX, gridY) {
        const neighbors = [];
        const directions = [
            [-1, 0], [1, 0], [0, -1], [0, 1],
            [-1, -1], [-1, 1], [1, -1], [1, 1]
        ];

        for (const [dx, dy] of directions) {
            const nx = gridX + dx;
            const ny = gridY + dy;

            if (nx >= 0 && nx < this.gridCols && ny >= 0 && ny < this.gridRows) {
                neighbors.push(this.grid[ny][nx]);
            }
        }

        return neighbors;
    }

    // ===== SORTING (Enhanced feedback) =====
    sortCluster(cluster, binCategory) {
        const now = Date.now();

        let totalReward = 0;
        let allCorrect = true;

        cluster.forEach(cell => {
            const correct = cell.category === binCategory;

            if (correct) {
                const multiplier = this.categories[cell.category].multiplier;
                const reward = Math.floor(this.activePower * multiplier);
                totalReward += reward;
                this.categoryStats[cell.category]++;
                this.correctSorts++;
            } else {
                allCorrect = false;
                this.incorrectSorts++;
            }

            this.totalRefined++;

            // Clear cell
            cell.isEmpty = true;
            cell.value = null;
            cell.category = null;
            cell.state = 'empty';
            cell.scanProgress = 0;
            cell.scanStartTime = null;

            this.emptySlots.push({
                cell: cell,
                emptyTime: now
            });
        });

        // COMBO SYSTEM (Enhanced)
        let comboBonus = 1;

        if (allCorrect && cluster.length >= 1) {
            const timeSinceLastDrop = now - this.lastDropTime;

            if (this.lastDropCategory === binCategory && timeSinceLastDrop < this.comboDecayTime) {
                this.currentCombo++;
            } else {
                this.currentCombo = 1;
            }

            this.lastDropCategory = binCategory;
            this.lastDropTime = now;

            if (this.currentCombo > this.maxCombo) {
                this.maxCombo = this.currentCombo;
            }

            // Apply combo bonuses
            const combo3 = this.synergyUpgrades.find(u => u.id === 'combo3');
            const combo2 = this.synergyUpgrades.find(u => u.id === 'combo2');
            const combo1 = this.synergyUpgrades.find(u => u.id === 'combo1');

            if (combo3 && combo3.purchased && this.currentCombo >= 10) {
                comboBonus = 5;
            } else if (combo2 && combo2.purchased && this.currentCombo >= 5) {
                comboBonus = 3;
            } else if (combo1 && combo1.purchased && this.currentCombo >= 3) {
                comboBonus = 2;
            }

            // Cluster size bonus
            const clusterBonusUpgrade = this.synergyUpgrades.find(u => u.id === 'cluster_bonus');
            if (clusterBonusUpgrade && clusterBonusUpgrade.purchased && cluster.length >= 3) {
                comboBonus *= (1 + (cluster.length - 2) * 0.2);
            }

            // Reset combo timer
            if (this.comboTimer) clearTimeout(this.comboTimer);
            this.comboTimer = setTimeout(() => {
                this.currentCombo = 0;
                this.lastDropCategory = null;
            }, this.comboDecayTime);
        } else {
            this.currentCombo = 0;
            this.lastDropCategory = null;
        }

        totalReward = Math.floor(totalReward * comboBonus);

        if (allCorrect && totalReward > 0) {
            this.dataPoints += totalReward;
            this.quotaProgress += totalReward;

            let message = `+${totalReward} DP`;
            if (cluster.length > 1) {
                message += ` [×${cluster.length}]`;
            }
            if (this.currentCombo >= 3) {
                message += ` COMBO ×${this.currentCombo}!`;
            }
            if (comboBonus > 1) {
                message += ` (×${comboBonus.toFixed(1)})`;
            }

            this.showToast(message);
        } else if (!allCorrect) {
            this.showToast(`Erreur! Précision réduite`, true);
        }
    }

    // ===== RESPAWN SYSTEM =====
    updateRespawn() {
        const now = Date.now();
        const toRespawn = [];

        this.emptySlots = this.emptySlots.filter(slot => {
            if (now - slot.emptyTime >= this.respawnTime) {
                toRespawn.push(slot.cell);
                return false;
            }
            return true;
        });

        toRespawn.forEach(cell => {
            this.spawnNumberAtCell(cell);
        });
    }

    // ===== AUTOMATION =====
    updateAutomation(deltaTime) {
        if (this.identifierCount > 0) {
            const scanRate = this.identifierCount * 0.5 * deltaTime;
            const unidentified = this.allCells.filter(c => !c.isEmpty && c.state === 'unidentified');
            const toScan = Math.min(unidentified.length, Math.floor(scanRate));

            for (let i = 0; i < toScan; i++) {
                unidentified[i].state = 'identified';
            }
        }

        if (this.sorterCount > 0) {
            const sortRate = this.sorterCount * 0.33 * deltaTime;
            const identified = this.allCells.filter(c => !c.isEmpty && c.state === 'identified');
            const toSort = Math.min(identified.length, Math.floor(sortRate));

            for (let i = 0; i < toSort; i++) {
                const cell = identified[i];
                this.sortCluster([cell], cell.category);
            }
        }

        if (this.macroCount > 0) {
            const macroRate = this.macroCount * 0.8 * deltaTime;
            const any = this.allCells.filter(c => !c.isEmpty);
            const toProcess = Math.min(any.length, Math.floor(macroRate));

            for (let i = 0; i < toProcess; i++) {
                const cell = any[i];
                if (cell.state === 'unidentified') {
                    cell.state = 'identified';
                }
                if (cell.state === 'identified') {
                    this.sortCluster([cell], cell.category);
                }
            }
        }
    }

    // ===== SHOP SYSTEM =====
    renderShop() {
        const departmentList = document.getElementById('departmentList');
        if (departmentList) {
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
                            <span class="shop-item-count">×${item.count}</span>
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
        }

        this.renderUpgradesList('activeUpgradesList', this.activeUpgrades);
        this.renderUpgradesList('synergyUpgradesList', this.synergyUpgrades);
        this.renderUpgradesList('techTree', this.techTree);
    }

    renderUpgradesList(containerId, upgrades) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = '';
        upgrades.forEach(upgrade => {
            if (upgrade.purchased) return;

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

        if (item.special === 'identifier') this.identifierCount++;
        if (item.special === 'sorter') this.sorterCount++;
        if (item.special === 'macro') this.macroCount++;

        this.calculatePassiveGeneration();
        this.renderShop();
        this.showNotification(`✓ ${item.name}`);
    }

    purchaseUpgrade(upgrade) {
        if (this.dataPoints < upgrade.cost || upgrade.purchased) return;

        this.dataPoints -= upgrade.cost;
        upgrade.purchased = true;
        if (upgrade.effect) upgrade.effect();

        this.renderShop();
        this.showNotification(`✓ ${upgrade.name}`);
    }

    getUpgradeCost(item) {
        return Math.floor(item.baseCost * Math.pow(item.costMultiplier, item.count));
    }

    calculatePassiveGeneration() {
        let total = 0;
        this.departmentItems.forEach(item => {
            total += item.baseProduction * item.count;
        });

        const syn1 = this.synergyUpgrades.find(u => u.id === 'syn1');
        if (syn1 && syn1.purchased) {
            const stagiaire = this.departmentItems.find(i => i.id === 'stagiaire');
            if (stagiaire) total += stagiaire.baseProduction * stagiaire.count * 0.1;
        }

        const syn2 = this.synergyUpgrades.find(u => u.id === 'syn2');
        if (syn2 && syn2.purchased) {
            const macro = this.departmentItems.find(i => i.id === 'macro');
            if (macro) total += macro.baseProduction * macro.count * 0.15;
        }

        this.passiveGeneration = total;
    }

    switchShopTab(tabName) {
        document.querySelectorAll('.shop-tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.shop-tab-content').forEach(content => content.classList.remove('active'));

        const btn = document.querySelector(`[data-shop-tab="${tabName}"]`);
        const content = document.getElementById(`${tabName}Tab`);

        if (btn) btn.classList.add('active');
        if (content) content.classList.add('active');
    }

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

    performSeverance() {
        if (this.dataPoints < 100000) return;

        const cpGained = Math.floor(this.dataPoints / 10000);
        this.conformityPoints += cpGained;

        // Reset
        this.dataPoints = 0;
        this.initializeGrid();
        this.departmentItems.forEach(item => item.count = 0);
        this.activeUpgrades.forEach(up => up.purchased = false);
        this.synergyUpgrades.forEach(up => up.purchased = false);
        this.techTree.forEach(up => up.purchased = false);

        this.activePower = 1;
        this.scanSpeed = 2000;
        this.scanRadius = 80;
        this.scanZoneLevel = 1;
        this.clusterSize = 1;
        this.respawnTime = 1500;
        this.identifierCount = 0;
        this.sorterCount = 0;
        this.macroCount = 0;
        this.currentCombo = 0;
        this.maxCombo = 0;

        this.calculatePassiveGeneration();
        this.renderShop();

        this.showNotification(`SEVERANCE: +${cpGained} CP`);
    }

    // ===== GAME LOOP (Fixed - continuous scan) =====
    gameLoop() {
        const now = Date.now();
        const deltaTime = (now - this.lastUpdate) / 1000;
        this.lastUpdate = now;

        // Passive generation
        if (this.passiveGeneration > 0) {
            this.dataPoints += this.passiveGeneration * deltaTime;
        }

        // IMPORTANT: Scan continuously in game loop
        this.scanNumbersInRadius();

        // Respawn
        this.updateRespawn();

        // Automation
        this.updateAutomation(deltaTime);

        // Render
        this.render();

        // Update UI
        this.updateUI();

        requestAnimationFrame(() => this.gameLoop());
    }

    // ===== RENDERING (Enhanced visuals) =====
    render() {
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        const time = Date.now() / 1000;

        // Draw scan zone (more visible)
        this.ctx.save();
        this.ctx.strokeStyle = 'rgba(0, 255, 65, 0.4)';
        this.ctx.lineWidth = 3;
        this.ctx.setLineDash([8, 4]);
        this.ctx.beginPath();
        this.ctx.arc(this.mouseX, this.mouseY, this.scanRadius, 0, Math.PI * 2);
        this.ctx.stroke();

        // Fill with gradient
        const gradient = this.ctx.createRadialGradient(
            this.mouseX, this.mouseY, 0,
            this.mouseX, this.mouseY, this.scanRadius
        );
        gradient.addColorStop(0, 'rgba(0, 255, 65, 0.1)');
        gradient.addColorStop(1, 'rgba(0, 255, 65, 0)');
        this.ctx.fillStyle = gradient;
        this.ctx.fill();

        this.ctx.setLineDash([]);
        this.ctx.restore();

        // Draw grid
        for (const cell of this.allCells) {
            if (cell.isEmpty) continue;

            const x = cell.gridX * this.cellWidth + this.cellWidth / 2;
            const y = cell.gridY * this.cellHeight + this.cellHeight / 2;

            // Wiggle effect
            const wiggleX = Math.sin(time * 2 + cell.wiggleOffset) * 1.5;
            const wiggleY = Math.cos(time * 2.5 + cell.wiggleOffset) * 1.5;

            this.ctx.save();
            this.ctx.translate(x + wiggleX, y + wiggleY);

            if (cell.state === 'unidentified' || cell.state === 'scanning') {
                // [???]
                this.ctx.fillStyle = cell.state === 'scanning' ? '#00ff41' : '#00aa2b';
                this.ctx.font = 'bold 13px "IBM Plex Mono", monospace';
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';
                this.ctx.fillText('[???]', 0, 0);

                // Scan progress circle
                if (cell.scanProgress > 0) {
                    this.ctx.strokeStyle = '#00ff41';
                    this.ctx.lineWidth = 3;
                    this.ctx.beginPath();
                    this.ctx.arc(0, 0, 22, -Math.PI / 2, -Math.PI / 2 + (cell.scanProgress * Math.PI * 2));
                    this.ctx.stroke();

                    // Progress text
                    this.ctx.fillStyle = '#00ff41';
                    this.ctx.font = 'bold 8px "IBM Plex Mono", monospace';
                    this.ctx.fillText(Math.floor(cell.scanProgress * 100) + '%', 0, 0);
                }
            } else if (cell.state === 'identified') {
                // Identified number with better visibility
                const category = this.categories[cell.category];
                this.ctx.fillStyle = category.color;
                this.ctx.shadowColor = category.color;
                this.ctx.shadowBlur = 8;
                this.ctx.font = 'bold 17px "IBM Plex Mono", monospace';
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';
                this.ctx.fillText(cell.value.toString(), 0, 0);

                // Subtle border
                this.ctx.shadowBlur = 0;
                this.ctx.strokeStyle = category.color;
                this.ctx.lineWidth = 1.5;
                this.ctx.beginPath();
                this.ctx.arc(0, 0, 20, 0, Math.PI * 2);
                this.ctx.stroke();
            }

            this.ctx.restore();
        }

        // Draw combo indicator on screen
        if (this.currentCombo >= 3) {
            this.ctx.save();
            this.ctx.fillStyle = '#ffdd33';
            this.ctx.shadowColor = '#ffdd33';
            this.ctx.shadowBlur = 20;
            this.ctx.font = 'bold 24px "IBM Plex Mono", monospace';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(`COMBO ×${this.currentCombo}`, this.canvas.width / 2, 40);
            this.ctx.restore();
        }
    }

    // ===== UI UPDATES =====
    updateUI() {
        document.getElementById('dataPoints').textContent = this.formatNumber(Math.floor(this.dataPoints));
        document.getElementById('dpPerSec').textContent = this.formatNumber(this.passiveGeneration, 1) + '/sec';
        document.getElementById('activePower').textContent = this.activePower + '/refine';
        document.getElementById('conformityPoints').textContent = this.conformityPoints;

        document.getElementById('scanSpeed').textContent = (this.scanSpeed / 1000).toFixed(1) + 's';
        document.getElementById('identifierCount').textContent = this.identifierCount;
        document.getElementById('sorterCount').textContent = this.sorterCount;
        document.getElementById('macroCount').textContent = this.macroCount;

        const accuracy = this.totalRefined > 0 ? (this.correctSorts / this.totalRefined * 100) : 100;
        document.getElementById('accuracy').textContent = accuracy.toFixed(1) + '%';
        document.getElementById('totalRefined').textContent = this.formatNumber(this.totalRefined);

        document.getElementById('woeCount').textContent = this.categoryStats.woe;
        document.getElementById('frolicCount').textContent = this.categoryStats.frolic;
        document.getElementById('dreadCount').textContent = this.categoryStats.dread;
        document.getElementById('maliceCount').textContent = this.categoryStats.malice;

        const quotaPercent = Math.min(100, (this.quotaProgress / this.currentQuota) * 100);
        document.getElementById('quotaFill').style.width = quotaPercent + '%';
        document.getElementById('quotaText').textContent = `${this.formatNumber(this.quotaProgress)} / ${this.formatNumber(this.currentQuota)}`;

        const filled = this.allCells.filter(c => !c.isEmpty).length;
        document.getElementById('terminalLoad').textContent = `Load: ${filled}/${this.allCells.length}`;

        document.getElementById('severanceBtn').disabled = this.dataPoints < 100000;
        document.getElementById('freeTime').textContent = this.freeTime;

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

    initializeUI() {
        this.switchShopTab('department');
    }

    showNotification(message) {
        const notif = document.getElementById('notification');
        notif.textContent = message;
        notif.classList.add('show');
        setTimeout(() => notif.classList.remove('show'), 2500);
    }

    showToast(message, isError = false) {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.style.borderColor = isError ? '#ff3366' : '#00ff41';
        toast.style.color = isError ? '#ff3366' : '#00ff41';
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2500);
    }

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
