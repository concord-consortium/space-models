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

	var _labIntegration = __webpack_require__(12);

	var _labIntegration2 = _interopRequireDefault(_labIntegration);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var container = document.getElementById('app');

	window.app = new _app2.default(container);
	(0, _labIntegration2.default)(window.app);

	window.onresize = resizeAppToWindow;
	resizeAppToWindow();

	function resizeAppToWindow() {
	  container.style.width = window.innerWidth + "px";
	  container.style.height = window.innerHeight + "px";
	  window.app.resize();
	}

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _eventemitter = __webpack_require__(2);

	var _eventemitter2 = _interopRequireDefault(_eventemitter);

	var _utils = __webpack_require__(3);

	var _physics = __webpack_require__(4);

	var _engine = __webpack_require__(5);

	var engine = _interopRequireWildcard(_engine);

	var _view = __webpack_require__(6);

	var _view2 = _interopRequireDefault(_view);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
	    diameter: 1, // [ earth diameter ]
	    rocky: true
	  },
	  camera: {
	    tilt: 90, // [ deg ], between 0 and 90
	    distance: 2.5 // [ AU ]
	  }
	};
	// Velocity will be set in such a way so that its orbit is circular.
	(0, _physics.setCircularVelocity)(DEF_STATE.planet);

	var _class = (function () {
	  function _class(parentEl) {
	    var _this = this;

	    _classCallCheck(this, _class);

	    this.state = (0, _utils.deepExtend)({}, DEF_STATE);

	    this.view = new _view2.default(parentEl);
	    this.view.on('camera.change', function (cameraState) {
	      _this.setState({ camera: cameraState });
	    });

	    this.tick = 0;
	    this.isPlaying = false;

	    this.dispatch = new _eventemitter2.default();

	    this._rafCallback = this._rafCallback.bind(this);
	    this._rafCallback();
	  }

	  _createClass(_class, [{
	    key: 'on',
	    value: function on() {
	      // Delegate #on to EventEmitter object.
	      this.dispatch.on.apply(this.dispatch, arguments);
	    }
	  }, {
	    key: 'play',
	    value: function play() {
	      this.isPlaying = true;
	      this.dispatch.emit('play');
	    }
	  }, {
	    key: 'stop',
	    value: function stop() {
	      this.isPlaying = false;
	      this.dispatch.emit('stop');
	    }
	  }, {
	    key: 'resize',
	    value: function resize() {
	      this.view.resize();
	    }
	  }, {
	    key: 'setState',
	    value: function setState(newState) {
	      (0, _utils.deepExtend)(this.state, newState);
	      this._emitStateChange();
	    }
	  }, {
	    key: '_rafCallback',
	    value: function _rafCallback() {
	      if (this.isPlaying) {
	        engine.tick(this.state);
	        if (this.tick % BREAD_CRUMBS_INTERVAL === 0) {
	          this.view.addBreadCrumb(this.state.planet.x, this.state.planet.y);
	        }
	        this.tick += 1;
	        this.dispatch.emit('tick');
	        this._emitStateChange();
	      }
	      this.view.setProps(this.state);
	      this.view.render();
	      this._rafID = requestAnimationFrame(this._rafCallback);
	    }
	  }, {
	    key: '_emitStateChange',
	    value: function _emitStateChange() {
	      this.dispatch.emit('state.change', this.state);
	    }
	  }]);

	  return _class;
	})();

	exports.default = _class;

