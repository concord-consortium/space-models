import $ from 'jquery';
import EventEmitter from 'eventemitter2';
import Star from './view-models/star.js';
import Planet from './view-models/planet.js';
import Grid from './view-models/grid.js';
import BreadCrumbs from './view-models/bread-crumbs.js';
import HabitationZone from './view-models/habitation-zone.js';
import Camera from './view-models/camera.js';
import InteractionsManager from './interactions-manager.js';
import {SF} from './constants.js';

// Let user know that he can change the tilt.
const TILT_CURSOR = 'ns-resize';

export default class {
  constructor(parentEl) {
    this.renderer = webglAvailable() ? new THREE.WebGLRenderer()
                                     : new THREE.CanvasRenderer();
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setClearColor(0x000000, 1);
    parentEl.appendChild(this.renderer.domElement);

    this._addHTMLDisplay(parentEl);

    this.camera = new Camera(this.renderer.domElement);
    this.camera.onChange(() => {
      this.dispatch.emit('camera.change', this.camera.getProps());
    });

    this.dispatch = new EventEmitter();

    this.scene = new THREE.Scene();
    this._initScene();

    this.interactionEnabled = true;
    this.interactionsManager = new InteractionsManager(this.renderer.domElement, this.camera);
    this._initInteractions();

    this.resize();
  }

  setProps(props) {
    this.star.setProps(props.star);
    this.habitationZone.setProps(props.habitationZone);
    this.planet.setProps(props.planet);
    this.camera.setProps(props.camera);

    this._setupZoomLevel(props.camera.zoom);

    this._showTilt(props.camera.tiltLocked ? false : props.camera.tilt.toFixed(2));
  }

  addBreadCrumb(x, y) {
    this.breadCrumbs.addBreadCrumb(x, y);
  }

  clearBreadCrumbs() {
    this.breadCrumbs.clear();
  }

  // Delegate #on to EventEmitter object.
  on() {
    this.dispatch.on.apply(this.dispatch, arguments);
  }

  render() {
    this.camera.update();
    this.renderer.render(this.scene, this.camera.camera);
    if (this.interactionEnabled) {
      this.interactionsManager.checkInteraction();
    }
  }

  // Resizes canvas to fill its parent.
  resize() {
    let parent = this.renderer.domElement.parentElement;
    let newWidth = parent.clientWidth;
    let newHeight = parent.clientHeight;
    this.renderer.setSize(newWidth, newHeight);
    this.camera.setSize(newWidth, newHeight);
    this.$display.css('font-size', (newHeight / 26) + 'px');
  }

  _addHTMLDisplay(parentEl) {
    this.$display = $('<div class="display">The tilt is <span class="tilt-val"></span> degrees</div>');
    this.$display.css({
      position: 'absolute',
      bottom: '5px',
      right: '5px',
      color: '#fff',
      fontFamily: 'Arial',
      pointerEvents: 'none'
    });
    this.$display.appendTo(parentEl);
    this.$tiltVal = this.$display.find('.tilt-val');
    this.$tiltVal.css({
      fontWeight: 'bold'
    })
  }

  _setCursor(cursor) {
    this.renderer.domElement.style.cursor = cursor || this._mainCursor;
  }

  // If 'tilt' is a number, it shows it at the bottom of the screen.
  // If it's false, it hides the display.
  _showTilt(tilt) {
    if (!this._tilt && tilt) {
      this.$display.show();
      this._mainCursor = TILT_CURSOR;
      this._setCursor();
    } else if (this._tilt && !tilt) {
      this.$display.hide();
      this._mainCursor = '';
      this._setCursor();
    }
    if (this._tilt !== tilt) {
      this.$tiltVal.text(tilt);
      this._tilt = tilt;
    }
  }

  // Updates grid size and makes certain objects bigger so they are still visible.
  _setupZoomLevel(zoom) {
    let gridSize = gridSizeForZoom(zoom);
    this.grid.size = gridSize;
  }

  _initScene() {
    this.grid = new Grid();
    this.star = new Star();
    this.habitationZone = new HabitationZone();
    this.planet = new Planet();
    this.breadCrumbs = new BreadCrumbs();
    this.scene.add(this.grid.rootObject);
    this.scene.add(this.star.rootObject);
    this.scene.add(this.habitationZone.rootObject);
    this.scene.add(this.planet.rootObject);
    this.scene.add(this.breadCrumbs.rootObject);
    this.scene.add(new THREE.AmbientLight(0x202020));
  }

  _initInteractions() {
    // Earth dragging.
    this.interactionsManager.registerInteraction({
      test: () => {
        return this.interactionsManager.isUserPointing(this.planet.interactionMesh);
      },
      activationChangeHandler: (isActive) => {
        this.planet.setHighlighted(isActive);
        this._setCursor(isActive ? 'move' : null);
      },
      stepHandler: () => {
        let coords = this.interactionsManager.pointerToXYPlane();
        this.dispatch.emit('planet.change', {x: coords.x / SF, y: coords.y / SF});
      }
    });
    // Velocity arrow(head) dragging.
    this.interactionsManager.registerInteraction({
      test: () => {
        return this.interactionsManager.isUserPointing(this.planet.velocityArrow.interactionMesh);
      },
      activationChangeHandler: (isActive) => {
        this.planet.velocityArrow.setHighlighted(isActive);
        this._setCursor(isActive ? 'move' : null);
      },
      stepHandler: () => {
        let coords = this.interactionsManager.pointerToXYPlane();
        // Calculate coordinates of new velocity vector in view units.
        let vx = coords.x - this.planet.position.x;
        let vy = coords.y - this.planet.position.y;
        this.dispatch.emit('planet.change', this.planet.velocityViewUnit2AU(vx, vy));
      }
    });
  }
}

function gridSizeForZoom(zoom) {
  if (zoom >= 2) {
    return 1;
  }
  if (zoom >= 0.5) {
    return 2;
  }
  return 5;
}

function webglAvailable() {
  try {
    var canvas = document.createElement('canvas');
    return !!( window.WebGLRenderingContext && (
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl') )
    );
  } catch (e) {
    return false;
  }
}