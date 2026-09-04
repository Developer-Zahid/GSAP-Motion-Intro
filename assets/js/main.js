import { buildIntro } from "./scenes.js";

/* Register before building — the scenes use TextPlugin at creation time. */
gsap.registerPlugin(GSDevTools, TextPlugin);

const { master, scenes } = buildIntro();

GSDevTools.create();

/* Module scope isn't global, so expose handles for console debugging.
   Note: never assign a scene to `window.name` — it's a built-in that coerces to a string. */
window.tl = master;
window.motion = { master, scenes };
