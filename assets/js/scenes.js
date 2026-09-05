/**
 * Shared choreography for both the autoplay and the scroll-driven build.
 *
 * Everything here is identical between the two; only the MASTER timeline differs,
 * so that is the one thing callers pass in.
 *
 * IMPORTANT: this exports a builder function rather than building on import.
 * The tweens use TextPlugin at creation time, so the entry file must call
 * gsap.registerPlugin(...) first — a module's top-level code would run too early.
 */

/**
 * Single source of truth for the copy. settings.js seeds the form inputs from this and
 * buildIntro() falls back to it, so the defaults can't drift between markup and code.
 * `roles` is a comma-separated string because that is what the form field produces.
 */
export const DEFAULT_SETTINGS = {
    fullName: "Zahid Hasan Munna",
    brandName: "Developer Zahid",
    roles: "Designer, Developer, Partner",
    themeColor: "#F62440",
};

/* Nested timelines do NOT inherit a parent's `defaults`, so each scene gets its own copy. */
const DEFAULTS = { duration: 1, ease: "expo.out" };
const scene = (id) => gsap.timeline({ id, defaults: DEFAULTS });

/**
 * Build every scene and assemble the master timeline.
 *
 * @param {object} [masterVars] Extra vars for the master timeline — e.g. a
 *   `scrollTrigger` config. `id: "master"` is applied first so it can be overridden.
 * @returns {{ master: object, scenes: object }} The master timeline plus each named
 *   scene, so callers can drive them individually (`scenes.roles.play()`).
 */
export function buildIntro(options = {}) {
    const {
        fullName = DEFAULT_SETTINGS.fullName,
        brandName = DEFAULT_SETTINGS.brandName,
        roles = DEFAULT_SETTINGS.roles,
        /* Applied by the caller as a CSS variable, not a tween — pulled out here so it
           doesn't fall through into masterVars. Anything that isn't a real GSAP
           timeline var must be destructured out, or the rest-spread leaks it. */
        themeColor,
        ...masterVars
    } = options;

    /* TextPlugin assigns through innerHTML, so any copy reaching a `text:` value is a
       markup-injection sink — verified: `text: '<img src=x onerror=…>'` runs the
       handler. These strings can arrive from a shared URL, i.e. from whoever sent the
       link, so escape here at the sink rather than trusting each caller. Escaping also
       renders correctly: "Tom & Jerry" types as "Tom & Jerry". */
    const escapeText = (value) =>
        String(value).replace(
            /[&<>"']/g,
            (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]
        );

    /* Accepts either an array or the comma-separated string the settings form produces. */
    const toRoleList = (value) =>
        (Array.isArray(value) ? value : String(value ?? "").split(","))
            .map((role) => String(role).trim())
            .filter(Boolean);

    const rolesList = toRoleList(roles);
    const formattedRoles = (rolesList.length ? rolesList : toRoleList(DEFAULT_SETTINGS.roles))
        .map(escapeText);

    const safeFullName = escapeText(fullName);
    const safeBrandName = escapeText(brandName);

    /* ---------- "H" grows in, canvas flips to light, types out "Hi" ---------- */
    const intro = scene("intro")
        .fromTo(".scene-1",
            {
                fontSize: "0.4em",
                x: "-12.5rem",
            },
            {
                fontSize: "0.65em",
                x: "-3.75rem",
                ease: "expo.inOut",
            }
        )
        .to(".scene-1", {
            fontSize: "1em",
            x: 0,
        })
        .to(".canvas", {
            backgroundColor: "var(--color-light)",
            color: "var(--color-dark)",
            duration: 0.2,
            ease: "power2.inOut",
        }, "<")
        .to(".scene-1", {
            text: "Hi",
        }, "<-0.2");

    /* ---------- hand off "Hi" -> "I'm", cursor fades in ---------- */
    const cursor = scene("cursor")
        .to(".scene-1", {
            autoAlpha: 0,
            x: -10,
            duration: 0.1,
            ease: "power1.out",
        })
        .to(".scene-2", {
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
        }, "<");

    /* ---------- cursor parks at the end, name types out ---------- */
    const developerName = scene("name")
        .set(".scene-3", {
            "--_cursor-left": "103%",
            "--_cursor-animation-name": "blink",
        })
        .to(".scene-3", {
            fontSize: "0.7em",
            color: "var(--color-dark)",
            "--_cursor-height": "150%",
            duration: 0.3,
        }, "<")
        .to(".scene-2__text", {
            width: 0,
        }, "<")
        .to(".scene-3", {
            text: safeFullName,
            ease: "none",
        }, "<");

    /* ---------- "Your" rises in, circle drops into the "o" ---------- */
    const your = scene("your")
        .to(".scene-2", {
            yPercent: -50,
            autoAlpha: 0,
        })
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
        }, "<-0.2");

    /* ---------- circle wiggles loose, then swells into the shutter ---------- */
    const morph = scene("morph")
        .set(".scene-4__circle", {
            "--_background-color": "var(--color-light)",
            "--_background-opacity": "100%",
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
        }, "-=0.2");

    /* ---------- shutter takes over, circle flies up and becomes the dot ---------- */
    const shutter = scene("shutter")
        .to(".canvas__shutter", {
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
            "--_background-color": "var(--color-dark)",
        }, "<+0.2");

    /* ---------- "Creative ___" cycles through the roles ---------- */
    const rolesTimeline = scene("roles")
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
                keyframes: formattedRoles.map((r, i) => ({
                    text: r.endsWith(".") ? r : `${r}.`,
                    delay: i === 0 ? 0 : 0.5,
                    duration: i === 0 ? 0.5 : 0,
                })),
            },
            "<+0.5"
        )
        .to(".canvas__shutter", {
            autoAlpha: 0,
            scale: 4,
        }, "<+0.2");

    /* ---------- settle on the sign-off ---------- */
    const outro = scene("outro")
        .to(".scene-5", {
            fontSize: "0.5em",
        })
        .set(".scene-5__prefix", {
            text: safeBrandName,
        }, "<+0.1")
        .set(".scene-5__words", {
            text: ".",
            /* The markup keeps a real space between prefix and words (needed so the
               roles line reads "Creative Designer." for screen readers and copy).
               The sign-off wants no gap, so pull the period back over it. */
            marginInlineStart: "-0.2em",
        }, "<");

    /* ---------- master: the only part that differs between builds ---------- */
    const master = gsap.timeline({ id: "master", ...masterVars })
        .addLabel("intro").add(intro)
        .addLabel("cursor").add(cursor)
        .addLabel("name").add(developerName)
        .addLabel("your", "+=0.5").add(your, "your")
        .addLabel("morph").add(morph)
        .addLabel("shutter").add(shutter)
        .addLabel("roles").add(rolesTimeline)
        .addLabel("outro", "+=0.5").add(outro, "outro");

    return {
        master,
        scenes: { intro, cursor, name: developerName, your, morph, shutter, roles: rolesTimeline, outro },
    };
}
