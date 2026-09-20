// WOW CLASSES: LEATHER (Demon Hunter, Rogue, Monk, Druid)
window.WOW_CLASSES_LEATHER = {
  "demonhunter": {
    "name": "Demon Hunter",
    "color": "#A330C9",
    "icon": "fa-eye",
    "specs": [
      {
        "id": "havoc",
        "name": "Havoc",
        "role": "dps",
        "allowedWeps": [
          { "id": "dual_wield", "label": "⚔️ Dual Warglaives / 1H" }
        ],
        "defaultWep": "dual_wield",
        "presets": {
          "raid": { "m": 920, "c": 1280, "h": 710, "v": 150 },
          "mplus": { "m": 980, "c": 1190, "h": 740, "v": 150 }
        },
        "heroTrees": [
          { "id": "aldrachi_reaver", "name": "🗡️ Aldrachi Reaver", "weights": { "m": 1.4, "c": 1.6, "h": 1, "v": 0.7 } },
          { "id": "fel_scarred", "name": "🔥 Fel-Scarred", "weights": { "m": 1.5, "c": 1.5, "h": 1, "v": 0.7 } }
        ]
      },
      {
        "id": "vengeance",
        "name": "Vengeance",
        "role": "tank",
        "allowedWeps": [
          { "id": "dual_wield", "label": "⚔️ Dual Warglaives / 1H" }
        ],
        "defaultWep": "dual_wield",
        "presets": {
          "raid": { "m": 450, "c": 740, "h": 1290, "v": 580 },
          "mplus": { "m": 390, "c": 680, "h": 1380, "v": 610 }
        },
        "heroTrees": [
          { "id": "aldrachi_reaver", "name": "🛡️ Aldrachi Reaver", "weights": { "m": 0.9, "c": 1.2, "h": 1.5, "v": 1.1 } },
          { "id": "fel_scarred", "name": "🔥 Fel-Scarred", "weights": { "m": 1, "c": 1.1, "h": 1.6, "v": 1.1 } }
        ]
      },
      {
        "id": "devourer",
        "name": "Devourer",
        "role": "dps",
        "allowedWeps": [
          { "id": "dual_wield", "label": "⚔️ Dual Warglaives / 1H" },
          { "id": "2h", "label": "🪄 2-Handed Staff" }
        ],
        "defaultWep": "dual_wield",
        "presets": {
          "raid": { "m": 1340, "c": 780, "h": 1020, "v": 140 },
          "mplus": { "m": 1260, "c": 840, "h": 1080, "v": 140 }
        },
        "heroTrees": [
          { "id": "fel_scarred", "name": "🔥 Fel-Scarred", "weights": { "m": 1.6, "c": 1.3, "h": 1.1, "v": 0.7 } },
          { "id": "aldrachi_reaver", "name": "🗡️ Aldrachi Reaver", "weights": { "m": 1.5, "c": 1.4, "h": 1.1, "v": 0.7 } }
        ]
      }
    ]
  },
  "rogue": {
    "name": "Rogue",
    "color": "#FFF468",
    "icon": "fa-skull",
    "specs": [
      {
        "id": "assassination",
        "name": "Assassination",
        "role": "dps",
        "allowedWeps": [
          { "id": "dual_wield", "label": "🗡️ Dual Daggers" }
        ],
        "defaultWep": "dual_wield",
        "presets": {
          "raid": { "m": 1350, "c": 890, "h": 680, "v": 140 },
          "mplus": { "m": 1280, "c": 840, "h": 790, "v": 150 }
        },
        "heroTrees": [
          { "id": "deathstalker", "name": "🗡️ Deathstalker", "weights": { "m": 1.7, "c": 1.3, "h": 1, "v": 0.7 } },
          { "id": "fatebound", "name": "🎲 Fatebound", "weights": { "m": 1.5, "c": 1.5, "h": 1, "v": 0.7 } }
        ]
      },
      {
        "id": "outlaw",
        "name": "Outlaw",
        "role": "dps",
        "allowedWeps": [
          { "id": "dual_wield", "label": "⚔️ Dual Wield (1H)" }
        ],
        "defaultWep": "dual_wield",
        "presets": {
          "raid": { "m": 420, "c": 890, "h": 1080, "v": 670 },
          "mplus": { "m": 380, "c": 850, "h": 1120, "v": 710 }
        },
        "heroTrees": [
          { "id": "fatebound", "name": "🎲 Fatebound", "weights": { "m": 0.8, "c": 1.3, "h": 1.5, "v": 1.2 } },
          { "id": "trickster", "name": "🎭 Trickster", "weights": { "m": 0.9, "c": 1.2, "h": 1.5, "v": 1.2 } }
        ]
      },
      {
        "id": "subtlety",
        "name": "Subtlety",
        "role": "dps",
        "allowedWeps": [
          { "id": "dual_wield", "label": "🗡️ Dual Daggers" }
        ],
        "defaultWep": "dual_wield",
        "presets": {
          "raid": { "m": 1410, "c": 780, "h": 690, "v": 180 },
          "mplus": { "m": 1350, "c": 820, "h": 740, "v": 150 }
        },
        "heroTrees": [
          { "id": "deathstalker", "name": "🗡️ Deathstalker", "weights": { "m": 1.7, "c": 1.2, "h": 0.8, "v": 1 } },
          { "id": "trickster", "name": "🎭 Trickster", "weights": { "m": 1.5, "c": 1.2, "h": 1, "v": 1 } }
        ]
      }
    ]
  },
  "monk": {
    "name": "Monk",
    "color": "#00FF98",
    "icon": "fa-yin-yang",
    "specs": [
      {
        "id": "brewmaster",
        "name": "Brewmaster",
        "role": "tank",
        "allowedWeps": [
          { "id": "2h", "label": "⚔️ 2-Handed Staff / Polearm" },
          { "id": "dual_wield", "label": "⚔️ Dual Wield (1H)" }
        ],
        "defaultWep": "2h",
        "presets": {
          "raid": { "m": 610, "c": 890, "h": 720, "v": 840 },
          "mplus": { "m": 520, "c": 810, "h": 780, "v": 950 }
        },
        "heroTrees": [
          { "id": "master_of_harmony", "name": "☯️ Master of Harmony", "weights": { "m": 0.9, "c": 1.3, "h": 1.1, "v": 1.4 } },
          { "id": "shado_pan", "name": "🥋 Shado-Pan", "weights": { "m": 0.9, "c": 1.3, "h": 1.1, "v": 1.4 } }
        ]
      },
      {
        "id": "windwalker",
        "name": "Windwalker",
        "role": "dps",
        "allowedWeps": [
          { "id": "dual_wield", "label": "⚔️ Dual Wield (1H)" },
          { "id": "2h", "label": "⚔️ 2-Handed (2H)" }
        ],
        "defaultWep": "dual_wield",
        "presets": {
          "raid": { "m": 1280, "c": 920, "h": 640, "v": 220 },
          "mplus": { "m": 1190, "c": 980, "h": 680, "v": 210 }
        },
        "heroTrees": [
          { "id": "shado_pan", "name": "🥋 Shado-Pan", "weights": { "m": 1.6, "c": 1.3, "h": 0.8, "v": 1 } },
          { "id": "conduit_of_the_celestials", "name": "✨ Conduit of the Celestials", "weights": { "m": 1.5, "c": 1.3, "h": 1, "v": 0.8 } }
        ]
      },
      {
        "id": "mistweaver",
        "name": "Mistweaver",
        "role": "healer",
        "allowedWeps": [
          { "id": "2h", "label": "⚔️ 2-Handed Staff" },
          { "id": "1h_shield", "label": "🪄 1H + Offhand" }
        ],
        "defaultWep": "2h",
        "presets": {
          "raid": { "m": 680, "c": 890, "h": 1210, "v": 280 },
          "mplus": { "m": 540, "c": 820, "h": 1380, "v": 320 }
        },
        "heroTrees": [
          { "id": "conduit_of_the_celestials", "name": "✨ Conduit of the Celestials", "weights": { "m": 1, "c": 1.3, "h": 1.6, "v": 0.8 } },
          { "id": "master_of_harmony", "name": "☯️ Master of Harmony", "weights": { "m": 1.1, "c": 1.4, "h": 1.5, "v": 0.8 } }
        ]
      }
    ]
  },
  "druid": {
    "name": "Druid",
    "color": "#FF7C0A",
    "icon": "fa-paw",
    "specs": [
      {
        "id": "balance",
        "name": "Balance",
        "role": "dps",
        "allowedWeps": [
          { "id": "2h", "label": "⚔️ 2-Handed Staff" },
          { "id": "1h_shield", "label": "🪄 1H + Offhand" }
        ],
        "defaultWep": "2h",
        "presets": {
          "raid": { "m": 1240, "c": 710, "h": 950, "v": 160 },
          "mplus": { "m": 1180, "c": 680, "h": 1040, "v": 160 }
        },
        "heroTrees": [
          { "id": "elunes_chosen", "name": "🌙 Elune's Chosen", "weights": { "m": 1.6, "c": 1, "h": 1.3, "v": 0.7 } },
          { "id": "keeper_of_the_grove", "name": "🌲 Keeper of the Grove", "weights": { "m": 1.5, "c": 1.1, "h": 1.4, "v": 0.7 } }
        ]
      },
      {
        "id": "feral",
        "name": "Feral",
        "role": "dps",
        "allowedWeps": [
          { "id": "2h", "label": "⚔️ 2-Handed Polearm / Staff" }
        ],
        "defaultWep": "2h",
        "presets": {
          "raid": { "m": 1080, "c": 1190, "h": 640, "v": 150 },
          "mplus": { "m": 1120, "c": 1120, "h": 680, "v": 140 }
        },
        "heroTrees": [
          { "id": "wildstalker", "name": "🌿 Wildstalker", "weights": { "m": 1.4, "c": 1.5, "h": 1, "v": 0.7 } },
          { "id": "druid_of_the_claw", "name": "🐾 Druid of the Claw", "weights": { "m": 1.5, "c": 1.4, "h": 1, "v": 0.7 } }
        ]
      },
      {
        "id": "guardian",
        "name": "Guardian",
        "role": "tank",
        "allowedWeps": [
          { "id": "2h", "label": "⚔️ 2-Handed Polearm / Staff" }
        ],
        "defaultWep": "2h",
        "presets": {
          "raid": { "m": 580, "c": 620, "h": 1350, "v": 510 },
          "mplus": { "m": 490, "c": 540, "h": 1420, "v": 610 }
        },
        "heroTrees": [
          { "id": "elunes_chosen", "name": "🌙 Elune's Chosen", "weights": { "m": 1, "c": 0.9, "h": 1.5, "v": 1.3 } },
          { "id": "druid_of_the_claw", "name": "🐾 Druid of the Claw", "weights": { "m": 1.1, "c": 0.9, "h": 1.4, "v": 1.4 } }
        ]
      },
      {
        "id": "restoration_druid",
        "name": "Restoration",
        "role": "healer",
        "allowedWeps": [
          { "id": "2h", "label": "⚔️ 2-Handed Staff" },
          { "id": "1h_shield", "label": "🪄 1H + Offhand" }
        ],
        "defaultWep": "2h",
        "presets": {
          "raid": { "m": 890, "c": 840, "h": 1120, "v": 210 },
          "mplus": { "m": 720, "c": 810, "h": 1290, "v": 240 }
        },
        "heroTrees": [
          { "id": "wildstalker", "name": "🌿 Wildstalker", "weights": { "m": 1.3, "c": 1.1, "h": 1.5, "v": 0.8 } },
          { "id": "keeper_of_the_grove", "name": "🌲 Keeper of the Grove", "weights": { "m": 1.4, "c": 1.1, "h": 1.5, "v": 0.8 } }
        ]
      }
    ]
  }
};
