gsap.registerPlugin(GSDevTools, TextPlugin);

const tl = gsap.timeline({ defaults: { duration: 1, ease: "expo.out" } });

/* ---------- "H" grows in, canvas flips to light, types out "Hi" ---------- */
tl.addLabel("intro")
.fromTo(".scene-1",
    {
        fontSize: "0.4em",
        x: -200,
    },
    {
        fontSize: "0.65em",
        x: -60,
        ease: "expo.inOut",
    }
)
.to(".scene-1", {
    fontSize: "1em",
    x: 0,
    clearProps: "all",
})
.to(".canvas", {
    backgroundColor: "var(--color-light)",
    color: "var(--color-dark)",
    duration: 0.2,
    ease: "power2.inOut",
}, "<")
.to(".scene-1", {
    text: "Hi",
}, "<-0.2")

/* ---------- hand off "Hi" -> "I'm", cursor fades in ---------- */
.addLabel("cursor")
.to(".scene-1", {
    autoAlpha: 0,
    duration: 0.1,
    ease: "power1.out",
})
.to(".scene-2", {
    id: "scene-2",
    autoAlpha: 1,
    x: 0,
}, "<")
.to(".scene-3", {
    "--_cursor-opacity": 1,
    duration: 0.1,
    ease: "none",
})
.to(".scene-3", {
    color: "#0000",
    duration: 0.1,
    ease: "none",
}, "<")
.to(".scene-2__text", {
    autoAlpha: 0,
    ease: "power2.out",
}, "<")
.to(".scene-3", {
    "--_cursor-width": "3px",
}, "<")

/* ---------- cursor parks at the end, name types out ---------- */
.addLabel("name")
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

/* ---------- "Your" rises in, circle drops into the "o" ---------- */
.addLabel("your", "+=0.5")
.to(".scene-2", {
    id: "scene-4",
    yPercent: -50,
    autoAlpha: 0,
}, "your")
.to(".scene-4", {
    y: 0,
    autoAlpha: 1,
}, "<+0.4")
.from(".scene-4__char", {
    autoAlpha: 0,
    stagger: 0.1,
    ease: "power2.out",
}, "<")
.to(".scene-4__circle", {
    "--_background-opacity": "0%",
    keyframes: [
        { yPercent: -50, duration: 0.5, ease: "power2.out" },
        { yPercent: 0, duration: 0.5, ease: "bounce.out" },
    ],
}, "<-0.2")

/* ---------- circle wiggles loose, then swells into the shutter ---------- */
.addLabel("morph")
.set(".scene-4__circle", {
    backgroundColor: "var(--color-light)",
})
.to(".scene-4__circle", {
    duration: 0.6,
    keyframes: [
        { yPercent: 30, ease: "power1.inOut" },
        { yPercent: -35, ease: "power1.inOut" },
        { yPercent: 50, ease: "power2.in" },
        {
            scaleX: 4.5,
            scaleY: 5,
            borderWidth: "0.18em",
            aspectRatio: "1 / 1",
            duration: 1,
            ease: "power2.inOut",
        },
    ],
})
.to(".scene-4__char", {
    autoAlpha: 0,
    duration: 0.1,
    ease: "power1.out",
}, "-=0.2")

/* ---------- shutter takes over, circle flies up and becomes the dot ---------- */
.addLabel("shutter")
.to(".canvas__shutter", {
    id: "scene-5",
    autoAlpha: 1,
    scale: 1,
    duration: 0.05,
    ease: "none",
})
.to(".scene-4__circle", {
    yPercent: -400,
    borderWidth: "0.09em",
    duration: 0.5,
})
.set(".scene-4__circle", {
    backgroundColor: "var(--color-dark)",
}, "<+0.2")

/* ---------- "Creative ___" cycles through the roles ---------- */
.addLabel("roles")
.to(".scene-5", {
    autoAlpha: 1,
})
.to(".scene-4__circle", {
    "--_inner-cut-size": 1,
    yPercent: 100,
}, "<")
.to(".canvas__shutter", {
    "--_curve-height": "100%",
    duration: 0.8,
}, "<+0.2")
.to(".scene-4__circle", {
    xPercent: 400,
    yPercent: 0,
})
.to(".scene-4__circle", {
    xPercent: 0,
    yPercent: -20,
    autoAlpha: 0,
})
.to(".scene-5", {
    color: "var(--color-dark)",
    ease: "power2.inOut",
}, "<")
.fromTo(".scene-5__words",
    {
        x: "1em",
    },
    {
        x: 0,
        ease: "none",
        keyframes: [
            { text: "Designer.", duration: 0.5 },
            { text: "Developer.", delay: 0.5, duration: 0 },
            { text: "Partner.", delay: 0.5, duration: 0 },
        ],
    },
    "<+0.5"
)
.to(".canvas__shutter", {
    autoAlpha: 0,
    scale: 4,
}, "<+0.2")

/* ---------- settle on the sign-off ---------- */
.addLabel("outro", "+=0.5")
.to(".scene-5", {
    fontSize: "0.5em",
}, "outro")
.set(".scene-5__prefix", {
    text: "Developer",
}, "<+0.1")
.set(".scene-5__words", {
    text: "Zahid.",
}, "<")

GSDevTools.create();
