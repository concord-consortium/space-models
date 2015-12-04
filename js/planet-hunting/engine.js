import {deepExtend} from './utils.js';
import {updatePlanet, updateStar, updateTelescope} from './physics.js';

export function tick(state) {
  updatePlanet(state.star, state.planet, state.timestep);
  state.time += state.timestep;

  calculateOutputs(state);
}

export function calculateOutputs(state) {
  // Note that star position and velocity depends strictly on planet, so it's an output in fact.
  updateStar(state.star, state.planet);
  updateTelescope(state.telescope, state.star, state.planet, state.camera, state.timestep);
}