// WOW CLASSES: PLATE (Paladin, Warrior, Death Knight)
window.WOW_CLASSES_PLATE = {
  "paladin": {
    "name": "Paladin",
    "color": "#F48CBA",
    "icon": "fa-shield-halved",
    "specs": [
      {
        "id": "retribution",
        "name": "Retribution",
        "role": "dps",
        "allowedWeps": [
          { "id": "2h", "label": "⚔️ 2-Handed (2H)" }
        ],
        "defaultWep": "2h",
        "presets": {
          "raid": { "m": 1060, "c": 974, "h": 854, "v": 115 },
          "mplus": { "m": 996, "c": 885, "h": 796, "v": 186 }
        },
        "heroTrees": [
          { "id": "herald", "name": "☀️ Herald of the Sun", "weights": { "m": 1.5, "c": 1.1, "h": 1.4, "v": 0.7 } },
          { "id": "templar", "name": "⚔️ Templar", "weights": { "m": 1.6, "c": 1.3, "h": 1.1, "v": 0.7 } }
        ]
      },
      {
        "id": "protection",
        "name": "Protection",
        "role": "tank",
        "allowedWeps": [
          { "id": "1h_shield", "label": "🛡️ 1H + Shield" }
        ],
        "defaultWep": "1h_shield",
        "presets": {
          "raid": { "m": 473, "c": 1037, "h": 1081, "v": 267 },
          "mplus": { "m": 521, "c": 882, "h": 1023, "v": 295 }
        },
        "heroTrees": [
          { "id": "lightsmith", "name": "🛡️ Lightsmith", "weights": { "m": 1.2, "c": 1, "h": 1.6, "v": 1.3 } },
          { "id": "templar", "name": "⚔️ Templar", "weights": { "m": 1.1, "c": 1, "h": 1.6, "v": 1.2 } }
        ]
      },
      {
        "id": "holy",
        "name": "Holy",
        "role": "healer",
        "allowedWeps": [
          { "id": "1h_shield", "label": "🛡️ 1H + Shield" },
          { "id": "2h", "label": "⚔️ 2-Handed (2H)" }
        ],
        "defaultWep": "1h_shield",
        "presets": {
          "raid": { "m": 1208, "c": 706, "h": 865, "v": 207 },
          "mplus": { "m": 774, "c": 720, "h": 980, "v": 309 }
        },
        "heroTrees": [
          { "id": "herald", "name": "☀️ Herald of the Sun", "weights": { "m": 1, "c": 1.5, "h": 1.4, "v": 0.8 } },
          { "id": "lightsmith", "name": "🛡️ Lightsmith", "weights": { "m": 1.1, "c": 1.4, "h": 1.4, "v": 0.9 } }
        ]
      }
    ]
  },
  "warrior": {
    "name": "Warrior",
    "color": "#C69B6D",
    "icon": "fa-gavel",
    "specs": [
      {
        "id": "arms",
        "name": "Arms",
        "role": "dps",
        "allowedWeps": [
          { "id": "2h", "label": "⚔️ 2-Handed (2H)" }
        ],
        "defaultWep": "2h",
        "presets": {
          "raid": { "m": 580, "c": 1310, "h": 890, "v": 280 },
          "mplus": { "m": 650, "c": 1150, "h": 980, "v": 280 }
        },
        "heroTrees": [
          { "id": "slayer", "name": "⚔️ Slayer", "weights": { "m": 1, "c": 1.6, "h": 1.3, "v": 0.8 } },
          { "id": "colossus", "name": "🛡️ Colossus", "weights": { "m": 1.4, "c": 1.5, "h": 1.1, "v": 0.8 } }
        ]
      },
      {
        "id": "fury",
        "name": "Fury",
        "role": "dps",
        "allowedWeps": [
          { "id": "dual_wield", "label": "⚔️ Dual Wield (2H/1H)" }
        ],
        "defaultWep": "dual_wield",
        "presets": {
          "raid": { "m": 820, "c": 680, "h": 1380, "v": 180 },
          "mplus": { "m": 890, "c": 620, "h": 1350, "v": 200 }
        },
        "heroTrees": [
          { "id": "mountain_thane", "name": "⚡ Mountain Thane", "weights": { "m": 1.4, "c": 1.1, "h": 1.5, "v": 0.7 } },
          { "id": "slayer", "name": "⚔️ Slayer", "weights": { "m": 1.3, "c": 1, "h": 1.6, "v": 0.7 } }
        ]
      },
      {
        "id": "prot_warrior",
        "name": "Protection",
        "role": "tank",
        "allowedWeps": [
          { "id": "1h_shield", "label": "🛡️ 1H + Shield" }
        ],
        "defaultWep": "1h_shield",
        "presets": {
          "raid": { "m": 480, "c": 720, "h": 1390, "v": 470 },
          "mplus": { "m": 390, "c": 580, "h": 1480, "v": 610 }
        },
        "heroTrees": [
          { "id": "mountain_thane", "name": "⚡ Mountain Thane", "weights": { "m": 0.9, "c": 1.1, "h": 1.6, "v": 1.2 } },
          { "id": "colossus", "name": "🛡️ Colossus", "weights": { "m": 1.1, "c": 1, "h": 1.5, "v": 1.3 } }
        ]
      }
    ]
  },
  "deathknight": {
    "name": "Death Knight",
    "color": "#C41E3A",
    "icon": "fa-skull",
    "specs": [
      {
        "id": "blood",
        "name": "Blood",
        "role": "tank",
        "allowedWeps": [
          { "id": "2h", "label": "⚔️ 2-Handed (2H)" }
        ],
        "defaultWep": "2h",
        "presets": {
          "raid": { "m": 650, "c": 820, "h": 1280, "v": 310 },
          "mplus": { "m": 520, "c": 740, "h": 1390, "v": 410 }
        },
        "heroTrees": [
          { "id": "deathbringer", "name": "⚔️ Deathbringer", "weights": { "m": 1, "c": 1.2, "h": 1.5, "v": 1.1 } },
          { "id": "sanlayn", "name": "🧛 San'layn", "weights": { "m": 1.1, "c": 1.1, "h": 1.6, "v": 1 } }
        ]
      },
      {
        "id": "frost_dk",
        "name": "Frost",
        "role": "dps",
        "allowedWeps": [
          { "id": "dual_wield", "label": "⚔️ Dual Wield (1H)" },
          { "id": "2h", "label": "⚔️ 2-Handed (2H)" }
        ],
        "defaultWep": "dual_wield",
        "presets": {
          "raid": { "m": 880, "c": 1290, "h": 720, "v": 170 },
          "mplus": { "m": 950, "c": 1180, "h": 780, "v": 150 }
        },
        "heroTrees": [
          { "id": "deathbringer", "name": "⚔️ Deathbringer", "weights": { "m": 1.6, "c": 1.4, "h": 1, "v": 0.7 } },
          { "id": "rider", "name": "🐎 Rider of the Apocalypse", "weights": { "m": 1.5, "c": 1.4, "h": 1.1, "v": 0.7 } }
        ]
      },
      {
        "id": "unholy",
        "name": "Unholy",
        "role": "dps",
        "allowedWeps": [
          { "id": "2h", "label": "⚔️ 2-Handed (2H)" }
        ],
        "defaultWep": "2h",
        "presets": {
          "raid": { "m": 1320, "c": 610, "h": 940, "v": 190 },
          "mplus": { "m": 1240, "c": 650, "h": 990, "v": 180 }
        },
        "heroTrees": [
          { "id": "rider", "name": "🐎 Rider of the Apocalypse", "weights": { "m": 1.6, "c": 1, "h": 1.3, "v": 0.7 } },
          { "id": "sanlayn", "name": "🧛 San'layn", "weights": { "m": 1.4, "c": 1, "h": 1.6, "v": 0.7 } }
        ]
      }
    ]
  }
};
