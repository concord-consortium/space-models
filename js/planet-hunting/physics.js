// The universal gravitational constant in AU, years, and earth-mass units.
const G = 0 - 2 * 5.922e-5;

// Integration:

export function doTick(state) {
  leapFrog(state.star, state.planet, state.timestep);
  // or euler(state.star, state.planet, state.timestep);
  state.time += state.timestep;
}

function euler(s, p, dt) {
  p.x += p.vx * dt * 0.5;
  p.z += p.vz * dt * 0.5;
  let factor = G * s.mass / Math.pow((p.x * p.x + p.z * p.z), 1.5);
  let ax = p.x * factor;
  let az = p.z * factor;
  p.vx += ax * dt;
  p.vz += az * dt;
  p.x += p.vx * dt * 0.5;
  p.z += p.vz * dt * 0.5;
}

function leapFrog(s, p, dt) {
  let factor = G * s.mass / Math.pow((p.x * p.x + p.z * p.z), 1.5);
  let a1x = p.x * factor;
  let a1z = p.z * factor;
  p.x += p.vx * dt + 0.5 * a1x * dt * dt;
  p.z += p.vz * dt + 0.5 * a1z * dt * dt;
  factor = G * s.mass / Math.pow((p.x * p.x + p.z * p.z), 1.5);
  let a2x = p.x * factor;
  let a2z = p.z * factor;
  p.vx += 0.5 * (a1x + a2x) * dt;
  p.vz += 0.5 * (a1z + a2z) * dt;
}

// Helpers:

export function setCircularVelocity(planet) {
  let p = planet;
  let a = Math.atan2(p.x, p.z);
  let d = Math.sqrt(p.x * p.x + p.z * p.z);
  let v = 2 * Math.PI / Math.sqrt(d);
  p.vx = v * Math.cos(a);
  p.vz = -v * Math.sin(a);
}
