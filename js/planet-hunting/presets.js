import {makeCircularOrbit} from './physics.js';
import {deepExtend} from './utils.js';
import {SOLAR_MASS} from './constants.js';

export default {
  // === PLANETS ===
  'NoPlanet': {
    planet: {
      diameter: 0
    }
  },
  'Earth': {
    planet: {
      x: 1 / Math.sqrt(2),
      y: 1 / Math.sqrt(2),
      diameter: 1,
      rocky: true
    },
    camera: {
      zoom: 1
    }
  },
  'Mars': {
    planet: {
      x: 1.5 / Math.sqrt(2),
      y: 1.5 / Math.sqrt(2),
      // The diameter sets the mass, so this reverses the process,
      // computing the diameter that would get .107 earth masses.
      diameter: Math.pow(0.107, 0.3333),
      rocky: true
    },
    camera: {
      zoom: 0.75
    }
  },
  'Jupiter': {
    planet: {
      x: 5.2 / Math.sqrt(2),
      y: 5.2 / Math.sqrt(2),
      // The diameter sets the mass, so this reverses the process.
      diameter: Math.pow((4.13 * 10.5), 0.3333),
      rocky: false
    },
    camera: {
      zoom: 0.25
    }
  },
  'Venus': {
    planet: {
      x: 0.728 / Math.sqrt(2),
      y: 0.728 / Math.sqrt(2),
      // The diameter sets the mass, so this reverses the process.
      diameter: Math.pow(0.815, 0.3333),
      rocky: true
    },
    camera: {
      zoom: 1.5
    }
  },
  'MercuryDiameter10x': { // Like Mercury but 10x larger diameter
    planet: {
      x: 0.467 / Math.sqrt(2),
      y: 0.467 / Math.sqrt(2),
      // The diameter sets the mass, so this reverses the process.
      diameter: Math.pow(55, 0.3333),
      rocky: true
    },
    camera: {
      zoom: 2
    }
  },
  'EarthDiameter10x': { // Like Earth but 10x larger diameter
    planet: {
      x: 1 / Math.sqrt(2),
      y: 1 / Math.sqrt(2),
      diameter: 10,
      rocky: true
    },
    camera: {
      zoom: 1
    }
  },
  'EarthNearTheStar': { // Earth-like planet near the star
    planet: {
      x: 0.25 / Math.sqrt(2),
      y: 0.25 / Math.sqrt(2),
      diameter: 1,
      rocky: true
    },
    camera: {
      zoom: 2.5
    }
  },
  'LargeNearTheStar': { // Large rocky planet very near the star
    planet: {
      x: 0.25 / Math.sqrt(2),
      y: 0.25 / Math.sqrt(2),
      diameter: 50,
      rocky: true
    },
    camera: {
      zoom: 2.5
    }
  },
  // === STARS ===
  'StarRed': { // M - red (temp 3120 K)
    planet: {},
    star: {
      mass: 0.21 * SOLAR_MASS,
      color: 0xFF0000,
      scale: 0.32,
      type: 'M'
    },
    habitationZone: {
      innerRadius: 0.08,
      outerRadius: 0.12
    },
    camera: {
      zoom: 1
    }
  },
  'StarOrange': { // K - orange (temp 4640 K)
    star: {
      mass: 0.69 * SOLAR_MASS,
      color: 0xFFA500,
      scale: 0.74,
      type: 'K'
    },
    habitationZone: {
      innerRadius: 0.38,
      outerRadius: 0.55
    },
    camera: {
      zoom: 1
    }
  },
  'Sun': { // G - yellow (temp 5920 K) -> our Sun
    star: {
      mass: SOLAR_MASS,
      color: 0xFFFF00,
      scale: 1,
      type: 'G'
    },
    habitationZone: {
      innerRadius: 0.95,
      outerRadius: 1.37
    },
    camera: {
      zoom: 1
    }
  },
  'StarWhite': { // F - white (temp 7240 K)
    star: {
      mass: 1.29 * SOLAR_MASS,
      color: 0xFFFFFF,
      scale: 1.2,
      type: 'F'
    },
    habitationZone: {
      innerRadius: 1.5,
      outerRadius: 2.17
    },
    camera: {
      zoom: 0.48
    }
  },
  'StarBlue': { // A - blue (temp 8620 K)
    star: {
      mass: 2.1 * SOLAR_MASS,
      color: 0x00FFFF,
      scale: 1.7,
      type: 'A'
    },
    habitationZone: {
      innerRadius: 4.26,
      outerRadius: 6.14
    },
    camera: {
      zoom: 0.25
    }
  }
};
