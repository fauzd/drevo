export function gui(callback) {
  //---------------controls&info start--------------
  const draggableButton = document.querySelector(".form-check-input");
  const infoSection = document.querySelector(".info");
  // const canvas = document.querySelector("canvas");
  const content = document.querySelector(".main");

  function HelperVisibility() {
    const isVisible = draggableButton.checked;

    infoSection.style.visibility = isVisible ? "visible" : "hidden";
    // canvas.zIndex = isVisible ? "99" : "-1";
    content.style.zIndex = isVisible ? "0" : "1";

    if (callback) {
      callback(isVisible);
    }
    return isVisible;
  }

  HelperVisibility();

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

  //---------------controls&info end--------------
  return HelperVisibility();
}
