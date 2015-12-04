import {PLANET_RADIUS, STAR_RADIUS} from './constants.js';

const DEG_2_RAD = Math.PI / 180;
// The universal gravitational constant in AU, years, and earth-mass units.
const G = 0 - 2 * 5.922e-5;
// The relative density compared to Earth.
const ROCKY_PLANET_DENSITY = 1;
// The relative density of Jupiter compared to Earth.
const GAS_PLANET_DENSITY = 1 / 4.13;

export function updatePlanet(star, planet, timestep) {
  leapFrog(star, planet, timestep);
}

export function updateStar(star, planet) {
  let rho = -planetMass(planet) / star.mass;
  star.x = rho * planet.x;
  star.y = rho * planet.y;
  star.vx = rho * planet.vx;
  star.vy = rho * planet.vy;
}

export function updateTelescope(telescope, star, planet, camera, timestep) {
  telescope.starCamVelocity = starCamVelocity(star, camera, timestep);
  telescope.lightIntensity = lightIntensity(star, planet, camera);

  if (telescope.precision < 100) {
    // Add random noise.
    telescope.starCamVelocity += 0.15 * (Math.random() * 2 - 1) / telescope.precision;
    telescope.lightIntensity += 0.3 * -Math.random() / telescope.precision;
  }
}

export function setCircularVelocity(planet) {
  let p = planet;
  let a = Math.atan2(p.x, p.y);
  let d = Math.sqrt(p.x * p.x + p.y * p.y);
  let v = 2 * Math.PI / Math.sqrt(d);
  p.vx = v * Math.cos(a);
  p.vy = -v * Math.sin(a);
}

export function starCamVelocity(star, camera, timestep) {
  let cameraX = 0;
  let cameraY = Math.cos(camera.tilt * DEG_2_RAD) * camera.distance;
  let cameraZ = Math.sin(camera.tilt * DEG_2_RAD) * camera.distance;
  let newStarX = star.x + star.vx * timestep;
  let newStarY = star.y + star.vy * timestep;
  let oldDist = dist(star.x, star.y, 0, cameraX, cameraY, cameraZ);
  let newDist = dist(newStarX, newStarY, 0, cameraX, cameraY, cameraZ);
  return (newDist - oldDist) / timestep;
}

export function lightIntensity(star, planet, camera) {
  if (occultation(star, planet, camera)) {
    return 1 - Math.pow(planet.diameter / 100, 2);
  }
  return 1;
}

export function occultation(star, planet, camera) {
  if (Math.abs(camera.tilt) > 0.1) {
    return false;
  }
  if (camera.distance < distObj(planet, {x: 0, y: 0})) {
    // Planet is behind the camera.
    return false;
  }
  if (planet.y > 0) {
    // Planet is behind the star.
    return false;
  }
  // This assumes that camera position is limited to XZ plane (so Y is always == 0)
  // and it always looks at (0, 0, 0) point.
  return Math.abs(star.x - planet.x) < PLANET_RADIUS + STAR_RADIUS;
}

export function planetMass(planet) {
  let density = planet.rocky ? ROCKY_PLANET_DENSITY : GAS_PLANET_DENSITY;
  return density * Math.pow(planet.diameter, 3);
}

function dist(x1, y1, z1, x2, y2, z2) {
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2) + Math.pow(z1 - z2, 2));
}

function distObj(a, b) {
  // Planet and star objects don't specify Z coord, as it's always equal to 0.
  return dist(a.x, a.y, a.z || 0, b.x, b.y, b.z || 0);
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
