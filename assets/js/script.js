gsap.registerPlugin(GSDevTools, TextPlugin);

const tl = gsap.timeline({ defaults: { duration: 1, ease: "expo.out" } });
tl.fromTo(".scene-1",
    {
        fontSize: "0.4em",
        x: -200,
    },
    {
        fontSize: "0.65em",
        x: -60,
        ease: "expo.inOut"
    }
)
.to(".scene-1",{
    fontSize: "1em",
    x: 0,
    clearProps: "all",
})
.to(".canvas", {
  backgroundColor: "var(--color-light)",
  color: "var(--color-dark)",
  duration: 0.2,
}, "<")
.to(".scene-1", {
  text: "Hi",
}, "<-0.2")
.to(".scene-1", {
    autoAlpha: 0,
    duration: 0.1,
})
.to(".scene-2", {
    id: "scene-2",
    autoAlpha: 1,
    x: 0,
}, "<" )
.to(".scene-3", {
    "--_cursor-opacity": 1,
    duration: 0.1,
})
.to(".scene-3", {
    color: "#0000",
    duration: 0.1,
}, "<")
.to(".scene-2__text", {
    autoAlpha: 0,
}, "<")
.to(".scene-3", {
    "--_cursor-width": "3px",
}, "<")
.set(".scene-3", {
    "--_cursor-left": "103%",
    "--_cursor-animation-name": "blink",
})
.to(".scene-3", {
    id: "scene-3",
    fontSize: "0.7em",
    color: "var(--color-dark)",
    "--_cursor-height": "150%",
    duration: 0.3,
}, "<")
.to(".scene-2__text", {
    width: 0,
}, "<")
.to(".scene-3", {
    text: "Zahid Hasan Munna",
    ease: "none",
}, "<")
.to(".scene-2", {
    id: "scene-4",
    yPercent: -50,
    autoAlpha: 0,
    delay: 0.5,
})
.to(".scene-4", {
    y: 0,
    autoAlpha: 1,
}, "<+0.4")
.from(".scene-4__char", {
    autoAlpha: 0,
    stagger: 0.1
}, "<")
.to(".scene-4__letter", {
    "--_background-opacity": "0%",
    keyframes: [
        {yPercent: -50, duration: 0.5},
        {yPercent: 0, duration: 0.5, ease: "bounce.out",},
    ],
}, "<-0.2")

GSDevTools.create();