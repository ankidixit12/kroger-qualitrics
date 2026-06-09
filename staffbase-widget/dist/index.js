// src/QualtricsLoader.js
var ZONE_URL = "https://zn2ukynhmxdi4ug6f-krogerxmit.siteintercept.qualtrics.com/SIE/?Q_ZID=ZN_2uKyNHmXdi4UG6f";
var ROOT_ID = "qualtrics-intercept-root";
var ZONE_DIV_ID = "ZN_2uKyNHmXdi4UG6f";
var isLoaded = false;
function ensureInterceptRoot() {
  let root = document.getElementById(ROOT_ID);
  if (root)
    return root;
  root = document.createElement("div");
  root.id = ROOT_ID;
  root.style.position = "fixed";
  root.style.bottom = "18px";
  root.style.right = "18px";
  root.style.zIndex = "2147483647";
  root.style.pointerEvents = "none";
  root.style.minWidth = "240px";
  root.style.maxWidth = "320px";
  root.style.borderRadius = "12px";
  root.style.background = "rgba(255,255,255,0.95)";
  root.style.boxShadow = "0 20px 50px rgba(15,23,42,0.12)";
  root.style.padding = "12px";
  root.style.fontFamily = "system-ui, sans-serif";
  root.style.fontSize = "12px";
  root.style.color = "#111827";
  root.style.lineHeight = "1.4";
  root.innerText = "Qualtrics intercept root loaded. The Qualtrics script will run on this page.";
  document.body.appendChild(root);
  return root;
}
function addZoneDiv(targetSelector) {
  let existing = document.getElementById(ZONE_DIV_ID);
  if (existing)
    return existing;
  const div = document.createElement("div");
  div.id = ZONE_DIV_ID;
  div.innerHTML = "<!--DO NOT REMOVE-CONTENTS PLACED HERE-->";
  if (targetSelector) {
    try {
      const el = document.querySelector(targetSelector);
      if (el) {
        el.appendChild(div);
        return div;
      }
    } catch (e) {
      console.warn("Invalid selector for embedded intercept:", targetSelector, e);
    }
  }
  const root = document.getElementById(ROOT_ID) || ensureInterceptRoot();
  root.appendChild(div);
  return div;
}
function loadQualtrics(userId) {
  if (isLoaded)
    return;
  const params = new URLSearchParams(window.location.search);
  const isPopUp = params.has("QualtricsTest_PopUp");
  const isFeedbackButton = params.has("QualtricsTest_FeedbackButton");
  const isEmbedded = params.has("QualtricsTest_Embedded");
  const embeddedSelector = params.get("qualtricsSelector") || null;
  ensureInterceptRoot();
  if (isEmbedded) {
    addZoneDiv(embeddedSelector);
  } else {
    addZoneDiv();
  }
  window.QSI = window.QSI || {};
  window.QSI.config = Object.assign(window.QSI.config || {}, {
    externalReference: userId,
    interceptRoot: `#${ROOT_ID}`,
    interceptTest: isPopUp ? "popUp" : isFeedbackButton ? "feedbackButton" : isEmbedded ? "embedded" : void 0
  });
  const existingScript = document.querySelector(`script[src='${ZONE_URL}']`);
  if (existingScript) {
    isLoaded = true;
    if (window.QSI && window.QSI.API && typeof window.QSI.API.run === "function") {
      try {
        window.QSI.API.run();
      } catch (e) {
        console.warn("QSI.API.run failed", e);
      }
    }
    return;
  }
  const script = document.createElement("script");
  script.src = ZONE_URL;
  script.async = true;
  script.crossOrigin = "anonymous";
  script.onload = () => {
    console.log("Qualtrics intercept script loaded.");
  };
  script.onerror = (event) => {
    console.error("Qualtrics intercept script failed to load.", event);
  };
  document.body.appendChild(script);
  isLoaded = true;
}

// src/RouteListener.js
function refreshQualtrics() {
  if (window.QSI && window.QSI.API) {
    try {
      window.QSI.API.unload();
      window.QSI.API.load();
      window.QSI.API.run();
    } catch (e) {
      console.error("Qualtrics refresh failed", e);
    }
  }
}

// src/index.js
function init(context) {
  const user = context?.user || {};
  const userId = user.id || user.externalId || "anonymous";
  loadQualtrics(userId);
  if (context.router && typeof context.router.listen === "function") {
    context.router.listen(() => {
      refreshQualtrics();
    });
  }
}
export {
  init as default
};
