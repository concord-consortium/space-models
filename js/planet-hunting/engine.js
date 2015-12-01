import {deepExtend} from './utils.js';
import {updatePositions} from './physics.js';

export function tick(state) {
  updatePositions(state.star, state.planet, state.timestep);
  state.time += state.timestep;
}
