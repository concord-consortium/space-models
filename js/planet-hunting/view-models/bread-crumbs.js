import {SF, PLANET_RADIUS} from '../constants.js';

const COUNT = 250;

export default class {
  constructor() {
    this.geometry = new THREE.BufferGeometry();
    this.geometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(COUNT * 3), 3));
    this.geometry.addAttribute('alpha', new THREE.BufferAttribute(new Float32Array(COUNT), 1));
    this.material = new THREE.ShaderMaterial( {
      uniforms:       {
                        color: {type: 'c', value: new THREE.Color(0xdddddd)}
                      },
      vertexShader:   vertexShader(10 * SF),
      fragmentShader: fragmentShader(),
      transparent:    true
    });
    this.points = new THREE.Points(this.geometry, this.material);

    this.count = 0;
    this.idx = 0;
  }

  get rootObject() {
    return this.points;
  }

  get position() {
    return this.points.position;
  }

  addBreadCrumb(x, y) {
    let vertices = this.points.geometry.attributes.position;
    vertices.array[this.idx * 3] = x * SF;
    vertices.array[this.idx * 3 + 1] = y * SF;
    vertices.needsUpdate = true;

    let alphas = this.points.geometry.attributes.alpha;
    for (let i = 0; i < this.count; i++) {
      let idx = this.idx - i > 0 ? this.idx - i : this.idx - i + COUNT;
      alphas.array[idx] = 1 - i / COUNT;
    }
    alphas.needsUpdate = true;

    this.count = Math.min(COUNT, this.count + 1);
    this.idx = (this.idx + 1) % COUNT;
  }
}

function vertexShader(pointSize) {
  return `
    attribute float alpha;
    varying float vAlpha;
    void main() {
      vAlpha = alpha;
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      gl_PointSize = ${pointSize.toFixed(2)} / length(mvPosition.xyz);
      gl_Position = projectionMatrix * mvPosition;
    }`;
}

function fragmentShader() {
  return `
    uniform vec3 color;
    varying float vAlpha;
    void main() {
      gl_FragColor = vec4(color, vAlpha);
    }`;
}