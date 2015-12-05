import {SF, PLANET_RADIUS} from '../constants.js';

const VELOCITY_LEN_SCALE = SF * 0.05;
const DEF_COLOR = 0x00ff00;
const DEF_EMISSIVE = 0x007700;

export default class {
  constructor() {
    let radius = PLANET_RADIUS * SF / 4;
    let height = PLANET_RADIUS * SF * 4;
    let headRadius = radius * 3;
    let headHeight = height / 3;

    // Set height to 1, as it will be scaled later (#setProps).
    this.arrowGeometry = new THREE.CylinderGeometry(radius, radius, 1, 8);
    this.material = new THREE.MeshPhongMaterial({color: DEF_COLOR, emissive: DEF_EMISSIVE});
    this.arrowMesh = new THREE.Mesh(this.arrowGeometry, this.material);

    this.headGeometry = new THREE.CylinderGeometry(headRadius, 0, headHeight, 16);
    this.headMesh = new THREE.Mesh(this.headGeometry, this.material);

    this.pivot = new THREE.Object3D();
    this.pivot.add(this.headMesh);
    this.pivot.add(this.arrowMesh);
  }

  get rootObject() {
    return this.pivot;
  }

  get position() {
    return this.pivot.position;
  }

  setProps(planet) {
    this.pivot.rotation.z = Math.atan2(planet.vx, -planet.vy);
    let len = Math.sqrt(planet.vx * planet.vx + planet.vy * planet.vy) * VELOCITY_LEN_SCALE;
    this.arrowMesh.scale.y = len;
    this.arrowMesh.position.y = -len * 0.5;
    this.headMesh.position.y = -len;
  }

  setHighlighted(v) {
    this.material.color.setHex(v ? HIGHLIGHT_COLOR : DEF_COLOR);
    this.material.emissive.setHex(v ? HIGHLIGHT_EMISSIVE : DEF_EMISSIVE);
  }
}
