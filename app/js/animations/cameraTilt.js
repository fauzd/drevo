let mouseX = 0;
let mouseY = 0;
const maxDeviation = 3;

// Слушатели событий для отслеживания положения мыши
document.addEventListener("mousemove", (event) => {
  mouseX = (event.clientX / window.innerWidth) * 2 - 1;
  mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
});

// Устанавливаем начальные координаты камеры
  let initialCameraX;
  let initialCameraY;

export function setInitialCameraPosition(camera) {
  initialCameraX = camera.position.x;
  initialCameraY = camera.position.y;
}

// Функция для обновления положения камеры
export function updateCameraTilt(camera, controls) {
  // Отключаем ненужные функции
  controls.enableZoom = false;
  controls.enablePan = false;
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;

  // Вычисляем новые координаты камеры на основе положения мыши
  let targetX = initialCameraX + mouseX * 0.25;
  let targetY = initialCameraY + mouseY * 0.25;

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
  camera.position.x += (targetX - camera.position.x) * 0.25;
  camera.position.y += (targetY - camera.position.y) * 0.25;

  // Обновляем OrbitControls
  controls.update();
}
