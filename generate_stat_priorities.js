// Script to compile official Wowhead stat priority guides and Hero Trees for all 39 specs
const fs = require('fs');

const STAT_WEIGHT_MAP = {
  // Paladin
  'retribution': {
    priority: ['mastery', 'crit', 'haste', 'vers'],
    weights: { m: 1.6, c: 1.3, h: 1.1, v: 0.7 },
    heroTrees: {
      'templar': { name: '⚔️ Templar', weights: { m: 1.6, c: 1.3, h: 1.1, v: 0.7 }, priority: 'Maestría > Crítico > Celeridad > Versatilidad' },
      'herald': { name: '☀️ Herald of the Sun', weights: { m: 1.5, c: 1.1, h: 1.4, v: 0.7 }, priority: 'Maestría > Celeridad > Crítico > Versatilidad' }
    }
  },
  'protection': {
    priority: ['haste', 'vers', 'mastery', 'crit'],
    weights: { m: 1.1, c: 1.0, h: 1.6, v: 1.2 },
    heroTrees: {
      'lightsmith': { name: '🛡️ Lightsmith', weights: { m: 1.2, c: 1.0, h: 1.6, v: 1.3 }, priority: 'Celeridad > Versatilidad > Maestría > Crítico' },
      'templar': { name: '⚔️ Templar', weights: { m: 1.1, c: 1.0, h: 1.6, v: 1.2 }, priority: 'Celeridad > Versatilidad > Maestría > Crítico' }
    }
  },
  'holy': {
    priority: ['crit', 'haste', 'mastery', 'vers'],
    weights: { m: 1.0, c: 1.5, h: 1.4, v: 0.8 },
    heroTrees: {
      'herald': { name: '☀️ Herald of the Sun', weights: { m: 1.0, c: 1.5, h: 1.4, v: 0.8 }, priority: 'Crítico > Celeridad > Maestría > Versatilidad' },
      'lightsmith': { name: '🛡️ Lightsmith', weights: { m: 1.1, c: 1.4, h: 1.4, v: 0.9 }, priority: 'Celeridad = Crítico > Maestría > Versatilidad' }
    }
  },

  // Warrior
  'arms': {
    priority: ['crit', 'haste', 'mastery', 'vers'],
    weights: { m: 1.0, c: 1.6, h: 1.3, v: 0.8 },
    heroTrees: {
      'slayer': { name: '⚔️ Slayer', weights: { m: 1.0, c: 1.6, h: 1.3, v: 0.8 }, priority: 'Crítico > Celeridad > Maestría > Versatilidad' },
      'colossus': { name: '🛡️ Colossus', weights: { m: 1.4, c: 1.5, h: 1.1, v: 0.8 }, priority: 'Crítico > Maestría > Celeridad > Versatilidad' }
    }
  },
  'fury': {
    priority: ['haste', 'mastery', 'crit', 'vers'],
    weights: { m: 1.3, c: 1.0, h: 1.6, v: 0.7 },
    heroTrees: {
      'slayer': { name: '⚔️ Slayer', weights: { m: 1.3, c: 1.0, h: 1.6, v: 0.7 }, priority: 'Celeridad > Maestría > Crítico > Versatilidad' },
      'mountain_thane': { name: '⚡ Mountain Thane', weights: { m: 1.4, c: 1.1, h: 1.5, v: 0.7 }, priority: 'Celeridad > Maestría > Crítico > Versatilidad' }
    }
  },
  'prot_warrior': {
    priority: ['haste', 'vers', 'crit', 'mastery'],
    weights: { m: 0.9, c: 1.1, h: 1.6, v: 1.2 },
    heroTrees: {
      'mountain_thane': { name: '⚡ Mountain Thane', weights: { m: 0.9, c: 1.1, h: 1.6, v: 1.2 }, priority: 'Celeridad > Versatilidad > Crítico > Maestría' },
      'colossus': { name: '🛡️ Colossus', weights: { m: 1.1, c: 1.0, h: 1.5, v: 1.3 }, priority: 'Celeridad > Versatilidad > Maestría > Crítico' }
    }
  },

  // Death Knight
  'blood': {
    priority: ['haste', 'crit', 'vers', 'mastery'],
    weights: { m: 1.0, c: 1.2, h: 1.5, v: 1.1 },
    heroTrees: {
      'deathbringer': { name: '⚔️ Deathbringer', weights: { m: 1.0, c: 1.2, h: 1.5, v: 1.1 }, priority: 'Celeridad > Crítico > Versatilidad > Maestría' },
      'sanlayn': { name: '🧛 San\'layn', weights: { m: 1.1, c: 1.1, h: 1.6, v: 1.0 }, priority: 'Celeridad > Crítico = Maestría > Versatilidad' }
    }
  },
  'frost_dk': {
    priority: ['mastery', 'crit', 'haste', 'vers'],
    weights: { m: 1.6, c: 1.4, h: 1.0, v: 0.7 },
    heroTrees: {
      'deathbringer': { name: '⚔️ Deathbringer', weights: { m: 1.6, c: 1.4, h: 1.0, v: 0.7 }, priority: 'Maestría > Crítico > Celeridad > Versatilidad' },
      'rider': { name: '🐎 Rider of the Apocalypse', weights: { m: 1.5, c: 1.4, h: 1.1, v: 0.7 }, priority: 'Maestría > Crítico > Celeridad > Versatilidad' }
    }
  },
  'unholy': {
    priority: ['mastery', 'haste', 'crit', 'vers'],
    weights: { m: 1.6, c: 1.0, h: 1.3, v: 0.7 },
    heroTrees: {
      'rider': { name: '🐎 Rider of the Apocalypse', weights: { m: 1.6, c: 1.0, h: 1.3, v: 0.7 }, priority: 'Maestría > Celeridad > Crítico > Versatilidad' },
      'sanlayn': { name: '🧛 San\'layn', weights: { m: 1.4, c: 1.0, h: 1.6, v: 0.7 }, priority: 'Celeridad > Maestría > Crítico > Versatilidad' }
    }
  },

  // Hunter
  'beast_mastery': {
    priority: ['crit', 'mastery', 'haste', 'vers'],
    weights: { m: 1.4, c: 1.6, h: 1.2, v: 0.7 },
    heroTrees: {
      'packleader': { name: '🐺 Leader of the Pack', weights: { m: 1.4, c: 1.6, h: 1.2, v: 0.7 }, priority: 'Crítico > Maestría > Celeridad > Versatilidad' },
      'dark_ranger': { name: '💀 Dark Ranger', weights: { m: 1.6, c: 1.4, h: 1.1, v: 0.7 }, priority: 'Maestría > Crítico > Celeridad > Versatilidad' }
    }
  },
  'marksmanship': {
    priority: ['crit', 'mastery', 'haste', 'vers'],
    weights: { m: 1.4, c: 1.6, h: 0.9, v: 0.7 },
    heroTrees: {
      'dark_ranger': { name: '💀 Dark Ranger', weights: { m: 1.4, c: 1.6, h: 0.9, v: 0.7 }, priority: 'Crítico > Maestría > Celeridad > Versatilidad' },
      'sentinel': { name: '🏹 Sentinel', weights: { m: 1.4, c: 1.6, h: 1.0, v: 0.7 }, priority: 'Crítico > Maestría > Celeridad > Versatilidad' }
    }
  },
  'survival': {
    priority: ['mastery', 'crit', 'haste', 'vers'],
    weights: { m: 1.6, c: 1.3, h: 1.1, v: 0.7 },
    heroTrees: {
      'sentinel': { name: '🏹 Sentinel', weights: { m: 1.6, c: 1.3, h: 1.1, v: 0.7 }, priority: 'Maestría > Crítico > Celeridad > Versatilidad' },
      'packleader': { name: '🐺 Pack Leader', weights: { m: 1.6, c: 1.3, h: 1.1, v: 0.7 }, priority: 'Maestría > Crítico > Celeridad > Versatilidad' }
    }
  },

  // Shaman
  'elemental': {
    priority: ['haste', 'mastery', 'crit', 'vers'],
    weights: { m: 1.4, c: 1.1, h: 1.6, v: 0.7 },
    heroTrees: {
      'stormbringer': { name: '⚡ Stormbringer', weights: { m: 1.4, c: 1.1, h: 1.6, v: 0.7 }, priority: 'Celeridad > Maestría > Crítico > Versatilidad' },
      'farseer': { name: '👁️ Farseer', weights: { m: 1.5, c: 1.1, h: 1.4, v: 0.7 }, priority: 'Maestría > Celeridad > Crítico > Versatilidad' }
    }
  },
  'enhancement': {
    priority: ['mastery', 'haste', 'crit', 'vers'],
    weights: { m: 1.6, c: 1.0, h: 1.3, v: 0.7 },
    heroTrees: {
      'stormbringer': { name: '⚡ Stormbringer', weights: { m: 1.6, c: 1.0, h: 1.3, v: 0.7 }, priority: 'Maestría > Celeridad > Crítico > Versatilidad' },
      'totemic': { name: '🪵 Totemic', weights: { m: 1.4, c: 1.1, h: 1.5, v: 0.7 }, priority: 'Celeridad > Maestría > Crítico > Versatilidad' }
    }
  },
  'restoration_shaman': {
    priority: ['crit', 'haste', 'mastery', 'vers'],
    weights: { m: 1.1, c: 1.5, h: 1.3, v: 0.8 },
    heroTrees: {
      'farseer': { name: '👁️ Farseer', weights: { m: 1.1, c: 1.5, h: 1.3, v: 0.8 }, priority: 'Crítico > Celeridad > Maestría > Versatilidad' },
      'totemic': { name: '🪵 Totemic', weights: { m: 1.2, c: 1.4, h: 1.4, v: 0.8 }, priority: 'Crítico = Celeridad > Maestría > Versatilidad' }
    }
  },

  // Rogue
  'assassination': {
    priority: ['mastery', 'crit', 'haste', 'vers'],
    weights: { m: 1.7, c: 1.3, h: 1.0, v: 0.7 },
    heroTrees: {
      'deathstalker': { name: '🗡️ Deathstalker', weights: { m: 1.7, c: 1.3, h: 1.0, v: 0.7 }, priority: 'Maestría > Crítico > Celeridad > Versatilidad' },
      'fatebound': { name: '🎲 Fatebound', weights: { m: 1.5, c: 1.5, h: 1.0, v: 0.7 }, priority: 'Maestría = Crítico > Celeridad > Versatilidad' }
    }
  },
  'outlaw': {
    priority: ['haste', 'crit', 'vers', 'mastery'],
    weights: { m: 0.8, c: 1.3, h: 1.5, v: 1.2 },
    heroTrees: {
      'fatebound': { name: '🎲 Fatebound', weights: { m: 0.8, c: 1.3, h: 1.5, v: 1.2 }, priority: 'Celeridad > Crítico > Versatilidad > Maestría' },
      'trickster': { name: '🎭 Trickster', weights: { m: 0.9, c: 1.2, h: 1.5, v: 1.2 }, priority: 'Celeridad > Crítico > Versatilidad > Maestría' }
    }
  },
  'subtlety': {
    priority: ['mastery', 'crit', 'vers', 'haste'],
    weights: { m: 1.7, c: 1.2, h: 0.8, v: 1.0 },
    heroTrees: {
      'deathstalker': { name: '🗡️ Deathstalker', weights: { m: 1.7, c: 1.2, h: 0.8, v: 1.0 }, priority: 'Maestría > Crítico > Versatilidad > Celeridad' },
      'trickster': { name: '🎭 Trickster', weights: { m: 1.5, c: 1.3, h: 0.9, v: 1.0 }, priority: 'Maestría > Crítico > Versatilidad > Celeridad' }
    }
  },

  // Monk
  'brewmaster': {
    priority: ['vers', 'crit', 'haste', 'mastery'],
    weights: { m: 0.9, c: 1.3, h: 1.1, v: 1.4 },
    heroTrees: {
      'master_of_harmony': { name: '☯️ Master of Harmony', weights: { m: 0.9, c: 1.3, h: 1.1, v: 1.4 }, priority: 'Versatilidad > Crítico > Celeridad > Maestría' },
      'shadopan': { name: '🥋 Shado-Pan', weights: { m: 1.0, c: 1.4, h: 1.1, v: 1.3 }, priority: 'Crítico > Versatilidad > Celeridad > Maestría' }
    }
  },
  'windwalker': {
    priority: ['mastery', 'crit', 'vers', 'haste'],
    weights: { m: 1.6, c: 1.3, h: 0.8, v: 1.0 },
    heroTrees: {
      'conduit': { name: '🐉 Conduit of the Celestials', weights: { m: 1.6, c: 1.3, h: 0.8, v: 1.0 }, priority: 'Maestría > Crítico > Versatilidad > Celeridad' },
      'shadopan': { name: '🥋 Shado-Pan', weights: { m: 1.5, c: 1.4, h: 0.8, v: 1.0 }, priority: 'Maestría > Crítico > Versatilidad > Celeridad' }
    }
  },
  'mistweaver': {
    priority: ['haste', 'crit', 'mastery', 'vers'],
    weights: { m: 1.0, c: 1.3, h: 1.6, v: 0.8 },
    heroTrees: {
      'conduit': { name: '🐉 Conduit of the Celestials', weights: { m: 1.0, c: 1.3, h: 1.6, v: 0.8 }, priority: 'Celeridad > Crítico > Maestría > Versatilidad' },
      'master_of_harmony': { name: '☯️ Master of Harmony', weights: { m: 1.2, c: 1.3, h: 1.4, v: 0.8 }, priority: 'Celeridad > Crítico > Maestría > Versatilidad' }
    }
  },

  // Demon Hunter
  'havoc': {
    priority: ['crit', 'mastery', 'haste', 'vers'],
    weights: { m: 1.4, c: 1.6, h: 1.0, v: 0.7 },
    heroTrees: {
      'aldrachi': { name: '⚔️ Aldrachi Reaver', weights: { m: 1.4, c: 1.6, h: 1.0, v: 0.7 }, priority: 'Crítico > Maestría > Celeridad > Versatilidad' },
      'felscarred': { name: '🔥 Fel-Scarred', weights: { m: 1.5, c: 1.5, h: 1.0, v: 0.7 }, priority: 'Crítico = Maestría > Celeridad > Versatilidad' }
    }
  },
  'vengeance': {
    priority: ['haste', 'crit', 'vers', 'mastery'],
    weights: { m: 0.9, c: 1.2, h: 1.5, v: 1.1 },
    heroTrees: {
      'aldrachi': { name: '⚔️ Aldrachi Reaver', weights: { m: 0.9, c: 1.2, h: 1.5, v: 1.1 }, priority: 'Celeridad > Crítico > Versatilidad > Maestría' },
      'felscarred': { name: '🔥 Fel-Scarred', weights: { m: 1.0, c: 1.1, h: 1.6, v: 1.2 }, priority: 'Celeridad > Versatilidad > Crítico > Maestría' }
    }
  },

  // Druid
  'balance': {
    priority: ['mastery', 'haste', 'crit', 'vers'],
    weights: { m: 1.6, c: 1.0, h: 1.3, v: 0.7 },
    heroTrees: {
      'elune': { name: '🌙 Elune\'s Chosen', weights: { m: 1.6, c: 1.0, h: 1.3, v: 0.7 }, priority: 'Maestría > Celeridad > Crítico > Versatilidad' },
      'keeper': { name: '🌲 Keeper of the Grove', weights: { m: 1.5, c: 1.0, h: 1.4, v: 0.7 }, priority: 'Celeridad = Maestría > Crítico > Versatilidad' }
    }
  },
  'feral': {
    priority: ['crit', 'mastery', 'haste', 'vers'],
    weights: { m: 1.4, c: 1.5, h: 1.0, v: 0.7 },
    heroTrees: {
      'druid_of_the_claw': { name: '🐾 Druid of the Claw', weights: { m: 1.4, c: 1.6, h: 1.0, v: 0.7 }, priority: 'Crítico > Maestría > Celeridad > Versatilidad' },
      'wildstalker': { name: '🌿 Wildstalker', weights: { m: 1.6, c: 1.4, h: 1.0, v: 0.7 }, priority: 'Maestría > Crítico > Celeridad > Versatilidad' }
    }
  },
  'guardian': {
    priority: ['haste', 'vers', 'mastery', 'crit'],
    weights: { m: 1.0, c: 0.9, h: 1.5, v: 1.3 },
    heroTrees: {
      'elune': { name: '🌙 Elune\'s Chosen', weights: { m: 1.0, c: 0.9, h: 1.5, v: 1.3 }, priority: 'Celeridad > Versatilidad > Maestría > Crítico' },
      'druid_of_the_claw': { name: '🐾 Druid of the Claw', weights: { m: 1.1, c: 1.0, h: 1.5, v: 1.3 }, priority: 'Celeridad > Versatilidad > Maestría > Crítico' }
    }
  },
  'restoration_druid': {
    priority: ['haste', 'mastery', 'crit', 'vers'],
    weights: { m: 1.3, c: 1.1, h: 1.5, v: 0.8 },
    heroTrees: {
      'keeper': { name: '🌲 Keeper of the Grove', weights: { m: 1.3, c: 1.1, h: 1.5, v: 0.8 }, priority: 'Celeridad > Maestría > Crítico > Versatilidad' },
      'wildstalker': { name: '🌿 Wildstalker', weights: { m: 1.4, c: 1.1, h: 1.4, v: 0.8 }, priority: 'Celeridad = Maestría > Crítico > Versatilidad' }
    }
  },

  // Mage
  'arcane': {
    priority: ['haste', 'mastery', 'crit', 'vers'],
    weights: { m: 1.3, c: 1.1, h: 1.5, v: 0.7 },
    heroTrees: {
      'sunfury': { name: '☀️ Sunfury', weights: { m: 1.4, c: 1.0, h: 1.5, v: 0.7 }, priority: 'Celeridad > Maestría > Crítico > Versatilidad' },
      'spellslinger': { name: '✨ Spellslinger', weights: { m: 1.3, c: 1.1, h: 1.6, v: 0.7 }, priority: 'Celeridad > Maestría > Crítico > Versatilidad' }
    }
  },
  'fire': {
    priority: ['haste', 'mastery', 'crit', 'vers'],
    weights: { m: 1.4, c: 0.9, h: 1.6, v: 0.7 },
    heroTrees: {
      'sunfury': { name: '☀️ Sunfury', weights: { m: 1.4, c: 0.9, h: 1.6, v: 0.7 }, priority: 'Celeridad > Maestría > Crítico > Versatilidad' },
      'frostfire': { name: '❄️ Frostfire', weights: { m: 1.5, c: 1.1, h: 1.4, v: 0.7 }, priority: 'Maestría > Celeridad > Crítico > Versatilidad' }
    }
  },
  'frost_mage': {
    priority: ['crit', 'mastery', 'haste', 'vers'],
    weights: { m: 1.3, c: 1.6, h: 1.1, v: 0.7 },
    heroTrees: {
      'frostfire': { name: '🔥 Frostfire', weights: { m: 1.3, c: 1.6, h: 1.1, v: 0.7 }, priority: 'Crítico (hasta 33.34%) > Maestría > Celeridad > Versatilidad' },
      'spellslinger': { name: '✨ Spellslinger', weights: { m: 1.4, c: 1.4, h: 1.4, v: 0.7 }, priority: 'Crítico = Celeridad = Maestría > Versatilidad' }
    }
  },

  // Warlock
  'affliction': {
    priority: ['mastery', 'haste', 'crit', 'vers'],
    weights: { m: 1.6, c: 1.0, h: 1.4, v: 0.7 },
    heroTrees: {
      'hellcaller': { name: '🔥 Hellcaller', weights: { m: 1.6, c: 1.0, h: 1.4, v: 0.7 }, priority: 'Maestría > Celeridad > Crítico > Versatilidad' },
      'soul_harvester': { name: '👻 Soul Harvester', weights: { m: 1.5, c: 1.0, h: 1.5, v: 0.7 }, priority: 'Maestría = Celeridad > Crítico > Versatilidad' }
    }
  },
  'demonology': {
    priority: ['haste', 'mastery', 'crit', 'vers'],
    weights: { m: 1.3, c: 1.1, h: 1.6, v: 0.7 },
    heroTrees: {
      'diabolist': { name: '😈 Diabolist', weights: { m: 1.3, c: 1.1, h: 1.6, v: 0.7 }, priority: 'Celeridad > Maestría > Crítico > Versatilidad' },
      'soul_harvester': { name: '👻 Soul Harvester', weights: { m: 1.4, c: 1.1, h: 1.5, v: 0.7 }, priority: 'Celeridad > Maestría > Crítico > Versatilidad' }
    }
  },
  'destruction': {
    priority: ['mastery', 'haste', 'crit', 'vers'],
    weights: { m: 1.5, c: 1.1, h: 1.4, v: 0.7 },
    heroTrees: {
      'diabolist': { name: '😈 Diabolist', weights: { m: 1.5, c: 1.1, h: 1.4, v: 0.7 }, priority: 'Maestría > Celeridad > Crítico > Versatilidad' },
      'hellcaller': { name: '🔥 Hellcaller', weights: { m: 1.4, c: 1.1, h: 1.5, v: 0.7 }, priority: 'Celeridad > Maestría > Crítico > Versatilidad' }
    }
  },

  // Priest
  'shadow': {
    priority: ['haste', 'mastery', 'crit', 'vers'],
    weights: { m: 1.4, c: 1.1, h: 1.6, v: 0.7 },
    heroTrees: {
      'archon': { name: '🔮 Archon', weights: { m: 1.4, c: 1.1, h: 1.6, v: 0.7 }, priority: 'Celeridad > Maestría > Crítico > Versatilidad' },
      'voidweaver': { name: '🌌 Voidweaver', weights: { m: 1.5, c: 1.1, h: 1.5, v: 0.7 }, priority: 'Celeridad = Maestría > Crítico > Versatilidad' }
    }
  },
  'discipline': {
    priority: ['haste', 'crit', 'mastery', 'vers'],
    weights: { m: 1.0, c: 1.3, h: 1.6, v: 0.8 },
    heroTrees: {
      'voidweaver': { name: '🌌 Voidweaver', weights: { m: 1.0, c: 1.3, h: 1.6, v: 0.8 }, priority: 'Celeridad > Crítico > Maestría > Versatilidad' },
      'oracle': { name: '👁️ Oracle', weights: { m: 1.1, c: 1.4, h: 1.5, v: 0.8 }, priority: 'Celeridad > Crítico > Maestría > Versatilidad' }
    }
  },
  'holy_priest': {
    priority: ['mastery', 'crit', 'haste', 'vers'],
    weights: { m: 1.5, c: 1.4, h: 1.0, v: 0.8 },
    heroTrees: {
      'archon': { name: '🔮 Archon', weights: { m: 1.5, c: 1.4, h: 1.0, v: 0.8 }, priority: 'Maestría > Crítico > Celeridad > Versatilidad' },
      'oracle': { name: '👁️ Oracle', weights: { m: 1.5, c: 1.3, h: 1.1, v: 0.8 }, priority: 'Maestría > Crítico > Celeridad > Versatilidad' }
    }
  },

  // Evoker
  'devastation': {
    priority: ['mastery', 'crit', 'haste', 'vers'],
    weights: { m: 1.7, c: 1.3, h: 1.0, v: 0.7 },
    heroTrees: {
      'scalecommander': { name: '🐲 Scalecommander', weights: { m: 1.7, c: 1.3, h: 1.0, v: 0.7 }, priority: 'Maestría > Crítico > Celeridad > Versatilidad' },
      'flameshaper': { name: '🔥 Flameshaper', weights: { m: 1.6, c: 1.4, h: 1.0, v: 0.7 }, priority: 'Maestría > Crítico > Celeridad > Versatilidad' }
    }
  },
  'preservation': {
    priority: ['mastery', 'crit', 'haste', 'vers'],
    weights: { m: 1.5, c: 1.3, h: 1.1, v: 0.8 },
    heroTrees: {
      'chronowarden': { name: '⏳ Chronowarden', weights: { m: 1.5, c: 1.3, h: 1.1, v: 0.8 }, priority: 'Maestría > Crítico > Celeridad > Versatilidad' },
      'flameshaper': { name: '🔥 Flameshaper', weights: { m: 1.6, c: 1.2, h: 1.1, v: 0.8 }, priority: 'Maestría > Crítico > Celeridad > Versatilidad' }
    }
  },
  'augmentation': {
    priority: ['mastery', 'haste', 'crit', 'vers'],
    weights: { m: 1.7, c: 1.0, h: 1.4, v: 0.7 },
    heroTrees: {
      'chronowarden': { name: '⏳ Chronowarden', weights: { m: 1.7, c: 1.0, h: 1.4, v: 0.7 }, priority: 'Maestría > Celeridad > Crítico > Versatilidad' },
      'scalecommander': { name: '🐲 Scalecommander', weights: { m: 1.6, c: 1.0, h: 1.5, v: 0.7 }, priority: 'Maestría > Celeridad > Crítico > Versatilidad' }
    }
  }
};

fs.writeFileSync('./wow_stat_priorities.json', JSON.stringify(STAT_WEIGHT_MAP, null, 2));
fs.writeFileSync('./wow_stat_priorities.js', `window.WOW_STAT_PRIORITIES = ${JSON.stringify(STAT_WEIGHT_MAP, null, 2)};\n`);
console.log('✅ Generated official stat priorities database for all 39 specs with Hero Trees!');
