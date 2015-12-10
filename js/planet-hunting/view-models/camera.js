import {SF} from '../constants.js';

const ROTATION_AXIS = new THREE.Vector3(1, 0, 0);
const ZERO_TILT_VEC = new THREE.Vector3(0, -1, 0);
const ZOOM_SPEED = 1.013;
const ZOOM_MIN = 0.25;
const ZOOM_MAX = 15;

export default class {
  constructor(canvas) {
    this.camera = new THREE.PerspectiveCamera(15, 1, 0.1 * SF, 1000 * SF);
    this.position.z = 2.5 * SF;

    this.controls = new THREE.OrbitControls(this.camera, canvas);
    this.controls.enablePan = false;
    this.controls.minPolarAngle = Math.PI * 0.5;
    this.controls.maxPolarAngle = Math.PI;
    this.controls.minAzimuthAngle = 0;
    this.controls.maxAzimuthAngle = 0;
    this.controls.rotateSpeed = 0.5;

    this.changeCallback = function() { /* noop */ };

    // Use custom zooming which changes camera lens instead of camera position.
    this.controls.enableZoom = false;
    this.zoomLocked = false;
    canvas.addEventListener('mousewheel', this._onMouseWheel.bind(this), false);
    canvas.addEventListener('MozMousePixelScroll', this._onMouseWheel.bind(this), false);
  }

  get position() {
    return this.camera.position;
  }

  set tiltLocked(v) {
    this._tiltLocked = v;
    this.controls.enableRotate = !v;
  }

  get tiltLocked() {
    // We can't return !this.controls.enableRotate, as this value is also modified by #lockedForInteraction!
    return this._tiltLocked;
  }

  // It *temporarily* locks tilt and zoom change.
  set lockedForInteraction(v) {
    // We can't use #tiltLocked, as we want to preserver value of this property. This is only temporal lock.
    this.controls.enableRotate = v ? false : !this._tiltLocked;
    this.zoomLocked = v;
  }

  set tilt(v) {
    if (v === this._tilt) return;
    this._tilt = v;
    let angleDiff = this.position.angleTo(ZERO_TILT_VEC);
    let tiltInRad = v * Math.PI / 180;
    this.position.applyAxisAngle(ROTATION_AXIS, angleDiff - tiltInRad);
    this.controls.update();
  }

  get tilt() {
    return this.position.angleTo(ZERO_TILT_VEC) * 180 / Math.PI;
  }

  set distance(v) {
    if (v === this._distance) return;
    this._distance = v;
    this.position.setLength(v * SF);
  }

  get distance() {
    return this.position.length() / SF;
  }

  set zoom(v) {
    if (v === this.camera.zoom) return;
    this.camera.zoom = v;
    this.camera.updateProjectionMatrix();
  }

  get zoom() {
    return this.camera.zoom;
  }

  // On change caused by user interaction.
  onChange(callback) {
    this.changeCallback = callback;
    this.controls.addEventListener('change', callback);
  }

  setProps(props) {
    this.tilt = props.tilt;
    this.tiltLocked = props.tiltLocked;
    this.zoom = props.zoom;
    this.distance = props.distance;
  }

  getProps() {
    let self = this;
    return {
      tilt: self.tilt,
      tiltLocked: self.tiltLocked,
      distance: self.distance,
      zoom: self.zoom
    };
  }

  setSize(newWidth, newHeight) {
    this.camera.aspect = newWidth / newHeight;
    this.camera.updateProjectionMatrix();
  }

  update() {
    this.controls.update();
  }

  zoomIn() {
    this.camera.zoom = Math.min(ZOOM_MAX, this.camera.zoom * ZOOM_SPEED);
    this.camera.updateProjectionMatrix();
    this.changeCallback();
  }

  zoomOut() {
    this.camera.zoom = Math.max(ZOOM_MIN, this.camera.zoom / ZOOM_SPEED);
    this.camera.updateProjectionMatrix();
    this.changeCallback();
  }

  _onMouseWheel(event) {
    if (this.zoomLocked) return;
    event.preventDefault();
    event.stopPropagation();
    let delta = 0;
    if (event.wheelDelta !== undefined) {
      // WebKit / Opera / Explorer 9
      delta = event.wheelDelta;
    } else if (event.detail !== undefined) {
      // Firefox
      delta = -event.detail;
    }
    if (delta > 0) {
      this.zoomIn();
    } else if (delta < 0) {
      this.zoomOut();
    }
  }
}
