import GScroll from "@grcmichael/gscroll";
import ScrollTrigger from "gsap/ScrollTrigger";
import gsap from "gsap";
import Splitting from "splitting";
import "splitting/dist/splitting.css";
import "splitting/dist/splitting-cells.css";

document.addEventListener("DOMContentLoaded", function () {

  gsap.registerPlugin(ScrollTrigger);

  const scroll = new GScroll("#GScroll", 0.3, () => {
    ScrollTrigger.update();
  });

  scroll.init();
  scroll.wheel();

  const scroller = document.getElementById("GScroll");
  ScrollTrigger.defaults({
    scroller: scroller,
  });

  ScrollTrigger.scrollerProxy(scroller, {
    scrollTop(value) {
      if (arguments.length) {
        scroll.current = -value; // setter
      }
      return -scroll.current; // getter
    },
    getBoundingClientRect() {
      return {
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      };
    },
  });

  window.addEventListener("resize", () => {
    scroll.resize();
  });

  Splitting();

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
        yPercent: (pos) => gsap.utils.random(-100, 100),
        rotationX: () => gsap.utils.random(-90, 90),
      },
      {
        // ease: "expo",
        opacity: 1,
        rotationX: 0,
        rotationY: 0,
        rotate: 0,
        xPercent: 0,
        yPercent: 0,
        z: 0,
        scrollTrigger: {
          trigger: ".hero",
          start: "top center",
          end: "bottom top-=200%",
          scrub: true,
          // pin: ".hero",
          // pin: true,
          // markers: true,
        },
        stagger: {
          each: 0.006,
          from: "random",
        },
      }
    );

    ScrollTrigger.create({
      trigger: ".hero",
      start: "top top",
      end: "bottom top-=200%",
      pin: true,
      // markers: true,
    });

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
          end: "bottom top-=200%",
          scrub: true,
          // markers: true,
        },
        y: initialY,
        opacity: 1,
      }
    );
  
  });

  ScrollTrigger.addEventListener("refresh", () => scroll.resize());
  ScrollTrigger.refresh();

  scroll.scrollTo("#start");
})
