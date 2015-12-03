import {deepExtend} from './utils.js';
import {updatePlanetPos, updateStarPos, starCamVelocity, lightIntensity} from './physics.js';

export function tick(state) {
  let oldStar = {x: state.star.x, y: state.star.y};

  updatePlanetPos(state.star, state.planet, state.timestep);
  updateStarPos(state.star, state.planet);

  state.starCamVelocity = starCamVelocity(oldStar, state.star, state.camera, state.timestep);
  state.lightIntensity = lightIntensity(state.star, state.planet, state.camera);

  state.time += state.timestep;
}
