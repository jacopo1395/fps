THREE.Controls = function(document) {
    var moveForward = false;
    var moveBackward = false;
    var moveLeft = false;
    var moveRight = false;
    var canJump = false;
    var prevTime = performance.now();
    var velocity = new THREE.Vector3();
    var speed = 1.0;
    var mass = 100.0;

    pointerlock = new THREE.PointerLockControls(camera);
    scene.add(pointerlock.getObject());

    var onKeyDown = function(event) {

        switch (event.keyCode) {

            case 38: // up
            case 87: // w
                moveForward = true;
                break;

            case 37: // left
            case 65: // a
                moveLeft = true;
                break;

            case 40: // down
            case 83: // s
                moveBackward = true;
                break;

            case 39: // right
            case 68: // d
                moveRight = true;
                break;

            case 32: // space
                if (canJump === true) velocity.y += 350;
                canJump = false;
                break;

            case 16: // shift
                speed = 3.0;
                break;

        }

    };

    var onKeyUp = function(event) {

        switch (event.keyCode) {

            case 38: // up
            case 87: // w
                moveForward = false;
                break;

            case 37: // left
            case 65: // a
                moveLeft = false;
                break;

            case 40: // down
            case 83: // s
                moveBackward = false;
                break;

            case 39: // right
            case 68: // d
                moveRight = false;
                break;

            case 16: // shift
                speed = 1.0;
                break;

        }

    };

    document.addEventListener('keydown', onKeyDown, false);
    document.addEventListener('keyup', onKeyUp, false);

    var raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, -1, 0), 0, 100);

    //Methods

    //update
    this.update = function() {

        if (controlsEnabled) {
            raycaster.ray.origin.copy(pointerlock.getObject().position);
            // raycaster.ray.origin.y -= 10;

            raycaster.ray.direction.copy(pointerlock.getDirection());

            var intersections = raycaster.intersectObjects(objects);
            for (var i = 0; i < intersections.length; i++) {
                intersections[i].object.material.color.set(0xff0000);
            }


            // var isOnObject = intersections.length > 0;
            var isOnObject = intersections.length > 0;

            
            // var isOnObjectX = false;
            // var isOnObjectMX = false;
            // var isOnObjectY = false;
            // var isOnObjectZ = false;
            // for(var i=0; objects.length; i++){
                // var collisionX = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, -1, 0), 0, 5);
                // collisionX.ray.origin.copy(pointerlock.getObject().position);
                // collisionX.ray.direction.copy(pointerlock.getDirection());
                // var intersect = collisionX.intersectObjects(objects);
                // isOnObjectX = intersect.length > 0;
                //
                // var collisionMX = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, -1, 0), 0, 5);
                // collisionMX.ray.origin.copy(pointerlock.getObject().position);
                // collisionMX.ray.direction.copy(pointerlock.getDirection());
                // collisionMX.ray.direction.x = -collisionMX.ray.direction.x;
                // intersect = collisionMX.intersectObjects(objects);
                // isOnObjectMX = intersect.length > 0;

                // var collisionZ = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, -1, 0), 0, 100);

            // }



            var time = performance.now();
            var delta = (time - prevTime) / 1000;

            velocity.x -= velocity.x * 10.0 * delta;
            velocity.z -= velocity.z * 10.0 * delta;

            velocity.y -= 9.8 * mass * delta; // 100.0 = mass

            if (moveForward) velocity.z -= 400.0 * delta * speed;
            if (moveBackward) velocity.z += 400.0 * delta * speed;

            if (moveLeft) velocity.x -= 400.0 * delta * speed;
            if (moveRight) velocity.x += 400.0 * delta * speed;

            if (isOnObject === true) {
                velocity.y = Math.max(0, velocity.y);

                canJump = true;
            }

            pointerlock.getObject().translateX(velocity.x * delta);
            pointerlock.getObject().translateY(velocity.y * delta);
            pointerlock.getObject().translateZ(velocity.z * delta);

            if (pointerlock.getObject().position.y < 10) {

                velocity.y = 0;
                pointerlock.getObject().position.y = 10;

                canJump = true;

            }

            prevTime = time;

        }

    }
}
