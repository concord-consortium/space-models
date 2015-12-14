import {deepExtend} from './utils.js';
import {updatePlanet} from './physics.js';

const MARS_MASS = 0.107; // of Earth mass
const ANALYZE_TIMESTEP = 0.001;
const MAX_STEPS = 10000000;

export default function analyzeHabitability(star, planet, habitationZone) {
  let orbit = calcOrbit(star, planet, habitationZone.innerRadius, habitationZone.outerRadius);
  return {
    starType: star.type !== 'A' && star.type !== 'M',
    planetType: planet.rocky,
    planetSize: planet.diameter > Math.pow(4 * MARS_MASS, 0.3333),
    orbitalDistance: orbit.minDist > habitationZone.innerRadius && orbit.maxDist < habitationZone.outerRadius
  };
}

function calcOrbit(star, planet, allowedMin, allowedMax) {
  // Copy star, so we don't modify the provided object!
  planet = deepExtend({}, planet);
  let orbitReady = false;
  let prevDist = null;
  let trends = [];
  let orbit = {
    maxDist: -Infinity,
    minDist: Infinity
  };
  let step = 0;

  while (!orbitReady && step < MAX_STEPS) {
    let dist = distance(planet.x, planet.y);
    orbit.maxDist = Math.max(dist, orbit.maxDist);
    orbit.minDist = Math.min(dist, orbit.minDist);

    if (prevDist !== null) {
      if (dist > prevDist && trends[0] !== '+') {
        trends.unshift('+');
      } else if (dist < prevDist && trends[0] !== '-') {
        trends.unshift('-');
      }
      // Possible cases: ['+', '-', '+'] or ['-', '+', '-']
      // When we have observed three different trends (planet moving towards or away from star),
      // it means that the planed have done the full orbit around the star.
      if (trends.length >= 3) {
        orbitReady = true;
      }
      // Don't continue calculation if orbit doesn't fit into the allowed range.
      if (orbit.maxDist > allowedMax || orbit.minDist < allowedMin) {
        orbitReady = true;
      }
    }
    prevDist = dist;
    step += 1;
    updatePlanet(star, planet, ANALYZE_TIMESTEP);
  }
  
  return orbit;
}

function distance(x, y) {
  return Math.sqrt(x * x + y * y);
}
