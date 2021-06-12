'use strict'

import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/build/three.module.js';

import {
  OrbitControls
} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/controls/OrbitControls.js';

function main() {
  // create WebGLRenderer
  const canvas = document.querySelector('#canvas');
  const renderer = new THREE.WebGLRenderer({
    canvas,
  });

  // create camera
  const fov = 75;
  const aspect = 2;
  const near = 0.1;
  const far = 100;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 3;

  // create OrbitControls
  const controls = new OrbitControls(camera, canvas);
  controls.target.set(0, 0, 0); // OrbitControls가 camera를 움직일 때마다 카메라의 시선이 (0, 0, 0) 지점을 향하도록 설정함.
  controls.update(); // OrbitControls 값에 변화를 주면 업데이트를 호출해줘야 함.

  // create scene
  const scene = new THREE.Scene();

  // create directional light
  {
    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    scene.add(light);
  }

  // create BoxGeometry
  const boxWidth = 1;
  const boxHeight = 1;
  const boxDepth = 1;
  const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

  // BoxGeometry를 전달받아서 퐁-머티리얼과 함께 큐브 메쉬를 만들어주는 함수
  function makeInstance(geometry, color, x) {
    const material = new THREE.MeshPhongMaterial({
      color
    });

    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube)

    cube.position.x = x;

    return cube;
  }

  // 각각 색상, x좌표값이 다른 큐브들을 3개 만들어서 cubes 배열 안에 저장해놓음. 나중에 animate 메서드에서 사용할 것.
  const cubes = [
    makeInstance(geometry, 0x44aa88, 0),
    makeInstance(geometry, 0x8844aa, -2),
    makeInstance(geometry, 0xaa8844, 2),
  ];

  /**
   * skybox를 만드는 두번째 방법 - 큐브맵(cubemap) 사용하기.
   * 
   * 큐브맵은 정육면체 한 면 당 하나, 총 6개의 면을 가진 텍스처를 의미함. cubeTexture 라고도 함.
   * 이 cubeTexture는 CubeTextureLoader() 객체를 호출함으로써 리턴받을 수 있는데, 
   * new THREE.CubeTextureLoader().load(urls) 이렇게 호출함.
   * 
   * 여기서 urls에는 6개의 이미지 텍스처 url string이 담긴 배열을 전달해줘야 함.
   * 이 때, 전달 순서는  pos-x, neg-x, pos-y, neg-y, pos-z, neg-z 순으로 전달해줘야 함.
   */
  const loader = new THREE.CubeTextureLoader();
  const texture = loader.load([
    './image/pos-x.jpg',
    './image/neg-x.jpg',
    './image/pos-y.jpg',
    './image/neg-y.jpg',
    './image/pos-z.jpg',
    './image/neg-z.jpg',
  ]);
  scene.background = texture; // 이렇게 씬의 background에 로드한 cubeTexture를 할당해주면 이외에 별도로 텍스처의 offset, repeat등은 조정해 줄 필요는 없음.

  // resize renderer
  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }

    return needResize;
  }

  // animate
  function animate(t) {
    t *= 0.001;

    // 렌더러가 리사이징되면 카메라의 비율(aspect)도 리사이징된 사이즈에 맞게 업데이트 되어야 함.
    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    // cubes안에 담긴 각각의 cube mesh들의 rotation값에 매 프레임마다 변화를 줘서 회전시킴
    cubes.forEach((cube, index) => {
      const speed = 1 + index * 0.1;
      const rotate = t * speed;
      cube.rotation.x = rotate;
      cube.rotation.y = rotate;
    });

    renderer.render(scene, camera);

    requestAnimationFrame(animate); // 내부에서 반복 호출 해줌
  }

  requestAnimationFrame(animate);
}

main();