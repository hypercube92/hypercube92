# 🏢 LUMON INDUSTRIES - MDR TERMINAL
## Brief de Projet Complet

---

## 📋 VUE D'ENSEMBLE

**Type de jeu** : Idle/Incremental Game
**Thème** : Univers de la série TV "Severance" (Lumon Industries)
**Langue** : Français
**Plateforme** : Web (HTML5/Canvas)
**Technologies** : HTML5, CSS3, JavaScript (Vanilla)

---

## 🎯 CONCEPT PRINCIPAL

Un jeu incrémental basé sur le "Macrodata Refinement" (raffinement de macro-données) inspiré de la série Severance. Le joueur incarne un employé de Lumon Industries qui doit identifier et trier des nombres mystérieux en les catégorisant selon leurs propriétés émotionnelles (WOE, FROLIC, DREAD, MALICE).

Le jeu propose un **système dual-world** :
- **INNIE** : Monde du travail (production, efficacité, stress)
- **OUTIE** : Monde extérieur (bien-être, repos, amélioration permanente)

---

## 🎨 DIRECTION ARTISTIQUE

### Aesthetic CRT Terminal Rétro-Futuriste

**Palette de couleurs** :
```
Terminal principal : #000000 (noir profond)
Terminal green : #00ff41 (vert phosphorescent)
Terminal green dim : #00aa2b
Terminal green dark : #005516

Catégories :
- WOE : #ff3366 (rouge-rose)
- FROLIC : #ffdd33 (jaune doré)
- DREAD : #9933ff (violet profond)
- MALICE : #ff8800 (orange brûlant)

Prestige : #66ccff (bleu ciel)
```

**Effets visuels** :
- Scanlines CRT (lignes horizontales répétées tous les 4px)
- Glow effect sur les textes importants (text-shadow avec blur)
- Vignette radiale sur les écrans
- Wiggle animation sur les nombres (Math.sin/cos avec offset)
- Particle effects lors du tri (optionnel)

**Typographie** :
- Police principale : IBM Plex Mono (monospace)
- Tailles : 0.7em à 1.4em selon l'importance
- Letter-spacing : 1-4px pour l'effet rétro

---

## 🎮 MÉCANIQUES DE JEU DÉTAILLÉES

### 1. SYSTÈME DE GRILLE

**Spécifications** :
- Grille fixe : 10 colonnes × 20 lignes = 200 cellules
- Taille canvas adaptative (responsive)
- Taille cellule : calculée dynamiquement (canvas.width / 10)

**États des cellules** :
```javascript
{
    isEmpty: boolean,
    state: 'unidentified' | 'scanning' | 'identified',
    value: number,
    category: 'woe' | 'frolic' | 'dread' | 'malice',
    gridX: number,
    gridY: number,
    wiggleOffset: number, // random pour animation
    scanProgress: 0-1,
    scanStartTime: timestamp
}
```

**Respawn des nombres** :
- Temps de base : 1500ms
- Réductible via upgrades
- Respawn aléatoire dans cellules vides
- Maximum 200 nombres simultanés

### 2. PROCESSUS DE RAFFINEMENT (2 ÉTAPES)

#### ÉTAPE 1 : SCAN (Identification)

**Mécanique** :
- Le joueur survole les `[???]` avec la souris
- Zone d'effet circulaire autour du curseur (rayon initial : 25px)
- Scan continu dans la boucle de jeu (60 FPS)
- Vitesse de scan initiale : 2000ms par nombre
- Barre de progression circulaire + pourcentage

**Rendu visuel** :
```
État UNIDENTIFIED : Afficher [???] en vert dim
État SCANNING : Afficher cercle de progression + % (PAS de [???])
État IDENTIFIED : Afficher nombre coloré avec glow + cercle de catégorie
```

**Formule de scan** :
```javascript
scanProgress = Math.min(1, (Date.now() - scanStartTime) / scanSpeed)
if (scanProgress >= 1) → état devient 'identified'
```

#### ÉTAPE 2 : SORT (Tri)

