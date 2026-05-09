// ==================================================
// LUMON INDUSTRIES - MDR TERMINAL v5.0
// THE ULTIMATE UPDATE - La Plus Grande Mise à Jour
// ==================================================

// ===== CONSTANTS =====
const GAME_CONSTANTS = {
    // Grid
    GRID_COLS: 10,
    GRID_ROWS: 20,
    GRID_FILL_RATIO: 0.6,

    // Scan
    SCAN_SPEED_INITIAL: 2000,
    SCAN_RADIUS_INITIAL: 25,

    // Combo
    COMBO_DECAY_MS: 6000, // Increased from 4000 to 6000

    // Respawn
    RESPAWN_TIME_MS: 1500,

    // Automation Rates (per second)
    IDENTIFIER_RATE: 0.5,
    SORTER_RATE: 0.5, // Increased from 0.33
    MACRO_RATE: 0.8,

    // Currency Generation
    FREE_TIME_PER_SEC: 0.025, // Increased from 0.016 (~1.5 FT/min)

    // Outie
    OUTIE_TIME_INTERVAL: 120, // 2 minutes

    // Severance
    SEVERANCE_THRESHOLD: 100000,
    SEVERANCE_CP_RATIO: 10000
};

class LumonMDRGame {
    constructor() {
        // ===== CORE CURRENCIES =====
        this.dataPoints = 0;
        this.conformityPoints = 0;
        this.freeTime = 0;
        this.freeTimeGeneration = GAME_CONSTANTS.FREE_TIME_PER_SEC;

        // ===== PASSIVE vs ACTIVE GENERATION =====
        this.passiveGeneration = 0;
        this.activePower = 1;

        // ===== REFINING STATS =====
        this.totalRefined = 0;
        this.correctSorts = 0;
        this.incorrectSorts = 0;

        // ===== OUTIE TIME SYSTEM =====
        this.playTimeSeconds = 0;
        this.lastOutieTime = 0;
        this.outieTimeInterval = 120; // 2 minutes
        this.canAccessOutie = false;
        this.outieNotificationShown = false;

        // ===== GRID SYSTEM =====
        this.gridCols = GAME_CONSTANTS.GRID_COLS;
        this.gridRows = GAME_CONSTANTS.GRID_ROWS;
        this.grid = [];
        this.allCells = [];

        // ===== SCAN MECHANICS =====
        this.scanSpeed = GAME_CONSTANTS.SCAN_SPEED_INITIAL;
        this.scanRadius = GAME_CONSTANTS.SCAN_RADIUS_INITIAL;
        this.scanZoneLevel = 1;

        // ===== CLUSTER MECHANICS =====
        this.clusterSize = 1;

        // ===== RESPAWN MECHANICS =====
        this.respawnTime = GAME_CONSTANTS.RESPAWN_TIME_MS;
        this.emptySlots = [];

        // ===== COMBO SYSTEM =====
        this.currentCombo = 0;
        this.maxCombo = 0;
        this.comboTimer = null;
        this.lastDropCategory = null;
        this.lastDropTime = 0;
        this.comboDecayTime = GAME_CONSTANTS.COMBO_DECAY_MS;

        // ===== v6.0: DAY/TIME MANAGEMENT =====
        this.currentDay = 1;
        this.dayPhase = 'work'; // 'work' or 'evening'
        this.workStartTime = null;
        this.workDuration = 8 * 3600000; // 8h en ms
        this.eveningHours = 7; // 17h-00h = 7h disponibles
        this.eveningStartTime = null;

        // ===== v6.0: FATIGUE SYSTEM =====
        this.fatigue = 0; // 0-100
        this.maxFatigue = 100;
        this.fatigueRate = 0.2; // Base rate per second (manual actions increase this)
        this.lastActionTime = 0;

        // ===== v6.0: NEEDS SYSTEM (Outie wellbeing) =====
        this.needs = {
            hunger: 50,    // 0-100, 50 = neutral
            energy: 100,   // Start day full energy
            happiness: 50,
            fitness: 50
        };

        // ===== v6.0: WORK QUALITY TRACKING =====
        this.sessionStartDP = 0;
        this.sessionQuotaStart = 0;
        this.sessionAccuracy = 0;
        this.workQualityScore = 0;

        // ===== CATEGORY SYSTEM =====
        this.categoryStats = { woe: 0, frolic: 0, dread: 0, malice: 0 };
        this.categories = {
            woe: {
                ranges: [[1, 25], [666, 669]],
                color: '#ff3366',
                multiplier: 1.6, // Increased from 1.5
                name: 'WOE',
                lore: 'Tristesse et mélancolie. Ces nombres portent le poids des regrets.'
            },
            frolic: {
                ranges: [[26, 50], [100, 111]],
                color: '#ffdd33',
                multiplier: 1.5, // Increased from 1.3
                name: 'FROLIC',
                lore: 'Joie et légèreté. L\'essence du bonheur innocent.'
            },
            dread: {
                ranges: [[51, 75], [200, 222]],
                color: '#9933ff',
                multiplier: 1.8, // Decreased from 2.0
                name: 'DREAD',
                lore: 'Peur et angoisse. Ce qui nous terrasse dans l\'ombre.'
            },
            malice: {
                ranges: [[76, 99], [300, 333]],
                color: '#ff8800',
                multiplier: 1.7, // Decreased from 1.8
                name: 'MALICE',
                lore: 'Colère et rancœur. La flamme de la vengeance.'
            }
        };

        // ===== QUOTA SYSTEM =====
        this.currentQuota = 500;
        this.quotaProgress = 0;
        this.quotaLevel = 1;

        // ===== AUTOMATION COUNTS =====
        this.identifierCount = 0;
        this.sorterCount = 0;
        this.macroCount = 0;

        // Automation accumulators (for sub-1 rates)
        this.identifierAccum = 0;
        this.sorterAccum = 0;
        this.macroAccum = 0;

        // ===== WORLD STATE =====
        this.currentWorld = 'innie';

        // ===== OUTIE HOUSING =====
        this.housingItems = [
            { id: 'bed', icon: '🛏️', name: 'Lit Confortable', cost: 5, owned: false, boost: 0.05 },
            { id: 'plant', icon: '🪴', name: 'Plante d\'Intérieur', cost: 3, owned: false, boost: 0.02 },
            { id: 'sofa', icon: '🛋️', name: 'Canapé Moelleux', cost: 8, owned: false, boost: 0.08 },
            { id: 'tv', icon: '📺', name: 'Télévision', cost: 12, owned: false, boost: 0.10 },
            { id: 'bookshelf', icon: '📚', name: 'Bibliothèque', cost: 10, owned: false, boost: 0.09 },
            { id: 'art', icon: '🖼️', name: 'Œuvre d\'Art', cost: 20, owned: false, boost: 0.15 },
            { id: 'piano', icon: '🎹', name: 'Piano', cost: 30, owned: false, boost: 0.20 }
        ];

        // ===== v6.0: OUTIE ACTIVITIES (avec timeCost + needs effects) =====
        this.activities = [
            // MANGER (obligatoire)
            {
                id: 'fast_food',
                icon: '🍔',
                name: 'Fast Food',
                timeCost: 0.5,
                ftCost: 2,
                effects: { hunger: 30, happiness: -5 },
                description: '30min - Rapide mais pas top'
            },
            {
                id: 'cuisiner',
                icon: '🍳',
                name: 'Cuisiner',
                timeCost: 1,
                ftCost: 4,
                effects: { hunger: 60, happiness: 10 },
                description: '1h - Bon repas maison'
            },

            // DÉTENTE (happiness)
            {
                id: 'tv',
                icon: '📺',
                name: 'Regarder TV',
                timeCost: 1.5,
                ftCost: 0,
                effects: { happiness: 20, energy: -10 },
                description: '1.5h - Divertissement basique'
            },
            {
                id: 'netflix',
                icon: '📺',
                name: 'Netflix Binge',
                timeCost: 2,
                ftCost: 2,
                effects: { happiness: 35 },
                description: '2h - Séries et films',
                requires: 'tv_tier_1'
            },

            // SPORT (fitness)
            {
                id: 'jogging',
                icon: '🏃',
                name: 'Jogging',
                timeCost: 1,
                ftCost: 0,
                effects: { fitness: 15, energy: -15 },
                description: '1h - Cardio basique'
            },
            {
                id: 'gym',
                icon: '🏋️',
                name: 'Musculation',
                timeCost: 2,
                ftCost: 3,
                effects: { fitness: 35, energy: -25, happiness: 10 },
                description: '2h - Workout complet',
                requires: 'gym_tier_1'
            },

            // SOCIAL (happiness)
            {
                id: 'cafe_amis',
                icon: '☕',
                name: 'Café avec Amis',
                timeCost: 2,
                ftCost: 5,
                effects: { happiness: 40 },
                description: '2h - Socialiser'
            },

            // REPOS
            {
                id: 'sieste',
                icon: '😴',
                name: 'Sieste (1h)',
                timeCost: 1,
                ftCost: 0,
                effects: { energy: 30, fatigue: -20 },
                description: '1h - Récupération rapide'
            },

            // SLEEP (special - ends day)
            {
                id: 'sleep',
                icon: '🛌',
                name: 'Dormir',
                timeCost: 0,
                ftCost: 0,
                effects: { END_DAY: true },
                description: 'Termine la journée'
            }
        ];

        // Active bonuses from Outie
        this.outieBonuses = {
            scanSpeedMult: 1,
            powerBonus: 0,
            comboMult: 1,
            passiveMult: 1,
            clusterBonus: 0
        };

        // ===== DEPARTMENT ITEMS =====
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
                id: 'analyste',
                icon: '📊',
                name: 'Analyste',
                description: 'Génère 1 DP/sec',
                baseCost: 150,
                baseProduction: 1,
                count: 0,
                costMultiplier: 1.13
            },
            {
                id: 'identifier',
                icon: '🔍',
                name: 'Identifier Auto',
                description: 'Scanne 1 numéro/2s',
                baseCost: 500,
                baseProduction: 5,
                count: 0,
                costMultiplier: 1.13,
                special: 'identifier'
            },
            {
                id: 'sorter',
                icon: '📊',
                name: 'Sorter Auto',
                description: 'Trie 1 numéro/3s',
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
                description: 'Booste département',
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

        // ===== ACTIVE UPGRADES =====
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

        // ===== SYNERGY UPGRADES =====
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
                description: '+60% adjacents même catégorie',
                cost: 5000,
                purchased: false
            },
            {
                id: 'cluster_bonus',
                icon: '✨',
                name: 'Bonus Cluster',
                description: '+20% par numéro (>2)',
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

        // ===== CONFORMITY POINTS SHOP =====
        this.cpUpgrades = [
            {
                id: 'cp1',
                icon: '💎',
                name: 'Démarrage Rapide',
                description: 'Commencer chaque session avec 1000 DP',
                cost: 10,
                purchased: false
            },
            {
                id: 'cp2',
                icon: '⚡',
                name: 'Efficacité Passive',
                description: 'Production passive permanente +50%',
                cost: 15,
                purchased: false
            },
            {
                id: 'cp3',
                icon: '🔍',
                name: 'Automation Précoce',
                description: 'Commencer avec 1 Identifier',
                cost: 20,
                purchased: false
            },
            {
                id: 'cp4',
                icon: '⏰',
                name: 'Temps Libre Accru',
                description: 'Génération FT permanente +100%',
                cost: 25,
                purchased: false
            },
            {
                id: 'cp5',
                icon: '💥',
                name: 'Maître du Combo',
                description: 'Decay combo 6s → 9s',
                cost: 30,
                purchased: false
            }
        ];

        // ===== TUTORIAL =====
        this.tutorialComplete = false;

        // ===== AUTOMATION FEEDBACK =====
        this.identifierFeedbackAccum = 0;
        this.sorterFeedbackAccum = 0;
        this.macroFeedbackAccum = 0;

        // ===== CANVAS SETUP =====
        this.canvas = document.getElementById('terminalCanvas');
        this.ctx = this.canvas.getContext('2d');

        // DOM CACHE for performance
        this.dom = {
            dataPoints: document.getElementById('dataPoints'),
            dpPerSec: document.getElementById('dpPerSec'),
            activePower: document.getElementById('activePower'),
            conformityPoints: document.getElementById('conformityPoints'),
            scanSpeed: document.getElementById('scanSpeed'),
            identifierCount: document.getElementById('identifierCount'),
            sorterCount: document.getElementById('sorterCount'),
            macroCount: document.getElementById('macroCount'),
            accuracy: document.getElementById('accuracy'),
            totalRefined: document.getElementById('totalRefined'),
            woeCount: document.getElementById('woeCount'),
            frolicCount: document.getElementById('frolicCount'),
            dreadCount: document.getElementById('dreadCount'),
            maliceCount: document.getElementById('maliceCount'),
            quotaFill: document.getElementById('quotaFill'),
            quotaText: document.getElementById('quotaText'),
            terminalLoad: document.getElementById('terminalLoad'),
            severanceBtn: document.getElementById('severanceBtn'),
            freeTime: document.getElementById('freeTime')
        };

        this.resizeCanvas();

        this.mouseX = 0;
        this.mouseY = 0;
        this.cellWidth = 0;
        this.cellHeight = 0;

        // ===== INITIALIZE =====
        this.initializeGrid();
        this.bindEvents();
        this.initializeUI();
        this.renderShop();
        this.renderOutieUI();

        // ===== START GAME LOOP =====
        this.lastUpdate = Date.now();

        // v6.0: Start day cycle
        this.startDay();

        this.gameLoop();
    }

