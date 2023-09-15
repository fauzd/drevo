import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import {
  cameraInitialPosition,
  treeInitialPosition,
  treeInitialRotation,
  controlInitialTarget,
  cameraInitialFOV,
} from "./position-config.js";

import "./2dAnimations.js";
import { animateModel } from "./3dAnimations.js";

document.addEventListener("DOMContentLoaded", function () {

  const scene = new THREE.Scene();

  // -----------------------делаем кастомные оси ------------
  // Создаем материалы для линий (осей)
  const redMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
  const greenMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 });
  const blueMaterial = new THREE.LineBasicMaterial({ color: 0x0000ff });

  // Создаем геометрию для линий
  const geometry = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0, 0, 0), // начальная точка
    new THREE.Vector3(1, 0, 0), // конечная точка
  ]);

  // Длина и толщина линий
  const length = 10;
  const thickness = 0.1;

  // Создаем линии (оси)
  const xAxis = new THREE.Line(geometry, redMaterial);
  const yAxis = new THREE.Line(geometry, greenMaterial);
  const zAxis = new THREE.Line(geometry, blueMaterial);

  // Масштабируем и трансформируем линии
  xAxis.scale.set(length, thickness, thickness);
  yAxis.scale.set(length, thickness, thickness);
  zAxis.scale.set(length, thickness, thickness);

  yAxis.rotation.z = Math.PI / 2;
  zAxis.rotation.y = Math.PI / 2;

  // Добавляем линии (оси) на сцену------------------------
  // scene.add(xAxis);
  // scene.add(yAxis);
  // scene.add(zAxis);

  // Горизонтальная сетка---------------------------------------
  const horizontalGrid = new THREE.GridHelper(100, 100);
  // scene.add(horizontalGrid);

  // Вертикальная сетка------------------------------------------
  const verticalGrid = new THREE.GridHelper(100, 100);
  verticalGrid.rotation.x = Math.PI / 2; // Поворот на 90 градусов относительно оси X
  // scene.add(verticalGrid);

  // Создаем геометрию сферы с радиусом 0.125 (диаметр будет 0.25)
  const sphereGeometry = new THREE.SphereGeometry(0.125, 32, 32);
  const appleGeometry = new THREE.SphereGeometry(0.25, 32, 32);

  // Создаем красный материал для сферы
  const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  const appleMaterial = new THREE.MeshBasicMaterial({ color: 0xc5ff3d });

  // Создаем сферу
  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  const apple = new THREE.Mesh(appleGeometry, appleMaterial);

  // Устанавливаем позицию сферы в начало координат
  sphere.position.set(0, 0, 0);
  apple.position.set(3, 12, 0);

  // Добавляем сферу на сцену
  // scene.add(sphere);
  scene.add(apple);

  //--------------------------------------------------------

  const canvasBackgroundColor = 0xf2f9eb;
  scene.background = new THREE.Color(canvasBackgroundColor);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Получаем холст и применяем к нему стили
  const canvas = renderer.domElement;
  canvas.style.position = "fixed";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.zIndex = "-1";

  document.body.appendChild(canvas);

  //--------------------Камера-------------------
  const camera = new THREE.PerspectiveCamera(
    cameraInitialFOV,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  camera.position.set(
    cameraInitialPosition.x,
    cameraInitialPosition.y,
    cameraInitialPosition.z
  );

  // Функция для обновления размеров рендерера и камеры
  function onWindowResize() {
    // Обновляем размеры камеры
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    // Обновляем размер рендерера
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  // Добавляем обработчик события
  window.addEventListener("resize", onWindowResize, false);

  const controls = new OrbitControls(camera, renderer.domElement);
  // controls.enableZoom = false; // Отключаем зум
  controls.target.set(
    controlInitialTarget.x,
    controlInitialTarget.y,
    controlInitialTarget.z
  );

  //--------------Загруджаем модель------------

  const loader = new GLTFLoader();
  let tree;

  loader.load(
    "models/scene.gltf",
    (gltf) => {
      tree = gltf.scene;
      tree.position.set(
        treeInitialPosition.x,
        treeInitialPosition.y,
        treeInitialPosition.z
      );
      tree.rotation.set(
        treeInitialRotation.x,
        treeInitialRotation.y,
        treeInitialRotation.z
      );
      scene.add(tree);

      console.log("Model loaded");

      animateModel({
        model: tree,
        camera: camera,
        cameraPositionTo: { x: -18.64, y: -6.78, z: -30.73 },
        cameraFovTo: 12,
        controls: controls,
        targetTo: { x: -1.59, y: -2.16, z: -1.25 },
        scaleTo: 1,
        trigger: ".approach",
      });

      animateModel({
        model: tree,
        camera: camera,
        cameraPositionTo: { x: -34.69, y: 3.31, z: 7.56 },
        cameraFovTo: 12,
        controls: controls,
        targetTo: { x: 0.85, y: 1.23, z: 1.94 },
        scaleTo: 1,
        trigger: ".services",
      });

      animateModel({
        model: tree,
        camera: camera,
        cameraPositionTo: { x: -5.39, y: 17.38, z: 32.33 },
        cameraFovTo: 12,
        controls: controls,
        targetTo: { x: 0.58, y: 9.9, z: 3.91 },
        scaleTo: 1,
        trigger: ".projects",
      });
    },
    undefined,
    (error) => {
      console.error("An error occurred while loading the model", error);
    }
  );

  //---------------------adjusting----------------
  // Обновление значений на экране
  function updateUI() {
    document.getElementById("cameraPositionX").value =
      camera.position.x.toFixed(2);
    document.getElementById("cameraPositionY").value =
      camera.position.y.toFixed(2);
    document.getElementById("cameraPositionZ").value =
      camera.position.z.toFixed(2);

    document.getElementById("cameraRotationX").value =
      camera.rotation.x.toFixed(2);
    document.getElementById("cameraRotationY").value =
      camera.rotation.y.toFixed(2);
    document.getElementById("cameraRotationZ").value =
      camera.rotation.z.toFixed(2);

    document.getElementById("cameraTargetX").value =
      controls.target.x.toFixed(2);
    document.getElementById("cameraTargetY").value =
      controls.target.y.toFixed(2);
    document.getElementById("cameraTargetZ").value =
      controls.target.z.toFixed(2);

    document.getElementById("cameraFOV").value = camera.fov.toFixed(2);
  }

  // Обновление значений из полей ввода
  function updateFromUI() {
    camera.position.set(
      parseFloat(document.getElementById("cameraPositionX").value),
      parseFloat(document.getElementById("cameraPositionY").value),
      parseFloat(document.getElementById("cameraPositionZ").value)
    );

    camera.rotation.set(
      parseFloat(document.getElementById("cameraRotationX").value),
      parseFloat(document.getElementById("cameraRotationY").value),
      parseFloat(document.getElementById("cameraRotationZ").value)
    );

    controls.target.set(
      parseFloat(document.getElementById("cameraTargetX").value),
      parseFloat(document.getElementById("cameraTargetY").value),
      parseFloat(document.getElementById("cameraTargetZ").value)
    );

    camera.fov = parseFloat(document.getElementById("cameraFOV").value);
    camera.updateProjectionMatrix();
  }

  // Добавляем обработчики событий для полей ввода
  document
    .getElementById("cameraPositionX")
    .addEventListener("input", updateFromUI);
  document
    .getElementById("cameraPositionY")
    .addEventListener("input", updateFromUI);
  document
    .getElementById("cameraPositionZ")
    .addEventListener("input", updateFromUI);

  document
    .getElementById("cameraRotationX")
    .addEventListener("input", updateFromUI);
  document
    .getElementById("cameraRotationY")
    .addEventListener("input", updateFromUI);
  document
    .getElementById("cameraRotationZ")
    .addEventListener("input", updateFromUI);

  document
    .getElementById("cameraTargetX")
    .addEventListener("input", updateFromUI);
  document
    .getElementById("cameraTargetY")
    .addEventListener("input", updateFromUI);
  document
    .getElementById("cameraTargetZ")
    .addEventListener("input", updateFromUI);

  document.getElementById("cameraFOV").addEventListener("input", updateFromUI);

  //----------------------------------------------

  const animate = () => {
    requestAnimationFrame(animate);
    updateUI();

    // Обновление OrbitControls
    controls.update();

    renderer.render(scene, camera);
  };

  // Запуск анимации
  animate();
});

