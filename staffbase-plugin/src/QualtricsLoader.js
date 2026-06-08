const ZONE_URL = 'https://zn2ukynhmxdi4ug6f-krogerxmit.siteintercept.qualtrics.com/SIE/?Q_ZID=ZN_2uKyNHmXdi4UG6f';
const ROOT_ID = 'qualtrics-intercept-root';
const ZONE_DIV_ID = 'ZN_2uKyNHmXdi4UG6f';
let isLoaded = false;

export function ensureInterceptRoot() {
  let root = document.getElementById(ROOT_ID);
  if (root) return root;

  root = document.createElement('div');
  root.id = ROOT_ID;
  root.style.position = 'fixed';
  root.style.bottom = '18px';
  root.style.right = '18px';
  root.style.zIndex = '2147483647';
  root.style.pointerEvents = 'none';
  root.style.minWidth = '240px';
  root.style.maxWidth = '320px';
  root.style.borderRadius = '12px';
  root.style.background = 'rgba(255,255,255,0.95)';
  root.style.boxShadow = '0 20px 50px rgba(15,23,42,0.12)';
  root.style.padding = '12px';
  root.style.fontFamily = 'system-ui, sans-serif';
  root.style.fontSize = '12px';
  root.style.color = '#111827';
  root.style.lineHeight = '1.4';
  root.innerText = 'Qualtrics intercept root loaded. The Qualtrics script will run on this page.';

  document.body.appendChild(root);
  return root;
}

function addZoneDiv(targetSelector) {
  // Ensure the Qualtrics zone div exists where Qualtrics expects it
  let existing = document.getElementById(ZONE_DIV_ID);
  if (existing) return existing;

  const div = document.createElement('div');
  div.id = ZONE_DIV_ID;
  div.innerHTML = '<!--DO NOT REMOVE-CONTENTS PLACED HERE-->';

  if (targetSelector) {
    try {
      const el = document.querySelector(targetSelector);
      if (el) {
        el.appendChild(div);
        return div;
      }
    } catch (e) {
      console.warn('Invalid selector for embedded intercept:', targetSelector, e);
    }
  }

  // default append to body (near intercept root)
  const root = document.getElementById(ROOT_ID) || ensureInterceptRoot();
  root.appendChild(div);
  return div;
}

export function loadQualtrics(userId) {
  if (isLoaded) return;

  // detect test intercepts via URL params
  const params = new URLSearchParams(window.location.search);
  const isPopUp = params.has('QualtricsTest_PopUp');
  const isFeedbackButton = params.has('QualtricsTest_FeedbackButton');
  const isEmbedded = params.has('QualtricsTest_Embedded');
  const embeddedSelector = params.get('qualtricsSelector') || null;

  // Prepare DOM roots
  ensureInterceptRoot();
  if (isEmbedded) {
    addZoneDiv(embeddedSelector);
  } else {
    // always ensure zone div exists for popups/feedback
    addZoneDiv();
  }

  window.QSI = window.QSI || {};
  window.QSI.config = Object.assign(window.QSI.config || {}, {
    externalReference: userId,
    interceptRoot: `#${ROOT_ID}`,
    interceptTest: isPopUp ? 'popUp' : isFeedbackButton ? 'feedbackButton' : isEmbedded ? 'embedded' : undefined
  });

  const existingScript = document.querySelector(`script[src='${ZONE_URL}']`);
  if (existingScript) {
    isLoaded = true;
    // If script already present, try to refresh/run API if available
    if (window.QSI && window.QSI.API && typeof window.QSI.API.run === 'function') {
      try { window.QSI.API.run(); } catch (e) { console.warn('QSI.API.run failed', e); }
    }
    return;
  }

  const script = document.createElement('script');
  script.src = ZONE_URL;
  script.async = true;
  script.crossOrigin = 'anonymous';
  script.onload = () => {
    console.log('Qualtrics intercept script loaded.');
  };
  script.onerror = (event) => {
    console.error('Qualtrics intercept script failed to load.', event);
  };

  document.body.appendChild(script);
  isLoaded = true;
}
