import {deepExtend} from './utils.js';
import {updatePlanet, updateStar, starCamVelocity, lightIntensity} from './physics.js';

export function tick(state) {
  updatePlanet(state.star, state.planet, state.timestep);
  state.time += state.timestep;

  calculateOutputs(state);
}

export function calculateOutputs(state) {
  // Note that star position and velocity depends strictly on planet, so it's an output in fact.
  updateStar(state.star, state.planet);
  state.starCamVelocity = starCamVelocity(state.star, state.camera, state.timestep);
  state.lightIntensity = lightIntensity(state.star, state.planet, state.camera);
}