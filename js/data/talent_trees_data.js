/**
 * Visual Talent Trees Dataset for World of Warcraft: Midnight Season 2 (Patch 12.1.5)
 * Protection Paladin (Class Tree, Hero Tree: Lightsmith, Spec Tree: Protection)
 * Provides official spell IDs, icons, names, tree positions (row/col) and ranks for Raid & M+.
 */
window.WOW_TALENT_TREES = window.WOW_TALENT_TREES || {};

window.WOW_TALENT_TREES.paladin_protection = {
  // 1. ÁRBOL DE CLASE: PALADÍN (10 Filas x 7 Columnas)
  classTree: {
    name: { en: 'Paladin Class Tree', es: 'Árbol de Clase Paladín' },
    points: 31,
    nodes: [
      // Fila 1
      { id: 853, row: 1, col: 2, name: 'Hammer of Justice', icon: 'spell_holy_sealofmight', rank: '1/1', shape: 'square', type: 'active' },
      { id: 19750, row: 1, col: 4, name: 'Flash of Light', icon: 'spell_holy_flashheal', rank: '1/1', shape: 'square', type: 'active' },
      { id: 879, row: 1, col: 6, name: 'Judgment', icon: 'spell_holy_righteousfury', rank: '1/1', shape: 'square', type: 'active' },

      // Fila 2
      { id: 31884, row: 2, col: 1, name: 'Avenging Wrath', icon: 'spell_holy_avenginewrath', rank: '1/1', shape: 'square', type: 'active' },
      { id: 20271, row: 2, col: 3, name: 'Judgment of Light', icon: 'ability_paladin_judgmentofthewise', rank: '1/1', shape: 'circle', type: 'passive' },
      { id: 498, row: 2, col: 5, name: 'Divine Protection', icon: 'spell_holy_divineprotection', rank: '1/1', shape: 'square', type: 'active' },
      { id: 642, row: 2, col: 7, name: 'Divine Shield', icon: 'spell_holy_divineintervention', rank: '1/1', shape: 'square', type: 'active' },

      // Fila 3
      { id: 6940, row: 3, col: 2, name: 'Blessing of Sacrifice', icon: 'spell_holy_sealofsacrifice', rank: '1/1', shape: 'square', type: 'active' },
      { id: 1044, row: 3, col: 3, name: 'Blessing of Freedom', icon: 'spell_holy_sealofvalor', rank: '1/1', shape: 'square', type: 'active' },
      { id: 1022, row: 3, col: 4, name: 'Blessing of Protection', icon: 'spell_holy_sealofprotection', rank: '1/1', shape: 'square', type: 'active' },
      { id: 210256, row: 3, col: 5, name: 'Blessing of Sanctuary', icon: 'spell_holy_greaterblessingofsanctuary', rank: '1/1', shape: 'circle', type: 'passive' },
      { id: 190784, row: 3, col: 6, name: 'Divine Steed', icon: 'ability_paladin_divinesteed', rank: '1/1', shape: 'square', type: 'active' },

      // Fila 4
      { id: 96231, row: 4, col: 1, name: 'Rebuke', icon: 'spell_holy_rebuke', rank: '1/1', shape: 'square', type: 'active' },
      { id: 320415, row: 4, col: 3, name: 'Cavalier', icon: 'spell_nature_swiftness', rank: '1/1', shape: 'circle', type: 'passive' },
      { id: 200652, row: 4, col: 4, name: 'Tirion\'s Devotion', icon: 'spell_holy_blessingofprotection', rank: '2/2', shape: 'circle', type: 'passive' },
      { id: 200654, row: 4, col: 5, name: 'Seasoned Warhorse', icon: 'ability_mount_charger', rank: '1/1', shape: 'circle', type: 'passive' },
      { id: 377043, row: 4, col: 7, name: 'Golden Path', icon: 'spell_holy_mindvision', rank: '1/1', shape: 'circle', type: 'passive' },

      // Fila 5
      { id: 115750, row: 5, col: 2, name: 'Blinding Light', icon: 'ability_paladin_blindinglight', rank: '1/1', shape: 'octagon', type: 'choice' },
      { id: 377796, row: 5, col: 4, name: 'Seal of the Crusader', icon: 'spell_holy_holysmite', rank: '2/2', shape: 'circle', type: 'passive' },
      { id: 377044, row: 5, col: 6, name: 'Judgment of Superiority', icon: 'spell_holy_righteousnessaura', rank: '2/2', shape: 'circle', type: 'passive' },

      // Fila 6
      { id: 377045, row: 6, col: 1, name: 'Aura of Swiftness', icon: 'spell_holy_auramastery', rank: '1/1', shape: 'circle', type: 'passive' },
      { id: 377046, row: 6, col: 3, name: 'Touch of Light', icon: 'spell_holy_greaterblessingofkings', rank: '1/1', shape: 'circle', type: 'passive' },
      { id: 377047, row: 6, col: 5, name: 'Incanter\'s Flow of Faith', icon: 'spell_holy_holybolt', rank: '2/2', shape: 'circle', type: 'passive' },
      { id: 377048, row: 6, col: 7, name: 'Seal of Repentance', icon: 'spell_holy_prayerofhealing02', rank: '1/1', shape: 'circle', type: 'passive' },

      // Fila 7
      { id: 385127, row: 7, col: 2, name: 'Of Dusk and Dawn', icon: 'spell_holy_mindsooth', rank: '1/1', shape: 'circle', type: 'passive' },
      { id: 385129, row: 7, col: 4, name: 'Seal of Order', icon: 'spell_holy_powerwordbarrier', rank: '1/1', shape: 'circle', type: 'passive' },
      { id: 385130, row: 7, col: 6, name: 'Fading Light', icon: 'spell_shadow_twilight', rank: '1/1', shape: 'circle', type: 'passive' }
    ]
  },

  // 2. ÁRBOL HÉROE: LIGHTSMITH (5 Filas x 3 Columnas)
  heroTree: {
    name: { en: 'Lightsmith (Hero Tree)', es: 'Forjador de la Luz (Árbol Héroe)' },
    points: 10,
    nodes: [
      // Fila 1 (Keystone)
      { id: 431377, row: 1, col: 2, name: 'Holy Bulwark / Sacred Weapon', icon: 'inv_shield_1h_artifactprotpal_d_01', rank: '1/1', shape: 'octagon', type: 'keystone' },

      // Fila 2
      { id: 431405, row: 2, col: 1, name: 'Solidarity', icon: 'spell_holy_blessingofprotection', rank: '1/1', shape: 'circle', type: 'passive' },
      { id: 431408, row: 2, col: 2, name: 'Divine Guidance', icon: 'spell_holy_divineprovidence', rank: '1/1', shape: 'circle', type: 'passive' },
      { id: 431411, row: 2, col: 3, name: 'Master Forger', icon: 'trade_blacksmithing', rank: '1/1', shape: 'circle', type: 'passive' },

      // Fila 3
      { id: 431415, row: 3, col: 1, name: 'Lay Down Arms', icon: 'ability_warrior_disarm', rank: '1/1', shape: 'circle', type: 'passive' },
      { id: 431418, row: 3, col: 2, name: 'Valiance', icon: 'spell_holy_sealofmight', rank: '1/1', shape: 'circle', type: 'passive' },
      { id: 431422, row: 3, col: 3, name: 'Fear No Evil', icon: 'spell_holy_heroism', rank: '1/1', shape: 'circle', type: 'passive' },

      // Fila 4
      { id: 431427, row: 4, col: 1, name: 'Authoritative Rebuke', icon: 'spell_holy_silence', rank: '1/1', shape: 'circle', type: 'passive' },
      { id: 431430, row: 4, col: 3, name: 'Blessed Assurance', icon: 'spell_holy_greaterblessingofsanctuary', rank: '1/1', shape: 'circle', type: 'passive' },

      // Fila 5 (Capstone)
      { id: 431435, row: 5, col: 2, name: 'Blessing of the Forge', icon: 'spell_holy_avenginewrath', rank: '1/1', shape: 'square', type: 'capstone' }
    ]
  },

  // 3. ÁRBOL DE ESPECIALIZACIÓN: PROTECCIÓN (10 Filas x 7 Columnas)
  specTree: {
    name: { en: 'Protection Spec Tree', es: 'Árbol de Especialización Protección' },
    points: 30,
    nodes: [
      // Fila 1
      { id: 53600, row: 1, col: 4, name: 'Shield of the Righteous', icon: 'ability_paladin_shieldofvengence', rank: '1/1', shape: 'square', type: 'active' },

      // Fila 2
      { id: 31935, row: 2, col: 2, name: 'Avenger\'s Shield', icon: 'spell_holy_avengersshield', rank: '1/1', shape: 'square', type: 'active' },
      { id: 26573, row: 2, col: 4, name: 'Consecration', icon: 'spell_holy_innerfire', rank: '1/1', shape: 'square', type: 'active' },
      { id: 204019, row: 2, col: 6, name: 'Blessed Hammer', icon: 'paladin_bastionoflight', rank: '1/1', shape: 'square', type: 'active' },

      // Fila 3
      { id: 204054, row: 3, col: 2, name: 'Redoubt', icon: 'ability_defend', rank: '1/1', shape: 'circle', type: 'passive' },
      { id: 20925, row: 3, col: 3, name: 'Holy Shield', icon: 'spell_holy_blessingofprotection', rank: '1/1', shape: 'circle', type: 'passive' },
      { id: 378279, row: 3, col: 4, name: 'Sanctuary', icon: 'spell_holy_restoration', rank: '1/1', shape: 'circle', type: 'passive' },
      { id: 378280, row: 3, col: 5, name: 'Barricade of Faith', icon: 'inv_shield_06', rank: '1/1', shape: 'circle', type: 'passive' },
      { id: 378281, row: 3, col: 6, name: 'Grand Crusader', icon: 'spell_holy_crusaderaura', rank: '1/1', shape: 'circle', type: 'passive' },

      // Fila 4
      { id: 378974, row: 4, col: 1, name: 'Soaring Shield', icon: 'ability_paladin_shieldofthetemplar', rank: '1/1', shape: 'circle', type: 'passive' },
      { id: 383280, row: 4, col: 3, name: 'Shining Light', icon: 'spell_holy_surgeoflight', rank: '1/1', shape: 'circle', type: 'passive' },
      { id: 383282, row: 4, col: 5, name: 'Inmost Light', icon: 'spell_holy_divineillumination', rank: '1/1', shape: 'circle', type: 'passive' },
      { id: 383283, row: 4, col: 7, name: 'Bastion of Light', icon: 'spell_holy_auramastery', rank: '1/1', shape: 'square', type: 'active' },

      // Fila 5
      { id: 383342, row: 5, col: 2, name: 'Bulwark of Order', icon: 'spell_holy_powerwordshield', rank: '2/2', shape: 'circle', type: 'passive' },
      { id: 31850, row: 5, col: 4, name: 'Ardent Defender', icon: 'spell_holy_ardentdefender', rank: '1/1', shape: 'square', type: 'active' },
      { id: 383344, row: 5, col: 6, name: 'Faith in the Light', icon: 'spell_holy_purifyingpower', rank: '2/2', shape: 'circle', type: 'passive' },

      // Fila 6
      { id: 383347, row: 6, col: 1, name: 'Tirion\'s Devotion', icon: 'spell_holy_holyguidance', rank: '1/1', shape: 'circle', type: 'passive' },
      { id: 86659, row: 6, col: 3, name: 'Guardian of Ancient Kings', icon: 'spell_holy_heroism', rank: '1/1', shape: 'square', type: 'active' },
      { id: 383349, row: 6, col: 5, name: 'Eye of Tyr', icon: 'ability_paladin_eyeoftyr', rank: '1/1', shape: 'square', type: 'active' },
      { id: 383350, row: 6, col: 7, name: 'Resolute Defender', icon: 'spell_holy_retributionaura', rank: '2/2', shape: 'circle', type: 'passive' },

      // Fila 7
      { id: 378285, row: 7, col: 2, name: 'Righteous Protector', icon: 'ability_paladin_shieldofvengence', rank: '1/1', shape: 'circle', type: 'passive' },
      { id: 378286, row: 7, col: 4, name: 'Sentinel', icon: 'spell_holy_ashestoashes', rank: '1/1', shape: 'square', type: 'active' },
      { id: 378287, row: 7, col: 6, name: 'Final Stand', icon: 'spell_holy_unyieldingfaith', rank: '1/1', shape: 'circle', type: 'passive' }
    ]
  }
};