**Mécanique** :
- Clic sur nombre identifié
- Sélection automatique d'un cluster de nombres adjacents
- Taille de cluster initiale : 1 (upgradeable jusqu'à 15)
- Algorithme BFS pour sélection des adjacents

**Système de cluster (BFS)** :
```javascript
function selectCluster(startCell, maxSize) {
    visited = Set()
    queue = [startCell]
    cluster = [startCell]

    while (queue.length > 0 && cluster.length < maxSize) {
        current = queue.shift()
        neighbors = getNeighbors(current.x, current.y) // 4-directional

        for (neighbor in neighbors) {
            if (neighbor.state === 'identified' && !visited.has(neighbor)) {
                visited.add(neighbor)
                cluster.push(neighbor)
                queue.push(neighbor)
            }
        }
    }

    return cluster
}
```

**Tri et récompenses** :
```javascript
baseValue = 1
categoryMultiplier = {
    woe: 1.5,
    frolic: 1.3,
    dread: 2.0,
    malice: 1.8
}

pointsPerNumber = baseValue * categoryMultiplier * activePower
totalPoints = pointsPerNumber * clusterSize * comboMultiplier
```

### 3. SYSTÈME DE COMBO

**Mécanique** :
- Se déclenche quand on trie plusieurs fois la même catégorie consécutivement
- Timer de decay : 4 secondes sans tri → reset du combo
- Bonus progressif

**Formule** :
```javascript
if (currentCategory === lastCategory && timeSinceLastSort < 4000) {
    combo++
} else {
    combo = 0
}

comboMultiplier = 1 + (combo * 0.05) // +5% par combo
// Exemple : combo 10 = 1.5x
```

### 4. CATÉGORIES DE NOMBRES

**Distribution des catégories** :
```javascript
categories = {
    woe: {
        name: 'WOE',
        color: '#ff3366',
        multiplier: 1.5,
        probability: 0.25
    },
    frolic: {
        name: 'FROLIC',
        color: '#ffdd33',
        multiplier: 1.3,
        probability: 0.25
    },
    dread: {
        name: 'DREAD',
        color: '#9933ff',
        multiplier: 2.0,
        probability: 0.25
    },
    malice: {
        name: 'MALICE',
        color: '#ff8800',
        multiplier: 1.8,
        probability: 0.25
    }
}
```

**Génération de nombres** :
```javascript
function generateNumber() {
    value = Math.floor(Math.random() * 1000)
    category = randomWeighted(categories) // distribution égale
    return { value, category }
}
```

---

## 💎 SYSTÈME DE MONNAIES

### Data Points (DP)
- **Source** : Tri manuel + production passive
- **Usage** : Achats dans le shop Innie (Department, Upgrades, Tech)

### Free Time (FT)
- **Source** : Génération passive (~1 FT/minute = 0.016/sec)
- **Usage** : Achats dans le monde Outie (Housing, Activities)

### Conformity Points (CP) - PRESTIGE
- **Source** : Severance Reset (100,000 DP = 10 CP)
- **Usage** : Bonus permanents post-reset (à implémenter)

---

## 🏪 SYSTÈME DE SHOP (3 TABS)

### TAB 1 : DEPARTMENT (Production Passive)

**Items** :
```javascript
departmentItems = [
    {
        id: 'stagiaire',
        icon: '👤',
        name: 'Stagiaire',
        description: 'Génère 0.1 DP/sec',
        baseCost: 15,
        baseProduction: 0.1,
        costMultiplier: 1.13,
        special: null
    },
    {
        id: 'analyste',
        icon: '📊',
        name: 'Analyste',
        description: 'Génère 1 DP/sec',
        baseCost: 100,
        baseProduction: 1,
        costMultiplier: 1.15,
        special: null
    },
    {
        id: 'identifier',
        icon: '🔍',
        name: 'Identifier',
        description: 'Auto-identifie 0.5 nombres/sec',
        baseCost: 500,
        baseProduction: 5,
        costMultiplier: 1.2,
        special: 'identifier' // incrémente identifierCount
    },
    {
        id: 'sorter',
        icon: '📦',
        name: 'Sorter',
        description: 'Auto-trie 0.33 nombres/sec',
        baseCost: 2000,
        baseProduction: 20,
        costMultiplier: 1.25,
        special: 'sorter' // incrémente sorterCount
    },
    {
        id: 'macro',
        icon: '🤖',
        name: 'Macro Processor',
        description: 'Traite tout : 0.8 nombres/sec',
        baseCost: 10000,
        baseProduction: 100,
        costMultiplier: 1.3,
        special: 'macro' // incrémente macroCount
    }
]
```

**Formule de coût** :
```javascript
cost = baseCost * (costMultiplier ^ count)
```

**Automation** :
```javascript
// Système d'accumulateurs (IMPORTANT pour deltaTime fractionnaire)
identifierAccum += identifierCount * 0.5 * deltaTime
while (identifierAccum >= 1) {
    unidentified[0].state = 'identified'
    identifierAccum -= 1
}

// Idem pour sorter (0.33/sec) et macro (0.8/sec)
```

### TAB 2 : UPGRADES (Boosts Actifs & Synergies)

**Catégories** :

**Active Refining** :
```javascript
[
    { id: 'power1', name: 'Puissance +1', cost: 50, effect: () => activePower += 1 },
    { id: 'power2', name: 'Puissance +2', cost: 200, effect: () => activePower += 2 },
    { id: 'power5', name: 'Puissance +5', cost: 1000, effect: () => activePower += 5 },
    { id: 'scan1', name: 'Scan -20%', cost: 100, effect: () => scanSpeed *= 0.8 },
    { id: 'scan2', name: 'Scan -30%', cost: 500, effect: () => scanSpeed *= 0.7 },
    { id: 'cluster2', name: 'Cluster 2', cost: 300, effect: () => clusterSize = 2 },
    { id: 'cluster4', name: 'Cluster 4', cost: 800, effect: () => clusterSize = 4 },
    { id: 'cluster8', name: 'Cluster 8', cost: 2500, effect: () => clusterSize = 8 },
    { id: 'cluster15', name: 'Cluster 15', cost: 8000, effect: () => clusterSize = 15 }
]
```

**Department Synergies** :
```javascript
[
    {
        id: 'syn1',
        name: 'Synergie Stagiaire',
        description: 'Les Stagiaires produisent +10%',
        cost: 500,
        effect: () => {
            // Appliqué dans calculatePassiveGeneration()
            // total += stagiaire.production * 0.1
        }
    },
    {
        id: 'syn2',
        name: 'Synergie Macro',
        description: 'Les Macros produisent +15%',
        cost: 5000
    }
]
```

**Special Combos** :
```javascript
[
    { id: 'combo1', name: 'Combo Master +10%', cost: 1000, effect: () => comboBaseBonus += 0.1 },
    { id: 'respawn1', name: 'Respawn -20%', cost: 800, effect: () => respawnTime *= 0.8 }
]
```

### TAB 3 : O&D TECH TREE (Optics & Design)

```javascript
techTree = [
    {
        id: 'tech1',
        name: 'Zone Scan +50%',
        description: 'Rayon de scan augmenté',
        cost: 400,
        effect: () => scanRadius *= 1.5
    },
    {
        id: 'tech2',
        name: 'Persistent Scan',
        description: 'Le scan continue hors zone',
        cost: 1500,
        effect: () => persistentScan = true
    },
    {
        id: 'tech3',
        name: 'Category Filter',
        description: 'Affiche la catégorie avant identification',
        cost: 3000
    }
]
```

---

## 🏠 SYSTÈME DUAL-WORLD

### INNIE WORLD (Production)

**Caractéristiques** :
- Focus sur l'efficacité et la production de DP
- Interface 3 colonnes : Stats | Terminal | Shop
- Ambiance stressante (vert terminal, noir profond)
- Mécaniques de travail (scan, tri, quotas)

**Interface** :
```
┌─────────────────────────────────────────────────┐
│  LUMON INDUSTRIES | DP: 1000 | FT: 5 | CP: 0   │
│  [INNIE] [OUTIE]                                 │
├──────────┬───────────────────────┬───────────────┤
│          │                       │               │
│  QUOTA   │   TERMINAL CANVAS    │   SHOP TAB 1  │
│  Stats   │   (Grid 10×20)       │   DEPT        │
│  Categ.  │   [???] [???] 42 87  │   [Items]     │
│          │   135 [???] 23 [???] │               │
│          │                       │   SHOP TAB 2  │
│          │   ┌───┬───┬───┬───┐  │   UPGRADES    │
│          │   │WOE│FRO│DRE│MAL│  │   [Items]     │
│  SEVER.  │   └───┴───┴───┴───┘  │               │
└──────────┴───────────────────────┴───────────────┘
```

### OUTIE WORLD (Bien-être)

**Déclenchement** :
- Automatique après 2 minutes de jeu OU quota atteint
- Bouton OUTIE pulse avec animation dorée
- Notification : "⏰ Fin de journée ! Temps libre disponible"

**Mécanique** :
- Monde séparé (overlay fullscreen)
- Couleurs apaisantes (bleu-violet, moins de vert)
- Pas de timer, exploration libre
- Bouton "Retourner au Bureau" pour revenir

**Interface** :
```
┌────────────────────────────────────────┐
│  🏠 TEMPS LIBRE      FT: 10  [RETOUR]  │
├────────────────────────────────────────┤
│                                        │
│  🏠 HOUSING - Améliorations Permanentes│
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ │
│  │ 🛏️   │ │ 🪴   │ │ 🛋️   │ │ 📺   │ │
│  │ Lit  │ │Plant │ │Canapé│ │  TV  │ │
│  │ +5%  │ │ +2%  │ │ +8%  │ │ +10% │ │
│  │ 5 FT │ │ 3 FT │ │ 8 FT │ │12 FT │ │
│  └──────┘ └──────┘ └──────┘ └──────┘ │
│                                        │
│  ✨ ACTIVITIES - Bonus Temporaires     │
│  ┌──────┐ ┌──────┐ ┌──────┐           │
│  │ 🏋️   │ │ 🍽️   │ │ 💐   │           │
│  │ Gym  │ │Diner │ │ Date │           │
│  │Scan  │ │Power │ │Combo │           │
│  │ 2 FT │ │ 3 FT │ │ 5 FT │           │
│  └──────┘ └──────┘ └──────┘           │
└────────────────────────────────────────┘
```

### HOUSING ITEMS (Permanent)

```javascript
housingItems = [
    { id: 'bed', icon: '🛏️', name: 'Lit Confortable', cost: 5, boost: 0.05 },      // +5% passive
    { id: 'plant', icon: '🪴', name: 'Plante d\'Intérieur', cost: 3, boost: 0.02 },  // +2% passive
    { id: 'sofa', icon: '🛋️', name: 'Canapé Moelleux', cost: 8, boost: 0.08 },      // +8% passive
    { id: 'tv', icon: '📺', name: 'Télévision', cost: 12, boost: 0.10 },           // +10% passive
    { id: 'bookshelf', icon: '📚', name: 'Bibliothèque', cost: 10, boost: 0.09 },  // +9% passive
    { id: 'art', icon: '🖼️', name: 'Œuvre d\'Art', cost: 20, boost: 0.15 },        // +15% passive
    { id: 'piano', icon: '🎹', name: 'Piano', cost: 30, boost: 0.20 }               // +20% passive
]

// Application du bonus
outieBonuses.passiveMult += item.boost  // Additif
passiveGeneration *= outieBonuses.passiveMult
```

### ACTIVITIES (Temporaire)

```javascript
activities = [
    {
        id: 'gym',
        icon: '🏋️',
        name: 'Salle de Sport',
        ftCost: 2,
        bonus: 'scan',
        value: 0.95  // Scan 5% plus rapide
    },
    {
        id: 'dinner',
        icon: '🍽️',
        name: 'Dîner chez Ricken',
        ftCost: 3,
        bonus: 'power',
        value: 2  // +2 puissance active
    },
    {
        id: 'date',
        icon: '💐',
        name: 'Rendez-vous',
        ftCost: 5,
        bonus: 'combo',
        value: 1.2  // Combo ×1.2
    },
    {
        id: 'therapy',
        icon: '🧘',
        name: 'Thérapie',
        ftCost: 4,
        bonus: 'passive',
        value: 1.1  // Passive ×1.1 (temporaire)
    },
    {
        id: 'book',
        icon: '📖',
        name: 'Lire',
        ftCost: 1,
        bonus: 'cluster',
        value: 1  // +1 cluster size
    }
]

// Application des bonus (pas de duration, reset au retour Innie)
outieBonuses = {
    scanSpeedMult: 1,      // multiplié à scanSpeed
    powerBonus: 0,         // ajouté à activePower
    comboMult: 1,          // multiplié au bonus combo
    passiveMult: 1,        // multiplié à passive generation
    clusterBonus: 0        // ajouté à clusterSize
}
```

**Reset des bonus** :
```javascript
// Quand on retourne en Innie, reset activités (pas housing)
switchWorld('innie') {
    outieBonuses.scanSpeedMult = 1
    outieBonuses.powerBonus = 0
    outieBonuses.comboMult = 1
    outieBonuses.passiveMult = 1  // SAUF housing qui s'additionne de façon permanente
    outieBonuses.clusterBonus = 0

    canAccessOutie = false
    lastOutieTime = playTimeSeconds
}
```

---

## 📊 SYSTÈME DE PROGRESSION

### QUOTA SYSTEM

```javascript
quota = {
    current: 500,
    progress: 0,
    level: 1
}

// Chaque tri ajoute au quota
quotaProgress += points

// Au completion
if (quotaProgress >= currentQuota) {
    quotaLevel++
    currentQuota = Math.floor(500 * Math.pow(1.5, quotaLevel))
    quotaProgress = 0

    // Trigger Outie Time
    canAccessOutie = true
}
```

### SEVERANCE RESET (Prestige)

```javascript
performSeverance() {
    if (dataPoints < 100000) return

    conformityPoints += Math.floor(dataPoints / 10000)

    // Reset
    dataPoints = 0
    departmentItems.forEach(i => i.count = 0)
    upgrades.forEach(u => u.purchased = false)

    // Keep Conformity Points et Outie Housing
}
```

---

## 💻 SPÉCIFICATIONS TECHNIQUES

### Architecture du Code

```
game.js
├─ class LumonMDRGame
│  ├─ constructor()        // Initialisation des variables
│  ├─ initializeGrid()     // Création de la grille 10×20
│  ├─ bindEvents()         // Event listeners
│  ├─ gameLoop()           // Boucle principale (requestAnimationFrame)
│  │
│  ├─ Scan & Refining
│  │  ├─ scanNumbersInRadius()
│  │  ├─ handleCanvasClick()
│  │  ├─ selectCluster(cell, maxSize)
│  │  ├─ sortCluster(cluster, category)
│  │
│  ├─ Automation
│  │  ├─ updateAutomation(deltaTime)
│  │  ├─ identifierAccum, sorterAccum, macroAccum
│  │
│  ├─ Shop System
│  │  ├─ renderShop()
│  │  ├─ renderUpgradesList()
│  │  ├─ purchaseDepartment(item)
│  │  ├─ purchaseUpgrade(upgrade)
│  │  ├─ getUpgradeCost(item)
│  │  ├─ updateShopButtons()  // Updates en temps réel
│  │
│  ├─ Outie World
│  │  ├─ checkOutieTime()
│  │  ├─ switchWorld(world)
│  │  ├─ renderOutieUI()
│  │  ├─ updateOutieButtons()
│  │  ├─ purchaseHousing(item)
│  │  ├─ doActivity(activity)
│  │
│  ├─ Rendering
│  │  ├─ render()          // Canvas rendering
│  │  ├─ drawGrid()
│  │  ├─ drawNumbers()     // États : [???], %, nombre coloré
│  │  ├─ drawScanCursor()
│  │
│  ├─ UI Updates
│  │  ├─ updateUI()        // Appelé chaque frame
│  │  ├─ updateShopButtons()
│  │  ├─ updateOutieButtons()
│  │
│  └─ Utility
│     ├─ formatNumber(num)
│     ├─ showNotification(msg)
│     ├─ showToast(msg)
│     └─ save() / load()   // LocalStorage
```

### Game Loop Structure

```javascript
gameLoop() {
    const now = Date.now()
    const deltaTime = (now - this.lastUpdate) / 1000  // en secondes
    this.lastUpdate = now

    // 1. Passive generation
    this.dataPoints += this.passiveGeneration * deltaTime
    this.freeTime += this.freeTimeGeneration * deltaTime
    this.playTimeSeconds += deltaTime

    // 2. Automation
    this.updateAutomation(deltaTime)

    // 3. Respawn
    this.updateRespawn(deltaTime)

    // 4. Scan (si souris sur canvas)
    this.scanNumbersInRadius()

    // 5. Combo decay
    if (Date.now() - this.lastSortTime > 4000) {
        this.currentCombo = 0
    }

    // 6. Outie Time check
    this.checkOutieTime()

    // 7. Rendering
    this.render()

    // 8. UI updates
    this.updateUI()

    // 9. Loop
    requestAnimationFrame(() => this.gameLoop())
}
```

### Critical Implementation Notes

**1. Button Disabled State (CRITIQUE)**
```javascript
// ❌ NE PAS FAIRE (ne fonctionne pas)
div.innerHTML = `<button disabled="${!affordable ? 'disabled' : ''}">BUY</button>`

// ✅ FAIRE (fonctionne)
div.innerHTML = `<button>BUY</button>`
const btn = div.querySelector('button')
btn.disabled = !affordable  // Propriété JS après création
```

**2. Automation Accumulator (CRITIQUE)**
```javascript
// ❌ NE PAS FAIRE (rate trop faible, toujours 0)
const toProcess = Math.floor(count * 0.5 * deltaTime)

// ✅ FAIRE (accumulation)
this.accumulator += count * 0.5 * deltaTime
while (this.accumulator >= 1) {
    // Process one item
    this.accumulator -= 1
}
```

**3. Canvas Mouse Position**
```javascript
canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect()
    this.mouseX = (e.clientX - rect.left) * (canvas.width / rect.width)
    this.mouseY = (e.clientY - rect.top) * (canvas.height / rect.height)
})
```

**4. Number Wiggle Animation**
```javascript
// Chaque cellule a un wiggleOffset random
cell.wiggleOffset = Math.random() * Math.PI * 2

// Dans render()
const time = Date.now() / 1000
const wiggleX = Math.sin(time * 2 + cell.wiggleOffset) * 1.5
const wiggleY = Math.cos(time * 2.5 + cell.wiggleOffset) * 1.5
```

---

## 🎯 BALANCING & FORMULES

### Progression Curve

**Early game (0-1000 DP)** :
- Scan manuel uniquement
- Acheter quelques Stagiaires
- Apprendre les mécaniques de scan et tri
- Premier upgrade de power

**Mid game (1000-50000 DP)** :
- Débloquer Identifier (automation partielle)
- Cluster size augmenté (2→4→8)
- Synergies de production
- Premiers achats Housing (Outie)

**Late game (50000+ DP)** :
- Full automation (Sorter + Macro)
- Cluster 15, scan ultra-rapide
- Focus sur combos et optimization
- Investissement lourd dans Housing

**End game** :
- Severance Reset pour Conformity Points
- Prestige bonuses (à définir)

### Coûts Recommandés

```
DEPARTMENT:
Stagiaire: 15 → 17 → 19 → 22... (×1.13)
Analyste: 100 → 115 → 132... (×1.15)
Identifier: 500 → 600 → 720... (×1.2)
Sorter: 2000 → 2500 → 3125... (×1.25)
Macro: 10000 → 13000 → 16900... (×1.3)

UPGRADES:
Power: 50, 200, 1000, 5000
Scan Speed: 100, 500, 2000
Cluster: 300, 800, 2500, 8000
Synergies: 500, 5000
Tech Tree: 400, 1500, 3000

OUTIE:
Housing: 3-30 FT (7 items total ≈ 100 FT)
Activities: 1-5 FT par usage
```

### Taux de Production

```
PASSIVE GENERATION:
Stagiaire: 0.1 DP/sec
Analyste: 1 DP/sec
Identifier: 5 DP/sec (+ 0.5 scans/sec)
Sorter: 20 DP/sec (+ 0.33 sorts/sec)
Macro: 100 DP/sec (+ 0.8 process/sec)

FREE TIME:
Base rate: 0.016 FT/sec (~1 FT/min)
Pas d'upgrade (volontairement lent pour équilibrage)

ACTIVE REFINING:
Manual sort: 1-4 DP/number (selon catégorie et power)
Cluster 15: jusqu'à 120 DP par clic (15×2×4)
Combo ×10: +50% bonus
```

---

## 🖼️ ASSETS & RESOURCES

### Icônes Emoji

```
STATS:
💎 Data Points
⚡ Passive
👆 Active
🧠 Conformity
⏰ Free Time

DEPARTMENT:
👤 Stagiaire
📊 Analyste
🔍 Identifier
📦 Sorter
🤖 Macro

UPGRADES:
💪 Power
🎯 Scan
📦 Cluster
🔄 Synergy
🎨 Tech

OUTIE HOUSING:
🛏️ Lit
🪴 Plante
🛋️ Canapé
📺 TV
📚 Bibliothèque
🖼️ Art
🎹 Piano

OUTIE ACTIVITIES:
🏋️ Gym
🍽️ Dîner
💐 Date
🧘 Thérapie
📖 Livre

WORLD:
🏢 Innie
🏠 Outie
```

### Police

```css
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&display=swap');

font-family: 'IBM Plex Mono', 'Courier New', monospace;
```

### Canvas Effects

**Scanline Shader** :
```css
.terminal-screen::before {
    content: '';
    position: absolute;
    background: repeating-linear-gradient(
        0deg,
        transparent 0px,
        transparent 2px,
        rgba(0, 0, 0, 0.3) 2px,
        rgba(0, 0, 0, 0.3) 4px
    );
    pointer-events: none;
}
```

**Vignette Shader** :
```css
.terminal-screen::after {
    content: '';
    position: absolute;
    background: radial-gradient(
        ellipse at center,
        transparent 0%,
        rgba(0, 0, 0, 0.4) 100%
    );
}
```

---

## 📱 RESPONSIVE DESIGN

### Breakpoints

```css
/* Desktop (défaut) */
@media (min-width: 1400px) {
    .game-container {
        grid-template-columns: 280px 1fr 340px;
    }
}

/* Tablette */
@media (max-width: 1400px) {
    .game-container {
        grid-template-columns: 250px 1fr 320px;
    }
}

/* Mobile */
@media (max-width: 1024px) {
    .game-container {
        grid-template-columns: 1fr;
    }
    .left-sidebar {
        display: none;
    }
    .bins-area {
        grid-template-columns: repeat(2, 1fr);
    }
}
```

---

## 💾 SAVE SYSTEM

### LocalStorage Structure

```javascript
saveData = {
    version: '4.3',
    dataPoints: number,
    conformityPoints: number,
    freeTime: number,

    // Departments
    departmentCounts: {
        stagiaire: number,
        analyste: number,
        // ...
    },

    // Upgrades
    purchasedUpgrades: ['power1', 'scan1', ...],

    // Outie
    ownedHousing: ['bed', 'plant', ...],

    // Stats
    totalRefined: number,
    correctSorts: number,
    quotaLevel: number,
    playTimeSeconds: number,

    timestamp: Date.now()
}

// Save every 10 seconds
setInterval(() => this.save(), 10000)

// Load on init
constructor() {
    this.load()
    // ...
}
```

---

## 🐛 BUGS CONNUS À ÉVITER

### 1. Shop Buttons toujours désactivés
**Cause** : `disabled=""` en HTML
**Solution** : Utiliser `btn.disabled = !affordable` en JS après création

### 2. Automation ne fonctionne pas
**Cause** : `Math.floor(rate * deltaTime)` toujours 0
**Solution** : Système d'accumulateurs

### 3. ??? ne disparaissent pas après scan
**Cause** : Affichage simultané de [???] et du nombre
**Solution** : États de rendu bien séparés (voir section Scan)

### 4. Shop ne se met pas à jour
**Cause** : Render shop seulement à l'achat
**Solution** : `updateShopButtons()` appelé chaque frame dans `updateUI()`

### 5. Cursor scan radius trop grand
**Cause** : Valeur initiale trop haute
**Solution** : Démarrer à 25px (pas 80px)

---

## 🎮 PLAYER EXPERIENCE

### Première Session (5-10 minutes)

1. **Découverte** (0-2 min)
   - Survole des [???] pour comprendre le scan
   - Premier clic sur nombre identifié
   - Comprend WOE/FROLIC/DREAD/MALICE
   - Voit les premiers DP arriver

2. **Premier achat** (2-5 min)
   - Atteint 15 DP → achète Stagiaire
   - Voit la génération passive commencer
   - Achète Power +1 (50 DP)

3. **Outie Time** (5-10 min)
   - Après 2 minutes → notification Outie
   - Découvre le monde Outie
   - Achète Plante (3 FT)
   - Voit le bonus permanent s'appliquer

### Session Type (30-60 minutes)

- Équilibre entre scan manuel et automation
- Optimisation de combos
- Investissements stratégiques (Housing vs Activities)
- Push vers quota suivant

### Long Terme (5+ heures)

- Full automation setup
- Min-maxing de synergies
- Préparation au Severance
- Collection de tous les Housing items

---

## 📦 DELIVERABLES

### Fichiers à produire

```
project/
├── index.html          # Structure HTML complète
├── style.css          # Tous les styles CRT + responsive
├── game.js            # Logique de jeu complète
└── README.md          # Instructions d'utilisation
```

### Critères d'acceptance

✅ **Fonctionnel** :
- Grille 10×20 avec nombres qui apparaissent
- Scan fonctionnel avec barre de progression
- Tri par clic avec cluster selection
- Shop avec 3 tabs fonctionnels
- Automation (Identifier, Sorter, Macro)
- Dual-world (Innie/Outie) avec transition
- Save/Load fonctionnel

✅ **Visuel** :
- Aesthetic CRT rétro-futuriste
- Couleurs fidèles à la palette
- Animations smooth (wiggle, glow, transitions)
- Responsive jusqu'à 1024px

✅ **Performance** :
- 60 FPS stable
- Pas de lag avec 200 nombres
- Canvas optimisé (pas de re-render inutile)

✅ **Bugs** :
- Aucun des 5 bugs connus listés ci-dessus
- Buttons shop/outie réactifs en temps réel
- Automation fonctionnelle dès 1 count

---

## 🚀 EXTENSIONS FUTURES (Optionnelles)

### Phase 2 - Conformity Points Usage
```javascript
conformityBonuses = [
    { cost: 10, name: 'Start with 100 DP', permanent: true },
    { cost: 25, name: 'Passive +50%', permanent: true },
    { cost: 50, name: 'Start with Identifier', permanent: true }
]
```

### Phase 3 - Events System
```javascript
randomEvents = [
    {
        id: 'board_meeting',
        probability: 0.05,
        effect: 'Double DP for 30s',
        visual: 'Notification spéciale'
    },
    {
        id: 'wellness_session',
        effect: '+5 FT instant',
        requirement: 'quotaLevel >= 3'
    }
]
```

### Phase 4 - Achievements
```javascript
achievements = [
    { id: 'first_sort', name: 'Premier Tri', icon: '🎯' },
    { id: 'combo_10', name: 'Combo Master', icon: '🔥', requirement: 'combo >= 10' },
    { id: 'full_house', name: 'Maison Complète', requirement: 'all housing owned' }
]
```

### Phase 5 - Sound Design
- Scan beep (pitch monte avec progress)
- Sort success chime (pitch selon catégorie)
- Combo hit sounds
- Ambient terminal hum
- Outie music (calme, ambient)

---

## 📞 CONTACT & QUESTIONS

Pour toute question sur ce brief :
- Clarifier les mécaniques floues
- Demander des exemples de code
- Valider les choix techniques
- Proposer des améliorations

**Version du brief** : 4.3 (30 octobre 2025)
**Dernière mise à jour** : Après correction automation + outie shop

---

## 🎓 LEARNING RESOURCES

**Game Design** :
- Incremental games: Cookie Clicker, Universal Paperclips
- Prestige systems: Anti-Idle, Kittens Game

**Tech** :
- Canvas API: MDN Web Docs
- RequestAnimationFrame: Game loop patterns
- BFS algorithm: Graph traversal

**Inspiration** :
- Série Severance (Apple TV+) pour le lore
- Lumon Industries aesthetic
- Macrodata Refinement concept

---

**Bonne chance pour l'implémentation ! 🚀**
