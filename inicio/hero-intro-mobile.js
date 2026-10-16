/* HALLEY — INTRO HERO MOBILE/TABLET v13
   Replica la secuencia desktop. Solo afecta a #HeaderM. */
(function () {
  "use strict";
  var started = false;
  var easeIn = "cubic-bezier(0.22, 1, 0.36, 1)";
  var easeMove = "cubic-bezier(0.4, 0, 0.2, 1)";
  function init() {
    if (started) return;
    var hero = document.querySelector("#HeaderM");
    if (!hero || !hero.getClientRects().length || getComputedStyle(hero).display === "none") { document.documentElement.classList.remove("halley-m-boot"); return; }
    var title = hero.querySelector(".tatsu-title-wrap h1, .tatsu-title-wrap h2, .tatsu-title-wrap h3, h1, h2, h3");
    if (!title) { document.documentElement.classList.remove("halley-m-boot"); return; }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !title.animate) { document.documentElement.classList.remove("halley-m-boot"); return; }
    var rect = title.getBoundingClientRect();
    var hr = hero.getBoundingClientRect();
    if (!rect.width || !rect.height || !hr.width) { document.documentElement.classList.remove("halley-m-boot"); return; }
    started = true;

    var modules = Array.prototype.slice.call(hero.querySelectorAll(".tatsu-module"));
    var titleModule = title.closest(".tatsu-module");
    var byClass = function (part) {
      return modules.find(function (m) { return m.classList.contains("tatsu-" + part); });
    };
    var paragraph = byClass("T0qnUyWkLdR") ||
      modules.find(function (m) { return m !== titleModule && /transform[aá].*estaci[oó]n/i.test(m.textContent || ""); });
    var gif = byClass("ZasZ9LIhVfN") ||
      modules.find(function (m) { return m !== titleModule && m.querySelector('img[data-src*=".gif"], img[data-srcset*=".gif"], img[src*=".gif"], video'); });
    var arrow = byClass("LA23h_D2J_i") ||
      modules.slice().reverse().find(function (m) { return m !== gif && m !== titleModule && m.querySelector("svg, img"); });
    var items = [paragraph, gif, arrow].filter(function (m, i, a) { return m && a.indexOf(m) === i; });
    var running = true, overlay, intro, watchdog;
    var preserveMorph = false;
    var timers = [];
    function later(fn, ms) { timers.push(window.setTimeout(fn, ms)); }
    function cleanup() {
      if (!running) return;
      running = false;
      timers.forEach(clearTimeout);
      title.classList.remove("halley-m-real-hidden", "halley-m-real-show");
      if (preserveMorph) title.classList.add("halley-m-native-retained");
      items.forEach(function (m) { m.classList.remove("halley-m-item-hidden"); });
      hero.classList.remove("halley-m-running");
      document.documentElement.classList.remove("halley-m-boot");
      if (overlay && !preserveMorph) overlay.remove();
    }
    /* Ocultar antes de comenzar: el GIF NO debe aparecer con el H1. */
    hero.classList.add("halley-m-running");
    document.documentElement.classList.remove("halley-m-boot");
    title.classList.add("halley-m-real-hidden");
    items.forEach(function (m) { m.classList.add("halley-m-item-hidden"); });

    overlay = document.createElement("div");
    overlay.className = "halley-m-overlay";
    intro = document.createElement("div");
    intro.className = "halley-m-title";
    var style = getComputedStyle(title);
    intro.style.fontFamily = style.fontFamily;
    intro.style.fontWeight = style.fontWeight;
    intro.style.letterSpacing = style.letterSpacing;
    intro.style.color = style.color;
    intro.style.textTransform = style.textTransform;
    /* Cada palabra es independiente: puede migrar de renglón durante el vuelo. */
    intro.innerHTML =
      '<span class="halley-m-line"><span class="halley-m-word">TOMÁ</span> <span class="halley-m-word">EL</span> <span class="halley-m-word halley-m-teal">CONTROL</span></span>' +
      '<span class="halley-m-line"><span class="halley-m-word">DE</span> <span class="halley-m-word">TU</span> <span class="halley-m-word">ESTACIÓN</span></span>' +
      '<span class="halley-m-line"><span class="halley-m-word">DE</span> <span class="halley-m-word">SERVICIO</span></span>';
    overlay.appendChild(intro);
    hero.appendChild(overlay);

    /* La apertura ocupa casi todo el ancho y alinea los tres renglones a la izquierda. */
    var leftStart = Math.max(14, rect.left - hr.left);
    var usable = Math.max(200, hr.width - leftStart - 14);
    var fontSize = Math.min(72, Math.max(34, hr.width * 0.125));
    intro.style.fontSize = fontSize + "px";
    intro.style.lineHeight = "1.03";
    var lines = Array.prototype.slice.call(intro.querySelectorAll(".halley-m-line"));
    var widest = Math.max.apply(Math, lines.map(function (line) { return line.getBoundingClientRect().width; }));
    if (widest > usable) {
      fontSize *= usable / widest;
      intro.style.fontSize = fontSize + "px";
    }
    var opening = intro.getBoundingClientRect();
    var startY = Math.max(14, Math.min(hr.height - opening.height - 14,
      (window.innerHeight - opening.height) / 2 - hr.top));
    if (!isFinite(startY)) startY = 25;
    intro.style.left = leftStart + "px";
    intro.style.top = startY + "px";

    /* Destino: mismo eje izquierdo del H1 nativo. */
    var destX = rect.left - hr.left;
    var destY = rect.top - hr.top;
    var dx = destX - leftStart;
    var dy = destY - startY;
    var scale = Math.min(1, rect.width / Math.max(opening.width, 1),
      rect.height / Math.max(opening.height, 1));
    /* Medir las ocho palabras en el H1 original de Swipe Pages.
       Range conserva los saltos de línea reales en cada ancho de pantalla. */
    function getFinalWordRects() {
      var found = [];
      var walker = document.createTreeWalker(title, NodeFilter.SHOW_TEXT);
      var node;
      while ((node = walker.nextNode())) {
        var re = /\S+/g;
        var match;
        while ((match = re.exec(node.textContent))) {
          var range = document.createRange();
          range.setStart(node, match.index);
          range.setEnd(node, match.index + match[0].length);
          var box = range.getBoundingClientRect();
          if (box.width && box.height) found.push(box);
        }
      }
      return found;
    }
    var words = Array.prototype.slice.call(intro.querySelectorAll(".halley-m-word"));
    var wordStarts = words.map(function (word) { return word.getBoundingClientRect(); });
    var wordTargets = getFinalWordRects();
    var canMorph = wordTargets.length === words.length &&
      wordTargets.every(function (r) { return r.width > 0 && r.height > 0; });

    function reveal(module, duration, distance) {
      if (!module || !running) return;
      var child = module.firstElementChild || module;
      /* La animación arranca oculta, antes de mostrar el módulo. */
      var a = child.animate([
        { opacity: 0, transform: "translateY(" + distance + "px)" },
        { opacity: 1, transform: "translateY(0px)" }
      ], { duration: duration, easing: easeIn, fill: "both" });
      module.classList.remove("halley-m-item-hidden");
      a.finished.then(function () {
        a.cancel();
        child.style.willChange = "auto";
        child.style.backfaceVisibility = "visible";
        child.style.webkitBackfaceVisibility = "visible";
      }).catch(function () {});
    }

    /* Desktop: 650ms de espera; líneas a 0/140/280ms durante 504ms;
       pausa 135ms; aterrizaje 1662ms (+20%);
       párrafo +780ms, flecha +984ms, GIF +1188ms desde aterrizaje.
       Las entradas mantienen la misma posición relativa en el recorrido. */
    later(function () {
      if (!running) return;
      var animations = lines.map(function (line, i) {
        return line.animate([
          { opacity: 0, transform: "translateY(20px)" },
          { opacity: 1, transform: "translateY(0px)" }
        ], { duration: 504, delay: i * 140, easing: easeIn, fill: "forwards" });
      });
      Promise.all(animations.map(function (a) { return a.finished; })).then(function () {
        if (!running) return;
        later(function () {
          if (!running) return;
          var landing;
          if (canMorph) {
            /* FLIP por palabra: movimiento, escala y cambio de renglón
               suceden juntos, sin esperar al final de la traslación. */
            var moves = words.map(function (word, i) {
              var from = wordStarts[i];
              var to = wordTargets[i];
              /* Escala isotrópica calculada con el ancho real de cada palabra
                 del H1 nativo: evita solapamientos y el ajuste brusco final. */
              /* Medir el texto interno, no solo la caja inline-block:
                 el Range del H1 nativo usa métricas de línea diferentes. */
              var textRange = document.createRange();
              textRange.selectNodeContents(word);
              var glyph = textRange.getBoundingClientRect();
              var uniformScale = to.width / (glyph.width || from.width);
              /* transform-origin: top left. Compensar el offset del texto
                 dentro de la caja para que no haya salto vertical al cambiar al H1 real. */
              var offsetX = glyph.left - from.left;
              var offsetY = glyph.top - from.top;
              var moveX = to.left - glyph.left - offsetX * (uniformScale - 1);
              var moveY = to.top - glyph.top - offsetY * (uniformScale - 1);
              /* Trayectoria con inercia: arranque suave, aceleración
                 adicional en el último tramo y frenado progresivo.
                 Todos los puntos usan el mismo progreso para cada palabra. */
              function pose(progress) {
                var size = 1 + (uniformScale - 1) * progress;
                return "translate(" + (moveX * progress) + "px," +
                  (moveY * progress) + "px) scale(" + size + ")";
              }
              return word.animate([
                { offset: 0,    transform: pose(0),    easing: "cubic-bezier(.42,0,.64,1)" },
                { offset: 0.68, transform: pose(0.62), easing: "cubic-bezier(.28,0,.18,1)" },
                { offset: 0.84, transform: pose(0.79), easing: "cubic-bezier(.25,0,.62,1)" },
                { offset: 0.94, transform: pose(0.97), easing: "cubic-bezier(.12,0,.2,1)" },
                { offset: 1,    transform: pose(1) }
              ], { duration: 1662, easing: "linear", fill: "forwards" });
            });
            landing = { finished: Promise.all(moves.map(function (m) { return m.finished; })) };
          } else {
            /* Fallback si Swipe Pages cambia la estructura del H1. */
            landing = intro.animate([
              { transform: "translate(0px,0px) scale(1)", opacity: 1 },
              { transform: "translate(" + dx + "px," + dy + "px) scale(" + scale + ")", opacity: 1 }
            ], { duration: 1662, easing: easeMove, fill: "forwards" });
          }
          later(function () { reveal(paragraph, 825, 10); }, 780);
          later(function () { reveal(arrow, 825, 10); }, 984);
          later(function () { reveal(gif, 1403, 14); }, 1188);
          /* Reorganizar de tres líneas a la disposición nativa de dos
             con una transición breve al finalizar el recorrido. */
          landing.finished.then(function () {
            if (!running) return;
            if (canMorph) {
              /* Evitar el salto al sustituir dos textos con métricas diferentes.
                 Conservar el overlay transformado como representación visible final. */
              preserveMorph = true;
              title.classList.add("halley-m-native-retained");
              later(cleanup, 1440);
            } else {
              title.classList.add("halley-m-real-show");
              intro.animate([{ opacity: 1 }, { opacity: 0 }],
                { duration: 180, easing: "ease-out", fill: "forwards" });
              later(function () {
                title.classList.remove("halley-m-real-hidden", "halley-m-real-show");
                if (overlay) overlay.remove();
                later(cleanup, 1250);
              }, 190);
            }
          }).catch(cleanup);
        }, 135);
      }).catch(cleanup);
    }, 650);
    /* Ante un cambio de ancho, restaurar el H1 nativo para respetar
       la maquetación responsive real de Swipe Pages. */
    var initialWidth = window.innerWidth;
    window.addEventListener("resize", function () {
      if (!preserveMorph || window.innerWidth === initialWidth) return;
      preserveMorph = false;
      title.classList.remove("halley-m-native-retained");
      if (overlay) overlay.remove();
    });
    watchdog = window.setTimeout(cleanup, 6500);
    timers.push(watchdog);
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else init();
  window.addEventListener("load", init, { once: true });
})();
