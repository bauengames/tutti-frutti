/* tutti.frutti · Google Analytics (GA4) con Consent Mode v2.
   - En el Espacio Económico Europeo, el Reino Unido y Suiza todo arranca denegado hasta que la
     persona elige en el aviso de Google (Privacidad y mensajes de AdSense). Para que ese aviso
     actualice el consentimiento, en AdSense tiene que estar activado el modo de consentimiento.
   - En el resto del mundo arranca habilitado; si la persona toca "Rechazar" en nuestro banner
     (cookie-consent.js), se pasa a denegado.
   Se carga antes que cookie-consent.js y que AdSense. */
(function () {
  var GA_ID = "G-ZVYPER2DH4";
  var CONSENT_REGIONS = [
    "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR", "HU", "IE",
    "IT", "LV", "LT", "LU", "MT", "NL", "PL", "PT", "RO", "SK", "SI", "ES", "SE",
    "IS", "LI", "NO", "GB", "CH",
  ];

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;

  gtag("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied",
    wait_for_update: 500,
    region: CONSENT_REGIONS,
  });
  gtag("consent", "default", {
    ad_storage: "granted",
    ad_user_data: "granted",
    ad_personalization: "granted",
    analytics_storage: "granted",
  });

  gtag("js", new Date());
  gtag("config", GA_ID);

  var script = document.createElement("script");
  script.async = true;
  script.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_ID;
  document.head.appendChild(script);
})();
