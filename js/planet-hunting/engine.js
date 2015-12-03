import {deepExtend} from './utils.js';
import {updatePlanetPos, updateStarPos, starCamVelocity} from './physics.js';

export function tick(state) {
  let oldStarX = state.star.x;
  let oldStarY = state.star.y;
  updatePlanetPos(state.star, state.planet, state.timestep);
  updateStarPos(state.star, state.planet);
  state.starCamVelocity = starCamVelocity({x: oldStarX, y: oldStarY}, state.star, state.camera, state.timestep);
  state.time += state.timestep;
}
