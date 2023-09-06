import * as THREE from "three";
import * as dat from "dat.gui";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import {
  cameraInitialPosition,
  treeInitialPosition,
  treeInitialRotation,
  treeInitialScale,
  cameraInitialDistance,
} from "./position-config.js";

const canvasBackgroundColor = 0xF2F9EB;




const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);

// Получаем холст и применяем к нему стили
const canvas = renderer.domElement;
canvas.style.position = "fixed";
canvas.style.top = "0";
canvas.style.left = "0";
canvas.style.zIndex = "-1";

document.body.appendChild(canvas);


// Функция для обновления размеров рендерера и камеры
function onWindowResize() {
  // Обновляем размеры камеры
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  // Обновляем размер рендерера
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// Добавляем обработчик события
window.addEventListener('resize', onWindowResize, false);


renderer.gammaFactor = 2.2;
renderer.gammaOutput = true;

// Добавление Ambient Light
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);
scene.background = new THREE.Color(canvasBackgroundColor);

// Добавление Directional Light
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(0, 15, 15);
scene.add(directionalLight);

// Добавление Point Light
const pointLight = new THREE.PointLight(0xffffff, 0.5);
pointLight.position.set(0, 15, 15);
scene.add(pointLight);

// const controls = new OrbitControls(camera, renderer.domElement);
// controls.enableZoom = false; // Отключаем зум

//dat.GUI для создания интерфейса, который позволит в реальном времени изменять параметры объектов, света, камеры и т.д.
  const gui = new dat.GUI();
  // gui.add(pointLight.position, "x").min(-3).max(3).step(0.01);
  // gui.add(pointLight.position, "y").min(-6).max(6).step(0.01);
  // gui.add(pointLight.position, "z").min(-3).max(3).step(0.01);

const loader = new GLTFLoader();
let tree;


camera.position.set(
  cameraInitialPosition.x,
  cameraInitialPosition.y,
  cameraInitialPosition.z
);
camera.rotation.set(0, 0, 0)


let cameraDistance = cameraInitialDistance; // Изначальное расстояние от камеры до центра сцены

// const direction = new THREE.Vector3()
//   .subVectors(camera.position, new THREE.Vector3(0, 0, 0))
//   .normalize();
// camera.position.copy(direction.multiplyScalar(cameraDistance));


// Папка для позиции камеры
const cameraFolder = gui.addFolder("Camera Position");
cameraFolder.add(camera.position, "x").min(-100).max(100).step(1);
cameraFolder.add(camera.position, "y").min(-100).max(100).step(1);
cameraFolder.add(camera.position, "z").min(-100).max(100).step(1);
let cameraDistanceController = cameraFolder
  .add({ cameraDistance }, "cameraDistance", 1, 100, 1)
  .name("Camera Distance")
  .onChange(function (value) {
    // Вычисляем новую позицию камеры на основе текущего направления
    const direction = new THREE.Vector3()
      .subVectors(camera.position, new THREE.Vector3(0, 0, 0))
      .normalize();
    camera.position.copy(direction.multiplyScalar(value));
  });

// Устанавливаем начальное расстояние камеры
const initialDirection = new THREE.Vector3()
  .subVectors(camera.position, new THREE.Vector3(0, 0, 0))
  .normalize();
camera.position.copy(initialDirection.multiplyScalar(cameraInitialDistance));

cameraFolder.open();


// Папка для углов наклона камеры
const cameraRotationFolder = gui.addFolder("Camera Rotation");
cameraRotationFolder
  .add(camera.rotation, "x")
  .min(-Math.PI)
  .max(Math.PI)
  .step(0.01);
cameraRotationFolder
  .add(camera.rotation, "y")
  .min(-Math.PI)
  .max(Math.PI)
  .step(0.01);
cameraRotationFolder
  .add(camera.rotation, "z")
  .min(-Math.PI)
  .max(Math.PI)
  .step(0.01);
