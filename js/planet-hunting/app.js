import {deepExtend} from './utils.js';
import {setCircularVelocity} from './physics.js';
import * as engine from './engine.js';
import View from './view.js';

const BREAD_CRUMBS_INTERVAL = 5; // add bread crumb every X ticks

const EARTH_MASS = 5.97e24; // [ kg ]
const SUN_MASS = 1.99e30;   // [ kg ]

const DEF_STATE = {
  time: 0,                      // [ year ]
  timestep: 0.001,              // [ year ]
  star: {
    x: 0,                       // [ AU ]
    y: 0,                       // [ AU ]
    mass: SUN_MASS / EARTH_MASS // [ earth mass ]
  },
  planet: {
    x: 1,   // [ AU ]
    y: 0,   // [ AU ]
    vx: 0,  // [ AU / year ]
    vy: 0,  // [ AU / year ]
    mass: 1 // [ earth mass ]
  },
  breadCrumbs: {
    x: [],
    y: []
  },
  planetEditable: false
};
// Velocity will be set in such a way so that its orbit is circular.
setCircularVelocity(DEF_STATE.planet);

export default class {
  constructor(parentEl) {
    this.state = deepExtend({}, DEF_STATE);
    this.view = new View(parentEl);
    this.tick = 0;

    this.isPlaying = true;

    this._rafCallback = this._rafCallback.bind(this);
    this._rafCallback();
  }

  _rafCallback() {
    if (this.isPlaying) {
      engine.tick(this.state);
      this.view.setProps(this.state);
    }
    if (this.tick % BREAD_CRUMBS_INTERVAL === 0) {
      this.view.addBreadCrumb(this.state.planet.x, this.state.planet.y);
    }
    this.view.render();
    this.tick += 1;
    this._rafID = requestAnimationFrame(this._rafCallback);
  }
}
