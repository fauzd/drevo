import gsap from "gsap";
import Splitting from "splitting";
import "splitting/dist/splitting.css";
import "splitting/dist/splitting-cells.css";

export function play2DAnimation(origin, destination, direction) {
  if (origin.anchor === "hero") {
    origin.item.classList.add("has-animation");
  }

  if (destination.anchor === "hero") {
    playHeroAnimation();
  }
}

export function reverse2DAnimation(origin, destination, direction) {

  if (origin.item.classList.contains("has-animation")) {
    if (origin.anchor === "hero") {
      reverseHeroAnimation(origin, direction);
    }
    return false;
  }
  return true;
}

Splitting();

const heroTitle = [
  ...document.querySelectorAll("[data-splitting][data-effect]"),
];
const words = heroTitle.map((title) => [...title.querySelectorAll(".word")]);

words.forEach((wordGroup) =>
  wordGroup.forEach((word) => gsap.set(word.parentNode, { perspective: 1000 }))
);

let heroAnimation = gsap.timeline({ paused: true });

heroAnimation.fromTo(
  words,
  {
    "will-change": "opacity, transform",
    opacity: 0,
    z: () => gsap.utils.random(500, 950),
    xPercent: (pos) => gsap.utils.random(-100, 100),
    yPercent: (pos) => gsap.utils.random(-100, 100),
    rotationX: () => gsap.utils.random(-90, 90),
  },
  {
    opacity: 1,
    rotationX: 0,
    rotationY: 0,
    rotate: 0,
    xPercent: 0,
    yPercent: 0,
    z: 0,
    stagger: {
      each: 0.006,
      from: "random",
    },
    duration: 1,
  }
);

function playHeroAnimation() {
  heroAnimation.play();
}

function reverseHeroAnimation(origin, direction) {
  heroAnimation.reverse().eventCallback("onReverseComplete", function () {
    origin.item.classList.remove("has-animation");

    if (direction === "up") {
      fullpage_api.moveSectionUp();
    } else {
      fullpage_api.moveSectionDown();
    }
  });
}