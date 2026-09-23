/* tutti.frutti · Google Analytics (GA4).
   Se carga recién cuando la persona acepta cookies en el banner de
   cookie-consent.js — nunca antes, así no se manda ningún dato sin permiso. */
(function () {
  var GA_ID = "G-ZVYPER2DH4";
  var loaded = false;

  function loadGoogleAnalytics() {
    if (loaded) return;
    loaded = true;

    var script = document.createElement("script");
    script.async = true;
    script.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_ID;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag("js", new Date());
    gtag("config", GA_ID);
  }

  if (window.getAdsConsent && window.getAdsConsent() === "accepted") {
    loadGoogleAnalytics();
  }

  window.addEventListener("ads-consent-changed", function (e) {
    if (e.detail === "accepted") loadGoogleAnalytics();
  });
})();
