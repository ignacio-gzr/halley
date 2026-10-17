/* HALLEY — INTRO HERO MOBILE/TABLET v20
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
    /* Tres grupos indivisibles: sus palabras jamás se separan. */
    intro.innerHTML =
      '<span class="halley-m-line"><span class="halley-m-word">TOMÁ EL <span class="halley-m-teal">CONTROL</span></span></span>' +
      '<span class="halley-m-line"><span class="halley-m-word">DE TU</span></span>' +
      '<span class="halley-m-line"><span class="halley-m-word">ESTACIÓN DE SERVICIO</span></span>';
    overlay.appendChild(intro);
    hero.appendChild(overlay);

    /* La apertura ocupa casi todo el ancho y alinea los tres renglones a la izquierda. */
    var leftStart = Math.max(14, rect.left - hr.left);
    var usable = Math.max(200, hr.width - leftStart - 14);
    var fontSize = Math.min(72, Math.max(34, hr.width * 0.125));
    intro.style.fontSize = fontSize + "px";
    /* Interlineado de apertura, independiente de las coordenadas
       tipográficas originales usadas para el aterrizaje. */
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
    var nativeWords = getFinalWordRects();
    var groupIndices = [[0, 1, 2], [3, 4], [5, 6, 7]];
    /* El destino de cada grupo se obtiene del primer vocablo y del
       ancho tipográfico de la frase completa. No se parte el grupo. */
    /* Cada grupo conserva sus distancias tipográficas internas:
       el ancho final se calcula escalando la frase completa, no
       estimando por separado cada palabra con Canvas. */
    var wordTargets = groupIndices.map(function (indices) {
      var first = nativeWords[indices[0]];
      return first ? { left: first.left, top: first.top,
        width: first.width, height: first.height,
        firstIndex: indices[0] } : null;
    });
    var canMorph = nativeWords.length === 8 && wordTargets.every(function (r) {
      return r && r.width > 0 && r.height > 0;
    });

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
          { opacity: 0 },
          { opacity: 1 }
        ], { duration: 504, delay: i * 140, easing: easeIn, fill: "forwards" });
      });
      Promise.all(animations.map(function (a) { return a.finished; })).then(function () {
        if (!running) return;
        later(function () {
          if (!running) return;
          /* La aparición solo cambia opacidad: las tres frases mantienen
             idénticas coordenadas antes y después de esta fase. */
          animations.forEach(function (a, i) {
            lines[i].style.opacity = "1";
            a.cancel();
          });
          /* Medir el origen DESPUÉS de cerrar la primera animación,
             no antes: así ambos movimientos comparten coordenadas. */
          wordStarts = words.map(function (word) {
            return word.getBoundingClientRect();
          });
          var landing;
          if (canMorph) {
            /* Tres bloques horizontales rígidos. No hay correcciones
               por fotograma ni desplazamientos individuales de palabras.
               El primer vocablo determina la escala exacta de cada bloque. */
            var groupMoves = words.map(function (word, i) {
              var from = wordStarts[i];
              var to = wordTargets[i];
              var range = document.createRange();
              var firstText = word.firstChild;
              if (!firstText || firstText.nodeType !== Node.TEXT_NODE) return null;
              var firstMatch = /\S+/.exec(firstText.textContent);
              if (!firstMatch) return null;
              range.setStart(firstText, firstMatch.index);
              range.setEnd(firstText, firstMatch.index + firstMatch[0].length);
              var firstGlyph = range.getBoundingClientRect();
              var scaleEnd = to.width / firstGlyph.width;
              var offsetX = firstGlyph.left - from.left;
              var offsetY = firstGlyph.top - from.top;
              var tx = to.left - from.left - scaleEnd * offsetX;
              var ty = to.top - from.top - scaleEnd * offsetY;
              var finalTransform = "translate(" + tx + "px," + ty +
                "px) scale(" + scaleEnd + ")";
              /* Ceder paso por bloques con un desfase mínimo, sin
                 cambios repentinos de carril ni saltos de posición. */
              var delay = [0, 75, 150][i];
              return word.animate([
                { transform: "translate(0px,0px) scale(1)" },
                { transform: finalTransform }
              ], { duration: 1662 - delay, delay: delay,
                   easing: "cubic-bezier(.4,0,.2,1)", fill: "forwards" });
            }).filter(Boolean);
            landing = { finished: Promise.all(groupMoves.map(function (a) {
              return a.finished;
            })) };
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
