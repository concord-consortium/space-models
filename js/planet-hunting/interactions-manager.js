import $ from 'jquery';
import {mousePos} from '../common/utils.js';

export default class {
  constructor(domElement, camera) {
    this.domElement = domElement;
    this.camera = camera;  // instance of view-models/camera, not THREE.Camera!

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2(-2, -2); // intentionally out of view, which is limited to [-1, 1] x [-1, 1]
    this._followMousePosition();

    this._interactions = []
  }

  registerInteraction(int) {
    this._interactions.push(int);
  }

  checkInteraction() {
    this.raycaster.setFromCamera(this.mouse, this.camera.camera);

    for (let i = 0; i < this._interactions.length; i++) {
      let int = this._interactions[i];
      if (int._started) {
        int.stepHandler();
        return;
      }
    }

    let anyInteractionActive = false;
    for (let i = 0; i < this._interactions.length; i++) {
      let int = this._interactions[i];
      if (!anyInteractionActive && int.test()) {
        this._setInteractionActive(int, i, true);
        anyInteractionActive = true;
      } else {
        if (int._active) {
          this._setInteractionActive(int, i, false);
        }
      }
    }

    if (anyInteractionActive) {
      this.camera.lockedForInteraction = true;
    } else {
      this.camera.lockedForInteraction = false;
    }
  }

  isUserPointing(mesh) {
    this.raycaster.setFromCamera(this.mouse, this.camera.camera);
    let intersects = this.raycaster.intersectObject(mesh);
    if (intersects.length > 0) {
      return intersects;
    } else {
      return false;
    }
  }

  pointerToXYPlane() {
    let v = new THREE.Vector3(this.mouse.x, this.mouse.y, 0.5);
    v.unproject(this.camera.camera);
    v.sub(this.camera.position);
    v.normalize();
    let distance = -this.camera.position.z / v.z;
    v.multiplyScalar(distance);
    let result = this.camera.position.clone();
    result.add(v);
    return result;
  }

  _setInteractionActive(int, idx, v) {
    int._active = v;
    int.activationChangeHandler(v);
    let $elem = $(this.domElement);
    let namespace = `interaction-${idx}`;
    if (v) {
      $elem.on(`mousedown.${namespace} touchstart.${namespace}`, () => {
        int._started = true;
      });
      $elem.on(`mouseup.${namespace} touchend.${namespace} touchcancel.${namespace}`, () => {
        int._started = false;
      });
    } else {
      $elem.off(`.${namespace}`);
    }
  }

  _followMousePosition() {
    let onMouseMove = (event) => {
      let pos = mousePosNormalized(event, this.domElement);
      this.mouse.x = pos.x;
      this.mouse.y = pos.y;
    };
    $(this.domElement).on('mousemove touchmove', onMouseMove);
  }
}

// Normalized mouse position [-1, 1].
function mousePosNormalized(event, targetElement) {
  let pos = mousePos(event, targetElement);
  let $targetElement = $(targetElement);
  let parentWidth = $targetElement.width();
  let parentHeight = $targetElement.height();
  pos.x =  (pos.x / parentWidth) * 2 - 1;
  pos.y = -(pos.y / parentHeight) * 2 + 1;
  return pos;
}