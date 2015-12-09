import {deepExtend} from './utils.js';
import {updatePlanet, updateStar, updateTelescope} from './physics.js';

const MAX_TIMESTEP = 0.005;

export function tick(state) {
  // Make sure that integration isn't using too big timestep, so it's still reasonably accurate.
  let dt = Math.min(MAX_TIMESTEP, state.timestep);
  let steps = Math.round(state.timestep / dt);
  for (let i = 0; i < steps; i++) {
    updatePlanet(state.star, state.planet, dt);
    state.time += dt;
  }
  calculateOutputs(state);
}

export function calculateOutputs(state) {
  // Note that star position and velocity depends strictly on planet, so it's an output in fact.
  updateStar(state.star, state.planet);
  updateTelescope(state.telescope, state.star, state.planet, state.camera, state.timestep);
}