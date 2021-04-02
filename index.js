const THREE = require("three");
const $ = require("jquery");
const OIMO = require("oimo");

const makeTiles = function(add, wood) {
  const container = new THREE.Object3D();
  const tiles = [];
  const k = 10;
  const geometry = new THREE.BoxGeometry();
  for (let x = 0; x <= k; x++) {
    for (let y = 0; y <= k; y++) {
      const tile = new THREE.Mesh(geometry, wood);
      const sc = 1.0 / k;
      tile.scale.set(2.0 * sc, 0.25 * sc, sc);
      const xp = x / k - 0.5;
      const yp = -Math.abs(xp) + 1.0;
      const zp = y / k;
      tile.position.set(xp, yp, zp);
      const sign = -Math.sign(xp);
      const r = xp == 0 ? 0.0 : 0.5;
      const f = () => (Math.random() - 0.5) * r;
      tile.rotation.set(f(), f(), sign * Math.PI * (0.25 - 0.1) + f());
      if (xp == 0) {
        tile.position.y -= 0.5 * sc;
        tile.scale.set(sc, sc, sc);
      }
      tiles.push(tile);
      container.add(tile);
      add(tile, xp === 0);
    }
  }
  return container;
};

const makeRoof = function(add, wood) {
  const triangleShape = new THREE.Shape();
  triangleShape.moveTo(-0.5, 0.5);
  triangleShape.lineTo(0, 1.0);
  triangleShape.lineTo(0.5, 0.5);

  const extrudeSettings = {
    depth: 1,
    bevelEnabled: true,
    bevelSegments: 1,
    steps: 0,
    bevelSize: 0,
    bevelThickness: 0
  };

  const geometry = new THREE.ExtrudeGeometry(triangleShape, extrudeSettings);
  const container = new THREE.Object3D();
  const roof = new THREE.Mesh(geometry, wood);
  //roof.position.z = -0.5;
  const sc = 1.0;
  container.add(roof);
  roof.scale.set(sc, sc, sc);
  //roof.position.y += 1.0;
  container.add(makeTiles(add, wood));

  const roofGeo = new THREE.BoxGeometry();
  const roofSim = new THREE.Mesh(roofGeo, wood);
  container.add(roofSim);
  const rsc = 1 / Math.sqrt(2);
  roofSim.scale.set(rsc, rsc, sc * 1.1);
  roofSim.position.y = 0.5;
  roofSim.position.z = 0.5;
  roofSim.rotation.z = Math.PI * 0.25;
  roofSim.visible = false;
  add(roofSim, true);

  return container;
};

const makeHouse = function(add, brick, wood) {
  const geometry = new THREE.BoxGeometry();
  const container = new THREE.Object3D();
  const k = 4;
  const sc = 0.5 / k;
  const f = x => (x + 0.1 * (Math.random() - 0.5)) * sc;
  for (let x = -k; x <= k; x++) {
    for (let y = -k; y <= k; y++) {
      for (let z = -k; z <= k; z++) {
        const cube = new THREE.Mesh(geometry, brick);
        cube.scale.set(sc, sc, sc);
        cube.position.set(f(x), f(y) - sc, f(z) + 0.5);
        container.add(cube);
      }
    }
  }
  const cube = new THREE.Mesh(geometry, brick);
  //container.add(cube);
  add(cube, true);
  container.add(makeRoof(add, wood));
  //container.position.z = 0.5;
  return container;
};

const makeWoodMaterial = function() {
  const img =
    "data:image/png;base64,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";
  const map = THREE.ImageUtils.loadTexture(img);
  // map.wrapS = THREE.RepeatWrapping;
  // map.wrapT = THREE.RepeatWrapping;
  map.repeat.x = 0.5;
  map.repeat.y = 0.5;
  return new THREE.MeshStandardMaterial({ color: 0xffffff, map });
};

const makeBrickMaterial = function() {
  const img =
    "data:image/jpeg;base64,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";
  const map = THREE.ImageUtils.loadTexture(img);
  map.repeat.x = 0.25;
  map.repeat.y = 0.25;
  return new THREE.MeshStandardMaterial({ color: 0xffffff, map });
};

const setupOimo = function() {
  const world = new OIMO.World({
    timestep: 1 / 60,
    iterations: 8,
    broadphase: 2,
    worldscale: 1,
    random: true,
    info: false,
    gravity: [0, -9.8, 0]
  });

  const updates = [];

  const add = function(obj, static) {
    const wsv = new THREE.Vector3();
    const ws = obj.getWorldScale(wsv);
    const size = [ws.x, ws.y, ws.z];
    const wpv = new THREE.Vector3();
    const wp = obj.getWorldPosition(wpv);
    const pos = [wp.x, wp.y, wp.z];
    const deg = x => (180.0 * x) / Math.PI;
    //const deg = x => (Math.PI * x) / 180.0;
    //const deg = x => x;
    const wrv = new THREE.Vector3();
    //const wr = obj.getWorldDirection(wrv);
    const wr = obj.rotation;
    const rot = [deg(wr.x), deg(wr.y), deg(wr.z)];
    if (static === undefined) {
      static = false;
    }
    const body = world.add({
      type: "box", // type of shape : sphere, box, cylinder
      size: size, // size of shape
      pos: pos, // start position in degree
      rot: rot, // start rotation in degree
      move: !static, // dynamic or statique
      density: 1,
      friction: 5.0,
      restitution: 0.2,
      belongsTo: 1, // The bits of the collision groups to which the shape belongs.
      collidesWith: 0xffffffff // The bits of the collision groups with which the shape collides.
    });

    const sync = function() {
      // const bp = body.getPosition();
      // const pos = new THREE.Vector3(bp);
      // obj.position.copy(obj.worldToLocal(pos));
      obj.position.copy(body.getPosition());
      obj.quaternion.copy(body.getQuaternion());
    };
    updates.push(sync);

    return body;
  };

  return { world, updates, add };
};

const main = function() {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 3, 3);
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const container = new THREE.Object3D();
  scene.add(container);
  const { world, updates, add } = setupOimo();
  container.add(makeHouse(add, makeBrickMaterial(), makeWoodMaterial()));

  container.rotation.y = -0.5;

  const light = new THREE.PointLight(0xffffff, 2, 100, 2);
  light.position.set(camera.position.x, camera.position.y, camera.position.z);
  scene.add(light);
  //light.position = camera.position;
  //light.target = container;
  //light.lookAt(container.position);

  // const light2 = new THREE.PointLight({ color: 0xffffff });
  // light2.position = camera.position;
  // scene.add(light2);

  let startTime = performance.now();
  const animate = function() {
    const newTime = performance.now();
    const elapsed = (newTime - startTime) * 0.001;
    startTime = performance.now();
    requestAnimationFrame(animate);
    container.rotation.y += 1 * elapsed;
    renderer.render(scene, camera);
    world.step();
    for (let upd of updates) {
      upd();
    }
  };

  animate();
};

$(main);
