import { buildIntro } from "./scenes.js";
import { initSettings } from "./settings.js";

/* Register before building — the scenes use TextPlugin at creation time. */
gsap.registerPlugin(GSDevTools, TextPlugin);

const { master } = buildIntro(initSettings());

GSDevTools.create({
    id: "main",
    animation: master,
    /* persist defaults to ON: GSDevTools saves the in/out points to sessionStorage and
       restores them on every create. A scrub that left in=100 would come back as a
       zero-width play range — the squashed scrubber — and sessionStorage outlives
       reloads, so it would survive the reload this form now does on save. */
    persist: false,
});