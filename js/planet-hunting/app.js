import {deepExtend} from './utils.js';
import {doTick, setCircularVelocity} from './physics.js';
import View from './view.js';

const EARTH_MASS = 5.97e24; // [ kg ]
const SUN_MASS = 1.99e30;   // [ kg ]

const DEF_STATE = {
  time: 0,                      // [ year ]
  timestep: 0.001,              // [ year ]
  star: {
    x: 0,                       // [ AU ]
    z: 0,                       // [ AU ]
    mass: SUN_MASS / EARTH_MASS // [ earth mass ]
  },
  planet: {
    x: 1,   // [ AU ]
    z: 0,   // [ AU ]
    vx: 0,  // [ AU / year ]
    vz: 0,  // [ AU / year ]
    mass: 1 // [ earth mass ]
  }
};
// Velocity will be set in such a way so that its orbit is circular.
setCircularVelocity(DEF_STATE.planet);

export default class {
  constructor(parentEl) {
    this.state = deepExtend({}, DEF_STATE);

    this.view = new View(parentEl);

    this._rafCallback = this._rafCallback.bind(this);
    this._rafCallback();
  }

  _rafCallback() {
    doTick(this.state);
    this.view.setProps(this.state);
    this.view.render();
    this._rafID = requestAnimationFrame(this._rafCallback);
  }
}
