import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import "splitting/dist/splitting.css";
import "splitting/dist/splitting-cells.css";
import Splitting from "splitting";

document.addEventListener("DOMContentLoaded", function () {
  gsap.registerPlugin(ScrollTrigger);
  Splitting();

  // ScrollTrigger.defaults({
  //   scroller: "[data-scroll-container]",
  //   scrub: true,
  // });

  const heroTitle = [
    ...document.querySelectorAll("[data-splitting][data-effect]"),
  ];

  heroTitle.forEach((title) => {
    const words = [...title.querySelectorAll(".word")];

    words.forEach((word) => gsap.set(word.parentNode, { perspective: 1000 }));

    gsap.fromTo(
      words,
      {
        "will-change": "opacity, transform",
        opacity: 0,
        z: () => gsap.utils.random(500, 950),
        xPercent: (pos) => gsap.utils.random(-100, 100),
        yPercent: (pos) => gsap.utils.random(-10, 10),
        rotationX: () => gsap.utils.random(-90, 90),
      },
      {
        ease: "expo",
        opacity: 1,
        rotationX: 0,
        rotationY: 0,
        rotate: 0,
        xPercent: 0,
        yPercent: 0,
        z: 0,
        scrollTrigger: {
          trigger: ".hero",
          start: "center center",
          end: "+=100%",
          scrub: true,
          pin: ".hero",
          // markers: true,
        },
        stagger: {
          each: 0.006,
          from: "random",
        },
      }
    );

    // logo&burger animations
    const windowHeight = window.innerHeight;
    const elementHeight = document.querySelector(".hero__logo").offsetHeight;

    const initialTop = 45;
    const finalBottom = 45;

    const initialY = initialTop;
    const finalY = windowHeight - elementHeight - finalBottom;

    gsap.fromTo(
      [".hero__logo", ".hero__burger"],
      {
        y: finalY,
        opacity: 0,
      },
      {
        ease: "ease-in-out",
        scrollTrigger: {
          trigger: ".hero",
          start: "top center",
          end: "top top",
          scrub: true,
          // markers: true,
        },
        y: initialY,
        opacity: 1,
      }
    );

    gsap.fromTo(
      ".hero__subtitle",
      {
        opacity: 0,
      },
      {
        scrollTrigger: {
          trigger: ".hero",
          start: "top 25%",
          end: "top top",
          scrub: true,
          // markers: true,
        },
        opacity: 1,
      }
    );
  });


  window.addEventListener("load", function () {
    window.scrollTo(0, document.body.scrollHeight);
  });
});