/***/ },
/* 2 */
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
/* 3 */
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
/* 4 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.updatePlanetPos = updatePlanetPos;
	exports.updateStarPos = updateStarPos;
	exports.setCircularVelocity = setCircularVelocity;
	exports.planetMass = planetMass;
	// The universal gravitational constant in AU, years, and earth-mass units.
	var G = 0 - 2 * 5.922e-5;

	// The relative density compared to Earth.
	var ROCKY_PLANET_DENSITY = 1;
	// The relative density of Jupiter compared to Earth.
	var GAS_PLANET_DENSITY = 1 / 4.13;

	function updatePlanetPos(star, planet, timestep) {
	  leapFrog(star, planet, timestep);
	}

	function updateStarPos(star, planet) {
	  var rho = 0 - planetMass(planet) / star.mass;
	  star.x = rho * planet.x;
	  star.y = rho * planet.y;
	}

	function setCircularVelocity(planet) {
	  var p = planet;
	  var a = Math.atan2(p.x, p.y);
	  var d = Math.sqrt(p.x * p.x + p.y * p.y);
	  var v = 2 * Math.PI / Math.sqrt(d);
	  p.vx = v * Math.cos(a);
	  p.vy = -v * Math.sin(a);
	}

	function planetMass(planet) {
	  var density = planet.rocky ? ROCKY_PLANET_DENSITY : GAS_PLANET_DENSITY;
	  return density * Math.pow(planet.diameter, 3);
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
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.tick = tick;

	var _utils = __webpack_require__(3);

	var _physics = __webpack_require__(4);

	function tick(state) {
	  (0, _physics.updatePlanetPos)(state.star, state.planet, state.timestep);
	  (0, _physics.updateStarPos)(state.star, state.planet);
	  state.time += state.timestep;
	}

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _eventemitter = __webpack_require__(2);

	var _eventemitter2 = _interopRequireDefault(_eventemitter);

	var _star = __webpack_require__(7);

	var _star2 = _interopRequireDefault(_star);

	var _planet = __webpack_require__(9);

	var _planet2 = _interopRequireDefault(_planet);

	var _grid = __webpack_require__(10);

	var _grid2 = _interopRequireDefault(_grid);

	var _breadCrumbs = __webpack_require__(11);

	var _breadCrumbs2 = _interopRequireDefault(_breadCrumbs);

	var _camera = __webpack_require__(18);

	var _camera2 = _interopRequireDefault(_camera);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var _class = (function () {
	  function _class(parentEl) {
	    var _this = this;

	    _classCallCheck(this, _class);

	    this.renderer = webglAvailable() ? new THREE.WebGLRenderer({ antialias: true }) : new THREE.CanvasRenderer();
	    parentEl.appendChild(this.renderer.domElement);

	    this.camera = new _camera2.default(this.renderer.domElement);
	    this.camera.controls.addEventListener('change', function () {
	      _this.dispatch.emit('camera.change', _this.camera.getProps());
	    });

	    this.dispatch = new _eventemitter2.default();

	    this.scene = new THREE.Scene();
	    this._initScene();

	    this.resize();
	  }

	  _createClass(_class, [{
	    key: 'setProps',
	    value: function setProps(props) {
	      this.star.setProps(props.star);
	      this.planet.setProps(props.planet);
	      this.camera.setProps(props.camera);
	      this.grid.setSize(gridSizeForCameraDist(props.camera.distance));
	    }
	  }, {
	    key: 'getCameraTilt',
	    value: function getCameraTilt() {
	      return this.camera.tilt;
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
	      this.camera.update();
	      //if (this._interactionHandler) {
	      //  this._interactionHandler.checkInteraction();
	      //}
	      this.renderer.render(this.scene, this.camera.camera);
	    }

	    // Resizes canvas to fill its parent.

	  }, {
	    key: 'resize',
	    value: function resize() {
	      var parent = this.renderer.domElement.parentElement;
	      var newWidth = parent.clientWidth;
	      var newHeight = parent.clientHeight;
	      this.renderer.setSize(newWidth, newHeight);
	      this.camera.setSize(newWidth, newHeight);
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
	    }
	  }]);

	  return _class;
	})();

	exports.default = _class;

	function gridSizeForCameraDist(camDist) {
	  if (camDist < 8) {
	    return 2;
	  } else if (camDist < 64) {
	    return 8;
	  } else {
	    return 80;
	  }
	}

	function webglAvailable() {
	  try {
	    var canvas = document.createElement('canvas');
	    return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
	  } catch (e) {
	    return false;
	  }
	}

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

	    // Add point light too.
	    this.posObject.add(new THREE.PointLight(0xffffff, 1, 0));
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

	    var geometry = new THREE.Geometry();
	    geometry.dynamic = true;
	    var material = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.35 });
	    this.mesh = new THREE.LineSegments(geometry, material);

	    this.setSize(2);
	  }

	  _createClass(_class, [{
	    key: 'setSize',
	    value: function setSize(newSize) {
	      if (this.oldSize === newSize) return;

	      var size = newSize * _constants.SF; // convert AU to view units
	      var steps = 8;
	      var step = size / steps;

	      var geometry = this.mesh.geometry;
	      geometry.vertices.length = 0;
	      for (var i = -size; i <= size; i += step) {
	        geometry.vertices.push(new THREE.Vector3(-size, i, 0));
	        geometry.vertices.push(new THREE.Vector3(size, i, 0));

	        geometry.vertices.push(new THREE.Vector3(i, -size, 0));
	        geometry.vertices.push(new THREE.Vector3(i, size, 0));
	      }
	      geometry.verticesNeedUpdate = true;
	      this.oldSize = newSize;
	    }
	  }, {
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
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _constants = __webpack_require__(8);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var COUNT = 250;
	var VERTEX_SHADER = '\n  attribute float alpha;\n  varying float vAlpha;\n  void main() {\n    vAlpha = alpha;\n    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);\n    gl_PointSize = 3.5;\n    gl_Position = projectionMatrix * mvPosition;\n  }';
	var FRAGMENT_SHADER = '\n  uniform vec3 color;\n  varying float vAlpha;\n  void main() {\n    gl_FragColor = vec4(color, vAlpha);\n  }';

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
	      vertexShader: VERTEX_SHADER,
	      fragmentShader: FRAGMENT_SHADER,
	      transparent: true
	    });
	    this.points = new THREE.Points(this.geometry, this.material);

	    this.count = 0;
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
	      for (var i = 0; i < this.count; i++) {
	        var idx = this.idx - i >= 0 ? this.idx - i : this.idx - i + COUNT;
	        alphas.array[idx] = 1 - i / COUNT;
	      }
	      alphas.needsUpdate = true;

	      this.count = Math.min(COUNT, this.count + 1);
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

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	exports.default = function (app) {
	  var phone = _iframePhone2.default.getIFrameEndpoint();

	  app.on('play', function () {
	    phone.post('play.iframe-model');
	  });
	  app.on('stop', function () {
	    phone.post('stop.iframe-model');
	  });
	  app.on('tick', function () {
	    phone.post('tick');
	  });
	  app.on('state.change', function (newState) {
	    phone.post('outputs', getOutputs(newState));
	  });

	  phone.addListener('play', function () {
	    app.play();
	  });
	  phone.addListener('stop', function () {
	    app.stop();
	  });
	  phone.addListener('set', function (content) {
	    // 'set' {name: 'planet.x', value: 1} => app.state.planet.x = content.value
	    var names = content.name.split('.');
	    var stateObj = {};
	    var state = stateObj;
	    while (names.length > 1) {
	      state = state[names.shift()] = {};
	    }
	    state[names[0]] = content.value;
	    app.setState(stateObj);
	  });

	  phone.initialize();

	  phone.post('outputs', getOutputs(app.state));
	};

	var _utils = __webpack_require__(3);

	var _iframePhone = __webpack_require__(13);

	var _iframePhone2 = _interopRequireDefault(_iframePhone);

	var _physics = __webpack_require__(4);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function getOutputs(state) {
	  var outputs = {};
	  outputs['planet.mass'] = (0, _physics.planetMass)(state.planet);
	  outputs['camera.tilt'] = state.camera.tilt;
	  return outputs;
	}

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	  /**
	   * Allows to communicate with an iframe.
	   */
	  ParentEndpoint:  __webpack_require__(14),
	  /**
	   * Allows to communicate with a parent page.
	   * IFrameEndpoint is a singleton, as iframe can't have multiple parents anyway.
	   */
	  getIFrameEndpoint: __webpack_require__(16),
	  structuredClone: __webpack_require__(15),

	  // TODO: May be misnamed
	  IframePhoneRpcEndpoint: __webpack_require__(17)

	};


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	var structuredClone = __webpack_require__(15);

	/**
	  Call as:
	    new ParentEndpoint(targetWindow, targetOrigin, afterConnectedCallback)
	      targetWindow is a WindowProxy object. (Messages will be sent to it)

	      targetOrigin is the origin of the targetWindow. (Messages will be restricted to this origin)

	      afterConnectedCallback is an optional callback function to be called when the connection is
	        established.

	  OR (less secure):
	    new ParentEndpoint(targetIframe, afterConnectedCallback)

	      targetIframe is a DOM object (HTMLIframeElement); messages will be sent to its contentWindow.

	      afterConnectedCallback is an optional callback function

	    In this latter case, targetOrigin will be inferred from the value of the src attribute of the
	    provided DOM object at the time of the constructor invocation. This is less secure because the
	    iframe might have been navigated to an unexpected domain before constructor invocation.

	  Note that it is important to specify the expected origin of the iframe's content to safeguard
	  against sending messages to an unexpected domain. This might happen if our iframe is navigated to
	  a third-party URL unexpectedly. Furthermore, having a reference to Window object (as in the first
	  form of the constructor) does not protect against sending a message to the wrong domain. The
	  window object is actualy a WindowProxy which transparently proxies the Window object of the
	  underlying iframe, so that when the iframe is navigated, the "same" WindowProxy now references a
	  completely differeent Window object, possibly controlled by a hostile domain.

	  See http://www.esdiscuss.org/topic/a-dom-use-case-that-can-t-be-emulated-with-direct-proxies for
	  more about this weird behavior of WindowProxies (the type returned by <iframe>.contentWindow).
	*/

	module.exports = function ParentEndpoint(targetWindowOrIframeEl, targetOrigin, afterConnectedCallback) {
	  var selfOrigin = window.location.href.match(/(.*?\/\/.*?)\//)[1];
	  var postMessageQueue = [];
	  var connected = false;
	  var handlers = {};
	  var targetWindowIsIframeElement;

	  function getOrigin(iframe) {
	    return iframe.src.match(/(.*?\/\/.*?)\//)[1];
	  }

	  function post(type, content) {
	    var message;
	    // Message object can be constructed from 'type' and 'content' arguments or it can be passed
	    // as the first argument.
	    if (arguments.length === 1 && typeof type === 'object' && typeof type.type === 'string') {
	      message = type;
	    } else {
	      message = {
	        type: type,
	        content: content
	      };
	    }
	    if (connected) {
	      var tWindow = getTargetWindow();
	      // if we are laready connected ... send the message
	      message.origin = selfOrigin;
	      // See http://dev.opera.com/articles/view/window-postmessage-messagechannel/#crossdoc
	      //     https://github.com/Modernizr/Modernizr/issues/388
	      //     http://jsfiddle.net/ryanseddon/uZTgD/2/
	      if (structuredClone.supported()) {
	        tWindow.postMessage(message, targetOrigin);
	      } else {
	        tWindow.postMessage(JSON.stringify(message), targetOrigin);
	      }
	    } else {
	      // else queue up the messages to send after connection complete.
	      postMessageQueue.push(message);
	    }
	  }

	  function addListener(messageName, func) {
	    handlers[messageName] = func;
	  }

	  function removeListener(messageName) {
	    handlers[messageName] = null;
	  }

	  // Note that this function can't be used when IFrame element hasn't been added to DOM yet
	  // (.contentWindow would be null). At the moment risk is purely theoretical, as the parent endpoint
	  // only listens for an incoming 'hello' message and the first time we call this function
	  // is in #receiveMessage handler (so iframe had to be initialized before, as it could send 'hello').
	  // It would become important when we decide to refactor the way how communication is initialized.
	  function getTargetWindow() {
	    if (targetWindowIsIframeElement) {
	      var tWindow = targetWindowOrIframeEl.contentWindow;
	      if (!tWindow) {
	        throw "IFrame element needs to be added to DOM before communication " +
	              "can be started (.contentWindow is not available)";
	      }
	      return tWindow;
	    }
	    return targetWindowOrIframeEl;
	  }

	  function receiveMessage(message) {
	    var messageData;
	    if (message.source === getTargetWindow() && message.origin === targetOrigin) {
	      messageData = message.data;
	      if (typeof messageData === 'string') {
	        messageData = JSON.parse(messageData);
	      }
	      if (handlers[messageData.type]) {
	        handlers[messageData.type](messageData.content);
	      } else {
	        console.log("cant handle type: " + messageData.type);
	      }
	    }
	  }

	  function disconnect() {
	    connected = false;
	    window.removeEventListener('message', receiveMessage);
	  }

	  // handle the case that targetWindowOrIframeEl is actually an <iframe> rather than a Window(Proxy) object
	  // Note that if it *is* a WindowProxy, this probe will throw a SecurityException, but in that case
	  // we also don't need to do anything
	  try {
	    targetWindowIsIframeElement = targetWindowOrIframeEl.constructor === HTMLIFrameElement;
	  } catch (e) {
	    targetWindowIsIframeElement = false;
	  }

	  if (targetWindowIsIframeElement) {
	    // Infer the origin ONLY if the user did not supply an explicit origin, i.e., if the second
	    // argument is empty or is actually a callback (meaning it is supposed to be the
	    // afterConnectionCallback)
	    if (!targetOrigin || targetOrigin.constructor === Function) {
	      afterConnectedCallback = targetOrigin;
	      targetOrigin = getOrigin(targetWindowOrIframeEl);
	    }
	  }

	  // when we receive 'hello':
	  addListener('hello', function() {
	    connected = true;

	    // send hello response
	    post('hello');

	    // give the user a chance to do things now that we are connected
	    // note that is will happen before any queued messages
	    if (afterConnectedCallback && typeof afterConnectedCallback === "function") {
	      afterConnectedCallback();
	    }

	    // Now send any messages that have been queued up ...
	    while(postMessageQueue.length > 0) {
	      post(postMessageQueue.shift());
	    }
	  });

	  window.addEventListener('message', receiveMessage, false);

	  // Public API.
	  return {
	    post: post,
	    addListener: addListener,
	    removeListener: removeListener,
	    disconnect: disconnect,
	    getTargetWindow: getTargetWindow,
	    targetOrigin: targetOrigin
	  };
	};


/***/ },
/* 15 */
/***/ function(module, exports) {

	var featureSupported = false;

	(function () {
	  var result = 0;

	  if (!!window.postMessage) {
	    try {
	      // Safari 5.1 will sometimes throw an exception and sometimes won't, lolwut?
	      // When it doesn't we capture the message event and check the
	      // internal [[Class]] property of the message being passed through.
	      // Safari will pass through DOM nodes as Null iOS safari on the other hand
	      // passes it through as DOMWindow, gotcha.
	      window.onmessage = function(e){
	        var type = Object.prototype.toString.call(e.data);
	        result = (type.indexOf("Null") != -1 || type.indexOf("DOMWindow") != -1) ? 1 : 0;
	        featureSupported = {
	          'structuredClones': result
	        };
	      };
	      // Spec states you can't transmit DOM nodes and it will throw an error
	      // postMessage implimentations that support cloned data will throw.
	      window.postMessage(document.createElement("a"),"*");
	    } catch(e) {
	      // BBOS6 throws but doesn't pass through the correct exception
	      // so check error message
	      result = (e.DATA_CLONE_ERR || e.message == "Cannot post cyclic structures.") ? 1 : 0;
	      featureSupported = {
	        'structuredClones': result
	      };
	    }
	  }
	}());

	exports.supported = function supported() {
	  return featureSupported && featureSupported.structuredClones > 0;
	};


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	var structuredClone = __webpack_require__(15);
	var HELLO_INTERVAL_LENGTH = 200;
	var HELLO_TIMEOUT_LENGTH = 60000;

	function IFrameEndpoint() {
	  var parentOrigin;
	  var listeners = {};
	  var isInitialized = false;
	  var connected = false;
	  var postMessageQueue = [];
	  var helloInterval;

	  function postToTarget(message, target) {
	    // See http://dev.opera.com/articles/view/window-postmessage-messagechannel/#crossdoc
	    //     https://github.com/Modernizr/Modernizr/issues/388
	    //     http://jsfiddle.net/ryanseddon/uZTgD/2/
	    if (structuredClone.supported()) {
	      window.parent.postMessage(message, target);
	    } else {
	      window.parent.postMessage(JSON.stringify(message), target);
	    }
	  }

	  function post(type, content) {
	    var message;
	    // Message object can be constructed from 'type' and 'content' arguments or it can be passed
	    // as the first argument.
	    if (arguments.length === 1 && typeof type === 'object' && typeof type.type === 'string') {
	      message = type;
	    } else {
	      message = {
	        type: type,
	        content: content
	      };
	    }
	    if (connected) {
	      postToTarget(message, parentOrigin);
	    } else {
	      postMessageQueue.push(message);
	    }
	  }

	  // Only the initial 'hello' message goes permissively to a '*' target (because due to cross origin
	  // restrictions we can't find out our parent's origin until they voluntarily send us a message
	  // with it.)
	  function postHello() {
	    postToTarget({
	      type: 'hello',
	      origin: document.location.href.match(/(.*?\/\/.*?)\//)[1]
	    }, '*');
	  }

	  function addListener(type, fn) {
	    listeners[type] = fn;
	  }

	  function removeAllListeners() {
	    listeners = {};
	  }

	  function getListenerNames() {
	    return Object.keys(listeners);
	  }

	  function messageListener(message) {
	      // Anyone can send us a message. Only pay attention to messages from parent.
	      if (message.source !== window.parent) return;

	      var messageData = message.data;

	      if (typeof messageData === 'string') messageData = JSON.parse(messageData);

	      // We don't know origin property of parent window until it tells us.
	      if (!connected && messageData.type === 'hello') {
	        // This is the return handshake from the embedding window.
	        parentOrigin = messageData.origin;
	        connected = true;
	        stopPostingHello();
	        while(postMessageQueue.length > 0) {
	          post(postMessageQueue.shift());
	        }
	      }

	      // Perhaps-redundantly insist on checking origin as well as source window of message.
	      if (message.origin === parentOrigin) {
	        if (listeners[messageData.type]) listeners[messageData.type](messageData.content);
	      }
	   }

	   function disconnect() {
	     connected = false;
	     stopPostingHello();
	     window.removeEventListener('message', messsageListener);
	   }

	  /**
	    Initialize communication with the parent frame. This should not be called until the app's custom
	    listeners are registered (via our 'addListener' public method) because, once we open the
	    communication, the parent window may send any messages it may have queued. Messages for which
	    we don't have handlers will be silently ignored.
	  */
	  function initialize() {
	    if (isInitialized) {
	      return;
	    }
	    isInitialized = true;
	    if (window.parent === window) return;

	    // We kick off communication with the parent window by sending a "hello" message. Then we wait
	    // for a handshake (another "hello" message) from the parent window.
	    postHello();
	    startPostingHello();
	    window.addEventListener('message', messageListener, false);
	  }

	  function startPostingHello() {
	    if (helloInterval) {
	      stopPostingHello();
	    }
	    helloInterval = window.setInterval(postHello, HELLO_INTERVAL_LENGTH);
	    window.setTimeout(stopPostingHello, HELLO_TIMEOUT_LENGTH);
	  }

	  function stopPostingHello() {
	    window.clearInterval(helloInterval);
	    helloInterval = null;
	  }

	  // Public API.
	  return {
	    initialize        : initialize,
	    getListenerNames  : getListenerNames,
	    addListener       : addListener,
	    removeAllListeners: removeAllListeners,
	    disconnect        : disconnect,
	    post              : post
	  };
	}

	var instance = null;

	// IFrameEndpoint is a singleton, as iframe can't have multiple parents anyway.
	module.exports = function getIFrameEndpoint() {
	  if (!instance) {
	    instance = new IFrameEndpoint();
	  }
	  return instance;
	};

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var ParentEndpoint = __webpack_require__(14);
	var getIFrameEndpoint = __webpack_require__(16);

	// Not a real UUID as there's an RFC for that (needed for proper distributed computing).
	// But in this fairly parochial situation, we just need to be fairly sure to avoid repeats.
	function getPseudoUUID() {
	    var chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
	    var len = chars.length;
	    var ret = [];

	    for (var i = 0; i < 10; i++) {
	        ret.push(chars[Math.floor(Math.random() * len)]);
	    }
	    return ret.join('');
	}

	module.exports = function IframePhoneRpcEndpoint(handler, namespace, targetWindow, targetOrigin, phone) {
	    var pendingCallbacks = Object.create({});

	    // if it's a non-null object, rather than a function, 'handler' is really an options object
	    if (handler && typeof handler === 'object') {
	        namespace = handler.namespace;
	        targetWindow = handler.targetWindow;
	        targetOrigin = handler.targetOrigin;
	        phone = handler.phone;
	        handler = handler.handler;
	    }

	    if ( ! phone ) {
	        if (targetWindow === window.parent) {
	            phone = getIFrameEndpoint();
	            phone.initialize();
	        } else {
	            phone = new ParentEndpoint(targetWindow, targetOrigin);
	        }
	    }

	    phone.addListener(namespace, function(message) {
	        var callbackObj;

	        if (message.messageType === 'call' && typeof this.handler === 'function') {
	            this.handler.call(undefined, message.value, function(returnValue) {
	                phone.post(namespace, {
	                    messageType: 'returnValue',
	                    uuid: message.uuid,
	                    value: returnValue
	                });
	            });
	        } else if (message.messageType === 'returnValue') {
	            callbackObj = pendingCallbacks[message.uuid];

	            if (callbackObj) {
	                window.clearTimeout(callbackObj.timeout);
	                if (callbackObj.callback) {
	                    callbackObj.callback.call(undefined, message.value);
	                }
	                pendingCallbacks[message.uuid] = null;
	            }
	        }
	    }.bind(this));

	    function call(message, callback) {
	        var uuid = getPseudoUUID();

	        pendingCallbacks[uuid] = {
	            callback: callback,
	            timeout: window.setTimeout(function() {
	                if (callback) {
	                    callback(undefined, new Error("IframePhone timed out waiting for reply"));
	                }
	            }, 2000)
	        };

	        phone.post(namespace, {
	            messageType: 'call',
	            uuid: uuid,
	            value: message
	        });
	    }

	    function disconnect() {
	        phone.disconnect();
	    }

	    this.handler = handler;
	    this.call = call.bind(this);
	    this.disconnect = disconnect.bind(this);
	};


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _constants = __webpack_require__(8);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var ROTATION_AXIS = new THREE.Vector3(1, 0, 0);
	var ZERO_TILT_VEC = new THREE.Vector3(0, -1, 0);

	var _class = (function () {
	  function _class(canvas) {
	    _classCallCheck(this, _class);

	    this.camera = new THREE.PerspectiveCamera(60, 1, 0.1 * _constants.SF, 1000 * _constants.SF);
	    this.position.z = 2.5 * _constants.SF;

	    this.controls = new THREE.OrbitControls(this.camera, canvas);
	    this.controls.enablePan = false;
	    this.controls.minPolarAngle = Math.PI * 0.5;
	    this.controls.maxPolarAngle = Math.PI;
	    this.controls.minAzimuthAngle = 0;
	    this.controls.maxAzimuthAngle = 0;
	    this.controls.rotateSpeed = 0.5;
	    this.controls.zoomSpeed = 0.3;

	    this.oldProps = {};
	  }

	  _createClass(_class, [{
	    key: 'setProps',
	    value: function setProps(props) {
	      if (this.oldProps.tilt !== props.tilt) {
	        var angleDiff = this.position.angleTo(ZERO_TILT_VEC);
	        var tiltInRad = props.tilt * Math.PI / 180;
	        this.position.applyAxisAngle(ROTATION_AXIS, angleDiff - tiltInRad);
	        this.controls.update();
	        this.oldProps.tilt = props.tilt;
	      }
	      if (this.oldProps.distance !== props.distance) {
	        this.position.setLength(props.distance * _constants.SF);
	        this.oldProps.distance = props.distance;
	      }
	    }
	  }, {
	    key: 'getProps',
	    value: function getProps() {
	      var props = {};
	      props.tilt = this.position.angleTo(ZERO_TILT_VEC) * 180 / Math.PI;
	      props.distance = this.position.length() / _constants.SF;
	      return props;
	    }

	    // Tilt is defined in degrees and it has a bit different range than control's polar angle
	    // (from 0 to 90, while the polar angle is between PI/2 and PI).

	  }, {
	    key: 'setTilt',
	    value: function setTilt(tiltInDeg) {
	      var newPolarAngle = (180 - tiltInDeg) * Math.PI / 180;
	      var polarAngleDiff = newPolarAngle - this.controls.getPolarAngle();
	      this.controls.constraint.rotateUp(polarAngleDiff);
	    }
	  }, {
	    key: 'setSize',
	    value: function setSize(newWidth, newHeight) {
	      this.camera.aspect = newWidth / newHeight;
	      this.camera.updateProjectionMatrix();
	    }
	  }, {
	    key: 'update',
	    value: function update() {
	      this.controls.update();
	    }
	  }, {
	    key: 'position',
	    get: function get() {
	      return this.camera.position;
	    }
	  }]);

	  return _class;
	})();

	exports.default = _class;

/***/ }
/******/ ]);