// WOW CLASSES: MAIL (Hunter, Shaman, Evoker)
window.WOW_CLASSES_MAIL = {
  "hunter": {
    "name": "Hunter",
    "color": "#AAD372",
    "icon": "fa-bullseye",
    "specs": [
      {
        "id": "beast_mastery",
        "name": "Beast Mastery",
        "role": "dps",
        "allowedWeps": [
          { "id": "2h", "label": "🏹 Ranged (Bow/Gun/Crossbow)" }
        ],
        "defaultWep": "2h",
        "presets": {
          "raid": { "m": 1211, "c": 1072, "h": 573, "v": 177 },
          "mplus": { "m": 1130, "c": 1024, "h": 467, "v": 227 }
        },
        "heroTrees": [
          { "id": "packleader", "name": "🐺 Pack Leader", "weights": { "m": 1.4, "c": 1.6, "h": 1.2, "v": 0.7 } },
          { "id": "dark_ranger", "name": "💀 Dark Ranger", "weights": { "m": 1.6, "c": 1.4, "h": 1.1, "v": 0.7 } }
        ]
      },
      {
        "id": "marksmanship",
        "name": "Marksmanship",
        "role": "dps",
        "allowedWeps": [
          { "id": "2h", "label": "🏹 Ranged (Bow/Gun/Crossbow)" }
        ],
        "defaultWep": "2h",
        "presets": {
          "raid": { "m": 1119, "c": 1565, "h": 258, "v": 223 },
          "mplus": { "m": 884, "c": 1322, "h": 402, "v": 250 }
        },
        "heroTrees": [
          { "id": "dark_ranger", "name": "💀 Dark Ranger", "weights": { "m": 1.4, "c": 1.6, "h": 0.9, "v": 0.7 } },
          { "id": "sentinel", "name": "🏹 Sentinel", "weights": { "m": 1.4, "c": 1.6, "h": 1, "v": 0.7 } }
        ]
      },
      {
        "id": "survival",
        "name": "Survival",
        "role": "dps",
        "allowedWeps": [
          { "id": "2h", "label": "⚔️ 2-Handed (Polearm/Spear)" },
          { "id": "dual_wield", "label": "⚔️ Dual Wield (1H)" }
        ],
        "defaultWep": "2h",
        "presets": {
          "raid": { "m": 1298, "c": 889, "h": 741, "v": 119 },
          "mplus": { "m": 1178, "c": 818, "h": 725, "v": 193 }
        },
        "heroTrees": [
          { "id": "sentinel", "name": "🏹 Sentinel", "weights": { "m": 1.6, "c": 1.3, "h": 1.1, "v": 0.7 } },
          { "id": "packleader", "name": "🐺 Pack Leader", "weights": { "m": 1.4, "c": 1.6, "h": 1.1, "v": 0.7 } }
        ]
      }
    ]
  },
  "shaman": {
    "name": "Shaman",
    "color": "#0070DD",
    "icon": "fa-bolt-lightning",
    "specs": [
      {
        "id": "elemental",
        "name": "Elemental",
        "role": "dps",
        "allowedWeps": [
          { "id": "1h_shield", "label": "🛡️ 1H + Shield / Offhand" },
          { "id": "2h", "label": "⚔️ 2-Handed Staff" }
        ],
        "defaultWep": "1h_shield",
        "presets": {
          "raid": { "m": 980, "c": 820, "h": 1120, "v": 140 },
          "mplus": { "m": 1080, "c": 740, "h": 1090, "v": 150 }
        },
        "heroTrees": [
          { "id": "stormbringer", "name": "⚡ Stormbringer", "weights": { "m": 1.4, "c": 1.1, "h": 1.6, "v": 0.7 } },
          { "id": "farseer", "name": "👁️ Farseer", "weights": { "m": 1.5, "c": 1.1, "h": 1.4, "v": 0.7 } }
        ]
      },
      {
        "id": "enhancement",
        "name": "Enhancement",
        "role": "dps",
        "allowedWeps": [
          { "id": "dual_wield", "label": "⚔️ Dual Wield (1H)" }
        ],
        "defaultWep": "dual_wield",
        "presets": {
          "raid": { "m": 1310, "c": 620, "h": 980, "v": 150 },
          "mplus": { "m": 1240, "c": 680, "h": 1010, "v": 130 }
        },
        "heroTrees": [
          { "id": "stormbringer", "name": "⚡ Stormbringer", "weights": { "m": 1.6, "c": 1, "h": 1.3, "v": 0.7 } },
          { "id": "totemic", "name": "🪵 Totemic", "weights": { "m": 1.4, "c": 1.1, "h": 1.5, "v": 0.7 } }
        ]
      },
      {
        "id": "restoration_shaman",
        "name": "Restoration",
        "role": "healer",
        "allowedWeps": [
          { "id": "1h_shield", "label": "🛡️ 1H + Shield / Offhand" },
          { "id": "2h", "label": "⚔️ 2-Handed Staff" }
        ],
        "defaultWep": "1h_shield",
        "presets": {
          "raid": { "m": 720, "c": 1090, "h": 980, "v": 270 },
          "mplus": { "m": 540, "c": 980, "h": 1220, "v": 320 }
        },
        "heroTrees": [
          { "id": "farseer", "name": "👁️ Farseer", "weights": { "m": 1.1, "c": 1.5, "h": 1.3, "v": 0.8 } },
          { "id": "totemic", "name": "🪵 Totemic", "weights": { "m": 1.2, "c": 1.4, "h": 1.4, "v": 0.8 } }
        ]
      }
    ]
  },
  "evoker": {
    "name": "Evoker",
    "color": "#33937F",
    "icon": "fa-dragon",
    "specs": [
      {
        "id": "devastation",
        "name": "Devastation",
        "role": "dps",
        "allowedWeps": [
          { "id": "2h", "label": "🪄 2-Handed Staff" },
          { "id": "1h_shield", "label": "🪄 1H + Offhand" }
        ],
        "defaultWep": "2h",
        "presets": {
          "raid": { "m": 1380, "c": 820, "h": 710, "v": 150 },
          "mplus": { "m": 1290, "c": 860, "h": 760, "v": 150 }
        },
        "heroTrees": [
          { "id": "flameshaper", "name": "🔥 Flameshaper", "weights": { "m": 1.7, "c": 1.3, "h": 1, "v": 0.7 } },
          { "id": "scalecommander", "name": "🛡️ Scalecommander", "weights": { "m": 1.6, "c": 1.3, "h": 1.1, "v": 0.7 } }
        ]
      },
      {
        "id": "preservation",
        "name": "Preservation",
        "role": "healer",
        "allowedWeps": [
          { "id": "2h", "label": "⚔️ 2-Handed Staff" },
          { "id": "1h_shield", "label": "🪄 1H + Offhand" }
        ],
        "defaultWep": "2h",
        "presets": {
          "raid": { "m": 1210, "c": 840, "h": 790, "v": 220 },
          "mplus": { "m": 1090, "c": 810, "h": 920, "v": 240 }
        },
        "heroTrees": [
          { "id": "chronowarden", "name": "⏳ Chronowarden", "weights": { "m": 1.5, "c": 1.3, "h": 1.1, "v": 0.8 } },
          { "id": "flameshaper", "name": "🔥 Flameshaper", "weights": { "m": 1.6, "c": 1.2, "h": 1.1, "v": 0.8 } }
        ]
      },
      {
        "id": "augmentation",
        "name": "Augmentation",
        "role": "support",
        "allowedWeps": [
          { "id": "2h", "label": "🪄 2-Handed Staff" },
          { "id": "1h_shield", "label": "🪄 1H + Offhand" }
        ],
        "defaultWep": "2h",
        "presets": {
          "raid": { "m": 1240, "c": 720, "h": 940, "v": 160 },
          "mplus": { "m": 1180, "c": 680, "h": 1040, "v": 160 }
        },
        "heroTrees": [
          { "id": "chronowarden", "name": "⏳ Chronowarden", "weights": { "m": 1.7, "c": 1, "h": 1.4, "v": 0.7 } },
          { "id": "scalecommander", "name": "🛡️ Scalecommander", "weights": { "m": 1.6, "c": 1.1, "h": 1.4, "v": 0.7 } }
        ]
      }
    ]
  }
};
