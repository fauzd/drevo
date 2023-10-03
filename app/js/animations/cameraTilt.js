let mouseX = 0;
let mouseY = 0;
const maxDeviation = 3;

// Слушатели событий для отслеживания положения мыши
document.addEventListener("mousemove", (event) => {
  mouseX = (event.clientX / window.innerWidth) * 2 - 1;
  mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
});

let initialCameraX, initialCameraY; // Изначальные координаты камеры

// Функция для установки новых начальных координат камеры
export function setInitialCameraPosition(camera) {
  initialCameraX = camera.position.x;
  initialCameraY = camera.position.y;
}

export function resetMousePosition() {
console.log("Before reset:", mouseX, mouseY); 
  mouseX = 0;
  mouseY = 0;
  console.log("After reset:", mouseX, mouseY);
}

// Функция для обновления положения камеры
export function updateCameraTilt(camera, controls, sensitivity = 0.25) {
  // Вычисляем новые координаты камеры на основе положения мыши
  let targetX = initialCameraX + mouseX * sensitivity;
  let targetY = initialCameraY + mouseY * sensitivity / 2;

  // Ограничиваем отклонение
  targetX = Math.min(
    Math.max(targetX, initialCameraX - maxDeviation),
    initialCameraX + maxDeviation
  );
  targetY = Math.min(
    Math.max(targetY, initialCameraY - maxDeviation),
    initialCameraY + maxDeviation
  );

  // Обновляем положение камеры
  camera.position.x += (targetX - camera.position.x) * sensitivity;
  camera.position.y += (targetY - camera.position.y) * sensitivity;

  // Обновляем камеру и контролы
  // camera.lookAt(controls.target);
  // controls.update();
}
