const THREE = require("three");
const $ = require("jquery");

const makeRoof = function(cube) {
  const triangleShape = new THREE.Shape();
  triangleShape.moveTo(-0.5, 0.5);
  triangleShape.lineTo(0, 1.0);
  triangleShape.lineTo(0.5, 0.5);

  const extrudeSettings = {
    amount: 1,
    bevelEnabled: true,
    bevelSegments: 1,
    steps: 0,
    bevelSize: 0,
    bevelThickness: 0
  };

  const geometry = new THREE.ExtrudeGeometry(triangleShape, extrudeSettings);

  const color = Math.random() * 0xffffff;
  const material = new THREE.MeshStandardMaterial({ color });
  const roof = new THREE.Mesh(geometry, material);
  roof.position.z = -0.5;

  const sc = 1.0;
  roof.scale.set(sc, sc, sc);

  return roof;
};

const makeHouse = function() {
  const geometry = new THREE.BoxGeometry();
  const container = new THREE.Object3D();
  const color = Math.random() * 0xffffff;
  const material = new THREE.MeshStandardMaterial({ color });
  const cube = new THREE.Mesh(geometry, material);
  container.add(cube);
  //cube.visible = false;
  container.add(makeRoof(cube));
  return container;
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
  container.add(makeHouse());
  container.rotation.y = -0.5;

  // const k = 10;
  // for (let x = -k; x <= k; x++) {
  //   for (let y = -k; y <= k; y++) {
  //     for (let z = -k; z <= k; z++) {
  //       const color = Math.random() * 0xffffff;
  //       const material = new THREE.MeshStandardMaterial({ color });
  //       const cube = new THREE.Mesh(geometry, material);
  //       const sc = 0.05;
  //       const sc2 = 0.1;
  //       cube.scale.set(sc, sc, sc);
  //       cube.position.set(x * sc2, y * sc2, z * sc2);
  //       container.add(cube);
  //     }
  //   }
  // }

  const light = new THREE.PointLight(0xffffff, 1, 100);
  //light.position.set(10.0, 10.0, 10.0);
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
    container.rotation.y += 0.1 * elapsed;
    renderer.render(scene, camera);
  };

  animate();
};

$(main);
