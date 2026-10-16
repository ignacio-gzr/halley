/* =========================================================
   HALLEY — HERO INTRO MOBILE / TABLET (#HeaderM)
   Secuencia y tiempos basados en la versión desktop.
   No altera #HeaderD ni los estilos globales del menú.
   ========================================================= */
(function () {
  "use strict";
  var initialized = false;
  var easeOut = "cubic-bezier(0.22, 1, 0.36, 1)";
  var easeMove = "cubic-bezier(0.4, 0, 0.2, 1)";

  function init() {
    if (initialized) return;
    var hero = document.querySelector("#HeaderM");
    if (!hero || !hero.getClientRects().length || getComputedStyle(hero).display === "none") return;
    var title = hero.querySelector(".tatsu-title-wrap h1, .tatsu-title-wrap h2, .tatsu-title-wrap h3, h1, h2, h3");
    if (!title) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
        !Element.prototype.animate) return;
    initialized = true;

    var modules = Array.prototype.slice.call(hero.querySelectorAll(".tatsu-module"));
    var titleModule = title.closest(".tatsu-module");
    var others = modules.filter(function (m) {
      return m !== titleModule && !m.contains(title) && !title.contains(m);
    });
    var paragraph = others.find(function (m) { return m.classList.contains("tatsu-T0qnUyWkLdR"); });
    var gif = others.find(function (m) { return m.classList.contains("tatsu-IC9qly8EPmS"); });
    var arrow = others.find(function (m) { return m.classList.contains("tatsu-LA23h_D2J_i"); });
    if (!paragraph) paragraph = others.find(function (m) { return /transforma tu estaci[oó]n/i.test(m.textContent || ""); });
    if (!gif) gif = others.find(function (m) { return !!m.querySelector('img[src*=".gif"], video'); });
    if (!arrow) arrow = others.slice().reverse().find(function (m) { return m !== gif && !!m.querySelector("svg, img"); });
    function unique(items) { return items.filter(function (x, i) { return x && items.indexOf(x) === i; }); }
    var textModules = others.filter(function (m) { return m !== gif && m !== arrow; });
    if (paragraph && textModules.indexOf(paragraph) < 0) textModules.push(paragraph);

    /* Ocultamos los módulos ANTES de la espera inicial: el GIF nunca
       debe aparecer junto con el título ni parpadear durante la intro. */
    hero.classList.add("halley-m-running");
    title.classList.add("halley-m-original-hidden");
    others.forEach(function (m) { m.classList.add("halley-m-hidden"); });

    var layer, intro, done = false;
    var anims = [];
    function cleanup() {
      if (done) return;
      done = true;
      anims.forEach(function (a) { try { a.cancel(); } catch (e) {} });
      title.classList.remove("halley-m-original-hidden", "halley-m-original-reveal");
      others.forEach(function (m) {
        m.classList.remove("halley-m-hidden");
        m.style.removeProperty("opacity");
        m.style.removeProperty("visibility");
      });
      hero.classList.remove("halley-m-running");
      if (layer) layer.remove();
    }
    function animateInner(module, duration, y) {
      if (!module) return;
      module.classList.remove("halley-m-hidden");
      var inner = module.firstElementChild || module;
      var a = inner.animate([
        { opacity: 0, transform: "translateY(" + y + "px)" },
        { opacity: 1, transform: "translateY(0px)" }
      ], { duration: duration, easing: easeOut, fill: "both" });
      anims.push(a);
      a.finished.then(function () {
        a.cancel();
        inner.style.transform = "none";
        inner.style.filter = "none";
        inner.style.willChange = "auto";
        if (module === gif) {
          inner.style.backfaceVisibility = "visible";
          inner.style.webkitBackfaceVisibility = "visible";
        }
      }).catch(function () {});
    }

    function begin() {
      if (done || !hero.isConnected) { cleanup(); return; }
      var hr = hero.getBoundingClientRect();
      var tr = title.getBoundingClientRect();
      var cs = getComputedStyle(title);
      if (!hr.width || !tr.width) { cleanup(); return; }

      layer = document.createElement("div");
      layer.className = "halley-m-layer";
      intro = document.createElement("div");
      intro.className = "halley-m-intro-title";
      intro.style.fontFamily = cs.fontFamily;
      intro.style.fontWeight = cs.fontWeight;
      intro.style.letterSpacing = cs.letterSpacing;
      intro.style.color = cs.color;
      intro.style.textTransform = cs.textTransform;
      intro.innerHTML =
        '<span class="halley-m-line">TOMÁ EL <span class="halley-m-accent">CONTROL</span></span>' +
        '<span class="halley-m-line">DE TU ESTACIÓN</span>' +
        '<span class="halley-m-line">DE SERVICIO</span>';
      layer.appendChild(intro);
      hero.appendChild(layer);

      /* Tres líneas grandes y alineadas a la IZQUIERDA. */
      var lines = Array.prototype.slice.call(intro.querySelectorAll(".halley-m-line"));
      var maxAvailable = Math.max(180, Math.min(hr.width, window.innerWidth) - 32);
      var fontSize = Math.min(74, Math.max(34, window.innerWidth * 0.125));
      intro.style.fontSize = fontSize + "px";
      var widest = Math.max.apply(Math, lines.map(function (l) { return l.scrollWidth; }));
      if (widest > maxAvailable) {
        fontSize *= maxAvailable / widest;
        intro.style.fontSize = fontSize + "px";
      }
      var iw = intro.getBoundingClientRect().width;
      var ih = intro.getBoundingClientRect().height;
      var startX = Math.max(16, (hr.width - iw) / 2);
      var startY = Math.max(18, Math.min(hr.height - ih - 18,
        (window.innerHeight - ih) / 2 - hr.top));
      if (!Number.isFinite(startY)) startY = 30;
      intro.style.left = startX + "px";
      intro.style.top = startY + "px";

      var targetX = tr.left - hr.left;
      var targetY = tr.top - hr.top;
      var scale = Math.min(tr.width / Math.max(iw, 1), tr.height / Math.max(ih, 1), 1);
      var dx = targetX - startX;
      var dy = targetY - startY;

      /* Desktop: renglones 0 / 140 / 280 ms, 504 ms de duración. */
      var entrances = lines.map(function (line, i) {
        var a = line.animate([
          { opacity: 0, transform: "translateY(20px)" },
          { opacity: 1, transform: "translateY(0px)" }
        ], { duration: 504, delay: i * 140, easing: easeOut, fill: "forwards" });
        anims.push(a);
        return a.finished;
      });
      Promise.all(entrances).then(function () {
        return new Promise(function (resolve) { setTimeout(resolve, 135); });
      }).then(function () {
        if (done) return;
        /* Desktop: aterrizaje de 1385 ms. El texto/GIF/flecha
           comienzan 650 / 990 / 820 ms después del aterrizaje. */
        var landing = intro.animate([
          { opacity: 1, transform: "translate(0,0) scale(1)" },
          { opacity: 1, transform: "translate(" + dx + "px," + dy + "px) scale(" + scale + ")" }
        ], { duration: 1385, easing: easeMove, fill: "forwards" });
        anims.push(landing);

        setTimeout(function () {
          if (done) return;
          textModules.forEach(function (m) { animateInner(m, 825, 10); });
        }, 650);
        setTimeout(function () {
          if (done) return;
          animateInner(arrow, 825, 10);
        }, 820);
        setTimeout(function () {
          if (done) return;
          animateInner(gif, 1403, 14);
        }, 990);

        /* El H1 real tiene un layout distinto (2 líneas):
           transición discreta al final, no salto instantáneo. */
        setTimeout(function () {
          if (done) return;
          title.classList.add("halley-m-original-reveal");
          intro.classList.add("halley-m-intro-fade");
        }, 1135);

        return landing.finished.then(function () {
          if (done) return;
          title.classList.remove("halley-m-original-hidden", "halley-m-original-reveal");
          layer.remove();
          layer = null;
          /* Esperar que termine la animación del GIF antes de liberar capas. */
          setTimeout(cleanup, 1100);
        });
      }).catch(cleanup);
    }

    /* Igual que desktop: 650 ms de pausa inicial. */
    setTimeout(begin, 650);
    setTimeout(cleanup, 6500);
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else init();
  window.addEventListener("load", init, { once: true });
})();
