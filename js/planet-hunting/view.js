import EventEmitter from 'eventemitter2';
import Star from './view-models/star.js';
import Planet from './view-models/planet.js';
import Grid from './view-models/grid.js';
import BreadCrumbs from './view-models/bread-crumbs.js';
import Camera from './view-models/camera.js';
import InteractionsManager from './interactions-manager.js';
import {SF} from './constants.js';
import {VELOCITY_LEN_SCALE} from './view-models/velocity-arrow.js';

export default class {
  constructor(parentEl) {
    this.renderer = webglAvailable() ? new THREE.WebGLRenderer({antialias: true})
                                     : new THREE.CanvasRenderer();
    parentEl.appendChild(this.renderer.domElement);

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
    this.planet.setProps(props.planet);
    this.camera.setProps(props.camera);

    this._setupZoomLevel(props.camera.distance);
  }

  getCameraTilt() {
    return this.camera.tilt;
  }

  addBreadCrumb(x, y) {
    this.breadCrumbs.addBreadCrumb(x, y);
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
  }

  // Updates grid size and makes certain objects bigger so they are still visible.
  _setupZoomLevel(cameraDistance) {
    let gridSize = gridSizeForCameraDist(cameraDistance);
    this.grid.size = gridSize;
    let objectScale = objectScaleForGridSize(gridSize);
    this.planet.scale = objectScale;
    this.star.scale = objectScale;
  }

  _initScene() {
    this.grid = new Grid();
    this.star = new Star();
    this.planet = new Planet();
    this.breadCrumbs = new BreadCrumbs();
    this.scene.add(this.grid.rootObject);
    this.scene.add(this.star.rootObject);
    this.scene.add(this.planet.rootObject);
    this.scene.add(this.breadCrumbs.rootObject);
    this.scene.add(new THREE.AmbientLight(0x202020));
  }

  _initInteractions() {
    // Earth dragging.
    this.interactionsManager.registerInteraction({
      test: () => {
        return this.interactionsManager.isUserPointing(this.planet.mesh);
      },
      activationChangeHandler: (isActive) => {
        this.planet.setHighlighted(isActive);
        document.body.style.cursor = isActive ? 'move' : '';
      },
      stepHandler: () => {
        let coords = this.interactionsManager.pointerToXYPlane();
        this.dispatch.emit('planet.change', {x: coords.x / SF, y: coords.y / SF});
      }
    });
    // Velocity arrow(head) dragging.
    this.interactionsManager.registerInteraction({
      test: () => {
        return this.interactionsManager.isUserPointing(this.planet.velocityArrow.headMesh);
      },
      activationChangeHandler: (isActive) => {
        this.planet.velocityArrow.setHighlighted(isActive);
        document.body.style.cursor = isActive ? 'move' : '';
      },
      stepHandler: () => {
        let coords = this.interactionsManager.pointerToXYPlane();
        let vx = (coords.x - this.planet.position.x) / VELOCITY_LEN_SCALE;
        let vy = (coords.y - this.planet.position.y) / VELOCITY_LEN_SCALE;
        this.dispatch.emit('planet.change', {vx: vx, vy: vy});
      }
    });
  }
}

function gridSizeForCameraDist(camDist) {
  if (camDist < 8) {
    return 2;
  } else if (camDist < 64) {
    return 8;
  } else {
    return 64;
  }
}

function objectScaleForGridSize(gridSize) {
  if (gridSize <= 2) {
    return 1;
  } else if (gridSize <= 8) {
    return 4;
  } else {
    return 32;
  }
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