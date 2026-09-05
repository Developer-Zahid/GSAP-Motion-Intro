import { DEFAULT_SETTINGS } from "./scenes.js";

/**
 * The "Project Settings" dialog, shared by the autoplay and scroll builds.
 *
 * The markup is injected rather than written into each page, so the two HTML files
 * can't drift apart and the field list lives in exactly one place. Everything that
 * differs between the pages — how the timeline is torn down and rebuilt — is passed
 * in as the `onApply` callback.
 *
 * Settings resolve in this order, least to most specific:
 *   built-in defaults  →  what this browser saved  →  what the URL asks for
 * so a shared link always wins for the visit, but only overwrites the visitor's own
 * saved preferences if they press Save.
 */

const DIALOG_ID = "settings-dialog";
const STORAGE_KEY = "gsap-motion-intro:settings";

/* Long enough for a real name, short enough that a hostile link can't wreck the
   layout or bloat the URL. */
const MAX_TEXT_LENGTH = 60;

/* One row per field. This drives the markup, the read, the storage and the share
   link, so adding a setting is a single edit here plus wherever buildIntro()
   consumes it. `key` matches the option buildIntro() destructures, `name` is the form
   control name, `param` is the (short) URL query key. */
const FIELDS = [
    { name: "full_name", key: "fullName", param: "name", label: "Full Name", type: "text" },
    { name: "brand_name", key: "brandName", param: "brand", label: "Brand Name", type: "text" },
    { name: "roles", key: "roles", param: "roles", label: "Roles", type: "text" },
    { name: "theme_color", key: "themeColor", param: "color", label: "Theme Color", type: "color" },
];

const GEAR_ICON = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 50 50" aria-hidden="true">
        <path fill="currentColor" d="M47.16,21.221l-5.91-0.966c-0.346-1.186-0.819-2.326-1.411-3.405l3.45-4.917c0.279-0.397,0.231-0.938-0.112-1.282 l-3.889-3.887c-0.347-0.346-0.893-0.391-1.291-0.104l-4.843,3.481c-1.089-0.602-2.239-1.08-3.432-1.427l-1.031-5.886 C28.607,2.35,28.192,2,27.706,2h-5.5c-0.49,0-0.908,0.355-0.987,0.839l-0.956,5.854c-1.2,0.345-2.352,0.818-3.437,1.412l-4.83-3.45 c-0.399-0.285-0.942-0.239-1.289,0.106L6.82,10.648c-0.343,0.343-0.391,0.883-0.112,1.28l3.399,4.863 c-0.605,1.095-1.087,2.254-1.438,3.46l-5.831,0.971c-0.482,0.08-0.836,0.498-0.836,0.986v5.5c0,0.485,0.348,0.9,0.825,0.985 l5.831,1.034c0.349,1.203,0.831,2.362,1.438,3.46l-3.441,4.813c-0.284,0.397-0.239,0.942,0.106,1.289l3.888,3.891 c0.343,0.343,0.884,0.391,1.281,0.112l4.87-3.411c1.093,0.601,2.248,1.078,3.445,1.424l0.976,5.861C21.3,47.647,21.717,48,22.206,48 h5.5c0.485,0,0.9-0.348,0.984-0.825l1.045-5.89c1.199-0.353,2.348-0.833,3.43-1.435l4.905,3.441 c0.398,0.281,0.938,0.232,1.282-0.111l3.888-3.891c0.346-0.347,0.391-0.894,0.104-1.292l-3.498-4.857 c0.593-1.08,1.064-2.222,1.407-3.408l5.918-1.039c0.479-0.084,0.827-0.5,0.827-0.985v-5.5C47.999,21.718,47.644,21.3,47.16,21.221z M25,32c-3.866,0-7-3.134-7-7c0-3.866,3.134-7,7-7s7,3.134,7,7C32,28.866,28.866,32,25,32z"></path>
    </svg>`;

/* ---------- reading settings from the three sources ---------- */

/**
 * Values can arrive from a URL someone else composed, so treat every field as
 * untrusted: cap the text, and accept a colour only if it is really a hex colour.
 * Markup escaping happens later, in scenes.js, right where TextPlugin writes.
 */
function sanitize(raw) {
    const clean = {};

    for (const { key, type } of FIELDS) {
        const value = raw?.[key];
        if (value === undefined || value === null || value === "") continue;

        if (type === "color") {
            const hex = String(value).trim();
            if (/^#[0-9a-f]{6}$/i.test(hex)) clean[key] = hex.toLowerCase();
        } else {
            clean[key] = String(value).trim().slice(0, MAX_TEXT_LENGTH);
        }
    }

    return clean;
}

function readStored() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? {};
    } catch {
        /* unavailable, or someone hand-edited it into invalid JSON */
        return {};
    }
}

function writeStored(settings) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
        /* private mode or quota — the page still works, it just won't remember */
    }
}

function readParams() {
    const params = new URLSearchParams(location.search);
    const raw = {};

    for (const { key, param, type } of FIELDS) {
        const value = params.get(param);
        if (value === null) continue;
        /* The hash is dropped from the URL for readability, so put it back. */
        raw[key] = type === "color" ? `#${value.replace(/^#/, "")}` : value;
    }

    return raw;
}

