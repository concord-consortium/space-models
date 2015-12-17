export const MODEL_WIDTH = 30;
const TELESCOPE_WIDTH = 3;
const MIN_X = -MODEL_WIDTH * 0.5 + TELESCOPE_WIDTH;
const MAX_X = MODEL_WIDTH * 0.5;
const TIME_MULT = 200;
const WAVE_VELOCITY = -100;

export function tick(state) {
  // Limit star VX in some cases.
  let starVx = Math.max(state.star.vx, WAVE_VELOCITY * 0.7);
  if (state.star.vx < 0 && starAtMinX(state.star) ||
      state.star.vx > 0 && starAtMaxX(state.star)) {
    starVx = 0;
  }

  // Calculate new wave point. Y is within the planet Y coord +/- radius, X is equal to the planet X coord.
  state.wave.y.unshift(Math.sin(state.time * TIME_MULT) * state.star.diameter * 0.3);
  state.wave.x.unshift(state.star.x);
  state.wave.starVx.unshift(starVx);

  moveStar(state.star, starVx, state.timestep);
  let newStarVx = moveWave(state.wave, state.timestep);
  if (newStarVx !== null) {
    state.starTelescopeVelocity = newStarVx;
  }

  state.time += state.timestep;
}

function moveStar(star, vx, dt) {
  star.x += vx * dt;
}

function starAtMinX(star) {
  return star.x <= MIN_X + star.diameter * 0.5 + 0.5; // add little margin (0.5) so wave is always visible
}

function starAtMaxX(star) {
  return star.x >= MAX_X - star.diameter * 0.5;
}

// Returns velocity of the removed photon (absorbed by telescope) or null.
function moveWave(wave, dt) {
  let x = wave.x;
  let waveLen = x.length;
  for (let i = 0; i < waveLen; i++) {
    x[i] += WAVE_VELOCITY * dt;
    if (x[i] < MIN_X || x[i] > MAX_X) {
      let starTelescopeVelocity = wave.starVx[i];
      wave.x.length = i;
      wave.y.length = i;
      wave.starVx.length = i;
      return starTelescopeVelocity;
    }
  }
  return null;
}