    // ===== GRID INITIALIZATION =====
    initializeGrid() {
        this.grid = [];
        this.allCells = [];

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

    resizeCanvas() {
        const rect = this.canvas.parentElement.getBoundingClientRect();

        // OPTIMIZED v5.0: Check if dimensions actually changed before resizing
        if (this.canvas.width === rect.width && this.canvas.height === rect.height) {
            return; // No resize needed, avoid unnecessary redraws
        }

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
            btn.addEventListener('click', (e) => {
                const world = e.target.closest('.world-btn').dataset.world;
                if (world) this.switchWorld(world);
            });
        });

        document.querySelectorAll('.shop-tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchShopTab(e.target.closest('[data-shop-tab]').dataset.shopTab));
        });

        document.getElementById('severanceBtn').addEventListener('click', () => this.performSeverance());

        // Outie return button
        const returnBtn = document.getElementById('returnToWorkBtn');
        if (returnBtn) {
            returnBtn.addEventListener('click', () => this.switchWorld('innie'));
        }

        window.addEventListener('resize', () => this.resizeCanvas());
    }

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
            const cluster = this.selectCluster(cell);
            const category = cell.category;
            this.sortCluster(cluster, category);
        }
    }

    handleMouseLeave() {}

    // ===== SCANNING (FIXED) =====
    scanNumbersInRadius() {
        const now = Date.now();
        const persistentScan = this.techTree.find(t => t.id === 'tech2')?.purchased;
        const effectiveScanSpeed = this.scanSpeed * this.outieBonuses.scanSpeedMult;

        // OPTIMIZED v5.0: Use squared distance to avoid Math.sqrt()
        const radiusSq = this.scanRadius * this.scanRadius;

        for (const cell of this.allCells) {
            if (cell.isEmpty) continue;

            // Skip if already identified
            if (cell.state === 'identified') continue;

            const cellCenterX = cell.gridX * this.cellWidth + this.cellWidth / 2;
            const cellCenterY = cell.gridY * this.cellHeight + this.cellHeight / 2;

            const distSq = (this.mouseX - cellCenterX) ** 2 +
                           (this.mouseY - cellCenterY) ** 2;

            const inRadius = distSq <= radiusSq;

            if (inRadius || (persistentScan && cell.state === 'scanning')) {
                if (cell.state === 'unidentified') {
                    cell.state = 'scanning';
                    if (!cell.scanStartTime) {
                        cell.scanStartTime = now;
                    }
                }

                if (cell.state === 'scanning') {
                    const elapsed = now - cell.scanStartTime;
                    cell.scanProgress = Math.min(1, elapsed / effectiveScanSpeed);

                    if (cell.scanProgress >= 1) {
                        cell.state = 'identified';
                        cell.scanProgress = 0;
                        cell.scanStartTime = null;
                    }
                }
            } else {
                if (cell.state === 'scanning' && !persistentScan) {
                    cell.state = 'unidentified';
                    cell.scanProgress = 0;
                    cell.scanStartTime = null;
                }
            }
        }
    }

    // ===== CLUSTER SELECTION =====
    selectCluster(startCell) {
        const maxCluster = this.clusterSize + this.outieBonuses.clusterBonus;
        const cluster = [startCell];
        const visited = new Set([startCell.id]);
        const queue = [startCell];

        while (queue.length > 0 && cluster.length < maxCluster) {
            const current = queue.shift();
            const neighbors = this.getNeighbors(current.gridX, current.gridY);

            for (const neighbor of neighbors) {
                if (visited.has(neighbor.id)) continue;
                if (neighbor.isEmpty || neighbor.state !== 'identified') continue;

                visited.add(neighbor.id);
                cluster.push(neighbor);
                queue.push(neighbor);

                if (cluster.length >= maxCluster) break;
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

    // ===== SORTING =====
    sortCluster(cluster, binCategory) {
        const now = Date.now();

        // v6.0: Track active player action (for fatigue calculation)
        this.lastActionTime = now;

        let totalReward = 0;
        let allCorrect = true;

        cluster.forEach(cell => {
            const correct = cell.category === binCategory;

            if (correct) {
                const multiplier = this.categories[cell.category].multiplier;
                const effectivePower = this.activePower + this.outieBonuses.powerBonus;
                const reward = Math.floor(effectivePower * multiplier);
                totalReward += reward;
                this.categoryStats[cell.category]++;
                this.correctSorts++;
            } else {
                allCorrect = false;
                this.incorrectSorts++;
            }

            this.totalRefined++;

            cell.isEmpty = true;
            cell.value = null;
            cell.category = null;
            cell.state = 'empty';
            cell.scanProgress = 0;
            cell.scanStartTime = null;

            this.emptySlots.push({ cell: cell, emptyTime: now });
        });

        // COMBO SYSTEM
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

            comboBonus *= this.outieBonuses.comboMult;

            const clusterBonusUpgrade = this.synergyUpgrades.find(u => u.id === 'cluster_bonus');
            if (clusterBonusUpgrade && clusterBonusUpgrade.purchased && cluster.length >= 3) {
                comboBonus *= (1 + (cluster.length - 2) * 0.2);
            }

            if (this.comboTimer) {
                clearTimeout(this.comboTimer);
                this.comboTimer = null;
            }
            this.comboTimer = setTimeout(() => {
                this.currentCombo = 0;
                this.lastDropCategory = null;
                this.comboTimer = null;
            }, this.comboDecayTime);
        } else {
            // FIXED: Clear timer in else branch too (was memory leak)
            if (this.comboTimer) {
                clearTimeout(this.comboTimer);
                this.comboTimer = null;
            }
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

    // ===== RESPAWN =====
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
        // IDENTIFIER - Auto-identify unidentified numbers
        if (this.identifierCount > 0) {
            const scanRate = this.identifierCount * GAME_CONSTANTS.IDENTIFIER_RATE;
            this.identifierAccum += scanRate * deltaTime;

            let scannedCount = 0;
            while (this.identifierAccum >= 1) {
                const unidentified = this.allCells.filter(c => !c.isEmpty && c.state === 'unidentified');
                if (unidentified.length > 0) {
                    unidentified[0].state = 'identified';
                    this.identifierAccum -= 1;
                    scannedCount++;
                } else {
                    this.identifierAccum = 0;
                    break;
                }
            }

            // Feedback accumulator for toasts
            if (scannedCount > 0) {
                this.identifierFeedbackAccum += scannedCount;
                if (this.identifierFeedbackAccum >= 5) {
                    this.showToast(`🔍 ${this.identifierFeedbackAccum} nombres identifiés`);
                    this.identifierFeedbackAccum = 0;
                }
            }
        }

        // SORTER - Auto-sort identified numbers
        if (this.sorterCount > 0) {
            const sortRate = this.sorterCount * GAME_CONSTANTS.SORTER_RATE; // INCREASED from 0.33 to 0.5
            this.sorterAccum += sortRate * deltaTime;

            let sortedCount = 0;
            while (this.sorterAccum >= 1) {
                const identified = this.allCells.filter(c => !c.isEmpty && c.state === 'identified');
                if (identified.length > 0) {
                    const cell = identified[0];
                    this.sortCluster([cell], cell.category);
                    this.sorterAccum -= 1;
                    sortedCount++;
                } else {
                    this.sorterAccum = 0;
                    break;
                }
            }

            // Feedback accumulator for toasts
            if (sortedCount > 0) {
                this.sorterFeedbackAccum += sortedCount;
                if (this.sorterFeedbackAccum >= 5) {
                    this.showToast(`📦 ${this.sorterFeedbackAccum} nombres triés`);
                    this.sorterFeedbackAccum = 0;
                }
            }
        }

        // MACRO - Auto-process everything
        if (this.macroCount > 0) {
            const macroRate = this.macroCount * GAME_CONSTANTS.MACRO_RATE;
            this.macroAccum += macroRate * deltaTime;

            let macroCount = 0;
            while (this.macroAccum >= 1) {
                const any = this.allCells.filter(c => !c.isEmpty);
                if (any.length > 0) {
                    const cell = any[0];
                    if (cell.state === 'unidentified') {
                        cell.state = 'identified';
                    }
                    if (cell.state === 'identified') {
                        this.sortCluster([cell], cell.category);
                    }
                    this.macroAccum -= 1;
                    macroCount++;
                } else {
                    this.macroAccum = 0;
                    break;
                }
            }

            // Feedback accumulator for toasts
            if (macroCount > 0) {
                this.macroFeedbackAccum += macroCount;
                if (this.macroFeedbackAccum >= 10) {
                    this.showToast(`🤖 ${this.macroFeedbackAccum} nombres macro-traités`);
                    this.macroFeedbackAccum = 0;
                }
            }
        }
    }

    // ===== OUTIE TIME SYSTEM =====
    checkOutieTime() {
        // Check if 2 minutes passed
        if (this.playTimeSeconds - this.lastOutieTime >= this.outieTimeInterval) {
            if (!this.canAccessOutie && !this.outieNotificationShown) {
                this.canAccessOutie = true;
                this.outieNotificationShown = true;
                this.showNotification('⏰ Fin de journée ! Temps libre disponible');

                // Highlight Outie button
                const outieBtn = document.querySelector('[data-world="outie"]');
                if (outieBtn) {
                    outieBtn.classList.add('pulse');
                }
            }
        }

        // Also trigger on milestones
        if (this.quotaProgress >= this.currentQuota && !this.canAccessOutie) {
            this.canAccessOutie = true;
            this.showNotification('🎯 Quota atteint ! Temps libre disponible');
        }
    }

    // ===== SHOP SYSTEM (FIXED) =====
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
                        <span class="shop-item-cost">${this.formatNumber(cost)}</span>
                        <button class="shop-item-btn">ACHETER</button>
                    </div>
                `;

                const btn = div.querySelector('button');
                btn.disabled = !affordable;
                btn.addEventListener('click', () => this.purchaseDepartment(item));
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
                    <span class="shop-item-cost">${this.formatNumber(upgrade.cost)}</span>
                    <button class="shop-item-btn">ACHETER</button>
                </div>
            `;

            const btn = div.querySelector('button');
            btn.disabled = !affordable;
            btn.addEventListener('click', () => this.purchaseUpgrade(upgrade));
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

    // ===== CONFORMITY POINTS SHOP v5.0 =====
    purchaseCPUpgrade(upgrade) {
        if (this.conformityPoints < upgrade.cost || upgrade.purchased) return;

        this.conformityPoints -= upgrade.cost;
        upgrade.purchased = true;

        this.applyCPBonuses();
        this.renderCPShop();
        this.showNotification(`✓ ${upgrade.name} (CP)`);
    }

    applyCPBonuses() {
        const cpUpgrades = this.cpUpgrades;

        // cp1: Start with 1000 DP
        if (cpUpgrades.find(u => u.id === 'cp1')?.purchased) {
            this.dataPoints = Math.max(this.dataPoints, 1000);
        }

        // cp3: Start with Identifier
        if (cpUpgrades.find(u => u.id === 'cp3')?.purchased) {
            this.identifierCount = Math.max(this.identifierCount, 1);
        }

        // cp5: Extend combo decay time
        if (cpUpgrades.find(u => u.id === 'cp5')?.purchased) {
            this.comboDecayTime = 9000;
        }

        // Recalculate passive (cp2 + cp4 are multipliers)
        this.calculatePassiveGeneration();
    }

    getCPPassiveMultiplier() {
        // cp2: +50% passive production
        const cp2 = this.cpUpgrades.find(u => u.id === 'cp2');
        return (cp2 && cp2.purchased) ? 1.5 : 1;
    }

    getCPFTMultiplier() {
        // cp4: +100% FT generation
        const cp4 = this.cpUpgrades.find(u => u.id === 'cp4');
        return (cp4 && cp4.purchased) ? 2.0 : 1;
    }

    renderCPShop() {
        const cpList = document.getElementById('cpUpgradesList');
        if (!cpList) return;

        cpList.innerHTML = '';
        this.cpUpgrades.forEach(upgrade => {
            if (upgrade.purchased) return; // Hide purchased

            const affordable = this.conformityPoints >= upgrade.cost;

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
                    <span class="shop-item-cost">${upgrade.cost} CP</span>
                    <button class="shop-item-btn">ACHETER</button>
                </div>
            `;

            const btn = div.querySelector('button');
            btn.disabled = !affordable;
            btn.addEventListener('click', () => this.purchaseCPUpgrade(upgrade));
            cpList.appendChild(div);
        });
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

        total *= this.outieBonuses.passiveMult;

        this.passiveGeneration = total;
    }

    // ===== OUTIE UI =====
    renderOutieUI() {
        // Housing
        const housingContainer = document.getElementById('housingItems');
        if (housingContainer) {
            housingContainer.innerHTML = '';
            this.housingItems.forEach(item => {
                const affordable = this.freeTime >= item.cost;

                const div = document.createElement('div');
                div.className = `activity-card ${item.owned ? 'owned' : ''} ${affordable ? 'affordable' : ''}`;
                div.innerHTML = `
                    <h3>${item.icon} ${item.name}</h3>
                    <p>Bonus production: +${(item.boost * 100).toFixed(0)}%</p>
                    <button class="activity-btn">
                        ${item.owned ? 'POSSÉDÉ' : item.cost + ' FT'}
                    </button>
                `;

                const btn = div.querySelector('button');
                // IMPORTANT: Set disabled as JS property, not HTML attribute
                btn.disabled = item.owned || !affordable;
                if (!item.owned) {
                    btn.addEventListener('click', () => this.purchaseHousing(item));
                }
                housingContainer.appendChild(div);
            });
        }

        // Activities
        const activitiesContainer = document.getElementById('outieActivitiesList');
        if (activitiesContainer) {
            activitiesContainer.innerHTML = '';
            this.activities.forEach(activity => {
                const affordable = this.freeTime >= activity.ftCost;

                const div = document.createElement('div');
                div.className = `activity-card ${affordable ? 'affordable' : ''}`;
                div.innerHTML = `
                    <h3>${activity.icon} ${activity.name}</h3>
                    <p>${this.getActivityDescription(activity)}</p>
                    <button class="activity-btn">
                        ${activity.ftCost} FT
                    </button>
                `;

                const btn = div.querySelector('button');
                // IMPORTANT: Set disabled as JS property, not HTML attribute
                btn.disabled = !affordable;
                btn.addEventListener('click', () => this.doActivity(activity));
                activitiesContainer.appendChild(div);
            });
        }
    }

    getActivityDescription(activity) {
        const descriptions = {
            'gym': 'Scan 5% plus rapide (temporaire)',
            'dinner': '+2 Puissance active (temporaire)',
            'date': 'Combos +20% (temporaire)',
            'therapy': 'Production passive +10% (temporaire)',
            'book': '+1 Taille cluster (temporaire)'
        };
        return descriptions[activity.id] || activity.bonus;
    }

    purchaseHousing(item) {
        if (this.freeTime < item.cost || item.owned) return;

        this.freeTime -= item.cost;
        item.owned = true;

        // Apply permanent boost
        this.outieBonuses.passiveMult += item.boost;
        this.calculatePassiveGeneration();

        this.renderOutieUI();
        this.showNotification(`🏠 Acheté: ${item.name}`);
    }

    doActivity(activity) {
        // v6.0: Check time budget
        if (this.dayPhase === 'evening') {
            if (this.eveningHours < activity.timeCost) {
                this.showToast('⏰ Pas assez de temps restant!', true);
                return;
            }
        }

        if (this.freeTime < activity.ftCost) {
            this.showToast('💰 Pas assez de FT!', true);
            return;
        }

        // Special case: Sleep ends day
        if (activity.id === 'sleep') {
            this.doSleep();
            return;
        }

        // Consume resources
        if (this.dayPhase === 'evening') {
            this.eveningHours -= activity.timeCost;
        }
        this.freeTime -= activity.ftCost;

        // Apply effects
        if (activity.effects) {
            for (const [key, value] of Object.entries(activity.effects)) {
                if (key === 'fatigue') {
                    this.fatigue = Math.max(0, this.fatigue + value);
                } else if (this.needs.hasOwnProperty(key)) {
                    this.needs[key] += value;
                }
            }
            this.clampNeeds();
        }

        this.showNotification(`✓ ${activity.name} (-${activity.timeCost}h)`);
        this.updateEveningClock();
        this.renderOutieUI();

        // Auto sleep if no time left
        if (this.eveningHours <= 0) {
            this.showNotification('⏰ Minuit! Il est temps de dormir.');
            setTimeout(() => this.doSleep(), 2000);
        }
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

        // Update button states
        document.querySelectorAll('.world-btn').forEach(btn => btn.classList.remove('active', 'pulse'));
        const activeBtn = document.querySelector(`[data-world="${world}"]`);
        if (activeBtn) activeBtn.classList.add('active');

        const gameContainer = document.querySelector('.game-container');
        const outieWorld = document.getElementById('outieWorld');

        if (world === 'outie') {
            if (!this.canAccessOutie) {
                this.showToast('Temps libre pas encore disponible', true);
                return;
            }
            gameContainer.style.display = 'none';
            outieWorld.classList.remove('hidden');
            this.outieNotificationShown = false;
            this.renderOutieUI();
        } else {
            gameContainer.style.display = 'grid';
            outieWorld.classList.add('hidden');

            // FIXED v5.0: Reset activity bonuses when returning to Innie
            const housingBonus = this.housingItems
                .filter(h => h.owned)
                .reduce((sum, h) => sum + h.boost, 0);

            this.outieBonuses = {
                scanSpeedMult: 1,
                powerBonus: 0,
                comboMult: 1,
                passiveMult: 1 + housingBonus, // Keep permanent housing bonuses
                clusterBonus: 0
            };

            this.calculatePassiveGeneration();

            // Reset for next time
            this.canAccessOutie = false;
            this.lastOutieTime = this.playTimeSeconds;
        }
    }

    performSeverance() {
        if (this.dataPoints < 100000) return;

        const cpGained = Math.floor(this.dataPoints / 10000);
        this.conformityPoints += cpGained;

        this.dataPoints = 0;
        this.initializeGrid();
        this.departmentItems.forEach(item => item.count = 0);
        this.activeUpgrades.forEach(up => up.purchased = false);
        this.synergyUpgrades.forEach(up => up.purchased = false);
        this.techTree.forEach(up => up.purchased = false);

        this.activePower = 1;
        this.scanSpeed = 2000;
        this.scanRadius = 25;
        this.scanZoneLevel = 1;
        this.clusterSize = 1;
        this.respawnTime = 1500;
        this.identifierCount = 0;
        this.sorterCount = 0;
        this.macroCount = 0;
        this.currentCombo = 0;
        this.maxCombo = 0;

        // Reset Outie bonuses
        this.outieBonuses = {
            scanSpeedMult: 1,
            powerBonus: 0,
            comboMult: 1,
            passiveMult: 1,
            clusterBonus: 0
        };

        this.calculatePassiveGeneration();
        this.renderShop();

        this.showNotification(`SEVERANCE: +${cpGained} CP`);
    }

    // ===== v6.0: DAY CYCLE MANAGEMENT =====

    startDay() {
        this.dayPhase = 'work';
        this.workStartTime = Date.now();
        this.fatigue = 0;
        this.sessionStartDP = this.dataPoints;
        this.sessionQuotaStart = this.quotaProgress || 0;

        // Auto switch to Innie
        if (this.currentWorld !== 'innie') {
            this.switchWorld('innie');
        }

        this.showNotification(`☀️ DAY ${this.currentDay} - 08:00 - Journée de travail commence`);
        this.updateWorkClock();
    }

    updateWorkday(deltaTime) {
        if (this.dayPhase !== 'work') return;

        const workElapsed = Date.now() - this.workStartTime;
        const workProgress = workElapsed / this.workDuration;

        // Fatigue increase (faster if active, slower if AFK)
        const isActive = this.isPlayerActive();
        const fatigueRate = isActive ? 0.3 : 0.15; // per second
        this.fatigue += fatigueRate * deltaTime;

        // Fatigue cap
        if (this.fatigue > this.maxFatigue) {
            this.fatigue = this.maxFatigue;
        }

        // Check end conditions
        if (this.fatigue >= this.maxFatigue) {
            this.showNotification('😴 EXHAUSTION - Fatigue maximale atteinte');
            this.endWorkday();
        } else if (workElapsed >= this.workDuration) {
            this.showNotification('🕔 17:00 - Fin de journée');
            this.endWorkday();
        }

        this.updateWorkClock();
    }

    endWorkday() {
        this.dayPhase = 'evening';

        // Calculate Work Quality Score
        this.workQualityScore = this.calculateWorkQuality();
        const ftEarned = Math.floor(this.workQualityScore / 10); // 0-10 FT
        this.freeTime += ftEarned;

        // Needs decay from workday
        this.needs.hunger -= 40;
        this.needs.energy -= 30;
        this.needs.happiness -= 20;

        // Clamp needs
        this.clampNeeds();

        // Show workday summary
        this.showWorkdaySummary(ftEarned);

        // Switch to Outie after summary (3 seconds)
        setTimeout(() => {
            this.switchWorld('outie');
            this.startEvening();
        }, 3000);
    }

    calculateWorkQuality() {
        const accuracy = this.totalRefined > 0 ? (this.correctSorts / this.totalRefined) * 100 : 0;
        const quotaRatio = this.currentQuota > 0 ? (this.quotaProgress / this.currentQuota) : 0;
        const comboScore = Math.min(100, this.maxCombo * 5);

        const quality = (accuracy * 0.5) + (quotaRatio * 30) + (comboScore * 0.2);
        return Math.min(100, quality);
    }

    showWorkdaySummary(ftEarned) {
        const accuracy = this.totalRefined > 0 ? ((this.correctSorts / this.totalRefined) * 100).toFixed(1) : 0;
        const quotaMet = this.quotaProgress >= this.currentQuota;

        const summary = `
🏢 FIN DE JOURNÉE

📊 Performance:
- Quota: ${this.quotaProgress} / ${this.currentQuota} ${quotaMet ? '✅' : '❌'}
- Accuracy: ${accuracy}%
- Max Combo: ×${this.maxCombo}

💰 Récompense: +${ftEarned} FT
😴 Fatigue: ${Math.floor(this.fatigue)}%

Quality Score: ${Math.floor(this.workQualityScore)}/100
        `;

        this.showNotification(summary);
    }

    startEvening() {
        this.eveningHours = 7; // 17h-00h
        this.eveningStartTime = Date.now();

        this.showNotification(`🏠 17:00 - Soirée libre (${this.eveningHours}h disponibles)`);
        this.updateEveningClock();
    }

    doSleep() {
        // Reset for next day
        this.needs.energy = 100;
        this.fatigue = 0;
        this.needs.hunger = Math.max(30, this.needs.hunger - 20); // Wake up a bit hungry

        this.currentDay++;
        this.showNotification(`😴 Bonne nuit... Jour ${this.currentDay}`);

        // Auto start next workday
        setTimeout(() => {
            this.startDay();
        }, 2000);
    }

    updateWorkClock() {
        // Calculate current work time (08:00 + elapsed)
        if (!this.workStartTime) return;

        const elapsed = Date.now() - this.workStartTime;
        const hours = 8 + (elapsed / 3600000); // Start at 08:00
        const displayHour = Math.floor(hours);
        const displayMin = Math.floor((hours % 1) * 60);
        const timeStr = `${String(displayHour).padStart(2, '0')}:${String(displayMin).padStart(2, '0')}`;

        // Update UI if element exists
        const clockEl = document.getElementById('workClock');
        if (clockEl) {
            clockEl.textContent = `⏰ ${timeStr} / 17:00`;
        }
    }

    updateEveningClock() {
        // Calculate current evening time (17:00 + spent hours)
        const currentHour = 17 + (7 - this.eveningHours);
        const displayTime = Math.floor(currentHour) + ':' +
                            String(Math.floor((currentHour % 1) * 60)).padStart(2, '0');

        const clockEl = document.getElementById('eveningClock');
        if (clockEl) {
            clockEl.textContent = `⏰ ${displayTime}`;
            clockEl.style.color = this.eveningHours < 2 ? '#ff3366' : '#00ff41';
        }

        // Warning if late
        if (this.eveningHours < 2 && this.eveningHours > 0) {
            this.showToast('⚠️ Il se fait tard... pensez à dormir!');
        }
    }

    isPlayerActive() {
        // Consider active if last action was within 5 seconds
        return (Date.now() - this.lastActionTime) < 5000;
    }

    clampNeeds() {
        for (const key in this.needs) {
            this.needs[key] = Math.max(0, Math.min(100, this.needs[key]));
        }
    }

    getNeedMultiplier(value) {
        // 0-25: Critical penalty (-50%)
        if (value < 25) return 0.5;
        // 25-50: Minor penalty (-20%)
        if (value < 50) return 0.8;
        // 50: Neutral
        if (value === 50) return 1.0;
        // 50-75: Bonus (+15%)
        if (value < 75) return 1.15;
        // 75-100: Major bonus (+30%)
        return 1.3;
    }

    getInnieEfficiency() {
        const hungerMult = this.getNeedMultiplier(this.needs.hunger);
        const energyMult = this.getNeedMultiplier(this.needs.energy);
        const fitnessMult = this.getNeedMultiplier(this.needs.fitness);
        const happinessMult = this.getNeedMultiplier(this.needs.happiness);

        // Fatigue penalty
        let fatigueMult = 1.0;
        if (this.fatigue >= 90) fatigueMult = 0.4;
        else if (this.fatigue >= 70) fatigueMult = 0.65;
        else if (this.fatigue >= 50) fatigueMult = 0.85;
        else if (this.fatigue >= 30) fatigueMult = 0.95;

        return hungerMult * energyMult * fitnessMult * happinessMult * fatigueMult;
    }

    // ===== GAME LOOP =====
    gameLoop() {
        const now = Date.now();
        const deltaTime = (now - this.lastUpdate) / 1000;
        this.lastUpdate = now;

        // Track play time
        this.playTimeSeconds += deltaTime;

        // v6.0: Update workday (fatigue, time tracking)
        if (this.dayPhase === 'work') {
            this.updateWorkday(deltaTime);
        }

        // Generate Free Time
        this.freeTime += this.freeTimeGeneration * deltaTime;

        // v6.0: Apply Innie efficiency (needs + fatigue)
        const efficiency = this.getInnieEfficiency();

        // Passive generation (with efficiency multiplier)
        if (this.passiveGeneration > 0) {
            this.dataPoints += (this.passiveGeneration * deltaTime * efficiency);
        }

        // Only update game if in Innie world
        if (this.currentWorld === 'innie') {
            this.scanNumbersInRadius();
            this.updateRespawn();
            this.updateAutomation(deltaTime);
            this.render();
        }

        // Check Outie Time availability
        this.checkOutieTime();

        // Update UI
        this.updateUI();

        requestAnimationFrame(() => this.gameLoop());
    }

    // ===== RENDERING (FIXED - ??? disappear) =====
    render() {
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        const time = Date.now() / 1000;

        // Draw scan zone
        this.ctx.save();
        this.ctx.strokeStyle = 'rgba(0, 255, 65, 0.4)';
        this.ctx.lineWidth = 3;
        this.ctx.setLineDash([8, 4]);
        this.ctx.beginPath();
        this.ctx.arc(this.mouseX, this.mouseY, this.scanRadius, 0, Math.PI * 2);
        this.ctx.stroke();

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

            const wiggleX = Math.sin(time * 2 + cell.wiggleOffset) * 1.5;
            const wiggleY = Math.cos(time * 2.5 + cell.wiggleOffset) * 1.5;

            this.ctx.save();
            this.ctx.translate(x + wiggleX, y + wiggleY);

            if (cell.state === 'unidentified') {
                // UNIDENTIFIED: Show [???] ONLY
                this.ctx.fillStyle = '#00aa2b';
                this.ctx.font = 'bold 13px "IBM Plex Mono", monospace';
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';
                this.ctx.fillText('[???]', 0, 0);

            } else if (cell.state === 'scanning') {
                // SCANNING: Show progress circle and % (NO [???] to avoid confusion)
                // Progress circle
                this.ctx.strokeStyle = '#00ff41';
                this.ctx.lineWidth = 3;
                this.ctx.beginPath();
                this.ctx.arc(0, 0, 22, -Math.PI / 2, -Math.PI / 2 + (cell.scanProgress * Math.PI * 2));
                this.ctx.stroke();

                // Progress %
                this.ctx.fillStyle = '#00ff41';
                this.ctx.font = 'bold 12px "IBM Plex Mono", monospace';
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';
                this.ctx.fillText(Math.floor(cell.scanProgress * 100) + '%', 0, 0);

            } else if (cell.state === 'identified') {
                // IDENTIFIED: Show number with wiggle (NO [???])
                const category = this.categories[cell.category];
                this.ctx.fillStyle = category.color;
                this.ctx.shadowColor = category.color;
                this.ctx.shadowBlur = 8;
                this.ctx.font = 'bold 17px "IBM Plex Mono", monospace';
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';
                this.ctx.fillText(cell.value.toString(), 0, 0);

                this.ctx.shadowBlur = 0;
                this.ctx.strokeStyle = category.color;
                this.ctx.lineWidth = 1.5;
                this.ctx.beginPath();
                this.ctx.arc(0, 0, 20, 0, Math.PI * 2);
                this.ctx.stroke();
            }

            this.ctx.restore();
        }

        // Draw combo indicator
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
        // OPTIMIZED v5.0: Use cached DOM elements (no getElementById each frame!)
        this.dom.dataPoints.textContent = this.formatNumber(Math.floor(this.dataPoints));
        this.dom.dpPerSec.textContent = this.formatNumber(this.passiveGeneration, 1) + '/sec';
        this.dom.activePower.textContent = (this.activePower + this.outieBonuses.powerBonus) + '/refine';
        this.dom.conformityPoints.textContent = this.conformityPoints;

        this.dom.scanSpeed.textContent = ((this.scanSpeed * this.outieBonuses.scanSpeedMult) / 1000).toFixed(1) + 's';
        this.dom.identifierCount.textContent = this.identifierCount;
        this.dom.sorterCount.textContent = this.sorterCount;
        this.dom.macroCount.textContent = this.macroCount;

        const accuracy = this.totalRefined > 0 ? (this.correctSorts / this.totalRefined * 100) : 100;
        this.dom.accuracy.textContent = accuracy.toFixed(1) + '%';
        this.dom.totalRefined.textContent = this.formatNumber(this.totalRefined);

        this.dom.woeCount.textContent = this.categoryStats.woe;
        this.dom.frolicCount.textContent = this.categoryStats.frolic;
        this.dom.dreadCount.textContent = this.categoryStats.dread;
        this.dom.maliceCount.textContent = this.categoryStats.malice;

        const quotaPercent = Math.min(100, (this.quotaProgress / this.currentQuota) * 100);
        this.dom.quotaFill.style.width = quotaPercent + '%';
        this.dom.quotaText.textContent = `${this.formatNumber(this.quotaProgress)} / ${this.formatNumber(this.currentQuota)}`;

        const filled = this.allCells.filter(c => !c.isEmpty).length;
        this.dom.terminalLoad.textContent = `Load: ${filled}/${this.allCells.length}`;

        this.dom.severanceBtn.disabled = this.dataPoints < GAME_CONSTANTS.SEVERANCE_THRESHOLD;
        this.dom.freeTime.textContent = this.formatNumber(this.freeTime, 1);

        // Update shop button states continuously
        this.updateShopButtons();

        // Update Outie buttons if in Outie world
        if (this.currentWorld === 'outie') {
            this.updateOutieButtons();
        }
    }

    updateOutieButtons() {
        // Update housing buttons
        const housingContainer = document.getElementById('housingItems');
        if (housingContainer) {
            const cards = housingContainer.querySelectorAll('.activity-card');
            cards.forEach((card, index) => {
                if (index < this.housingItems.length) {
                    const item = this.housingItems[index];
                    const affordable = this.freeTime >= item.cost;
                    const btn = card.querySelector('button');
                    if (btn) {
                        btn.disabled = item.owned || !affordable;
                        card.classList.toggle('affordable', affordable && !item.owned);
                    }
                }
            });
        }

        // Update activities buttons
        const activitiesContainer = document.getElementById('outieActivitiesList');
        if (activitiesContainer) {
            const cards = activitiesContainer.querySelectorAll('.activity-card');
            cards.forEach((card, index) => {
                if (index < this.activities.length) {
                    const activity = this.activities[index];
                    const affordable = this.freeTime >= activity.ftCost;
                    const btn = card.querySelector('button');
                    if (btn) {
                        btn.disabled = !affordable;
                        card.classList.toggle('affordable', affordable);
                    }
                }
            });
        }
    }

    updateShopButtons() {
        // Update department items
        const departmentList = document.getElementById('departmentList');
        if (departmentList) {
            const items = departmentList.querySelectorAll('.shop-item');
            items.forEach((item, index) => {
                if (index < this.departmentItems.length) {
                    const deptItem = this.departmentItems[index];
                    const cost = this.getUpgradeCost(deptItem);
                    const affordable = this.dataPoints >= cost;
                    const btn = item.querySelector('button');
                    if (btn) {
                        btn.disabled = !affordable;
                        item.classList.toggle('affordable', affordable);
                    }
                }
            });
        }

        // Update upgrades
        this.updateUpgradeButtons('activeUpgradesList', this.activeUpgrades);
        this.updateUpgradeButtons('synergyUpgradesList', this.synergyUpgrades);
        this.updateUpgradeButtons('techTree', this.techTree);
    }

    updateUpgradeButtons(containerId, upgrades) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const items = container.querySelectorAll('.shop-item');
        const visibleUpgrades = upgrades.filter(u => !u.purchased);

        items.forEach((item, index) => {
            if (index < visibleUpgrades.length) {
                const upgrade = visibleUpgrades[index];
                const affordable = this.dataPoints >= upgrade.cost;
                const btn = item.querySelector('button');
                if (btn) {
                    btn.disabled = !affordable;
                    item.classList.toggle('affordable', affordable);
                }
            }
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
