import * as THREE from "three";
import * as dat from "dat.gui";

import {
  cameraInitialPosition,
  treeInitialPosition,
  treeInitialRotation,
  treeInitialScale,
  cameraInitialDistance,
  cameraInitialRotation,
} from "./position-config.js";

export function setupGUI(scene, model, camera) {
  const gui = new dat.GUI();

  const onScreenGui = document.querySelector(".dg.ac");
  onScreenGui.style.zIndex = "100";

  let cameraDistance = cameraInitialDistance;

  // Папка для позиции камеры
  const cameraFolder = gui.addFolder("Camera Position");
  cameraFolder.add(camera.position, "x").min(-100).max(100).step(1);
  cameraFolder.add(camera.position, "y").min(-100).max(100).step(1);
  cameraFolder.add(camera.position, "z").min(-100).max(100).step(1);
  let cameraDistanceController = cameraFolder
    .add({ cameraDistance }, "cameraDistance", -100, 100, 1)
    .name("Camera Distance")
    .onChange(function (value) {
      // Вычисляем новую позицию камеры на основе текущего направления
      const direction = new THREE.Vector3()
        .subVectors(camera.position, new THREE.Vector3(0, 0, 0))
        .normalize();
      camera.position.copy(direction.multiplyScalar(value));
    });
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

  // Добавляем папку для модели
  const treeFolder = gui.addFolder("Tree Position");
  treeFolder.add(model.position, "x").min(-100).max(100).step(0.01);
  treeFolder.add(model.position, "y").min(-100).max(100).step(0.01);
  treeFolder.add(model.position, "z").min(-100).max(100).step(0.01);
  treeFolder.open();

  let universalScale = treeInitialScale; // Изначальный масштаб

  const scaleFolder = gui.addFolder("Tree Scale");
  scaleFolder
    .add({ universalScale }, "universalScale", 0.1, 6, 0.01)
    .name("Universal Scale")
    .onChange(function (value) {
      model.scale.set(value, value, value);
    });
  scaleFolder.open();

  const folder = gui.addFolder("Tree Rotation");
  folder.add(model.rotation, "x", 0, Math.PI * 2).step(0.01);
  folder.add(model.rotation, "y", 0, Math.PI * 2).step(0.01);
  folder.add(model.rotation, "z", 0, Math.PI * 2).step(0.01);
  folder.open();

  //--------------------Помощь------------------------
  {
    // Dспомогательные элементы
    const axesHelper = new THREE.AxesHelper(15);
    const gridHelper = new THREE.GridHelper(100, 10);
    const cameraHelper = new THREE.CameraHelper(camera);

    // Добавляем их на сцену
    scene.add(axesHelper);
    scene.add(gridHelper);
    scene.add(cameraHelper);

    // Изначально делаем их невидимыми
    axesHelper.visible = false;
    gridHelper.visible = false;
    cameraHelper.visible = false;

    function HelperVisibility() {
      const isVisible = draggableButton.checked;

      axesHelper.visible = isVisible;
      gridHelper.visible = isVisible;
      cameraHelper.visible = isVisible;

      draggablePanel.style.visibility = isVisible ? "visible" : "hidden";
    }

    // Кнопка включения - перемещаем ее по странице
    const draggableButton = document.querySelector(".form-check-input");
  //   draggableButton.checked = axesHelper.visible;

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

    makeDraggable("draggableElement", draggableButton, HelperVisibility);
    makeDraggable("draggablePanel", draggablePanel, null, ".title");
  }
  //-------------------------конец помощи---------------------
}
