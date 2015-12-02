// The universal gravitational constant in AU, years, and earth-mass units.
const G = 0 - 2 * 5.922e-5;

// The relative density compared to Earth.
const ROCKY_PLANET_DENSITY = 1;
// The relative density of Jupiter compared to Earth.
const GAS_PLANET_DENSITY = 1 / 4.13;

export function updatePlanetPos(star, planet, timestep) {
  leapFrog(star, planet, timestep);
}

export function updateStarPos(star, planet) {
  let rho = 0 - planetMass(planet) / star.mass;
  star.x = rho * planet.x;
  star.y = rho * planet.y;
}

export function setCircularVelocity(planet) {
  let p = planet;
  let a = Math.atan2(p.x, p.y);
  let d = Math.sqrt(p.x * p.x + p.y * p.y);
  let v = 2 * Math.PI / Math.sqrt(d);
  p.vx = v * Math.cos(a);
  p.vy = -v * Math.sin(a);
}

export function planetMass(planet) {
  let density = planet.rocky ? ROCKY_PLANET_DENSITY : GAS_PLANET_DENSITY;
  return density * Math.pow(planet.diameter, 3);
}

function euler(s, p, dt) {
  p.x += p.vx * dt * 0.5;
  p.y += p.vy * dt * 0.5;
  let factor = G * s.mass / Math.pow((p.x * p.x + p.y * p.y), 1.5);
  let ax = p.x * factor;
  let ay = p.y * factor;
  p.vx += ax * dt;
  p.vy += ay * dt;
  p.x += p.vx * dt * 0.5;
  p.y += p.vy * dt * 0.5;
}

function leapFrog(s, p, dt) {
  let factor = G * s.mass / Math.pow((p.x * p.x + p.y * p.y), 1.5);
  let a1x = p.x * factor;
  let a1y = p.y * factor;
  p.x += p.vx * dt + 0.5 * a1x * dt * dt;
  p.y += p.vy * dt + 0.5 * a1y * dt * dt;
  factor = G * s.mass / Math.pow((p.x * p.x + p.y * p.y), 1.5);
  let a2x = p.x * factor;
  let a2y = p.y * factor;
  p.vx += 0.5 * (a1x + a2x) * dt;
  p.vy += 0.5 * (a1y + a2y) * dt;
}
