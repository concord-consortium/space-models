import EventEmitter from 'eventemitter2';
import Star from './view-models/star.js';
import Planet from './view-models/planet.js';
import Grid from './view-models/grid.js';
import {SF, PLANET_RADIUS} from './constants.js';

export default class {
  constructor(parentEl) {
    let width = parentEl.clientWidth;
    let height = parentEl.clientHeight;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(60, width / height, PLANET_RADIUS * SF / 100, PLANET_RADIUS * SF * 100);
    this.renderer = new THREE.WebGLRenderer({antialias: true});
    this.renderer.setSize(width, height);
    parentEl.appendChild(this.renderer.domElement);

    this._initScene();
    this._setInitialCamPos();

    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enablePan = false;
    this.controls.maxPolarAngle = Math.PI * 0.5;
    this.controls.minAzimuthAngle = 0;
    this.controls.maxAzimuthAngle = 0;
    this.controls.rotateSpeed = 0.5;

    this.dispatch = new EventEmitter();

    this.props = {};
  }

  setProps(props) {
    this.star.setProps(props.star);
    this.planet.setProps(props.planet);
  }

  // Delegate #on to EventEmitter object.
  on() {
    this.dispatch.on.apply(this.dispatch, arguments);
  }

  render() {
    this.controls.update();
    //if (this._interactionHandler) {
    //  this._interactionHandler.checkInteraction();
    //}
    this.renderer.render(this.scene, this.camera);
  }

  // Resizes canvas to fill its parent.
  resize() {
    let parent = this.renderer.domElement.parentElement;
    let newWidth = parent.clientWidth;
    let newHeight = parent.clientHeight;
    this.camera.aspect = newWidth / newHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(newWidth, newHeight);
  }

  _initScene() {
    this.grid = new Grid();
    this.star = new Star();
    this.planet = new Planet();
    this.scene.add(this.grid.rootObject);
    this.scene.add(this.star.rootObject);
    this.scene.add(this.planet.rootObject);
    this.scene.add(new THREE.AmbientLight(0x202020));
    this.scene.add(new THREE.PointLight(0xffffff, 1, 0));
  }

  _setInitialCamPos() {
    this.camera.position.x = 0;
    this.camera.position.y = 0;
    this.camera.position.z = PLANET_RADIUS * SF * 50;
  }
}
