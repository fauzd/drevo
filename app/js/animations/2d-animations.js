import gsap from "gsap";
import Splitting from "splitting";
import "splitting/dist/splitting.css";
import "splitting/dist/splitting-cells.css";

export function play2DAnimation(origin, destination, direction) {
  if (
    destination.anchor === "hero" ||
    // destination.anchor === "approach" ||
    destination.anchor === "services"
  ) {
    //наличие класса has-animation = отсутствие автоскролла по колесику/клаве.
    //только через fullpage_api.moveSectionUp/Down
    destination.item.classList.add("has-animation");
  }

  switch (destination.anchor) {
    case "hero":
      playHeroAnimation();
      break;
    case "approach":
      // Будет анимация
      break;
    case "services":
      if (origin.index < destination.index) {
        // Анимация для входа в секцию сверху
        servicesAnimation = createServicesAnimation("top", "start");
      } else if (origin.index > destination.index) {
        // Анимация для входа в секцию снизу
        servicesAnimation = createServicesAnimation("bottom", "end");
      } else if (origin.index === destination.index) {
        // Анимация для входа в секцию снизу
        servicesAnimation = createServicesAnimation("center", "random");
      }
      playServicesAnimation();
      break;
    default:
      console.log("Unknown section");
  }
}

export function reverse2DAnimation(origin, destination, direction) {

  if (origin.item.classList.contains("has-animation")) {
    switch (origin.anchor) {
      case "hero":
        reverseHeroAnimation(origin, direction);
        break;
      case "services":
        reverseServicesAnimation(origin, direction);
        break;
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

let servicesAnimation = gsap.timeline({ paused: true });
const items = document.querySelectorAll('.services__item');

//Анимация прозрачности текста в зависимости от направления 
function animateTextOpacity(element, forward = true) {
  gsap.fromTo(
    element.querySelectorAll(".services__item-child"),
    {
      "--text-opacity": forward ? 0 : 1,
    },
    {
      "--text-opacity": forward ? 1 : 0,
      duration: 0.75,
    }
  );
}

function createServicesAnimation(transformOrigin, staggerFrom) {
  let tl = gsap.timeline({ paused: true });
  tl
  .to(items,{opacity: 1, duration: .1})
  .fromTo(
    items,
    {
      transform: "scaleY(0)",
      "--border-radius": "9px",
      "--transform-origin": transformOrigin,
    },
    {
      transform: "scaleY(1)",
      "--border-radius": "28px",
      "--transform-origin": transformOrigin,
      stagger: {
        each: .3,
        from: staggerFrom,
        onComplete: function () {
          animateTextOpacity(this.targets()[0], true);
        },
      },
    }
  );
  return tl;
}

function playServicesAnimation() {
  servicesAnimation.restart();
}

let servicesOnLeave = gsap.timeline({ paused: true})
servicesOnLeave.fromTo(
  items,
  {
    opacity: 1,
  },
  {
    opacity: 0,
    duration: 1,
    stagger: {
      each: 0.05,
      from: "random",
      onComplete: function () {
        animateTextOpacity(this.targets()[0], false);
      },
    },
  }
);

function reverseServicesAnimation(origin, direction) {
  servicesOnLeave.restart().eventCallback("onComplete", function () {
    origin.item.classList.remove("has-animation");

    if (direction === "up") {
      fullpage_api.moveSectionUp();
    } else {
      fullpage_api.moveSectionDown();
    }
  });
}