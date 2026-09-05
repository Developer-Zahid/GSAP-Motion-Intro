import { buildIntro } from "./scenes.js";
import { initSettings } from "./settings.js";

/* Register before building — the scenes use TextPlugin at creation time. */
gsap.registerPlugin(ScrollTrigger, TextPlugin);

/* How many extra viewports of scrolling the pinned intro lasts — the scroll length
   knob. It lives here rather than in CSS because .scroll-stage must NOT have its own
   height: the pin-spacer already provides the runway, and a CSS height would be a
   second, competing one. The two agree at load and drift apart the moment the mobile
   URL bar changes `dvh`, leaving dead scroll at the bottom. */
const SCROLL_SCREENS = 7;

/* ScrollTrigger lives ONLY on the master timeline — never on a nested scene. */
buildIntro({
    ...initSettings(),
    scrollTrigger: {
        trigger: ".scroll-stage",
        start: "top top",
        end: () => `+=${window.innerHeight * SCROLL_SCREENS}`,
        pin: ".scroll-pin",
        scrub: 1,
        invalidateOnRefresh: true,
        markers: false,
    },
});