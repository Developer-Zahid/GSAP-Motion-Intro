import { buildIntro } from "./scenes.js";
import { initSettings } from "./settings.js";

/* Register before building — the scenes use TextPlugin at creation time. */
gsap.registerPlugin(ScrollTrigger, TextPlugin);

/* ScrollTrigger lives ONLY on the master timeline — never on a nested scene. */
const SCROLL_TRIGGER = {
    trigger: ".scroll-stage",
    start: "top top",
    end: "bottom bottom",
    pin: ".scroll-pin",
    scrub: 1,
    invalidateOnRefresh: true,
    markers: false,
};

const build = (settings) => buildIntro({ ...settings, scrollTrigger: SCROLL_TRIGGER });

let motion;

const settings = initSettings((updated) => {
    /* Kill the ScrollTrigger explicitly with revert=true so the pin-spacer it injected
       is removed. Leaving it would stack a second spacer on the next build and the
       page would grow by a viewport each save. */
    motion.master.scrollTrigger?.kill(true);
    motion.master.revert();

    motion = build(updated);

    /* Recalculate start/end against the layout the rebuild produced. */
    ScrollTrigger.refresh();
});

motion = build(settings);
