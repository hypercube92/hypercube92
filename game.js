// ==================================================
// LUMON INDUSTRIES - MDR TERMINAL v3.0
// Macrodata Refinement Simulation - Grid System
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

        // ===== GRID SYSTEM =====
        this.gridCols = 10;
        this.gridRows = 20;
        this.grid = []; // Array of numbers at each position
        this.cellWidth = 0;
        this.cellHeight = 0;

        // ===== SCAN MECHANICS =====
        this.scanSpeed = 1500; // ms to scan one number
        this.scanRadius = 60; // pixels - zone d'effet du curseur
        this.scanZoneLevel = 1; // upgrade level

        // ===== CLUSTER MECHANICS =====
        this.clusterSize = 1; // combien de numéros adjacents on peut prendre
        this.selectedCluster = []; // numéros actuellement sélectionnés
        this.isDragging = false;

        // ===== RESPAWN MECHANICS =====
        this.respawnTime = 2000; // ms avant qu'un nouveau numéro apparaisse
        this.emptySlots = []; // positions vides avec timestamp
        this.lastRespawnCheck = Date.now();

        // ===== COMBO SYSTEM =====
        this.currentCombo = 0;
        this.comboMultiplier = 1;
        this.comboTimer = null;
        this.lastDropCategory = null;
        this.lastDropTime = 0;

        // ===== CATEGORY SYSTEM =====
        this.categoryStats = { woe: 0, frolic: 0, dread: 0, malice: 0 };
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

        // ===== QUOTA SYSTEM =====
        this.currentQuota = 1000;
        this.quotaProgress = 0;
        this.quotaLevel = 1;

        // ===== AUTOMATION COUNTS =====
        this.identifierCount = 0;
        this.sorterCount = 0;
        this.macroCount = 0;

        // ===== WORLD STATE =====
        this.currentWorld = 'innie';

        // ===== DEPARTMENT ITEMS =====
        this.departmentItems = [
            {
                id: 'stagiaire',
                icon: '👤',
                name: 'Stagiaire',
                description: 'Génère 0.1 DP/sec',
                baseCost: 10,
                baseProduction: 0.1,
                count: 0,
                costMultiplier: 1.15
            },
            {
                id: 'identifier',
                icon: '🔍',
                name: 'Identifier Auto',
                description: 'Scanne 1 numéro toutes les 2 sec',
                baseCost: 50,
                baseProduction: 0.5,
                count: 0,
                costMultiplier: 1.15,
                special: 'identifier'
            },
            {
                id: 'sorter',
                icon: '📊',
                name: 'Sorter Auto',
                description: 'Trie 1 numéro identifié toutes les 3 sec',
                baseCost: 150,
                baseProduction: 1,
                count: 0,
                costMultiplier: 1.15,
                special: 'sorter'
            },
            {
                id: 'macro',
                icon: '⚙️',
                name: 'Macro Complet',
                description: 'Scan + Tri automatique',
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
                description: 'Booste tout le département',
                baseCost: 1000,
                baseProduction: 5,
                count: 0,
                costMultiplier: 1.15
            },
            {
                id: 'irving',
                icon: '🖥️',
                name: 'Serveur d\'Irving',
                description: 'Traitement parallèle massif',
                baseCost: 5000,
                baseProduction: 20,
                count: 0,
                costMultiplier: 1.15
            },
            {
                id: 'cobel',
                icon: '👁️',
                name: 'Mrs. Cobel',
                description: 'Supervision totale',
                baseCost: 25000,
                baseProduction: 100,
                count: 0,
                costMultiplier: 1.15
            }
        ];

        // ===== ACTIVE UPGRADES =====
        this.activeUpgrades = [
            {
                id: 'power1',
                icon: '👆',
                name: 'Formation de Base',
                description: 'Puissance active +1',
                cost: 100,
                purchased: false,
                effect: () => this.activePower += 1
            },
            {
                id: 'power2',
                icon: '✌️',
                name: 'Expertise Avancée',
                description: 'Puissance active +3',
                cost: 500,
                purchased: false,
                effect: () => this.activePower += 3
            },
            {
                id: 'power3',
                icon: '💪',
                name: 'Maîtrise Totale',
                description: 'Puissance active +10',
                cost: 2500,
                purchased: false,
                effect: () => this.activePower += 10
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
            },
            {
                id: 'scan3',
                icon: '⚡⚡⚡',
                name: 'Scan Instantané',
                description: 'Vitesse de scan -50%',
                cost: 8000,
                purchased: false,
                effect: () => this.scanSpeed *= 0.5
            },
            {
                id: 'zone1',
                icon: '🎯',
                name: 'Zone Étendue',
                description: 'Rayon de scan +50%',
                cost: 400,
                purchased: false,
                effect: () => { this.scanRadius *= 1.5; this.scanZoneLevel++; }
            },
            {
                id: 'zone2',
                icon: '🎯🎯',
                name: 'Zone Large',
                description: 'Rayon de scan +100%',
                cost: 2000,
                purchased: false,
                effect: () => { this.scanRadius *= 2; this.scanZoneLevel++; }
            },
            {
                id: 'zone3',
                icon: '🎯🎯🎯',
                name: 'Zone Massive',
                description: 'Rayon de scan +150%',
                cost: 10000,
                purchased: false,
                effect: () => { this.scanRadius *= 2.5; this.scanZoneLevel++; }
            },
            {
                id: 'cluster1',
                icon: '🔗',
                name: 'Cluster Duo',
                description: 'Sélection adjacente: 2 numéros',
                cost: 600,
                purchased: false,
                effect: () => this.clusterSize = 2
            },
            {
                id: 'cluster2',
                icon: '🔗🔗',
                name: 'Cluster Groupe',
                description: 'Sélection adjacente: 5 numéros',
                cost: 3000,
                purchased: false,
                effect: () => this.clusterSize = 5
            },
            {
                id: 'cluster3',
                icon: '🔗🔗🔗',
                name: 'Cluster Massif',
                description: 'Sélection adjacente: 10 numéros',
                cost: 15000,
                purchased: false,
                effect: () => this.clusterSize = 10
            },
            {
                id: 'respawn1',
                icon: '⏱️',
                name: 'Respawn Rapide',
                description: 'Réapparition -30%',
                cost: 800,
                purchased: false,
                effect: () => this.respawnTime *= 0.7
            },
            {
                id: 'respawn2',
                icon: '⏱️⏱️',
                name: 'Respawn Ultra',
                description: 'Réapparition -50%',
                cost: 4000,
                purchased: false,
                effect: () => this.respawnTime *= 0.5
            },
            {
                id: 'respawn3',
                icon: '⏱️⏱️⏱️',
                name: 'Respawn Instantané',
                description: 'Réapparition -70%',
                cost: 20000,
                purchased: false,
                effect: () => this.respawnTime *= 0.3
            }
        ];

        // ===== SYNERGY UPGRADES =====
        this.synergyUpgrades = [
            {
                id: 'syn1',
                icon: '🌟',
                name: 'Synergie Stagiaire',
                description: '+10% production pour chaque Stagiaire',
                cost: 2000,
                purchased: false
            },
            {
                id: 'syn2',
                icon: '🌟🌟',
                name: 'Synergie Macro',
                description: '+15% production pour chaque Macro',
                cost: 10000,
                purchased: false
            },
            {
                id: 'combo1',
                icon: '💥',
                name: 'Bonus Combo x2',
                description: 'Combo de 3+ : multiplicateur x2',
                cost: 5000,
                purchased: false
            },
            {
                id: 'combo2',
                icon: '💥💥',
                name: 'Bonus Combo x3',
                description: 'Combo de 5+ : multiplicateur x3',
                cost: 15000,
                purchased: false
            },
            {
                id: 'cluster_same',
                icon: '🎨',
                name: 'Clusters Colorés',
                description: '+50% chance numéros adjacents même catégorie',
                cost: 7000,
                purchased: false
            }
        ];

        // ===== TECH TREE =====
        this.techTree = [
            {
                id: 'tech1',
                icon: '📈',
                name: 'Grille Étendue',
                description: 'Plus de numéros sur la grille',
                cost: 3000,
                purchased: false,
                effect: () => { this.gridRows += 5; this.initializeGrid(); }
            },
            {
                id: 'tech2',
                icon: '🔬',
                name: 'Analyse Prédictive',
                description: 'Révèle la catégorie avant scan',
                cost: 8000,
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

        // ===== INITIALIZE =====
        this.initializeGrid();
        this.bindEvents();
        this.initializeUI();
        this.renderShop();

        // ===== START GAME LOOP =====
        this.lastUpdate = Date.now();
        this.gameLoop();
    }

    // ===== GRID INITIALIZATION =====
    initializeGrid() {
        this.grid = [];
        const totalCells = this.gridCols * this.gridRows;

        for (let i = 0; i < totalCells; i++) {
            const row = Math.floor(i / this.gridCols);
            const col = i % this.gridCols;

            const number = {
                id: i,
                gridX: col,
                gridY: row,
                value: null,
                category: null,
                state: 'empty', // 'empty', 'unidentified', 'scanning', 'identified', 'selected'
                scanProgress: 0,
                wiggleOffset: Math.random() * Math.PI * 2, // pour animation
                isEmpty: true
            };

            this.grid.push(number);
        }

        // Remplir 50% de la grille au départ
        const toFill = Math.floor(totalCells * 0.5);
        for (let i = 0; i < toFill; i++) {
            this.spawnNumberAtRandomPosition();
        }
    }

    spawnNumberAtRandomPosition() {
        const emptyCells = this.grid.filter(cell => cell.isEmpty);
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
    }

    getRandomCategory(cell) {
        // Check if cluster upgrade purchased
        const clusterUpgrade = this.synergyUpgrades.find(u => u.id === 'cluster_same');

        if (clusterUpgrade && clusterUpgrade.purchased && Math.random() < 0.5) {
            // 50% chance de regarder les voisins
            const neighbors = this.getNeighbors(cell.gridX, cell.gridY);
            const identifiedNeighbors = neighbors.filter(n => !n.isEmpty && n.category);

            if (identifiedNeighbors.length > 0) {
                // Prendre la catégorie d'un voisin
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

        // Recalculate cell dimensions
        this.cellWidth = this.canvas.width / this.gridCols;
        this.cellHeight = this.canvas.height / this.gridRows;
    }

    // ===== EVENT BINDING =====
    bindEvents() {
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));
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

        // Scan numbers in radius
        if (!this.isDragging) {
            this.scanNumbersInRadius();
        }
    }

    scanNumbersInRadius() {
        const now = Date.now();

        this.grid.forEach(cell => {
            if (cell.isEmpty || cell.state === 'identified') return;

            const cellCenterX = cell.gridX * this.cellWidth + this.cellWidth / 2;
            const cellCenterY = cell.gridY * this.cellHeight + this.cellHeight / 2;

            const dist = Math.sqrt(
                (this.mouseX - cellCenterX) ** 2 +
                (this.mouseY - cellCenterY) ** 2
            );

            if (dist <= this.scanRadius) {
                // Dans la zone de scan
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
                        delete cell.scanStartTime;
                    }
                }
            } else {
                // Hors de la zone de scan
                if (cell.state === 'scanning') {
                    cell.state = 'unidentified';
                    cell.scanProgress = 0;
                    delete cell.scanStartTime;
                }
            }
        });
    }

    handleMouseDown(e) {
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const gridX = Math.floor(mouseX / this.cellWidth);
        const gridY = Math.floor(mouseY / this.cellHeight);

        const cell = this.grid.find(c => c.gridX === gridX && c.gridY === gridY);

        if (cell && !cell.isEmpty && cell.state === 'identified') {
            // Sélectionner le cluster
            this.selectedCluster = this.selectCluster(cell);
            this.isDragging = true;

            // Marquer comme sélectionnés
            this.selectedCluster.forEach(c => c.state = 'selected');
        }
    }

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
            [-1, 0], [1, 0], [0, -1], [0, 1], // orthogonaux
            [-1, -1], [-1, 1], [1, -1], [1, 1] // diagonaux
        ];

        for (const [dx, dy] of directions) {
            const nx = gridX + dx;
            const ny = gridY + dy;

            if (nx >= 0 && nx < this.gridCols && ny >= 0 && ny < this.gridRows) {
                const neighbor = this.grid.find(c => c.gridX === nx && c.gridY === ny);
                if (neighbor) neighbors.push(neighbor);
            }
        }

        return neighbors;
    }

    handleMouseUp(e) {
        if (!this.isDragging || this.selectedCluster.length === 0) {
            this.isDragging = false;
            this.selectedCluster = [];
            return;
        }

        const rect = this.canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // Check if dropped on a bin
        const binHeight = 80; // hauteur approximative des bins sous le canvas
        const parentRect = this.canvas.parentElement.parentElement.getBoundingClientRect();
        const absoluteY = e.clientY;

        // Si on est en bas de l'écran (zone des bins)
        if (absoluteY > parentRect.bottom - binHeight) {
            const binWidth = parentRect.width / 4;
            const relativeX = e.clientX - parentRect.left;
            const binIndex = Math.floor(relativeX / binWidth);
            const bins = ['woe', 'frolic', 'dread', 'malice'];
            const droppedBin = bins[Math.max(0, Math.min(3, binIndex))];

            if (droppedBin) {
                this.sortCluster(this.selectedCluster, droppedBin);
            }
        }

        // Reset selection
        this.selectedCluster.forEach(c => {
            if (c.state === 'selected') c.state = 'identified';
        });
        this.selectedCluster = [];
        this.isDragging = false;
    }

    handleMouseLeave() {
        if (this.isDragging) {
            this.selectedCluster.forEach(c => {
                if (c.state === 'selected') c.state = 'identified';
            });
            this.selectedCluster = [];
            this.isDragging = false;
        }
    }

    sortCluster(cluster, binCategory) {
        const now = Date.now();

        // Vérifier les catégories
        const categories = cluster.map(c => c.category);
        const allSameCategory = categories.every(cat => cat === categories[0]);
        const correctCategory = categories[0] === binCategory;

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

            // Vider la cellule
            cell.isEmpty = true;
            cell.value = null;
            cell.category = null;
            cell.state = 'empty';
            cell.scanProgress = 0;

            // Ajouter à la liste de respawn
            this.emptySlots.push({
                cell: cell,
                emptyTime: now
            });
        });

        // COMBO SYSTEM
        let comboBonus = 1;

        if (allSameCategory && cluster.length >= 2) {
            // Gérer le combo
            const timeSinceLastDrop = now - this.lastDropTime;

            if (this.lastDropCategory === categories[0] && timeSinceLastDrop < 3000) {
                this.currentCombo++;
            } else {
                this.currentCombo = 1;
            }

            this.lastDropCategory = categories[0];
            this.lastDropTime = now;

            // Appliquer les bonus de combo
            const combo2 = this.synergyUpgrades.find(u => u.id === 'combo1');
            const combo3 = this.synergyUpgrades.find(u => u.id === 'combo2');

            if (combo3 && combo3.purchased && this.currentCombo >= 5) {
                comboBonus = 3;
            } else if (combo2 && combo2.purchased && this.currentCombo >= 3) {
                comboBonus = 2;
            }

            // Bonus de cluster
            if (cluster.length >= 3) {
                comboBonus *= (1 + (cluster.length - 3) * 0.1); // +10% par numéro au-dessus de 3
            }

            // Reset combo timer
            if (this.comboTimer) clearTimeout(this.comboTimer);
            this.comboTimer = setTimeout(() => {
                this.currentCombo = 0;
                this.lastDropCategory = null;
            }, 3000);
        } else {
            // Reset combo si pas de cluster ou catégories différentes
            this.currentCombo = 0;
            this.lastDropCategory = null;
        }

        totalReward = Math.floor(totalReward * comboBonus);

        if (allCorrect && totalReward > 0) {
            this.dataPoints += totalReward;
            this.quotaProgress += totalReward;

            let message = `+${totalReward} DP`;
            if (cluster.length > 1) {
                message += ` (x${cluster.length})`;
            }
            if (comboBonus > 1) {
                message += ` COMBO x${this.currentCombo}! (×${comboBonus.toFixed(1)})`;
            }

            this.showToast(message);
        } else if (!allCorrect) {
            this.showToast(`Incorrect! Précision réduite`, true);
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
        // Identifiers
        if (this.identifierCount > 0) {
            const scanRate = this.identifierCount * 0.5 * deltaTime;
            const unidentified = this.grid.filter(c => !c.isEmpty && c.state === 'unidentified');
            const toScan = Math.min(unidentified.length, Math.floor(scanRate));

            for (let i = 0; i < toScan; i++) {
                unidentified[i].state = 'identified';
            }
        }

        // Sorters
        if (this.sorterCount > 0) {
            const sortRate = this.sorterCount * 0.33 * deltaTime;
            const identified = this.grid.filter(c => !c.isEmpty && c.state === 'identified');
            const toSort = Math.min(identified.length, Math.floor(sortRate));

            for (let i = 0; i < toSort; i++) {
                const cell = identified[i];
                this.sortCluster([cell], cell.category);
            }
        }

        // Macros
        if (this.macroCount > 0) {
            const macroRate = this.macroCount * 0.8 * deltaTime;
            const any = this.grid.filter(c => !c.isEmpty);
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
        this.showNotification(`Acheté: ${item.name}`);
    }

    purchaseUpgrade(upgrade) {
        if (this.dataPoints < upgrade.cost || upgrade.purchased) return;

        this.dataPoints -= upgrade.cost;
        upgrade.purchased = true;
        if (upgrade.effect) upgrade.effect();

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
        this.scanSpeed = 1500;
        this.scanRadius = 60;
        this.scanZoneLevel = 1;
        this.clusterSize = 1;
        this.respawnTime = 2000;
        this.identifierCount = 0;
        this.sorterCount = 0;
        this.macroCount = 0;

        this.calculatePassiveGeneration();
        this.renderShop();

        this.showNotification(`SEVERANCE: +${cpGained} Conformity Points`);
    }

    // ===== GAME LOOP =====
    gameLoop() {
        const now = Date.now();
        const deltaTime = (now - this.lastUpdate) / 1000;
        this.lastUpdate = now;

        // Passive generation
        if (this.passiveGeneration > 0) {
            this.dataPoints += this.passiveGeneration * deltaTime;
        }

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

    // ===== RENDERING =====
    render() {
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        const time = Date.now() / 1000;

        // Draw scan zone
        if (!this.isDragging) {
            this.ctx.save();
            this.ctx.strokeStyle = 'rgba(0, 255, 65, 0.3)';
            this.ctx.lineWidth = 2;
            this.ctx.setLineDash([5, 5]);
            this.ctx.beginPath();
            this.ctx.arc(this.mouseX, this.mouseY, this.scanRadius, 0, Math.PI * 2);
            this.ctx.stroke();
            this.ctx.setLineDash([]);
            this.ctx.restore();
        }

        // Draw grid
        this.grid.forEach(cell => {
            if (cell.isEmpty) return;

            const x = cell.gridX * this.cellWidth + this.cellWidth / 2;
            const y = cell.gridY * this.cellHeight + this.cellHeight / 2;

            // Wiggle effect
            const wiggleX = Math.sin(time * 2 + cell.wiggleOffset) * 2;
            const wiggleY = Math.cos(time * 2.5 + cell.wiggleOffset) * 2;

            this.ctx.save();
            this.ctx.translate(x + wiggleX, y + wiggleY);

            if (cell.state === 'unidentified' || cell.state === 'scanning') {
                // [???]
                this.ctx.fillStyle = cell.state === 'scanning' ? '#00ff41' : '#00aa2b';
                this.ctx.font = 'bold 14px "IBM Plex Mono", monospace';
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';
                this.ctx.fillText('[???]', 0, 0);

                // Scan progress
                if (cell.scanProgress > 0) {
                    this.ctx.strokeStyle = '#00ff41';
                    this.ctx.lineWidth = 2;
                    this.ctx.beginPath();
                    this.ctx.arc(0, 0, 25, -Math.PI / 2, -Math.PI / 2 + (cell.scanProgress * Math.PI * 2));
                    this.ctx.stroke();
                }
            } else if (cell.state === 'identified' || cell.state === 'selected') {
                // Identified number
                const category = this.categories[cell.category];
                this.ctx.fillStyle = category.color;
                this.ctx.font = 'bold 16px "IBM Plex Mono", monospace';
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';
                this.ctx.fillText(cell.value.toString(), 0, 0);

                // Border for selected
                if (cell.state === 'selected') {
                    this.ctx.strokeStyle = category.color;
                    this.ctx.lineWidth = 3;
                    this.ctx.shadowColor = category.color;
                    this.ctx.shadowBlur = 15;
                    this.ctx.beginPath();
                    this.ctx.arc(0, 0, 22, 0, Math.PI * 2);
                    this.ctx.stroke();
                    this.ctx.shadowBlur = 0;
                }
            }

            this.ctx.restore();
        });

        // Draw selected cluster being dragged
        if (this.isDragging && this.selectedCluster.length > 0) {
            this.ctx.save();
            this.ctx.translate(this.mouseX, this.mouseY);

            this.selectedCluster.forEach((cell, index) => {
                const offsetX = (index % 3) * 30 - 30;
                const offsetY = Math.floor(index / 3) * 30;

                const category = this.categories[cell.category];
                this.ctx.fillStyle = category.color;
                this.ctx.font = 'bold 18px "IBM Plex Mono", monospace';
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';

                this.ctx.shadowColor = category.color;
                this.ctx.shadowBlur = 20;
                this.ctx.fillText(cell.value.toString(), offsetX, offsetY);
            });

            this.ctx.shadowBlur = 0;
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

        const filled = this.grid.filter(c => !c.isEmpty).length;
        document.getElementById('terminalLoad').textContent = `Load: ${filled}/${this.grid.length}`;

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
