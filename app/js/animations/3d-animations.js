import { gsap } from "gsap";
import { setInitialCameraPosition } from "./cameraTilt";
import { resetMousePosition } from "./cameraTilt";

// Объявляем таймлайн во внешней области видимости
let sectionAnimation = gsap.timeline({ paused: true });

const animationParams = {
  hero: {
    //Initial position
    cameraPositionTo: { x: -71.55, y: -1.06, z: -41.87 },
    cameraFovTo: 35,
    targetTo: { x: -3.31, y: 19.65, z: -5.26 },
    scaleTo: 1,
    delay: 0.3,
    duration: 1,
    ease: "ease-in-out",
  },
  approach: {
    cameraPositionTo: { x: -18.64, y: -6.78, z: -30.73 },
    cameraFovTo: 12,
    targetTo: { x: -1.59, y: -2.16, z: -1.25 },
    scaleTo: 1,
    delay: 0.1,
    duration: 1,
    ease: "ease-in-out",
  },
  services: {
    cameraPositionTo: { x: -34.69, y: 3.31, z: 7.56 },
    cameraFovTo: 12,
    targetTo: { x: -0.85, y: 1.23, z: 1.94 },
    scaleTo: 1,
    delay: 0.3,
    duration: 1,
    ease: "ease-in-out",
  },
  projects: {
    cameraPositionTo: { x: -5.39, y: 17.38, z: 32.33 },
    cameraFovTo: 12,
    targetTo: { x: 2.05, y: 5.06, z: 1.12 },
    scaleTo: 1,
    delay: 0.3,
    duration: 1,
    ease: "ease-in-out",
  },
  clients: {
    cameraPositionTo: { x: 42.73, y: 32.5, z: 15.5 },
    cameraFovTo: 12,
    targetTo: { x: 0.58, y: 9.9, z: 3.91 },
    scaleTo: 1,
    delay: 0.3,
    duration: 1,
    ease: "ease-in-out",
  },
  team: {
    cameraPositionTo: { x: 41.66, y: 29.9, z: -47.87 },
    cameraFovTo: 12,
    targetTo: { x: -1.55, y: 10.85, z: -0.43 },
    scaleTo: 1,
    delay: 0.3,
    duration: 1,
    ease: "ease-in-out",
  },
  contacts: {
    cameraPositionTo: { x: 0.38, y: -11.16, z: -4.64 },
    cameraFovTo: 12,
    targetTo: { x: -1.45, y: 12.23, z: 0.4 },
    scaleTo: 1,
    delay: 0.3,
    duration: 1,
    ease: "ease-in-out",
  },
  message: {
    cameraPositionTo: { x: -1.55, y: 9.0, z: -0.43 },
    cameraFovTo: 12,
    targetTo: { x: -1.55, y: 16.0, z: -0.43 },
    scaleTo: 1,
    delay: 0.3,
    duration: 1,
    ease: "ease-in-out",
  },
  fall: {
    cameraPositionTo: { x: -1.55, y: -10.0, z: -0.43 },
    cameraFovTo: 12,
    targetTo: { x: -1.55, y: 16.0, z: -0.43 },
    scaleTo: 1,
    delay: 0.3,
    duration: 3,
    ease: "power4.out",
  },
};

export function play3DAnimation(anchor, model, camera, controls) {
  const params = animationParams[anchor];
  if (!params) {
    console.error("Invalid anchor:", anchor);
    return;
  }

  // Обновляем таймлайн
  sectionAnimation
    .clear()
    .add(
      gsap.to(model.scale, {
        ease: params.ease,
        x: params.scaleTo,
        y: params.scaleTo,
        z: params.scaleTo,
      }),
      "beforeLeave"
    )
    .add(
      gsap.to(camera.position, {
        ease: params.ease,
        x: params.cameraPositionTo.x,
        y: params.cameraPositionTo.y,
        z: params.cameraPositionTo.z,
      }),
      "beforeLeave"
    )
    .add(
      gsap.to(camera, {
        ease: params.ease,
        fov: params.cameraFovTo,
        onUpdate: () => {
          camera.updateProjectionMatrix();
        },
      }),
      "beforeLeave"
    )
    .add(
      gsap.to(controls.target, {
        ease: params.ease,
        x: params.targetTo.x,
        y: params.targetTo.y,
        z: params.targetTo.z,
        onUpdate: () => controls.update(),
      }),
      "beforeLeave"
    )
    .duration(params.duration)
    .delay(params.delay)
    .eventCallback("onComplete", () => {
      resetMousePosition();
      setInitialCameraPosition(camera);
    });

  sectionAnimation.play();
}
