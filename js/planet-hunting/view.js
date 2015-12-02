import EventEmitter from 'eventemitter2';
import Star from './view-models/star.js';
import Planet from './view-models/planet.js';
import Grid from './view-models/grid.js';
import BreadCrumbs from './view-models/bread-crumbs.js';
import Camera from './view-models/camera.js';

export default class {
  constructor(parentEl) {
    this.renderer = webglAvailable() ? new THREE.WebGLRenderer({antialias: true})
                                     : new THREE.CanvasRenderer();
    parentEl.appendChild(this.renderer.domElement);

    this.camera = new Camera(this.renderer.domElement);
    this.camera.controls.addEventListener('change', () => {
      this.dispatch.emit('camera.change', this.camera.getProps());
    });

    this.dispatch = new EventEmitter();

    this.scene = new THREE.Scene();
    this._initScene();

    this.resize();
  }

  setProps(props) {
    this.star.setProps(props.star);
    this.planet.setProps(props.planet);
    this.camera.setProps(props.camera);
    this.grid.setSize(gridSizeForCameraDist(props.camera.distance));
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
    //if (this._interactionHandler) {
    //  this._interactionHandler.checkInteraction();
    //}
    this.renderer.render(this.scene, this.camera.camera);
  }

  // Resizes canvas to fill its parent.
  resize() {
    let parent = this.renderer.domElement.parentElement;
    let newWidth = parent.clientWidth;
    let newHeight = parent.clientHeight;
    this.renderer.setSize(newWidth, newHeight);
    this.camera.setSize(newWidth, newHeight);
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
}

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
    return !!( window.WebGLRenderingContext && (
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl') )
    );
  } catch (e) {
    return false;
  }
}