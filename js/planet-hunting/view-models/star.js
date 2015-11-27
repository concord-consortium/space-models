import {SF, STAR_RADIUS} from '../constants.js';

const DEF_COLOR = 0xFFC107;
const DEF_EMISSIVE = 0xFFC107;

export default class {
  constructor() {
    let geometry = new THREE.SphereGeometry(STAR_RADIUS * SF, 64, 64);
    this._material = new THREE.MeshPhongMaterial({color: DEF_COLOR, emissive: DEF_EMISSIVE});
    this._mesh = new THREE.Mesh(geometry, this._material);
    this._posObject = new THREE.Object3D();
    this._posObject.add(this._mesh);
  }

  get rootObject() {
    return this._posObject;
  }

  get position() {
    return this._posObject.position;
  }

  setProps(props) {
    this.position.x = props.x * SF;
    this.position.z = props.z * SF;
  }

  setHighlighted(v) {
    //this._material.color.setHex(v ? HIGHLIGHT_COLOR : DEF_COLOR);
    //this._material.emissive.setHex(v ? HIGHLIGHT_EMISSIVE : DEF_EMISSIVE);
  }
}