function resolveSettings() {
    return {
        ...DEFAULT_SETTINGS,
        ...sanitize(readStored()),
        ...sanitize(readParams()),
    };
}

/* Only non-default values go in, so a link with one tweak stays short and readable. */
function buildShareURL(settings) {
    const url = new URL(location.href);
    url.search = "";

    for (const { key, param, type } of FIELDS) {
        const value = settings[key];
        if (!value || value === DEFAULT_SETTINGS[key]) continue;
        url.searchParams.set(param, type === "color" ? String(value).replace(/^#/, "") : value);
    }

    return url.toString();
}

/* ---------- UI ---------- */

function renderUI() {
    /* No value="" here: the inputs are filled through the .value property below.
       Interpolating settings into an HTML string would let a crafted share link break
       out of the attribute. */
    const fields = FIELDS.map(
        ({ name, label, type }) => `
            <label for="settings-${name}">${label}:</label>
            <input type="${type}" id="settings-${name}" name="${name}"
                   placeholder="${label}" required>`
    ).join("");

    document.body.insertAdjacentHTML(
        "beforeend",
        `<button id="${DIALOG_ID}-button" type="button" class="settings-button" aria-label="Project settings" command="show-modal" commandfor="${DIALOG_ID}">${GEAR_ICON}</button>
         <dialog id="${DIALOG_ID}" class="settings-dialog" aria-labelledby="${DIALOG_ID}-title" closedby="any">
             <h2 id="${DIALOG_ID}-title" class="settings-dialog__title">Project Settings</h2>
             <form class="settings-dialog__form">
                 ${fields}
                 <button type="submit" class="settings-dialog__button">Save</button>
                 <button type="button" class="settings-dialog__button cc-secondary" data-share>Copy Share Link</button>
                 <p class="settings-dialog__status" role="status" aria-live="polite"></p>
                 <input class="settings-dialog__share-url" type="text" readonly hidden aria-label="Shareable link">
             </form>
         </dialog>`
    );
}

function fillForm(form, settings) {
    for (const { name, key } of FIELDS) {
        form.elements[name].value = settings[key] ?? DEFAULT_SETTINGS[key];
    }
}

function readForm(form) {
    const data = new FormData(form);
    return sanitize(
        Object.fromEntries(FIELDS.map(({ name, key }) => [key, data.get(name)?.toString()]))
    );
}

/* The scenes read --color-primary straight from CSS, so the theme is a variable swap
   rather than anything GSAP animates. */
function applyThemeColor({ themeColor }) {
    if (themeColor) {
        document.documentElement.style.setProperty("--color-primary", themeColor);
    }
}

/**
 * Inject the dialog, restore saved/shared settings, and wire Save and Share.
 *
 * @param {(settings: object) => void} onApply Rebuild step for this page. Runs after the
 *   theme is applied and before the dialog closes.
 * @returns {object} The settings to build with on first load.
 */
export function initSettings(onApply) {
    renderUI();

    const dialog = document.getElementById(DIALOG_ID);
    const form = dialog.querySelector(".settings-dialog__form");
    const status = dialog.querySelector(".settings-dialog__status");
    const shareField = dialog.querySelector(".settings-dialog__share-url");

    /* command/commandfor is the Invoker Commands API (Chrome 135+). Where it isn't
       supported the button would silently do nothing, so fall back to showModal() —
       guarded, otherwise a supporting browser would open the dialog twice and the
       second showModal() call throws InvalidStateError. */
    if (!("command" in HTMLButtonElement.prototype)) {
        document
            .getElementById(`${DIALOG_ID}-button`)
            .addEventListener("click", () => dialog.showModal());
    }

    const initial = { ...DEFAULT_SETTINGS, ...resolveSettings() };
    fillForm(form, initial);
    applyThemeColor(initial);

    const resetStatus = () => {
        status.textContent = "";
        shareField.hidden = true;
    };

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const settings = { ...DEFAULT_SETTINGS, ...readForm(form) };
        writeStored(settings);
        applyThemeColor(settings);
        onApply(settings);

        resetStatus();
        dialog.close();
    });

    form.querySelector("[data-share]").addEventListener("click", async () => {
        /* Share what is on screen in the form, so a link can be sent without saving. */
        const url = buildShareURL({ ...DEFAULT_SETTINGS, ...readForm(form) });

        try {
            await navigator.clipboard.writeText(url);
            status.textContent = "Link copied to clipboard.";
            shareField.hidden = true;
        } catch {
            /* Clipboard needs a secure context and permission; when either is missing,
               show the link so it can be copied by hand rather than failing silently. */
            status.textContent = "Copy this link:";
            shareField.hidden = false;
            shareField.value = url;
            shareField.select();
        }
    });

    /* Editing after a share invalidates the message that's on screen. */
    form.addEventListener("input", resetStatus);
    dialog.addEventListener("close", resetStatus);

    return initial;
}
