// WOW CLASSES: CLOTH (Mage, Warlock, Priest)
window.WOW_CLASSES_CLOTH = {
  "mage": {
    "name": "Mage",
    "color": "#3FC7EB",
    "icon": "fa-fire-flame-curved",
    "specs": [
      {
        "id": "arcane",
        "name": "Arcane",
        "role": "dps",
        "allowedWeps": [
          { "id": "2h", "label": "🪄 2-Handed Staff" },
          { "id": "1h_shield", "label": "🪄 1H + Offhand" }
        ],
        "defaultWep": "2h",
        "presets": {
          "raid": { "m": 890, "c": 840, "h": 1180, "v": 150 },
          "mplus": { "m": 920, "c": 790, "h": 1210, "v": 140 }
        },
        "heroTrees": [
          { "id": "sunfury", "name": "☀️ Sunfury", "weights": { "m": 1.3, "c": 1.1, "h": 1.5, "v": 0.7 } },
          { "id": "spellslinger", "name": "🪄 Spellslinger", "weights": { "m": 1.4, "c": 1.1, "h": 1.4, "v": 0.7 } }
        ]
      },
      {
        "id": "fire",
        "name": "Fire",
        "role": "dps",
        "allowedWeps": [
          { "id": "2h", "label": "🪄 2-Handed Staff" },
          { "id": "1h_shield", "label": "🪄 1H + Offhand" }
        ],
        "defaultWep": "2h",
        "presets": {
          "raid": { "m": 1080, "c": 650, "h": 1190, "v": 140 },
          "mplus": { "m": 1120, "c": 610, "h": 1190, "v": 140 }
        },
        "heroTrees": [
          { "id": "sunfury", "name": "☀️ Sunfury", "weights": { "m": 1.4, "c": 0.9, "h": 1.6, "v": 0.7 } },
          { "id": "frostfire", "name": "❄️ Frostfire", "weights": { "m": 1.5, "c": 0.9, "h": 1.5, "v": 0.7 } }
        ]
      },
      {
        "id": "frost_mage",
        "name": "Frost",
        "role": "dps",
        "allowedWeps": [
          { "id": "2h", "label": "🪄 2-Handed Staff" },
          { "id": "1h_shield", "label": "🪄 1H + Offhand" }
        ],
        "defaultWep": "2h",
        "presets": {
          "raid": { "m": 920, "c": 1240, "h": 780, "v": 120 },
          "mplus": { "m": 980, "c": 1190, "h": 780, "v": 110 }
        },
        "heroTrees": [
          { "id": "frostfire", "name": "❄️ Frostfire", "weights": { "m": 1.3, "c": 1.6, "h": 1.1, "v": 0.7 } },
          { "id": "spellslinger", "name": "🪄 Spellslinger", "weights": { "m": 1.4, "c": 1.5, "h": 1.1, "v": 0.7 } }
        ]
      }
    ]
  },
  "warlock": {
    "name": "Warlock",
    "color": "#8788EE",
    "icon": "fa-ghost",
    "specs": [
      {
        "id": "affliction",
        "name": "Affliction",
        "role": "dps",
        "allowedWeps": [
          { "id": "2h", "label": "🪄 2-Handed Staff" },
          { "id": "1h_shield", "label": "🪄 1H + Offhand" }
        ],
        "defaultWep": "2h",
        "presets": {
          "raid": { "m": 1280, "c": 680, "h": 980, "v": 120 },
          "mplus": { "m": 1210, "c": 640, "h": 1080, "v": 130 }
        },
        "heroTrees": [
          { "id": "soul_harvester", "name": "👻 Soul Harvester", "weights": { "m": 1.6, "c": 1, "h": 1.4, "v": 0.7 } },
          { "id": "hellcaller", "name": "🔥 Hellcaller", "weights": { "m": 1.5, "c": 1.1, "h": 1.4, "v": 0.7 } }
        ]
      },
      {
        "id": "demonology",
        "name": "Demonology",
        "role": "dps",
        "allowedWeps": [
          { "id": "2h", "label": "🪄 2-Handed Staff" },
          { "id": "1h_shield", "label": "🪄 1H + Offhand" }
        ],
        "defaultWep": "2h",
        "presets": {
          "raid": { "m": 940, "c": 820, "h": 1180, "v": 120 },
          "mplus": { "m": 980, "c": 780, "h": 1180, "v": 120 }
        },
        "heroTrees": [
          { "id": "diabolist", "name": "😈 Diabolist", "weights": { "m": 1.3, "c": 1.1, "h": 1.6, "v": 0.7 } },
          { "id": "soul_harvester", "name": "👻 Soul Harvester", "weights": { "m": 1.4, "c": 1.1, "h": 1.5, "v": 0.7 } }
        ]
      },
      {
        "id": "destruction",
        "name": "Destruction",
        "role": "dps",
        "allowedWeps": [
          { "id": "2h", "label": "🪄 2-Handed Staff" },
          { "id": "1h_shield", "label": "🪄 1H + Offhand" }
        ],
        "defaultWep": "2h",
        "presets": {
          "raid": { "m": 1120, "c": 740, "h": 1080, "v": 120 },
          "mplus": { "m": 1180, "c": 690, "h": 1080, "v": 110 }
        },
        "heroTrees": [
          { "id": "diabolist", "name": "😈 Diabolist", "weights": { "m": 1.5, "c": 1.1, "h": 1.4, "v": 0.7 } },
          { "id": "hellcaller", "name": "🔥 Hellcaller", "weights": { "m": 1.4, "c": 1.2, "h": 1.4, "v": 0.7 } }
        ]
      }
    ]
  },
  "priest": {
    "name": "Priest",
    "color": "#FFFFFF",
    "icon": "fa-sun",
    "specs": [
      {
        "id": "shadow",
        "name": "Shadow",
        "role": "dps",
        "allowedWeps": [
          { "id": "2h", "label": "🪄 2-Handed Staff" },
          { "id": "1h_shield", "label": "🪄 1H + Offhand" }
        ],
        "defaultWep": "2h",
        "presets": {
          "raid": { "m": 1180, "c": 840, "h": 920, "v": 120 },
          "mplus": { "m": 1120, "c": 790, "h": 1020, "v": 130 }
        },
        "heroTrees": [
          { "id": "voidweaver", "name": "🌌 Voidweaver", "weights": { "m": 1.5, "c": 1.1, "h": 1.4, "v": 0.7 } },
          { "id": "archon", "name": "✨ Archon", "weights": { "m": 1.6, "c": 1, "h": 1.4, "v": 0.7 } }
        ]
      },
      {
        "id": "discipline",
        "name": "Discipline",
        "role": "healer",
        "allowedWeps": [
          { "id": "2h", "label": "🪄 2-Handed Staff" },
          { "id": "1h_shield", "label": "🪄 1H + Offhand" }
        ],
        "defaultWep": "2h",
        "presets": {
          "raid": { "m": 720, "c": 920, "h": 1210, "v": 210 },
          "mplus": { "m": 580, "c": 890, "h": 1350, "v": 240 }
        },
        "heroTrees": [
          { "id": "oracle", "name": "🔮 Oracle", "weights": { "m": 1, "c": 1.3, "h": 1.6, "v": 0.8 } },
          { "id": "voidweaver", "name": "🌌 Voidweaver", "weights": { "m": 1.1, "c": 1.3, "h": 1.5, "v": 0.8 } }
        ]
      },
      {
        "id": "holy_priest",
        "name": "Holy",
        "role": "healer",
        "allowedWeps": [
          { "id": "2h", "label": "🪄 2-Handed Staff" },
          { "id": "1h_shield", "label": "🪄 1H + Offhand" }
        ],
        "defaultWep": "2h",
        "presets": {
          "raid": { "m": 1120, "c": 1040, "h": 680, "v": 220 },
          "mplus": { "m": 980, "c": 920, "h": 890, "v": 270 }
        },
        "heroTrees": [
          { "id": "archon", "name": "✨ Archon", "weights": { "m": 1.5, "c": 1.4, "h": 1, "v": 0.8 } },
          { "id": "oracle", "name": "🔮 Oracle", "weights": { "m": 1.4, "c": 1.4, "h": 1.1, "v": 0.8 } }
        ]
      }
    ]
  }
};