cameraRotationFolder.open();

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
    tree.scale.set(treeInitialScale, treeInitialScale, treeInitialScale);
    scene.add(tree);

    console.log("Model loaded");

    // Добавляем папку для модели
    const treeFolder = gui.addFolder("Tree Position");
    treeFolder.add(tree.position, "x").min(-100).max(100).step(0.01);
    treeFolder.add(tree.position, "y").min(-100).max(100).step(0.01);
    treeFolder.add(tree.position, "z").min(-100).max(100).step(0.01);
    treeFolder.open();

    let universalScale = treeInitialScale; // Изначальный масштаб

    const scaleFolder = gui.addFolder("Tree Scale");
    scaleFolder
      .add({ universalScale }, "universalScale", 0.1, 3, 0.01)
      .name("Universal Scale")
      .onChange(function (value) {
        tree.scale.set(value, value, value);
      });
    scaleFolder.open();

    const folder = gui.addFolder("Tree Rotation");
    folder.add(tree.rotation, "x", 0, Math.PI * 2).step(0.01);
    folder.add(tree.rotation, "y", 0, Math.PI * 2).step(0.01);
    folder.add(tree.rotation, "z", 0, Math.PI * 2).step(0.01);
    folder.open();
  },
  undefined,
  (error) => {
    console.error("An error occurred while loading the model", error);
  }
);

function animate() {
  requestAnimationFrame(animate);

  // controls.update();
  renderer.render(scene, camera);
}

//----------Помощь----
// Dспомогательные элементы
const axesHelper = new THREE.AxesHelper(15);
const gridHelper = new THREE.GridHelper(100, 10);
const cameraHelper = new THREE.CameraHelper(camera);
const pointLightHelper = new THREE.PointLightHelper(pointLight, 1);

// Добавляем их на сцену
scene.add(axesHelper);
scene.add(gridHelper);
scene.add(cameraHelper);
scene.add(pointLightHelper);

// Изначально делаем их невидимыми
axesHelper.visible = false;
gridHelper.visible = false;
cameraHelper.visible = false;
pointLightHelper.visible = false;

function HelperVisibility() {
  const isVisible = draggableButton.checked;

  axesHelper.visible = isVisible;
  gridHelper.visible = isVisible;
  cameraHelper.visible = isVisible;
  pointLightHelper.visible = isVisible;

  draggablePanel.style.visibility = isVisible ? "visible" : "hidden";
}

// Кнопка включения - перемещаем ее по странице
const draggableButton = document.querySelector(".form-check-input");
draggableButton.checked = axesHelper.visible;

const draggablePanel = document.querySelector(".dg.main.a");

function makeDraggable(
  elementName,
  element,
  onClickFunction,
  handleSelector = null
) {
  let isButtonDragging = true;

  // Загрузка сохраненных координат
  const savedCoords = JSON.parse(
    localStorage.getItem(`${elementName}SavedCoord`)
  );
  const handleElement = handleSelector
    ? element.querySelector(handleSelector)
    : element;
  const targetElement = element;

  if (savedCoords) {
    targetElement.style.left = savedCoords.left + "px";
    targetElement.style.top = savedCoords.top + "px";
    targetElement.style.position = "fixed";
  }

  handleElement.addEventListener("mousedown", function (e) {
    isButtonDragging = false;
    let offsetX = e.clientX - targetElement.getBoundingClientRect().left;
    let offsetY = e.clientY - targetElement.getBoundingClientRect().top;

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);

    function onMouseMove(e) {
      isButtonDragging = true;
      targetElement.style.left = e.clientX - offsetX + "px";
      targetElement.style.top = e.clientY - offsetY + "px";
      targetElement.style.position = "fixed";
    }

    function onMouseUp() {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);

      // Сохранение текущих координат в localStorage
      localStorage.setItem(
        `${elementName}SavedCoord`,
        JSON.stringify({
          left: parseFloat(targetElement.style.left),
          top: parseFloat(targetElement.style.top),
        })
      );
    }
  });

  // Предотвращаем клик, если было перетаскивание
  handleElement.addEventListener("click", function (e) {
    if (isButtonDragging) {
      console.log("isButtonDragging", isButtonDragging);
      e.preventDefault();
    }
    if (typeof onClickFunction === "function") {
      onClickFunction();
    }
  });
}


makeDraggable ("draggableElement", draggableButton, HelperVisibility);
makeDraggable("draggablePanel", draggablePanel, null, '.title');

//-------------------------

animate();