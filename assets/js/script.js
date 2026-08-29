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
    }
)
.to(".scene-1",{
    fontSize: "1em",
    x: 0,
    clearProps: true,
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
.to(".scene-3", {
    "--_cursor-left": "103%",
    duration: 0,
})
.to(".scene-3", {
    "--_cursor-animation-name": "blink",
    duration: 0,
})
.to(".scene-3", {
    id: "scene-3",
    fontSize: "0.5em",
    color: "var(--color-dark)",
    "--_cursor-height": "150%",
    duration: 0.3,
}, "<")
.to(".scene-3", {
    text: "Zahid Hasan Munna",
}, "<")

GSDevTools.create();