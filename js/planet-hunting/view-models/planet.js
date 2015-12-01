import {SF, PLANET_RADIUS} from '../constants.js';

const DEF_COLOR = 0x1286CD;
const DEF_EMISSIVE = 0x002135;

export default class {
  constructor() {
    let geometry = new THREE.SphereGeometry(PLANET_RADIUS * SF, 64, 64);
    this.material = new THREE.MeshPhongMaterial({color: DEF_COLOR, emissive: DEF_EMISSIVE});
    this.mesh = new THREE.Mesh(geometry, this.material);
    this.posObject = new THREE.Object3D();
    this.posObject.add(this.mesh);
  }

  get rootObject() {
    return this.posObject;
  }

  get position() {
    return this.posObject.position;
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
