import {SF} from '../constants.js';

const ROTATION_AXIS = new THREE.Vector3(1, 0, 0);
const ZERO_TILT_VEC = new THREE.Vector3(0, -1, 0);

export default class {
  constructor(canvas) {
    this.camera = new THREE.PerspectiveCamera(60, 1, 0.1 * SF, 1000 * SF);
    this.position.z = 2.5 * SF;

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

  get position() {
    return this.camera.position;
  }

  set locked(v) {
    this.controls.enableRotate = !v;
  }

  // On change caused by user interaction.
  onChange(callback) {
    this.controls.addEventListener('change', callback);
  }

  setProps(props) {
    if (this.oldProps.tilt !== props.tilt) {
      let angleDiff = this.position.angleTo(ZERO_TILT_VEC);
      let tiltInRad = props.tilt * Math.PI / 180;
      this.position.applyAxisAngle(ROTATION_AXIS, angleDiff - tiltInRad);
      this.controls.update();
      this.oldProps.tilt = props.tilt;
    }
    if (this.oldProps.distance !== props.distance) {
      this.position.setLength(props.distance * SF);
      this.oldProps.distance = props.distance;
    }
  }

  getProps() {
    let props = {};
    props.tilt = this.position.angleTo(ZERO_TILT_VEC) * 180 / Math.PI;
    props.distance = this.position.length() / SF;
    return props;
  }

  // Tilt is defined in degrees and it has a bit different range than control's polar angle
  // (from 0 to 90, while the polar angle is between PI/2 and PI).
  setTilt(tiltInDeg) {
    let newPolarAngle = (180 - tiltInDeg) * Math.PI / 180;
    let polarAngleDiff = newPolarAngle - this.controls.getPolarAngle();
    this.controls.constraint.rotateUp(polarAngleDiff);
  }

  setSize(newWidth, newHeight) {
    this.camera.aspect = newWidth / newHeight;
    this.camera.updateProjectionMatrix();
  }

  update() {
    this.controls.update();
  }
}
