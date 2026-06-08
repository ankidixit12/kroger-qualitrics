const ZONE_URL = "https://zn2ukynhmxdi4ug6f-krogerxmit.siteintercept.qualtrics.com/SIE/?Q_ZID=ZN_2uKyNHmXdi4UG6f";

let isLoaded = false;

export function loadQualtrics(userId) {
  if (isLoaded) return;

  window.QSI = window.QSI || {};
  window.QSI.config = {
    externalReference: userId
  };

  const script = document.createElement('script');
  script.src = ZONE_URL;
  script.async = true;
  script.crossOrigin = 'anonymous';

  document.body.appendChild(script);
  isLoaded = true;
}
