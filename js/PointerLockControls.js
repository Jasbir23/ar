THREE.PointerLockControls = function(camera) {
  var scope = this;

  camera.rotation.set(0, 0, 0);

  var pitchObject = new THREE.Object3D();
  pitchObject.add(camera);

  var yawObject = new THREE.Object3D();
  yawObject.position.y = 10;
  yawObject.add(pitchObject);

  var PI_2 = Math.PI / 2;

  var onMouseMove = function(event) {
    if (scope.enabled === false) return;

    var movementX =
      event.movementX || event.mozMovementX || event.webkitMovementX || 0;
    var movementY =
      event.movementY || event.mozMovementY || event.webkitMovementY || 0;

    // console.log(movementX, movementY, "kjhjkhjk");

    yawObject.rotation.y -= movementX * 0.002;
    pitchObject.rotation.x -= movementY * 0.002;

    pitchObject.rotation.x = Math.max(
      -PI_2,
      Math.min(PI_2, pitchObject.rotation.x)
    );
  };

  this.dispose = function() {
    document.removeEventListener("mousemove", onMouseMove, false);
    document.removeEventListener("keydown", onDocumentKeyDown, false);
  };

  // document.addEventListener("mousemove", onMouseMove, false);
  document.addEventListener("keydown", onDocumentKeyDown, false);

  function onDocumentKeyDown(event) {
    var keyCode = event.which;
    // console.log(keyCode);
    let movementX = 0;
    let movementY = 0;
    if (keyCode == 39) {
      movementX = 30;
    } else if (keyCode == 37) {
      movementX = -30;
    } else if (keyCode == 40) {
      movementY = 30;
    } else if (keyCode == 38) {
      movementY = -30;
    } else {
      movementX = 0;
      movementY = 0;
    }

    yawObject.rotation.y -= movementX * 0.002;
    pitchObject.rotation.x -= movementY * 0.002;

    pitchObject.rotation.x = Math.max(
      -PI_2,
      Math.min(PI_2, pitchObject.rotation.x)
    );
  }

  this.enabled = false;

  this.getObject = function() {
    return yawObject;
  };

  this.getDirection = (function() {
    // assumes the camera itself is not rotated

    var direction = new THREE.Vector3(0, 0, -1);
    var rotation = new THREE.Euler(0, 0, 0, "YXZ");

    return function(v) {
      rotation.set(pitchObject.rotation.x, yawObject.rotation.y, 0);

      v.copy(direction).applyEuler(rotation);

      return v;
    };
  })();
};
