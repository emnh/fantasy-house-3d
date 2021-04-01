const THREE = require("three");
const $ = require("jquery");

const main = function() {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 5;

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const container = new THREE.Object3D();
  scene.add(container);
  const geometry = new THREE.BoxGeometry();

  const k = 10;
  for (let x = -k; x <= k; x++) {
    for (let y = -k; y <= k; y++) {
      for (let z = -k; z <= k; z++) {
        const color = Math.random() * 0xffffff;
        const material = new THREE.MeshStandardMaterial({ color });
        const cube = new THREE.Mesh(geometry, material);
        const sc = 0.05;
        const sc2 = 0.1;
        cube.scale.set(sc, sc, sc);
        cube.position.set(x * sc2, y * sc2, z * sc2);
        container.add(cube);
      }
    }
  }

  const light = new THREE.DirectionalLight({ color: 0xffffff });
  light.position.set(10.0, 10.0, 10.0);
  light.lookAt(new THREE.Vector3(0.0, 0.0, 0.0));
  scene.add(light);

  const light2 = new THREE.PointLight({ color: 0xffffff });
  light2.position.set(0, 0, 5);
  //light2.lookAt(new THREE.Vector3(0.0, 0.0, 0.0));
  scene.add(light2);

  const animate = function() {
    requestAnimationFrame(animate);
    container.rotation.x += 0.1;
    container.rotation.y += 0.1;
    renderer.render(scene, camera);
  };

  animate();
};

$(main);
