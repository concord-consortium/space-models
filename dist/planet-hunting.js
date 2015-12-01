/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _app = __webpack_require__(1);

	var _app2 = _interopRequireDefault(_app);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	window.app = new _app2.default(document.getElementById('app'));

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _utils = __webpack_require__(2);

	var _physics = __webpack_require__(3);

	var _engine = __webpack_require__(4);

	var engine = _interopRequireWildcard(_engine);

	var _view = __webpack_require__(5);

	var _view2 = _interopRequireDefault(_view);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var BREAD_CRUMBS_INTERVAL = 5; // add bread crumb every X ticks

	var EARTH_MASS = 5.97e24; // [ kg ]
	var SUN_MASS = 1.99e30; // [ kg ]

	var DEF_STATE = {
	  time: 0, // [ year ]
	  timestep: 0.001, // [ year ]
	  star: {
	    x: 0, // [ AU ]
	    y: 0, // [ AU ]
	    mass: SUN_MASS / EARTH_MASS // [ earth mass ]
	  },
	  planet: {
	    x: 1, // [ AU ]
	    y: 0, // [ AU ]
	    vx: 0, // [ AU / year ]
	    vy: 0, // [ AU / year ]
	    mass: 1 // [ earth mass ]
	  },
	  breadCrumbs: {
	    x: [],
	    y: []
	  },
	  planetEditable: false
	};
	// Velocity will be set in such a way so that its orbit is circular.
	(0, _physics.setCircularVelocity)(DEF_STATE.planet);

	var _class = (function () {
	  function _class(parentEl) {
	    _classCallCheck(this, _class);

	    this.state = (0, _utils.deepExtend)({}, DEF_STATE);
	    this.view = new _view2.default(parentEl);
	    this.tick = 0;

	    this.isPlaying = true;

	    this._rafCallback = this._rafCallback.bind(this);
	    this._rafCallback();
	  }

	  _createClass(_class, [{
	    key: '_rafCallback',
	    value: function _rafCallback() {
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
	  }]);

	  return _class;
	})();

	exports.default = _class;

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.extend = extend;
	exports.deepExtend = deepExtend;

	function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

	// Simplified jQuery.extend, based on from:
	// https://github.com/jquery/jquery/blob/22449eb968622c2e14d6c8d8de2cf1e1ba4adccd/src/core.js#L118-L185
	function extend() {
	  var options,
	      name,
	      src,
	      copy,
	      copyIsArray,
	      clone,
	      target = arguments[0] || {},
	      i = 1,
	      length = arguments.length,
	      deep = false;
	  // Handle a deep copy situation
	  if (typeof target === "boolean") {
	    deep = target;
	    // Skip the boolean and the target
	    target = arguments[i] || {};
	    i++;
	  }
	  // Handle case when target is a string or something (possible in deep copy)
	  if ((typeof target === "undefined" ? "undefined" : _typeof(target)) !== "object") {
	    target = {};
	  }
	  for (; i < length; i++) {
	    // Only deal with non-null/undefined values
	    if ((options = arguments[i]) != null) {
	      // Extend the base object
	      for (name in options) {
	        src = target[name];
	        copy = options[name];
	        // Prevent never-ending loop
	        if (target === copy) {
	          continue;
	        }
	        // Recurse if we're merging plain objects or arrays
	        if (deep && copy && (isPlainObject(copy) || (copyIsArray = Array.isArray(copy)))) {
	          if (copyIsArray) {
	            copyIsArray = false;
	            clone = src && Array.isArray(src) ? src : [];
	          } else {
	            clone = src && isPlainObject(src) ? src : {};
	          }
	          // Never move original objects, clone them
	          target[name] = extend(deep, clone, copy);
	          // Don't bring in undefined values
	        } else if (copy !== undefined) {
	            target[name] = copy;
	          }
	      }
	    }
	  }
	  // Return the modified object
	  return target;
	}

	// Same as extend, but passing true as a first parameter.
	function deepExtend() {
	  var args = Array.prototype.slice.call(arguments);
	  args.unshift(true);
	  return extend.apply(null, args);
	}

	window.ext = extend;

	function isPlainObject(obj) {
	  return (typeof obj === "undefined" ? "undefined" : _typeof(obj)) === "object";
	}

/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.updatePositions = updatePositions;
	exports.setCircularVelocity = setCircularVelocity;
	// The universal gravitational constant in AU, years, and earth-mass units.
	var G = 0 - 2 * 5.922e-5;

	// Integration:

	function updatePositions(star, planet, timestep) {
	  leapFrog(star, planet, timestep);
	  // or euler(star, planet, timestep);
	}

	// Helpers:

	function setCircularVelocity(planet) {
	  var p = planet;
	  var a = Math.atan2(p.x, p.y);
	  var d = Math.sqrt(p.x * p.x + p.y * p.y);
	  var v = 2 * Math.PI / Math.sqrt(d);
	  p.vx = v * Math.cos(a);
	  p.vy = -v * Math.sin(a);
	}

	function euler(s, p, dt) {
	  p.x += p.vx * dt * 0.5;
	  p.y += p.vy * dt * 0.5;
	  var factor = G * s.mass / Math.pow(p.x * p.x + p.y * p.y, 1.5);
	  var ax = p.x * factor;
	  var ay = p.y * factor;
	  p.vx += ax * dt;
	  p.vy += ay * dt;
	  p.x += p.vx * dt * 0.5;
	  p.y += p.vy * dt * 0.5;
	}

	function leapFrog(s, p, dt) {
	  var factor = G * s.mass / Math.pow(p.x * p.x + p.y * p.y, 1.5);
	  var a1x = p.x * factor;
	  var a1y = p.y * factor;
	  p.x += p.vx * dt + 0.5 * a1x * dt * dt;
	  p.y += p.vy * dt + 0.5 * a1y * dt * dt;
	  factor = G * s.mass / Math.pow(p.x * p.x + p.y * p.y, 1.5);
	  var a2x = p.x * factor;
	  var a2y = p.y * factor;
	  p.vx += 0.5 * (a1x + a2x) * dt;
	  p.vy += 0.5 * (a1y + a2y) * dt;
	}

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.tick = tick;

	var _utils = __webpack_require__(2);

	var _physics = __webpack_require__(3);

	function tick(state) {
	  (0, _physics.updatePositions)(state.star, state.planet, state.timestep);
	  state.time += state.timestep;
	}

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _eventemitter = __webpack_require__(6);

	var _eventemitter2 = _interopRequireDefault(_eventemitter);

	var _star = __webpack_require__(7);

	var _star2 = _interopRequireDefault(_star);

	var _planet = __webpack_require__(9);

	var _planet2 = _interopRequireDefault(_planet);

	var _grid = __webpack_require__(10);

	var _grid2 = _interopRequireDefault(_grid);

	var _breadCrumbs = __webpack_require__(12);

	var _breadCrumbs2 = _interopRequireDefault(_breadCrumbs);

	var _constants = __webpack_require__(8);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var BREAD_CRUMBS_LIMIT = 10000;

	var _class = (function () {
	  function _class(parentEl) {
	    _classCallCheck(this, _class);

	    var width = parentEl.clientWidth;
	    var height = parentEl.clientHeight;
	    this.scene = new THREE.Scene();
	    this.camera = new THREE.PerspectiveCamera(60, width / height, _constants.PLANET_RADIUS * _constants.SF / 100, _constants.PLANET_RADIUS * _constants.SF * 10000);
	    this.renderer = webglAvailable() ? new THREE.WebGLRenderer({ antialias: true }) : new THREE.CanvasRenderer();
	    this.renderer.setSize(width, height);
	    parentEl.appendChild(this.renderer.domElement);

	    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
	    this.controls.enablePan = false;
	    this.controls.minPolarAngle = Math.PI * 0.5;
	    this.controls.maxPolarAngle = Math.PI;
	    this.controls.minAzimuthAngle = 0;
	    this.controls.maxAzimuthAngle = 0;
	    this.controls.rotateSpeed = 0.5;
	    this.controls.zoomSpeed = 0.5;

	    this.dispatch = new _eventemitter2.default();

	    this._initScene();
	    this._setInitialCamPos();
	  }

	  _createClass(_class, [{
	    key: 'setProps',
	    value: function setProps(props) {
	      this.star.setProps(props.star);
	      this.planet.setProps(props.planet);
	    }
	  }, {
	    key: 'addBreadCrumb',
	    value: function addBreadCrumb(x, y) {
	      this.breadCrumbs.addBreadCrumb(x, y);
	    }

	    // Delegate #on to EventEmitter object.

	  }, {
	    key: 'on',
	    value: function on() {
	      this.dispatch.on.apply(this.dispatch, arguments);
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      this.controls.update();
	      //if (this._interactionHandler) {
	      //  this._interactionHandler.checkInteraction();
	      //}
	      this.renderer.render(this.scene, this.camera);
	    }

	    // Resizes canvas to fill its parent.

	  }, {
	    key: 'resize',
	    value: function resize() {
	      var parent = this.renderer.domElement.parentElement;
	      var newWidth = parent.clientWidth;
	      var newHeight = parent.clientHeight;
	      this.camera.aspect = newWidth / newHeight;
	      this.camera.updateProjectionMatrix();
	      this.renderer.setSize(newWidth, newHeight);
	    }
	  }, {
	    key: '_initScene',
	    value: function _initScene() {
	      this.grid = new _grid2.default();
	      this.star = new _star2.default();
	      this.planet = new _planet2.default();
	      this.breadCrumbs = new _breadCrumbs2.default();
	      this.scene.add(this.grid.rootObject);
	      this.scene.add(this.star.rootObject);
	      this.scene.add(this.planet.rootObject);
	      this.scene.add(this.breadCrumbs.rootObject);
	      this.scene.add(new THREE.AmbientLight(0x202020));
	      this.scene.add(new THREE.PointLight(0xffffff, 1, 0));
	    }
	  }, {
	    key: '_setInitialCamPos',
	    value: function _setInitialCamPos() {
	      this.camera.position.x = 0;
	      this.camera.position.y = 0;
	      this.camera.position.z = _constants.PLANET_RADIUS * _constants.SF * 50;
	    }
	  }]);

	  return _class;
	})();

	exports.default = _class;

	function webglAvailable() {
	  try {
	    var canvas = document.createElement('canvas');
	    return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
	  } catch (e) {
	    return false;
	  }
	}

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/*!
	 * EventEmitter2
	 * https://github.com/hij1nx/EventEmitter2
	 *
	 * Copyright (c) 2013 hij1nx
	 * Licensed under the MIT license.
	 */
	;!function(undefined) {

	  var isArray = Array.isArray ? Array.isArray : function _isArray(obj) {
	    return Object.prototype.toString.call(obj) === "[object Array]";
	  };
	  var defaultMaxListeners = 10;

	  function init() {
	    this._events = {};
	    if (this._conf) {
	      configure.call(this, this._conf);
	    }
	  }

	  function configure(conf) {
	    if (conf) {

	      this._conf = conf;

	      conf.delimiter && (this.delimiter = conf.delimiter);
	      conf.maxListeners && (this._events.maxListeners = conf.maxListeners);
	      conf.wildcard && (this.wildcard = conf.wildcard);
	      conf.newListener && (this.newListener = conf.newListener);

	      if (this.wildcard) {
	        this.listenerTree = {};
	      }
	    }
	  }

	  function EventEmitter(conf) {
	    this._events = {};
	    this.newListener = false;
	    configure.call(this, conf);
	  }

	  //
	  // Attention, function return type now is array, always !
	  // It has zero elements if no any matches found and one or more
	  // elements (leafs) if there are matches
	  //
	  function searchListenerTree(handlers, type, tree, i) {
	    if (!tree) {
	      return [];
	    }
	    var listeners=[], leaf, len, branch, xTree, xxTree, isolatedBranch, endReached,
	        typeLength = type.length, currentType = type[i], nextType = type[i+1];
	    if (i === typeLength && tree._listeners) {
	      //
	      // If at the end of the event(s) list and the tree has listeners
	      // invoke those listeners.
	      //
	      if (typeof tree._listeners === 'function') {
	        handlers && handlers.push(tree._listeners);
	        return [tree];
	      } else {
	        for (leaf = 0, len = tree._listeners.length; leaf < len; leaf++) {
	          handlers && handlers.push(tree._listeners[leaf]);
	        }
	        return [tree];
	      }
	    }

	    if ((currentType === '*' || currentType === '**') || tree[currentType]) {
	      //
	      // If the event emitted is '*' at this part
	      // or there is a concrete match at this patch
	      //
	      if (currentType === '*') {
	        for (branch in tree) {
	          if (branch !== '_listeners' && tree.hasOwnProperty(branch)) {
	            listeners = listeners.concat(searchListenerTree(handlers, type, tree[branch], i+1));
	          }
	        }
	        return listeners;
	      } else if(currentType === '**') {
	        endReached = (i+1 === typeLength || (i+2 === typeLength && nextType === '*'));
	        if(endReached && tree._listeners) {
	          // The next element has a _listeners, add it to the handlers.
	          listeners = listeners.concat(searchListenerTree(handlers, type, tree, typeLength));
	        }

	        for (branch in tree) {
	          if (branch !== '_listeners' && tree.hasOwnProperty(branch)) {
	            if(branch === '*' || branch === '**') {
	              if(tree[branch]._listeners && !endReached) {
	                listeners = listeners.concat(searchListenerTree(handlers, type, tree[branch], typeLength));
	              }
	              listeners = listeners.concat(searchListenerTree(handlers, type, tree[branch], i));
	            } else if(branch === nextType) {
	              listeners = listeners.concat(searchListenerTree(handlers, type, tree[branch], i+2));
	            } else {
	              // No match on this one, shift into the tree but not in the type array.
	              listeners = listeners.concat(searchListenerTree(handlers, type, tree[branch], i));
	            }
	          }
	        }
	        return listeners;
	      }

	      listeners = listeners.concat(searchListenerTree(handlers, type, tree[currentType], i+1));
	    }

	    xTree = tree['*'];
	    if (xTree) {
	      //
	      // If the listener tree will allow any match for this part,
	      // then recursively explore all branches of the tree
	      //
	      searchListenerTree(handlers, type, xTree, i+1);
	    }

	    xxTree = tree['**'];
	    if(xxTree) {
	      if(i < typeLength) {
	        if(xxTree._listeners) {
	          // If we have a listener on a '**', it will catch all, so add its handler.
	          searchListenerTree(handlers, type, xxTree, typeLength);
	        }

	        // Build arrays of matching next branches and others.
	        for(branch in xxTree) {
	          if(branch !== '_listeners' && xxTree.hasOwnProperty(branch)) {
	            if(branch === nextType) {
	              // We know the next element will match, so jump twice.
	              searchListenerTree(handlers, type, xxTree[branch], i+2);
	            } else if(branch === currentType) {
	              // Current node matches, move into the tree.
	              searchListenerTree(handlers, type, xxTree[branch], i+1);
	            } else {
	              isolatedBranch = {};
	              isolatedBranch[branch] = xxTree[branch];
	              searchListenerTree(handlers, type, { '**': isolatedBranch }, i+1);
	            }
	          }
	        }
	      } else if(xxTree._listeners) {
	        // We have reached the end and still on a '**'
	        searchListenerTree(handlers, type, xxTree, typeLength);
	      } else if(xxTree['*'] && xxTree['*']._listeners) {
	        searchListenerTree(handlers, type, xxTree['*'], typeLength);
	      }
	    }

	    return listeners;
	  }

	  function growListenerTree(type, listener) {

	    type = typeof type === 'string' ? type.split(this.delimiter) : type.slice();

	    //
	    // Looks for two consecutive '**', if so, don't add the event at all.
	    //
	    for(var i = 0, len = type.length; i+1 < len; i++) {
	      if(type[i] === '**' && type[i+1] === '**') {
	        return;
	      }
	    }

	    var tree = this.listenerTree;
	    var name = type.shift();

	    while (name) {

	      if (!tree[name]) {
	        tree[name] = {};
	      }

	      tree = tree[name];

	      if (type.length === 0) {

	        if (!tree._listeners) {
	          tree._listeners = listener;
	        }
	        else if(typeof tree._listeners === 'function') {
	          tree._listeners = [tree._listeners, listener];
	        }
	        else if (isArray(tree._listeners)) {

	          tree._listeners.push(listener);

	          if (!tree._listeners.warned) {

	            var m = defaultMaxListeners;

	            if (typeof this._events.maxListeners !== 'undefined') {
	              m = this._events.maxListeners;
	            }

	            if (m > 0 && tree._listeners.length > m) {

	              tree._listeners.warned = true;
	              console.error('(node) warning: possible EventEmitter memory ' +
	                            'leak detected. %d listeners added. ' +
	                            'Use emitter.setMaxListeners() to increase limit.',
	                            tree._listeners.length);
	              console.trace();
	            }
	          }
	        }
	        return true;
	      }
	      name = type.shift();
	    }
	    return true;
	  }

	  // By default EventEmitters will print a warning if more than
	  // 10 listeners are added to it. This is a useful default which
	  // helps finding memory leaks.
	  //
	  // Obviously not all Emitters should be limited to 10. This function allows
	  // that to be increased. Set to zero for unlimited.

	  EventEmitter.prototype.delimiter = '.';

	  EventEmitter.prototype.setMaxListeners = function(n) {
	    this._events || init.call(this);
	    this._events.maxListeners = n;
	    if (!this._conf) this._conf = {};
	    this._conf.maxListeners = n;
	  };

	  EventEmitter.prototype.event = '';

	  EventEmitter.prototype.once = function(event, fn) {
	    this.many(event, 1, fn);
	    return this;
	  };

	  EventEmitter.prototype.many = function(event, ttl, fn) {
	    var self = this;

	    if (typeof fn !== 'function') {
	      throw new Error('many only accepts instances of Function');
	    }

	    function listener() {
	      if (--ttl === 0) {
	        self.off(event, listener);
	      }
	      fn.apply(this, arguments);
	    }

	    listener._origin = fn;

	    this.on(event, listener);

	    return self;
	  };

	  EventEmitter.prototype.emit = function() {

	    this._events || init.call(this);

	    var type = arguments[0];

	    if (type === 'newListener' && !this.newListener) {
	      if (!this._events.newListener) { return false; }
	    }

	    // Loop through the *_all* functions and invoke them.
	    if (this._all) {
	      var l = arguments.length;
	      var args = new Array(l - 1);
	      for (var i = 1; i < l; i++) args[i - 1] = arguments[i];
	      for (i = 0, l = this._all.length; i < l; i++) {
	        this.event = type;
	        this._all[i].apply(this, args);
	      }
	    }

	    // If there is no 'error' event listener then throw.
	    if (type === 'error') {

	      if (!this._all &&
	        !this._events.error &&
	        !(this.wildcard && this.listenerTree.error)) {

	        if (arguments[1] instanceof Error) {
	          throw arguments[1]; // Unhandled 'error' event
	        } else {
	          throw new Error("Uncaught, unspecified 'error' event.");
	        }
	        return false;
	      }
	    }

	    var handler;

	    if(this.wildcard) {
	      handler = [];
	      var ns = typeof type === 'string' ? type.split(this.delimiter) : type.slice();
	      searchListenerTree.call(this, handler, ns, this.listenerTree, 0);
	    }
	    else {
	      handler = this._events[type];
	    }

	    if (typeof handler === 'function') {
	      this.event = type;
	      if (arguments.length === 1) {
	        handler.call(this);
	      }
	      else if (arguments.length > 1)
	        switch (arguments.length) {
	          case 2:
	            handler.call(this, arguments[1]);
	            break;
	          case 3:
	            handler.call(this, arguments[1], arguments[2]);
	            break;
	          // slower
	          default:
	            var l = arguments.length;
	            var args = new Array(l - 1);
	            for (var i = 1; i < l; i++) args[i - 1] = arguments[i];
	            handler.apply(this, args);
	        }
	      return true;
	    }
	    else if (handler) {
	      var l = arguments.length;
	      var args = new Array(l - 1);
	      for (var i = 1; i < l; i++) args[i - 1] = arguments[i];

	      var listeners = handler.slice();
	      for (var i = 0, l = listeners.length; i < l; i++) {
	        this.event = type;
	        listeners[i].apply(this, args);
	      }
	      return (listeners.length > 0) || !!this._all;
	    }
	    else {
	      return !!this._all;
	    }

	  };

	  EventEmitter.prototype.on = function(type, listener) {

	    if (typeof type === 'function') {
	      this.onAny(type);
	      return this;
	    }

	    if (typeof listener !== 'function') {
	      throw new Error('on only accepts instances of Function');
	    }
	    this._events || init.call(this);

	    // To avoid recursion in the case that type == "newListeners"! Before
	    // adding it to the listeners, first emit "newListeners".
	    this.emit('newListener', type, listener);

	    if(this.wildcard) {
	      growListenerTree.call(this, type, listener);
	      return this;
	    }

	    if (!this._events[type]) {
	      // Optimize the case of one listener. Don't need the extra array object.
	      this._events[type] = listener;
	    }
	    else if(typeof this._events[type] === 'function') {
	      // Adding the second element, need to change to array.
	      this._events[type] = [this._events[type], listener];
	    }
	    else if (isArray(this._events[type])) {
	      // If we've already got an array, just append.
	      this._events[type].push(listener);

	      // Check for listener leak
	      if (!this._events[type].warned) {

	        var m = defaultMaxListeners;

	        if (typeof this._events.maxListeners !== 'undefined') {
	          m = this._events.maxListeners;
	        }

	        if (m > 0 && this._events[type].length > m) {

	          this._events[type].warned = true;
	          console.error('(node) warning: possible EventEmitter memory ' +
	                        'leak detected. %d listeners added. ' +
	                        'Use emitter.setMaxListeners() to increase limit.',
	                        this._events[type].length);
	          console.trace();
	        }
	      }
	    }
	    return this;
	  };

	  EventEmitter.prototype.onAny = function(fn) {

	    if (typeof fn !== 'function') {
	      throw new Error('onAny only accepts instances of Function');
	    }

	    if(!this._all) {
	      this._all = [];
	    }

	    // Add the function to the event listener collection.
	    this._all.push(fn);
	    return this;
	  };

	  EventEmitter.prototype.addListener = EventEmitter.prototype.on;

	  EventEmitter.prototype.off = function(type, listener) {
	    if (typeof listener !== 'function') {
	      throw new Error('removeListener only takes instances of Function');
	    }

	    var handlers,leafs=[];

	    if(this.wildcard) {
	      var ns = typeof type === 'string' ? type.split(this.delimiter) : type.slice();
	      leafs = searchListenerTree.call(this, null, ns, this.listenerTree, 0);
	    }
	    else {
	      // does not use listeners(), so no side effect of creating _events[type]
	      if (!this._events[type]) return this;
	      handlers = this._events[type];
	      leafs.push({_listeners:handlers});
	    }

	    for (var iLeaf=0; iLeaf<leafs.length; iLeaf++) {
	      var leaf = leafs[iLeaf];
	      handlers = leaf._listeners;
	      if (isArray(handlers)) {

	        var position = -1;

	        for (var i = 0, length = handlers.length; i < length; i++) {
	          if (handlers[i] === listener ||
	            (handlers[i].listener && handlers[i].listener === listener) ||
	            (handlers[i]._origin && handlers[i]._origin === listener)) {
	            position = i;
	            break;
	          }
	        }

	        if (position < 0) {
	          continue;
	        }

	        if(this.wildcard) {
	          leaf._listeners.splice(position, 1);
	        }
	        else {
	          this._events[type].splice(position, 1);
	        }

	        if (handlers.length === 0) {
	          if(this.wildcard) {
	            delete leaf._listeners;
	          }
	          else {
	            delete this._events[type];
	          }
	        }
	        return this;
	      }
	      else if (handlers === listener ||
	        (handlers.listener && handlers.listener === listener) ||
	        (handlers._origin && handlers._origin === listener)) {
	        if(this.wildcard) {
	          delete leaf._listeners;
	        }
	        else {
	          delete this._events[type];
	        }
	      }
	    }

	    return this;
	  };

	  EventEmitter.prototype.offAny = function(fn) {
	    var i = 0, l = 0, fns;
	    if (fn && this._all && this._all.length > 0) {
	      fns = this._all;
	      for(i = 0, l = fns.length; i < l; i++) {
	        if(fn === fns[i]) {
	          fns.splice(i, 1);
	          return this;
	        }
	      }
	    } else {
	      this._all = [];
	    }
	    return this;
	  };

	  EventEmitter.prototype.removeListener = EventEmitter.prototype.off;

	  EventEmitter.prototype.removeAllListeners = function(type) {
	    if (arguments.length === 0) {
	      !this._events || init.call(this);
	      return this;
	    }

	    if(this.wildcard) {
	      var ns = typeof type === 'string' ? type.split(this.delimiter) : type.slice();
	      var leafs = searchListenerTree.call(this, null, ns, this.listenerTree, 0);

	      for (var iLeaf=0; iLeaf<leafs.length; iLeaf++) {
	        var leaf = leafs[iLeaf];
	        leaf._listeners = null;
	      }
	    }
	    else {
	      if (!this._events[type]) return this;
	      this._events[type] = null;
	    }
	    return this;
	  };

	  EventEmitter.prototype.listeners = function(type) {
	    if(this.wildcard) {
	      var handlers = [];
	      var ns = typeof type === 'string' ? type.split(this.delimiter) : type.slice();
	      searchListenerTree.call(this, handlers, ns, this.listenerTree, 0);
	      return handlers;
	    }

	    this._events || init.call(this);

	    if (!this._events[type]) this._events[type] = [];
	    if (!isArray(this._events[type])) {
	      this._events[type] = [this._events[type]];
	    }
	    return this._events[type];
	  };

	  EventEmitter.prototype.listenersAny = function() {

	    if(this._all) {
	      return this._all;
	    }
	    else {
	      return [];
	    }

	  };

	  if (true) {
	     // AMD. Register as an anonymous module.
	    !(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
	      return EventEmitter;
	    }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  } else if (typeof exports === 'object') {
	    // CommonJS
	    exports.EventEmitter2 = EventEmitter;
	  }
	  else {
	    // Browser global.
	    window.EventEmitter2 = EventEmitter;
	  }
	}();


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _constants = __webpack_require__(8);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var DEF_COLOR = 0xFFC107;
	var DEF_EMISSIVE = 0xFFC107;

	var _class = (function () {
	  function _class() {
	    _classCallCheck(this, _class);

	    var geometry = new THREE.SphereGeometry(_constants.STAR_RADIUS * _constants.SF, 64, 64);
	    this.material = new THREE.MeshPhongMaterial({ color: DEF_COLOR, emissive: DEF_EMISSIVE });
	    this.mesh = new THREE.Mesh(geometry, this.material);
	    this.posObject = new THREE.Object3D();
	    this.posObject.add(this.mesh);
	  }

	  _createClass(_class, [{
	    key: 'setProps',
	    value: function setProps(props) {
	      this.position.x = props.x * _constants.SF;
	      this.position.y = props.y * _constants.SF;
	    }
	  }, {
	    key: 'setHighlighted',
	    value: function setHighlighted(v) {
	      //this.material.color.setHex(v ? HIGHLIGHT_COLOR : DEF_COLOR);
	      //this.material.emissive.setHex(v ? HIGHLIGHT_EMISSIVE : DEF_EMISSIVE);
	    }
	  }, {
	    key: 'rootObject',
	    get: function get() {
	      return this.posObject;
	    }
	  }, {
	    key: 'position',
	    get: function get() {
	      return this.posObject.position;
	    }
	  }]);

	  return _class;
	})();

	exports.default = _class;

/***/ },
/* 8 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	// Default unit: AU
	var SF = exports.SF = 1000; // scale factor
	var STAR_RADIUS = exports.STAR_RADIUS = 0.1;
	var PLANET_RADIUS = exports.PLANET_RADIUS = 0.05;

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _constants = __webpack_require__(8);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var DEF_COLOR = 0x1286CD;
	var DEF_EMISSIVE = 0x002135;

	var _class = (function () {
	  function _class() {
	    _classCallCheck(this, _class);

	    var geometry = new THREE.SphereGeometry(_constants.PLANET_RADIUS * _constants.SF, 64, 64);
	    this.material = new THREE.MeshPhongMaterial({ color: DEF_COLOR, emissive: DEF_EMISSIVE });
	    this.mesh = new THREE.Mesh(geometry, this.material);
	    this.posObject = new THREE.Object3D();
	    this.posObject.add(this.mesh);
	  }

	  _createClass(_class, [{
	    key: 'setProps',
	    value: function setProps(props) {
	      this.position.x = props.x * _constants.SF;
	      this.position.y = props.y * _constants.SF;
	    }
	  }, {
	    key: 'setHighlighted',
	    value: function setHighlighted(v) {
	      //this.material.color.setHex(v ? HIGHLIGHT_COLOR : DEF_COLOR);
	      //this.material.emissive.setHex(v ? HIGHLIGHT_EMISSIVE : DEF_EMISSIVE);
	    }
	  }, {
	    key: 'rootObject',
	    get: function get() {
	      return this.posObject;
	    }
	  }, {
	    key: 'position',
	    get: function get() {
	      return this.posObject.position;
	    }
	  }]);

	  return _class;
	})();

	exports.default = _class;

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _constants = __webpack_require__(8);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var _class = (function () {
	  function _class() {
	    _classCallCheck(this, _class);

	    var steps = 8;
	    var size = 2 * _constants.SF;
	    var step = size / steps;

	    var geometry = new THREE.Geometry();
	    var material = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.35 });

	    for (var i = -size; i <= size; i += step) {
	      geometry.vertices.push(new THREE.Vector3(-size, i, 0));
	      geometry.vertices.push(new THREE.Vector3(size, i, 0));

	      geometry.vertices.push(new THREE.Vector3(i, -size, 0));
	      geometry.vertices.push(new THREE.Vector3(i, size, 0));
	    }
	    this.mesh = new THREE.LineSegments(geometry, material);
	  }

	  _createClass(_class, [{
	    key: 'rootObject',
	    get: function get() {
	      return this.mesh;
	    }
	  }, {
	    key: 'position',
	    get: function get() {
	      return this.mesh.position;
	    }
	  }]);

	  return _class;
	})();

	exports.default = _class;

/***/ },
/* 11 */,
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _constants = __webpack_require__(8);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var COUNT = 250;

	var _class = (function () {
	  function _class() {
	    _classCallCheck(this, _class);

	    this.geometry = new THREE.BufferGeometry();
	    this.geometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(COUNT * 3), 3));
	    this.geometry.addAttribute('alpha', new THREE.BufferAttribute(new Float32Array(COUNT), 1));
	    this.material = new THREE.ShaderMaterial({
	      uniforms: {
	        color: { type: 'c', value: new THREE.Color(0xdddddd) }
	      },
	      vertexShader: vertexShader(10 * _constants.SF),
	      fragmentShader: fragmentShader(),
	      transparent: true
	    });
	    this.points = new THREE.Points(this.geometry, this.material);
	    this.idx = 0;
	  }

	  _createClass(_class, [{
	    key: 'addBreadCrumb',
	    value: function addBreadCrumb(x, y) {
	      var vertices = this.points.geometry.attributes.position;
	      vertices.array[this.idx * 3] = x * _constants.SF;
	      vertices.array[this.idx * 3 + 1] = y * _constants.SF;
	      vertices.needsUpdate = true;

	      var alphas = this.points.geometry.attributes.alpha;
	      // [idx + 1] is the oldest breadcrumb, while [idx] is the youngest.
	      for (var i = 1; i <= COUNT; i++) {
	        alphas.array[(this.idx + i) % COUNT] = i / COUNT;
	      }
	      alphas.needsUpdate = true;

	      this.idx = (this.idx + 1) % COUNT;
	    }
	  }, {
	    key: 'rootObject',
	    get: function get() {
	      return this.points;
	    }
	  }, {
	    key: 'position',
	    get: function get() {
	      return this.points.position;
	    }
	  }]);

	  return _class;
	})();

	exports.default = _class;

	function vertexShader(pointSize) {
	  return '\n    attribute float alpha;\n    varying float vAlpha;\n    void main() {\n      vAlpha = alpha;\n      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);\n      gl_PointSize = ' + pointSize.toFixed(2) + ' / length(mvPosition.xyz);\n      gl_Position = projectionMatrix * mvPosition;\n    }';
	}

	function fragmentShader() {
	  return '\n    uniform vec3 color;\n    varying float vAlpha;\n    void main() {\n      gl_FragColor = vec4(color, vAlpha);\n    }';
	}

/***/ }
/******/ ]);