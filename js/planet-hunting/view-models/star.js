import {SF, STAR_RADIUS} from '../constants.js';

const DEF_COLOR = 0xFFC107;
const DEF_EMISSIVE = 0xFFC107;

export default class {
  constructor() {
    let geometry = new THREE.SphereGeometry(STAR_RADIUS * SF, 64, 64);
    this.material = new THREE.MeshPhongMaterial({color: DEF_COLOR, emissive: DEF_EMISSIVE});
    this.mesh = new THREE.Mesh(geometry, this.material);
    this.posObject = new THREE.Object3D();
    this.posObject.add(this.mesh);

    // Add point light too.
    this.posObject.add(new THREE.PointLight(0xffffff, 1, 0))
  }

  get rootObject() {
    return this.posObject;
  }

  get position() {
    return this.posObject.position;
  }

  set scale(v) {
    this.rootObject.scale.set(v, v, v);
  }

  setProps(props) {
    this.position.x = props.x * SF;
    this.position.y = props.y * SF;
  }

  setHighlighted(v) {
    //this.material.color.setHex(v ? HIGHLIGHT_COLOR : DEF_COLOR);
    //this.material.emissive.setHex(v ? HIGHLIGHT_EMISSIVE : DEF_EMISSIVE);
  }
}
