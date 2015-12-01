import {deepExtend} from './utils.js';
import {updatePlanetPos, updateStarPos} from './physics.js';

export function tick(state) {
  updatePlanetPos(state.star, state.planet, state.timestep);
  updateStarPos(state.star, state.planet);
  state.time += state.timestep;
}
