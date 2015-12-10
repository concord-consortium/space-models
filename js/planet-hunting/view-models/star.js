import {SF, STAR_RADIUS} from '../constants.js';

export default class {
  constructor() {
    this.geometry = new THREE.SphereGeometry(STAR_RADIUS * SF, 64, 64);
    this.material = new THREE.MeshPhongMaterial();
    this.mesh = new THREE.Mesh(this.geometry, this.material);
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

  get scale() {
    // We always keep scale.x equal to scale.y and scale.y, take a look at setter.
    return this.rootObject.scale.x;
  }

  set scale(v) {
    this.rootObject.scale.set(v, v, v);
  }

  setProps(props) {
    this.position.x = props.x * SF;
    this.position.y = props.y * SF;
    this.material.color.setHex(props.color);
    this.material.emissive.setHex(props.color);
    this.scale = props.scale;
  }
}
