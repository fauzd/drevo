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
  function updateVisibility(newVisibility) {
    isVisible = newVisibility;
  }

  gui(updateVisibility); 
   

  setupThreeDScene()
    .then(({ scene, camera, controls, tree }) => {
      new fullpage("#fullpage", {
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
        },
        beforeLeave: function (origin, destination, direction) {
          const shouldMove = reverse2DAnimation(origin, destination, direction);
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
      });
    })
    .catch((error) => {
      console.error("Failed to setup 3D scene:", error);
    });

    
  
});
