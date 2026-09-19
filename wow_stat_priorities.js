// WOWHEAD STAT PRIORITIES Y HERO TREES OFICIALES EXTRAÍDOS
window.WOWHEAD_STAT_PRIORITIES = {
  "deathknight": {
    "blood": {
      "name": "Blood Death Knight",
      "guideUrl": "https://www.wowhead.com/guide/classes/death-knight/blood/stat-priority-pve-tank",
      "heroTrees": {
        "San'layn": {
          "rawList": [
            "Strength",
            "Haste",
            "Mastery / Critical Strike / Versatility"
          ],
          "secondaryOrder": "Haste > Mastery = Crit = Vers",
          "weights": {
            "m": 1.3,
            "c": 1.3,
            "h": 1.6,
            "v": 1.3
          }
        },
        "Deathbringer": {
          "rawList": [
            "Strength",
            "Critical Strike",
            "Mastery / Versatility",
            "Haste"
          ],
          "secondaryOrder": "Crit > Mastery = Vers > Haste",
          "weights": {
            "m": 1.3,
            "c": 1.6,
            "h": 1,
            "v": 1.3
          }
        }
      }
    },
    "frost_dk": {
      "name": "Frost Death Knight",
      "guideUrl": "https://www.wowhead.com/guide/classes/death-knight/frost/stat-priority-pve-dps",
      "heroTrees": {
        "Deathbringer": {
          "rawList": [
            "Strength",
            "Critical Strike",
            "Mastery",
            "Haste",
            "Versatility"
          ],
          "secondaryOrder": "Crit > Mastery > Haste > Vers",
          "weights": {
            "m": 1.3,
            "c": 1.6,
            "h": 1,
            "v": 0.7
          }
        },
        "Rider of the Apocalypse": {
          "rawList": [
            "Strength",
            "Critical Strike",
            "Mastery",
            "Haste",
            "Versatility"
          ],
          "secondaryOrder": "Crit > Mastery > Haste > Vers",
          "weights": {
            "m": 1.3,
            "c": 1.6,
            "h": 1,
            "v": 0.7
          }
        }
      }
    },
    "unholy": {
      "name": "Unholy Death Knight",
      "guideUrl": "https://www.wowhead.com/guide/classes/death-knight/unholy/stat-priority-pve-dps",
      "heroTrees": {
        "San'layn": {
          "rawList": [
            "Strength",
            "Crit",
            "Mastery",
            "Haste",
            "Versatility"
          ],
          "secondaryOrder": "Crit > Mastery > Haste > Vers",
          "weights": {
            "m": 1.3,
            "c": 1.6,
            "h": 1,
            "v": 0.7
          }
        },
        "Rider of the Apocalypse": {
          "rawList": [
            "Strength",
            "Crit",
            "Mastery",
            "Haste",
            "Versatility"
          ],
          "secondaryOrder": "Crit > Mastery > Haste > Vers",
          "weights": {
            "m": 1.3,
            "c": 1.6,
            "h": 1,
            "v": 0.7
          }
        }
      }
    }
  },
  "demonhunter": {
    "havoc": {
      "name": "Havoc Demon Hunter",
      "guideUrl": "https://www.wowhead.com/guide/classes/demon-hunter/havoc/stat-priority-pve-dps",
      "heroTrees": {
        "Fel-Scarred": {
          "rawList": [
            "Agility",
            "Critical Strike",
            "Mastery",
            "Haste",
            "Versatility"
          ],
          "secondaryOrder": "Crit > Mastery > Haste > Vers",
          "weights": {
            "m": 1.3,
            "c": 1.6,
            "h": 1,
            "v": 0.7
          }
        },
        "Aldrachi Reaver": {
          "rawList": [
            "Agility",
            "Critical Strike",
            "Mastery",
            "Haste",
            "Versatility"
          ],
          "secondaryOrder": "Crit > Mastery > Haste > Vers",
          "weights": {
            "m": 1.3,
            "c": 1.6,
            "h": 1,
            "v": 0.7
          }
        }
      }
    },
    "vengeance": {
      "name": "Vengeance Demon Hunter",
      "guideUrl": "https://www.wowhead.com/guide/classes/demon-hunter/vengeance/stat-priority-pve-tank",
      "heroTrees": {
        "Aldrachi Reaver": {
          "rawList": [
            "Item Level (Agility+Stamina)",
            "Haste",
            "Crit",
            "Versatility",
            "Mastery"
          ],
          "secondaryOrder": "Haste > Crit > Vers > Mastery",
          "weights": {
            "m": 0.7,
            "c": 1.3,
            "h": 1.6,
            "v": 1
          }
        },
        "Fel-Scarred": {
          "rawList": [
            "Item Level (Agility+Stamina)",
            "Haste",
            "Crit",
            "Versatility",
            "Mastery"
          ],
          "secondaryOrder": "Haste > Crit > Vers > Mastery",
          "weights": {
            "m": 0.7,
            "c": 1.3,
            "h": 1.6,
            "v": 1
          }
        }
      }
    },
    "devourer": {
      "name": "Devourer Demon Hunter",
      "guideUrl": "https://www.wowhead.com/guide/classes/demon-hunter/devourer/stat-priority-pve-dps",
      "heroTrees": {
        "Annihilator": {
          "rawList": [
            "Intellect",
            "Haste",
            "Mastery",
            "Critical Strike",
            "Versatility"
          ],
          "secondaryOrder": "Haste > Mastery > Crit > Vers",
          "weights": {
            "m": 1.3,
            "c": 1,
            "h": 1.6,
            "v": 0.7
          }
        },
        "Void-Scarred": {
          "rawList": [
            "Intellect",
            "Haste (until 800/18%-20%)",
            "Critical Strike",
            "Mastery",
            "Versatility",
            "Haste (above 800/18%-20%)."
          ],
          "secondaryOrder": "Haste > Crit > Mastery > Vers > Haste",
          "weights": {
            "m": 1,
            "c": 1.3,
            "h": 0.6,
            "v": 0.7
          }
        }
      }
    }
  },
  "druid": {
    "balance": {
      "name": "Balance Druid",
      "guideUrl": "https://www.wowhead.com/guide/classes/druid/balance/stat-priority-pve-dps",
      "heroTrees": {
        "Keeper of the Grove": {
          "rawList": [
            "Intellect",
            "Mastery",
            "Haste = Critical Strike",
            "Versatility"
          ],
          "secondaryOrder": "Mastery > Crit = Haste > Vers",
          "weights": {
            "m": 1.6,
            "c": 1.3,
            "h": 1.3,
            "v": 1
          }
        },
        "Elune's Chosen": {
          "rawList": [
            "Intellect",
            "Mastery",
            "Haste",
            "Critical Strike",
            "Versatility"
          ],
          "secondaryOrder": "Mastery > Haste > Crit > Vers",
          "weights": {
            "m": 1.6,
            "c": 1,
            "h": 1.3,
            "v": 0.7
          }
        }
      }
    },
    "feral": {
      "name": "Feral Druid",
      "guideUrl": "https://www.wowhead.com/guide/classes/druid/feral/stat-priority-pve-dps",
      "heroTrees": {
        "Druid of the Claw": {
          "rawList": [
            "Agility",
            "Mastery",
            "Haste",
            "Critical Strike",
            "Versatility"
          ],
          "secondaryOrder": "Mastery > Haste > Crit > Vers",
          "weights": {
            "m": 1.6,
            "c": 1,
            "h": 1.3,
            "v": 0.7
          }
        },
        "Wildstalker": {
          "rawList": [
            "Agility",
            "Mastery",
            "Critical Strike",
            "Haste",
            "Versatility"
          ],
          "secondaryOrder": "Mastery > Crit > Haste > Vers",
          "weights": {
            "m": 1.6,
            "c": 1.3,
            "h": 1,
            "v": 0.7
          }
        }
      }
    },
    "guardian": {
      "name": "Guardian Druid",
      "guideUrl": "https://www.wowhead.com/guide/classes/druid/guardian/stat-priority-pve-tank",
      "heroTrees": {
        "Druid of the Claw": {
          "rawList": [
            "Agility",
            "Haste",
            "Versatility",
            "Critical Strike",
            "Mastery"
          ],
          "secondaryOrder": "Haste > Vers > Crit > Mastery",
          "weights": {
            "m": 0.7,
            "c": 1,
            "h": 1.6,
            "v": 1.3
          }
        },
        "Elune's Chosen": {
          "rawList": [
            "Agility",
            "Haste",
            "Versatility",
            "Critical Strike",
            "Mastery"
          ],
          "secondaryOrder": "Haste > Vers > Crit > Mastery",
          "weights": {
            "m": 0.7,
            "c": 1,
            "h": 1.6,
            "v": 1.3
          }
        }
      }
    },
    "restoration_druid": {
      "name": "Restoration Druid",
      "guideUrl": "https://www.wowhead.com/guide/classes/druid/restoration/stat-priority-pve-healer",
      "heroTrees": {
        "Keeper of the Grove": {
          "rawList": [
            "Intellect",
            "Haste",
            "Mastery",
            "Versatility",
            "Critical Strike"
          ],
          "secondaryOrder": "Haste > Mastery > Vers > Crit",
          "weights": {
            "m": 1.3,
            "c": 0.7,
            "h": 1.6,
            "v": 1
          }
        },
        "Wildstalker": {
          "rawList": [
            "Intellect",
            "Haste",
            "Mastery",
            "Versatility",
            "Critical Strike"
          ],
          "secondaryOrder": "Haste > Mastery > Vers > Crit",
          "weights": {
            "m": 1.3,
            "c": 0.7,
            "h": 1.6,
            "v": 1
          }
        }
      }
    }
  },
  "evoker": {
    "devastation": {
      "name": "Devastation Evoker",
      "guideUrl": "https://www.wowhead.com/guide/classes/evoker/devastation/stat-priority-pve-dps",
      "heroTrees": {
        "Flameshaper": {
          "rawList": [
            "Intellect",
            "Critical Strike",
            "Mastery",
            "Haste",
            "Versatility"
          ],
          "secondaryOrder": "Crit > Mastery > Haste > Vers",
          "weights": {
            "m": 1.3,
            "c": 1.6,
            "h": 1,
            "v": 0.7
          }
        },
        "Scalecommander": {
          "rawList": [
            "Intellect",
            "Critical Strike",
            "Mastery",
            "Haste",
            "Versatility"
          ],
          "secondaryOrder": "Crit > Mastery > Haste > Vers",
          "weights": {
            "m": 1.3,
            "c": 1.6,
            "h": 1,
            "v": 0.7
          }
        }
      }
    },
    "preservation": {
      "name": "Preservation Evoker",
      "guideUrl": "https://www.wowhead.com/guide/classes/evoker/preservation/stat-priority-pve-healer",
      "heroTrees": {
        "Chronowarden": {
          "rawList": [
            "Intellect",
            "Crit",
            "Mastery",
            "Haste",
            "Versatility"
          ],
          "secondaryOrder": "Crit > Mastery > Haste > Vers",
          "weights": {
            "m": 1.3,
            "c": 1.6,
            "h": 1,
            "v": 0.7
          }
        },
        "Flameshaper": {
          "rawList": [
            "Intellect",
            "Crit",
            "Haste",
            "Mastery",
            "Versatility"
          ],
          "secondaryOrder": "Crit > Haste > Mastery > Vers",
          "weights": {
            "m": 1,
            "c": 1.6,
            "h": 1.3,
            "v": 0.7
          }
        }
      }
    },
    "augmentation": {
      "name": "Augmentation Evoker",
      "guideUrl": "https://www.wowhead.com/guide/classes/evoker/augmentation/stat-priority-pve-dps",
      "heroTrees": {
        "Chronowarden": {
          "rawList": [
            "Intellect",
            "Mastery",
            "Critical Strike",
            "Haste",
            "Versatility"
          ],
          "secondaryOrder": "Mastery > Crit > Haste > Vers",
          "weights": {
            "m": 1.6,
            "c": 1.3,
            "h": 1,
            "v": 0.7
          }
        },
        "Scalecommander": {
          "rawList": [
            "Intellect",
            "Mastery",
            "Critical Strike",
            "Haste",
            "Versatility"
          ],
          "secondaryOrder": "Mastery > Crit > Haste > Vers",
          "weights": {
            "m": 1.6,
            "c": 1.3,
            "h": 1,
            "v": 0.7
          }
        }
      }
    }
  },
  "hunter": {
    "beastmastery": {
      "name": "Beast Mastery Hunter",
      "guideUrl": "https://www.wowhead.com/guide/classes/hunter/beast-mastery/stat-priority-pve-dps",
      "heroTrees": {
        "Pack Leader": {
          "rawList": [
            "Weapon Damage",
            "Agility",
            "Mastery",
            "Critical Strike",
            "Haste",
            "Versatility"
          ],
          "secondaryOrder": "Mastery > Crit > Haste > Vers",
          "weights": {
            "m": 1.6,
            "c": 1.3,
            "h": 1,
            "v": 0.7
          }
        },
        "Dark Ranger": {
          "rawList": [
            "Weapon Damage",
            "Agility",
            "Mastery",
            "Critical Strike",
            "Haste",
            "Versatility"
          ],
          "secondaryOrder": "Mastery > Crit > Haste > Vers",
          "weights": {
            "m": 1.6,
            "c": 1.3,
            "h": 1,
            "v": 0.7
          }
        }
      }
    },
    "marksmanship": {
      "name": "Marksmanship Hunter",
      "guideUrl": "https://www.wowhead.com/guide/classes/hunter/marksmanship/stat-priority-pve-dps",
      "heroTrees": {
        "Dark Ranger": {
          "rawList": [
            "Agility",
            "Critical Strike",
            "Mastery",
            "Versatility",
            "Haste"
          ],
          "secondaryOrder": "Crit > Mastery > Vers > Haste",
          "weights": {
            "m": 1.3,
            "c": 1.6,
            "h": 0.7,
            "v": 1
          }
        },
        "Sentinel": {
          "rawList": [
            "Agility",
            "Critical Strike",
            "Mastery",
            "Versatility",
            "Haste"
          ],
          "secondaryOrder": "Crit > Mastery > Vers > Haste",
          "weights": {
            "m": 1.3,
            "c": 1.6,
            "h": 0.7,
            "v": 1
          }
        }
      }
    },
    "survival": {
      "name": "Survival Hunter",
      "guideUrl": "https://www.wowhead.com/guide/classes/hunter/survival/stat-priority-pve-dps",
      "heroTrees": {
        "Pack Leader": {
          "rawList": [
            "Agility",
            "Mastery",
            "Critical Strike and Haste",
            "Versatility"
          ],
          "secondaryOrder": "Mastery > Crit = Haste > Vers",
          "weights": {
            "m": 1.6,
            "c": 1.3,
            "h": 1.3,
            "v": 1
          }
        },
        "Sentinel": {
          "rawList": [
            "Agility",
            "Mastery",
            "Critical Strike",
            "Haste",
            "Versatility"
          ],
          "secondaryOrder": "Mastery > Crit > Haste > Vers",
          "weights": {
            "m": 1.6,
            "c": 1.3,
            "h": 1,
            "v": 0.7
          }
        }
      }
    }
  },
  "mage": {
    "arcane": {
      "name": "Arcane Mage",
      "guideUrl": "https://www.wowhead.com/guide/classes/mage/arcane/stat-priority-pve-dps",
      "heroTrees": {
        "Spellslinger": {
          "rawList": [
            "Intellect",
            "Haste",
            "Mastery",
            "Critical Strike",
            "Versatility"
          ],
          "secondaryOrder": "Haste > Mastery > Crit > Vers",
          "weights": {
            "m": 1.3,
            "c": 1,
            "h": 1.6,
            "v": 0.7
          }
        },
        "Sunfury": {
          "rawList": [
            "Intellect",
            "Haste",
            "Versatility",
            "Critical Strike",
            "Mastery"
          ],
          "secondaryOrder": "Haste > Vers > Crit > Mastery",
          "weights": {
            "m": 0.7,
            "c": 1,
            "h": 1.6,
            "v": 1.3
          }
        }
      }
    },
    "fire": {
      "name": "Fire Mage",
      "guideUrl": "https://www.wowhead.com/guide/classes/mage/fire/stat-priority-pve-dps",
      "heroTrees": {
        "Sunfury": {
          "rawList": [
            "Intellect",
            "Haste",
            "Mastery",
            "Versatility",
            "Critical Strike"
          ],
          "secondaryOrder": "Haste > Mastery > Vers > Crit",
          "weights": {
            "m": 1.3,
            "c": 0.7,
            "h": 1.6,
            "v": 1
          }
        },
        "Frostfire": {
          "rawList": [
            "Intellect",
            "Haste",
            "Mastery",
            "Versatility",
            "Critical Strike"
          ],
          "secondaryOrder": "Haste > Mastery > Vers > Crit",
          "weights": {
            "m": 1.3,
            "c": 0.7,
            "h": 1.6,
            "v": 1
          }
        }
      }
    },
    "frost_mage": {
      "name": "Frost Mage",
      "guideUrl": "https://www.wowhead.com/guide/classes/mage/frost/stat-priority-pve-dps",
      "heroTrees": {
        "Frostfire": {
          "rawList": [
            "Intellect",
            "Mastery",
            "Critical Strike",
            "Haste",
            "Versatility"
          ],
          "secondaryOrder": "Mastery > Crit > Haste > Vers",
          "weights": {
            "m": 1.6,
            "c": 1.3,
            "h": 1,
            "v": 0.7
          }
        },
        "Spellslinger": {
          "rawList": [
            "Intellect",
            "Mastery",
            "Critical Strike",
            "Haste",
            "Versatility"
          ],
          "secondaryOrder": "Mastery > Crit > Haste > Vers",
          "weights": {
            "m": 1.6,
            "c": 1.3,
            "h": 1,
            "v": 0.7
          }
        }
      }
    }
  },
  "monk": {
    "brewmaster": {
      "name": "Brewmaster Monk",
      "guideUrl": "https://www.wowhead.com/guide/classes/monk/brewmaster/stat-priority-pve-tank",
      "heroTrees": {
        "Shado-Pan": {
          "rawList": [
            "Item Level / Agility",
            "Critical Strike",
            "Versatility = Mastery",
            "Haste"
          ],
          "secondaryOrder": "Crit > Mastery = Vers > Haste",
          "weights": {
            "m": 1.3,
            "c": 1.6,
            "h": 1,
            "v": 1.3
          }
        },
        "Master of Harmony": {
          "rawList": [
            "Item Level / Agility",
            "Critical Strike",
            "Versatility = Mastery",
            "Haste"
          ],
          "secondaryOrder": "Crit > Mastery = Vers > Haste",
          "weights": {
            "m": 1.3,
            "c": 1.6,
            "h": 1,
            "v": 1.3
          }
        }
      }
    },
    "mistweaver": {
      "name": "Mistweaver Monk",
      "guideUrl": "https://www.wowhead.com/guide/classes/monk/mistweaver/stat-priority-pve-healer",
      "heroTrees": {
        "Conduit of the Celestials": {
          "rawList": [
            "Intellect",
            "Haste",
            "Critical Strike",
            "Versatility",
            "Mastery"
          ],
          "secondaryOrder": "Haste > Crit > Vers > Mastery",
          "weights": {
            "m": 0.7,
            "c": 1.3,
            "h": 1.6,
            "v": 1
          }
        },
        "Master of Harmony": {
          "rawList": [
            "Intellect",
            "Haste",
            "Mastery",
            "Critical Strike",
            "Versatility"
          ],
          "secondaryOrder": "Haste > Mastery > Crit > Vers",
          "weights": {
            "m": 1.3,
            "c": 1,
            "h": 1.6,
            "v": 0.7
          }
        }
      }
    },
    "windwalker": {
      "name": "Windwalker Monk",
      "guideUrl": "https://www.wowhead.com/guide/classes/monk/windwalker/stat-priority-pve-dps",
      "heroTrees": {
        "Conduit of the Celestials": {
          "rawList": [
            "Agility",
            "Haste = Critical Strike = Mastery",
            "Versatility"
          ],
          "secondaryOrder": "Mastery = Crit = Haste > Vers",
          "weights": {
            "m": 1.6,
            "c": 1.6,
            "h": 1.6,
            "v": 1.3
          }
        },
        "Shado-Pan": {
          "rawList": [
            "Agility",
            "Haste = Critical Strike = Mastery",
            "Versatility"
          ],
          "secondaryOrder": "Mastery = Crit = Haste > Vers",
          "weights": {
            "m": 1.6,
            "c": 1.6,
            "h": 1.6,
            "v": 1.3
          }
        }
      }
    }
  },
  "paladin": {
    "holy_paladin": {
      "name": "Holy Paladin",
      "guideUrl": "https://www.wowhead.com/guide/classes/paladin/holy/stat-priority-pve-healer",
      "heroTrees": {
        "Herald of the Sun": {
          "rawList": [
            "Intellect",
            "Mastery",
            "Haste = Crit",
            "Versatility"
          ],
          "secondaryOrder": "Mastery > Crit = Haste > Vers",
          "weights": {
            "m": 1.6,
            "c": 1.3,
            "h": 1.3,
            "v": 1
          }
        },
        "Lightsmith": {
          "rawList": [
            "Intellect",
            "Mastery",
            "Haste = Crit",
            "Versatility"
          ],
          "secondaryOrder": "Mastery > Crit = Haste > Vers",
          "weights": {
            "m": 1.6,
            "c": 1.3,
            "h": 1.3,
            "v": 1
          }
        }
      }
    },
    "protection_paladin": {
      "name": "Protection Paladin",
      "guideUrl": "https://www.wowhead.com/guide/classes/paladin/protection/stat-priority-pve-tank",
      "heroTrees": {
        "Lightsmith": {
          "rawList": [
            "Strength",
            "Haste",
            "Mastery",
            "Critical Strike",
            "Versatility"
          ],
          "secondaryOrder": "Haste > Mastery > Crit > Vers",
          "weights": {
            "m": 1.3,
            "c": 1,
            "h": 1.6,
            "v": 0.7
          }
        },
        "Templar": {
          "rawList": [
            "Strength",
            "Haste",
            "Critical Strike",
            "Mastery",
            "Versatility"
          ],
          "secondaryOrder": "Haste > Crit > Mastery > Vers",
          "weights": {
            "m": 1,
            "c": 1.3,
            "h": 1.6,
            "v": 0.7
          }
        }
      }
    },
    "retribution": {
      "name": "Retribution Paladin",
      "guideUrl": "https://www.wowhead.com/guide/classes/paladin/retribution/stat-priority-pve-dps",
      "heroTrees": {
        "Herald of the Sun": {
          "rawList": [
            "Strength",
            "Mastery",
            "Haste",
            "Critical Strike",
            "Versatility"
          ],
          "secondaryOrder": "Mastery > Haste > Crit > Vers",
          "weights": {
            "m": 1.6,
            "c": 1,
            "h": 1.3,
            "v": 0.7
          }
        },
        "Templar": {
          "rawList": [
            "Strength",
            "Mastery",
            "Haste",
            "Critical Strike",
            "Versatility"
          ],
          "secondaryOrder": "Mastery > Haste > Crit > Vers",
          "weights": {
            "m": 1.6,
            "c": 1,
            "h": 1.3,
            "v": 0.7
          }
        }
      }
    }
  },
  "priest": {
    "discipline": {
      "name": "Discipline Priest",
      "guideUrl": "https://www.wowhead.com/guide/classes/priest/discipline/stat-priority-pve-healer",
      "heroTrees": {
        "Voidweaver": {
          "rawList": [
            "Intellect",
            "Haste",
            "Mastery",
            "Critical Strike",
            "Versatility"
          ],
          "secondaryOrder": "Haste > Mastery > Crit > Vers",
          "weights": {
            "m": 1.3,
            "c": 1,
            "h": 1.6,
            "v": 0.7
          }
        },
        "Oracle": {
          "rawList": [
            "Intellect",
            "Haste",
            "Mastery",
            "Critical Strike",
            "Versatility"
          ],
          "secondaryOrder": "Haste > Mastery > Crit > Vers",
          "weights": {
            "m": 1.3,
            "c": 1,
            "h": 1.6,
            "v": 0.7
          }
        }
      }
    },
    "holy_priest": {
      "name": "Holy Priest",
      "guideUrl": "https://www.wowhead.com/guide/classes/priest/holy/stat-priority-pve-healer",
      "heroTrees": {
        "Oracle": {
          "rawList": [
            "Intellect",
            "Haste to comfort (~20%)",
            "Versatility",
            "Critical Strike",
            "Haste",
            "Mastery"
          ],
          "secondaryOrder": "Haste > Vers > Crit > Haste > Mastery",
          "weights": {
            "m": 0.6,
            "c": 1,
            "h": 0.7,
            "v": 1.3
          }
        },
        "Archon": {
          "rawList": [
            "Intellect",
            "Crit",
            "Versatility = Mastery",
            "Haste"
          ],
          "secondaryOrder": "Crit > Mastery = Vers > Haste",
          "weights": {
            "m": 1.3,
            "c": 1.6,
            "h": 1,
            "v": 1.3
          }
        }
      }
    },
    "shadow": {
      "name": "Shadow Priest",
      "guideUrl": "https://www.wowhead.com/guide/classes/priest/shadow/stat-priority-pve-dps",
      "heroTrees": {
        "Archon": {
          "rawList": [
            "Intellect",
            "Haste",
            "Mastery",
            "Critical Strike",
            "Versatility"
          ],
          "secondaryOrder": "Haste > Mastery > Crit > Vers",
          "weights": {
            "m": 1.3,
            "c": 1,
            "h": 1.6,
            "v": 0.7
          }
        },
        "Voidweaver": {
          "rawList": [
            "Intellect",
            "Haste",
            "Mastery",
            "Critical Strike",
            "Versatility"
          ],
          "secondaryOrder": "Haste > Mastery > Crit > Vers",
          "weights": {
            "m": 1.3,
            "c": 1,
            "h": 1.6,
            "v": 0.7
          }
        }
      }
    }
  },
  "rogue": {
    "assassination": {
      "name": "Assassination Rogue",
      "guideUrl": "https://www.wowhead.com/guide/classes/rogue/assassination/stat-priority-pve-dps",
      "heroTrees": {
        "Fatebound": {
          "rawList": [
            "Agility",
            "Critical Strike",
            "Haste",
            "Mastery",
            "Versatility"
          ],
          "secondaryOrder": "Crit > Haste > Mastery > Vers",
          "weights": {
            "m": 1,
            "c": 1.6,
            "h": 1.3,
            "v": 0.7
          }
        },
        "Deathstalker": {
          "rawList": [
            "Agility",
            "Critical Strike",
            "Haste",
            "Mastery",
            "Versatility"
          ],
          "secondaryOrder": "Crit > Haste > Mastery > Vers",
          "weights": {
            "m": 1,
            "c": 1.6,
            "h": 1.3,
            "v": 0.7
          }
        }
      }
    },
    "outlaw": {
      "name": "Outlaw Rogue",
      "guideUrl": "https://www.wowhead.com/guide/classes/rogue/outlaw/stat-priority-pve-dps",
      "heroTrees": {
        "Trickster": {
          "rawList": [
            "Agility",
            "Haste",
            "Critical Strike",
            "Versatility",
            "Mastery"
          ],
          "secondaryOrder": "Haste > Crit > Vers > Mastery",
          "weights": {
            "m": 0.7,
            "c": 1.3,
            "h": 1.6,
            "v": 1
          }
        },
        "Fatebound": {
          "rawList": [
            "Agility",
            "Haste",
            "Critical Strike",
            "Versatility",
            "Mastery"
          ],
          "secondaryOrder": "Haste > Crit > Vers > Mastery",
          "weights": {
            "m": 0.7,
            "c": 1.3,
            "h": 1.6,
            "v": 1
          }
        }
      }
    },
    "subtlety": {
      "name": "Subtlety Rogue",
      "guideUrl": "https://www.wowhead.com/guide/classes/rogue/subtlety/stat-priority-pve-dps",
      "heroTrees": {
        "Deathstalker": {
          "rawList": [
            "Agility",
            "Mastery",
            "Haste (~700 Haste)",
            "Versatility",
            "Critical Strike"
          ],
          "secondaryOrder": "Mastery > Haste > Vers > Crit",
          "weights": {
            "m": 1.6,
            "c": 0.7,
            "h": 1.3,
            "v": 1
          }
        },
        "Trickster": {
          "rawList": [
            "Agility",
            "Mastery",
            "Haste (~700 Haste)",
            "Versatility",
            "Critical Strike"
          ],
          "secondaryOrder": "Mastery > Haste > Vers > Crit",
          "weights": {
            "m": 1.6,
            "c": 0.7,
            "h": 1.3,
            "v": 1
          }
        }
      }
    }
  },
  "shaman": {
    "elemental": {
      "name": "Elemental Shaman",
      "guideUrl": "https://www.wowhead.com/guide/classes/shaman/elemental/stat-priority-pve-dps",
      "heroTrees": {
        "Farseer": {
          "rawList": [
            "Mastery to 1200 rating",
            "Haste/Crit",
            "Versatility",
            "Intellect"
          ],
          "secondaryOrder": "Mastery > Crit = Haste > Vers",
          "weights": {
            "m": 1.6,
            "c": 1.3,
            "h": 1.3,
            "v": 1
          }
        },
        "Stormbringer": {
          "rawList": [
            "Mastery to 1200 rating",
            "Haste/Crit",
            "Versatility",
            "Intellect"
          ],
          "secondaryOrder": "Mastery > Crit = Haste > Vers",
          "weights": {
            "m": 1.6,
            "c": 1.3,
            "h": 1.3,
            "v": 1
          }
        }
      }
    },
    "enhancement": {
      "name": "Enhancement Shaman",
      "guideUrl": "https://www.wowhead.com/guide/classes/shaman/enhancement/stat-priority-pve-dps",
      "heroTrees": {
        "Totemic": {
          "rawList": [
            "Agility",
            "Mastery = Haste",
            "Critical Strike",
            "Versatility"
          ],
          "secondaryOrder": "Mastery = Haste > Crit > Vers",
          "weights": {
            "m": 1.6,
            "c": 1.3,
            "h": 1.6,
            "v": 1
          }
        },
        "Stormbringer": {
          "rawList": [
            "Agility",
            "Critical Strike = Mastery",
            "Haste",
            "Versatility"
          ],
          "secondaryOrder": "Mastery = Crit > Haste > Vers",
          "weights": {
            "m": 1.6,
            "c": 1.6,
            "h": 1.3,
            "v": 1
          }
        }
      }
    },
    "restoration_shaman": {
      "name": "Restoration Shaman",
      "guideUrl": "https://www.wowhead.com/guide/classes/shaman/restoration/stat-priority-pve-healer",
      "heroTrees": {
        "Farseer": {
          "rawList": [
            "Intellect",
            "Critical Strike",
            "Haste = Versatility",
            "Mastery"
          ],
          "secondaryOrder": "Crit > Haste = Vers > Mastery",
          "weights": {
            "m": 1,
            "c": 1.6,
            "h": 1.3,
            "v": 1.3
          }
        },
        "Totemic": {
          "rawList": [
            "Intellect",
            "Critical Strike",
            "Haste = Versatility",
            "Mastery"
          ],
          "secondaryOrder": "Crit > Haste = Vers > Mastery",
          "weights": {
            "m": 1,
            "c": 1.6,
            "h": 1.3,
            "v": 1.3
          }
        }
      }
    }
  },
  "warlock": {
    "affliction": {
      "name": "Affliction Warlock",
      "guideUrl": "https://www.wowhead.com/guide/classes/warlock/affliction/stat-priority-pve-dps",
      "heroTrees": {
        "Hellcaller": {
          "rawList": [
            "Intellect",
            "Haste",
            "Critical Strike",
            "Versatility",
            "Mastery"
          ],
          "secondaryOrder": "Haste > Crit > Vers > Mastery",
          "weights": {
            "m": 0.7,
            "c": 1.3,
            "h": 1.6,
            "v": 1
          }
        },
        "Soul Harvester": {
          "rawList": [
            "Intellect",
            "Haste",
            "Critical Strike",
            "Versatility",
            "Mastery"
          ],
          "secondaryOrder": "Haste > Crit > Vers > Mastery",
          "weights": {
            "m": 0.7,
            "c": 1.3,
            "h": 1.6,
            "v": 1
          }
        }
      }
    },
    "demonology": {
      "name": "Demonology Warlock",
      "guideUrl": "https://www.wowhead.com/guide/classes/warlock/demonology/stat-priority-pve-dps",
      "heroTrees": {
        "Diabolist": {
          "rawList": [
            "Intellect",
            "Haste=Critical Strike",
            "Mastery",
            "Versatility"
          ],
          "secondaryOrder": "Crit = Haste > Mastery > Vers",
          "weights": {
            "m": 1.3,
            "c": 1.6,
            "h": 1.6,
            "v": 1
          }
        },
        "Soul Harvester": {
          "rawList": [
            "Intellect",
            "Haste=Critical Strike",
            "Mastery",
            "Versatility"
          ],
          "secondaryOrder": "Crit = Haste > Mastery > Vers",
          "weights": {
            "m": 1.3,
            "c": 1.6,
            "h": 1.6,
            "v": 1
          }
        }
      }
    },
    "destruction": {
      "name": "Destruction Warlock",
      "guideUrl": "https://www.wowhead.com/guide/classes/warlock/destruction/stat-priority-pve-dps",
      "heroTrees": {
        "Diabolist": {
          "rawList": [
            "Intellect",
            "Haste",
            "Mastery>=Critical Strike",
            "Versatility"
          ],
          "secondaryOrder": "Haste > Mastery = Crit > Vers",
          "weights": {
            "m": 1.3,
            "c": 1.3,
            "h": 1.6,
            "v": 1
          }
        },
        "Hellcaller": {
          "rawList": [
            "Intellect",
            "Haste",
            "Mastery>=Critical Strike",
            "Versatility"
          ],
          "secondaryOrder": "Haste > Mastery = Crit > Vers",
          "weights": {
            "m": 1.3,
            "c": 1.3,
            "h": 1.6,
            "v": 1
          }
        }
      }
    }
  },
  "warrior": {
    "arms": {
      "name": "Arms Warrior",
      "guideUrl": "https://www.wowhead.com/guide/classes/warrior/arms/stat-priority-pve-dps",
      "heroTrees": {
        "Colossus": {
          "rawList": [
            "Strength",
            "Critical Strike",
            "Haste",
            "Mastery",
            "Versatility"
          ],
          "secondaryOrder": "Crit > Haste > Mastery > Vers",
          "weights": {
            "m": 1,
            "c": 1.6,
            "h": 1.3,
            "v": 0.7
          }
        },
        "Slayer": {
          "rawList": [
            "Strength",
            "Critical Strike",
            "Haste",
            "Mastery",
            "Versatility"
          ],
          "secondaryOrder": "Crit > Haste > Mastery > Vers",
          "weights": {
            "m": 1,
            "c": 1.6,
            "h": 1.3,
            "v": 0.7
          }
        }
      }
    },
    "fury": {
      "name": "Fury Warrior",
      "guideUrl": "https://www.wowhead.com/guide/classes/warrior/fury/stat-priority-pve-dps",
      "heroTrees": {
        "Slayer": {
          "rawList": [
            "Strength",
            "Haste",
            "Mastery",
            "Critical Strike",
            "Versatility"
          ],
          "secondaryOrder": "Haste > Mastery > Crit > Vers",
          "weights": {
            "m": 1.3,
            "c": 1,
            "h": 1.6,
            "v": 0.7
          }
        },
        "Mountain Thane": {
          "rawList": [
            "Strength",
            "Haste",
            "Mastery",
            "Critical Strike",
            "Versatility"
          ],
          "secondaryOrder": "Haste > Mastery > Crit > Vers",
          "weights": {
            "m": 1.3,
            "c": 1,
            "h": 1.6,
            "v": 0.7
          }
        }
      }
    },
    "protection_warrior": {
      "name": "Protection Warrior",
      "guideUrl": "https://www.wowhead.com/guide/classes/warrior/protection/stat-priority-pve-tank",
      "heroTrees": {
        "Colossus": {
          "rawList": [
            "Strength",
            "Haste",
            "Critical Strike",
            "Versatility",
            "Mastery"
          ],
          "secondaryOrder": "Haste > Crit > Vers > Mastery",
          "weights": {
            "m": 0.7,
            "c": 1.3,
            "h": 1.6,
            "v": 1
          }
        },
        "Mountain Thane": {
          "rawList": [
            "Strength",
            "Haste",
            "Critical Strike",
            "Versatility",
            "Mastery"
          ],
          "secondaryOrder": "Haste > Crit > Vers > Mastery",
          "weights": {
            "m": 0.7,
            "c": 1.3,
            "h": 1.6,
            "v": 1
          }
        }
      }
    }
  }
};
