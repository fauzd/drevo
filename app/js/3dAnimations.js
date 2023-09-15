import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function animateModel({
  model,
  camera,
  cameraPositionTo,
  cameraFovTo,
  controls,
  targetTo,
  scaleTo,
  trigger,
}) {
  if (
    !model ||
    !camera ||
    !cameraPositionTo ||
    !cameraFovTo ||
    !controls ||
    !targetTo ||
    !scaleTo ||
    !trigger
  ) {
    console.error("One or more required arguments are missing or undefined");
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  gsap.from(model.scale, {
    ease: "ease-in-out",
    scrollTrigger: {
      trigger: trigger,
      start: "bottom bottom",
      end: "bottom top",
      scrub: true,
      // markers: true,
    },
    x: scaleTo,
    y: scaleTo,
    z: scaleTo,
  });

  gsap.from(camera.position, {
    x: cameraPositionTo.x,
    y: cameraPositionTo.y,
    z: cameraPositionTo.z,
    scrollTrigger: {
      trigger: trigger,
      start: "bottom bottom",
      end: "bottom top",
      scrub: true,
    },
  });
  gsap.from(camera, {
    fov: cameraFovTo,
    scrollTrigger: {
      trigger: trigger,
      start: "bottom bottom",
      end: "bottom top",
      scrub: true,
    },
    onUpdate: () => camera.updateProjectionMatrix(),
  });

  gsap.from(controls.target, {
    x: targetTo.x,
    y: targetTo.y,
    z: targetTo.z,
    scrollTrigger: {
      trigger: trigger,
      start: "bottom bottom",
      end: "bottom top",
      scrub: true,
    },
    onUpdate: () => controls.update(), // Это нужно для обновления controls после каждого изменения
  });
}
