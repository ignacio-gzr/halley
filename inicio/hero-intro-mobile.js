/* Halley | Intro mobile + tablet. Independiente de #HeaderD. */
(function () {
  "use strict";
  var SELECTOR = "#HeaderM";
  var started = false;

  function init() {
    if (started) return;
    var hero = document.querySelector(SELECTOR);
    if (!hero) return;
    /* Swipe Pages puede conservar ambas secciones en el DOM. */
    if (getComputedStyle(hero).display === "none" || !hero.getClientRects().length) return;
    var title = hero.querySelector(".tatsu-title-wrap h1, .tatsu-title-wrap h2, .tatsu-title-wrap h3, h1, h2, h3");
    if (!title) return;
    started = true;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
        !Element.prototype.animate) return;

    var titleModule = title.closest(".tatsu-module") || title.parentElement;
    var modules = Array.prototype.slice.call(hero.querySelectorAll(".tatsu-module"));
    var paragraph = modules.find(function (m) { return m.className.indexOf("tatsu-T0qnUyWkLdR") !== -1; });
    var gif = modules.find(function (m) { return m.className.indexOf("tatsu-IC9qly8EPmS") !== -1; });
    var arrow = modules.find(function (m) { return m.className.indexOf("tatsu-LA23h_D2J_i") !== -1; });
    /* Si cambian las clases generadas, buscamos por contenido. */
    if (!paragraph) paragraph = modules.find(function (m) { return /Transformá la gestión/i.test(m.textContent || ""); });
    if (!gif) gif = modules.find(function (m) { return m.querySelector("img, video") && m !== titleModule; });
    if (!arrow) arrow = modules.slice().reverse().find(function (m) { return m !== gif && m.querySelector("svg, img"); });
    var reveals = [paragraph, gif, arrow].filter(function (m, i, a) { return m && a.indexOf(m) === i; });

    var rect = title.getBoundingClientRect();
    var heroRect = hero.getBoundingClientRect();
    var cs = getComputedStyle(title);
    if (!rect.width || !rect.height) return;
    hero.classList.add("halley-m-intro-running");
    title.classList.add("halley-m-title-real");
    reveals.forEach(function (m) { m.classList.add("halley-m-pending"); });

    var layer = document.createElement("div");
    layer.className = "halley-m-intro-layer";
    var intro = document.createElement("div");
    intro.className = "halley-m-intro-title";
    intro.style.fontFamily = cs.fontFamily;
    intro.style.fontWeight = cs.fontWeight;
    intro.style.letterSpacing = cs.letterSpacing;
    intro.style.color = cs.color;
    intro.style.textTransform = cs.textTransform;
    intro.innerHTML = '<span class="halley-m-line">TOMÁ EL <span class="halley-m-accent">CONTROL</span></span>' +
      '<span class="halley-m-line">DE TU ESTACIÓN</span>' +
      '<span class="halley-m-line">DE SERVICIO</span>';
    layer.appendChild(intro);
    hero.appendChild(layer);

    /* Medimos el título de apertura a su tamaño natural, sin cortes de línea. */
    var available = Math.max(240, Math.min(window.innerWidth, heroRect.width) - 24);
    var size = Math.min(62, Math.max(31, window.innerWidth * 0.105));
    intro.style.fontSize = size + "px";
    intro.style.lineHeight = "1.03";
    var lines = Array.prototype.slice.call(intro.querySelectorAll(".halley-m-line"));
    var maxWidth = Math.max.apply(Math, lines.map(function (el) { return el.getBoundingClientRect().width; }));
    if (maxWidth > available) {
      size *= available / maxWidth;
      intro.style.fontSize = size + "px";
    }
    var w = intro.getBoundingClientRect().width;
    var h = intro.getBoundingClientRect().height;
    var startX = (heroRect.width - w) / 2;
    /* Centrado en el área visible de la pantalla, relativo al hero. */
    var startY = Math.max(10, Math.min(heroRect.height - h - 10,
      (window.innerHeight - h) / 2 - heroRect.top));
    if (!isFinite(startY)) startY = 40;
    intro.style.left = startX + "px";
    intro.style.top = startY + "px";

    var finalX = rect.left - heroRect.left;
    var finalY = rect.top - heroRect.top;
    var scale = Math.min(rect.width / Math.max(w, 1), rect.height / Math.max(h, 1), 1);
    var dx = finalX - startX;
    var dy = finalY - startY;
    var cleaned = false;
    function cleanup() {
      if (cleaned) return;
      cleaned = true;
      title.classList.remove("halley-m-title-real");
      reveals.forEach(function (m) { m.classList.remove("halley-m-pending"); });
      hero.classList.remove("halley-m-intro-running");
      layer.remove();
    }
    function show(module, duration, delay) {
      if (!module) return;
      window.setTimeout(function () {
        module.classList.remove("halley-m-pending");
        var inner = module.firstElementChild || module;
        inner.animate([
          { opacity: 0, transform: "translateY(12px)" },
          { opacity: 1, transform: "translateY(0)" }
        ], { duration: duration, easing: "cubic-bezier(.22,1,.36,1)", fill: "none" });
      }, delay);
    }

    /* Aparición de renglones, uno por uno. */
    lines.forEach(function (line, i) {
      line.animate([
        { opacity: 0, transform: "translateY(18px)" },
        { opacity: 1, transform: "translateY(0)" }
      ], { delay: 260 + i * 220, duration: 650,
           easing: "cubic-bezier(.22,1,.36,1)", fill: "both" });
    });

    window.setTimeout(function () {
      var move = intro.animate([
        { transform: "translate(0,0) scale(1)", opacity: 1 },
        { transform: "translate(" + dx + "px," + dy + "px) scale(" + scale + ")", opacity: 0 }
      ], { duration: 1100, easing: "cubic-bezier(.22,1,.36,1)", fill: "forwards" });
      /* Cruce suave: el H1 nativo conserva su disposición responsive de 2 líneas. */
      window.setTimeout(function () {
        title.classList.add("halley-m-title-reveal");
      }, 760);
      move.onfinish = function () {
        title.classList.remove("halley-m-title-real", "halley-m-title-reveal");
        layer.remove();
        show(paragraph, 825, 50);
        show(gif, 1403, 230);
        show(arrow, 825, 510);
        window.setTimeout(cleanup, 2050);
      };
    }, 1350);
    window.setTimeout(cleanup, 6500);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
  window.addEventListener("load", init, { once: true });
})();
