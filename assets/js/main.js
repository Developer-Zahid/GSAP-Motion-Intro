import { buildIntro } from "./scenes.js";
import { initSettings } from "./settings.js";

/* Register before building — the scenes use TextPlugin at creation time. */
gsap.registerPlugin(GSDevTools, TextPlugin);

/* Needed so GSDevTools.getById(...).kill() can find the panel on a rebuild. */
const DEV_TOOLS_ID = "main";

function createDevTools(animation) {
    return GSDevTools.create({
        id: DEV_TOOLS_ID,
        animation,
        persist: false,
    });
}

/* One-time cleanup of keys written before persist was disabled, so an already-poisoned
   session doesn't keep the bad in/out range. */
try {
    Object.keys(sessionStorage)
        .filter((key) => key.startsWith("gs-dev-"))
        .forEach((key) => sessionStorage.removeItem(key));
} catch {
    /* storage unavailable (private mode) — nothing to clean */
}

let motion;

const settings = initSettings((updated) => {
    /* Dispose the panel first so it stops holding the timeline about to be reverted,
       and so its UI is removed rather than a second one stacking up. */
    GSDevTools.getById(DEV_TOOLS_ID)?.kill();

    /* Must run BEFORE the rebuild. revert() kills the old master (otherwise two
       timelines fight over the same DOM) and restores every inline style and text GSAP
       wrote, so the new build's from/fromTo tweens capture clean start values. */
    motion.master.revert();

    motion = buildIntro(updated);
    createDevTools(motion.master);
    motion.master.restart();
});

motion = buildIntro(settings);
createDevTools(motion.master);
