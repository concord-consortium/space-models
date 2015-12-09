import {makeCircularOrbit} from './physics.js';

let presets = {
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
      zoom: 2
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
  }
};

Object.keys(presets).forEach(function (name) {
  makeCircularOrbit(presets[name].planet);
});

export default presets;
