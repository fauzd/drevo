import fullpage from "fullpage.js";
import "fullpage.js/dist/fullpage.css";

import {
  play2DAnimation,
  reverse2DAnimation,
} from "./animations/2d-animations";
import {
  play3DAnimation,
} from "./animations/3d-animations";

import {setupThreeDScene} from "./3d-scene"
import { gui } from "./gui-light";



document.addEventListener("DOMContentLoaded", function () {
  let isVisible;
  let myFullpage; // переменная для хранения экземпляра fullpage

  function updateVisibility(newVisibility) {
    // Это про отключение скролла и эффектов при включенном помощнике
    isVisible = newVisibility;
  }

  function casesVisibility () {
    //снимаем флаги видимости с любых открытых кейсов
    const caseElement = document.querySelector(".projects__case-1");
    if (caseElement.classList.contains("visible")) {
      caseElement.classList.remove("visible");
    }

    //Запрещаем прокрутку, когда курсор в пределах кейса
    const caseElements = document.querySelectorAll(".projects__case");

    caseElements.forEach((caseElement) => {
      caseElement.addEventListener("mouseenter", function () {
        fullpage_api.setAllowScrolling(false);
      });

      caseElement.addEventListener("mouseleave", function () {
        fullpage_api.setAllowScrolling(true);
      });
    });
  }

  gui(updateVisibility);

  setupThreeDScene()
    .then(({ scene, camera, controls, tree }) => {
      myFullpage = new fullpage("#fullpage", {
        anchors: [
          "fall",
          "message",
          "contacts",
          "team",
          "clients",
          "projects",
          "services",
          "approach",
          "hero",
        ],
        licenseKey: "5PL9J-GX1Q9-6HIGJ-5WCP9-MZOAM",
        credits: {
          enabled: false,
          label: "Made with fullPage.js",
          position: "right",
        },
        autoScrolling: true,
        scrollingSpeed: 1000,
        afterLoad: function (origin, destination, direction) {
          play2DAnimation(origin, destination, direction);
          // origin.item.classList.add("has-animation");
        },
        beforeLeave: function (origin, destination, direction) {
          if (!isVisible) {
            const shouldMove = reverse2DAnimation(
              origin,
              destination,
              direction
            );
            if (!shouldMove) {
              return false;
            }
          } else {
            return false;
          }

          play3DAnimation(destination.anchor, tree, camera, controls);
        },
        onLeave: function (origin, destination, direction) {
          casesVisibility();
        },
      });
      // Перемещение к нужной секции без анимации
      // Только при первой загрузке в сессии
      if (!sessionStorage.getItem("firstLoad")) {
        sessionStorage.setItem("firstLoad", "done");
        myFullpage.silentMoveTo("your-anchor");
      }
    })
    .catch((error) => {
      console.error("Failed to setup 3D scene:", error);
    });
});
