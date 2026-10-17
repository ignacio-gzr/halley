/* HALLEY — INTRO HERO MOBILE/TABLET v22
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
          { opacity: 0, transform: "translateY(20px)" },
          { opacity: 1, transform: "translateY(0px)" }
        ], { duration: 504, delay: i * 140, easing: easeIn, fill: "forwards" });
      });
      Promise.all(animations.map(function (a) { return a.finished; })).then(function () {
        if (!running) return;
        later(function () {
          if (!running) return;
          /* Restaurar la aparición original, con subida suave.
             La fase dos empieza desde el mismo translateY(0px) final. */
          animations.forEach(function (a, i) {
            lines[i].style.opacity = "1";
            lines[i].style.transform = "translateY(0px)";
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
            /* Medir primero los tres bloques completos, sin dividir palabras. */
            var plans = words.map(function (word, i) {
              var from = wordStarts[i], to = wordTargets[i];
              var range = document.createRange();
              var firstText = word.firstChild;
              if (!firstText || firstText.nodeType !== Node.TEXT_NODE) return null;
              var match = /\\S+/.exec(firstText.textContent);
              if (!match) return null;
              range.setStart(firstText, match.index);
              range.setEnd(firstText, match.index + match[0].length);
              var glyph = range.getBoundingClientRect();
              var k = to.width / glyph.width;
              var ox = glyph.left - from.left, oy = glyph.top - from.top;
              return { word: word, from: from, k: k,
                tx: to.left - from.left - k * ox,
                ty: to.top - from.top - k * oy };
            });
            /* Planificar la prioridad ANTES de animar. Las trayectorias
               resultantes son continuas, sin empujones en pleno vuelo. */
            function ease(p) {
              p = Math.max(0, Math.min(1, p));
              return p * p * (3 - 2 * p);
            }
            function position(plan, progress) {
              var k = 1 + (plan.k - 1) * progress;
              return { x: plan.from.left + plan.tx * progress,
                y: plan.from.top + plan.ty * progress,
                w: plan.from.width * k, h: plan.from.height * k };
            }
            function overlap(a, b) {
              var gap = 2;
              return a.x < b.x + b.w + gap && b.x < a.x + a.w + gap &&
                a.y < b.y + b.h + gap && b.y < a.y + a.h + gap;
            }
            function check(delays) {
              for (var tick = 0; tick <= 100; tick++) {
                var ms = tick * 16.62;
                var boxes = plans.map(function (plan, i) {
                  var p = ease((ms - delays[i]) / (1662 - delays[i]));
                  return position(plan, p);
                });
                if (overlap(boxes[0], boxes[1]) ||
                    overlap(boxes[0], boxes[2]) ||
                    overlap(boxes[1], boxes[2])) return false;
              }
              return true;
            }
            /* Buscar desfases que respeten el paso de los tres bloques.
               Se priorizan los menores para conservar la agilidad. */
            var delays = [0, 75, 150], found = false;
            var candidates = [0, 60, 120, 180, 240, 300, 360, 420, 480, 540, 600, 680];
            outer: for (var c = 0; c < candidates.length; c++) {
              for (var d = 0; d < candidates.length; d++) {
                var trial = [0, candidates[c], candidates[d]];
                if (check(trial)) { delays = trial; found = true; break outer; }
              }
            }
            /* Si no hay un desfase libre, priorizar la separación del
               primer y segundo bloque, que es el conflicto visible. */
            if (!found) {
              for (var e = 0; e < candidates.length; e++) {
                var trial2 = [0, candidates[e], 150];
                var safe = true;
                for (var tick2 = 0; tick2 <= 100; tick2++) {
                  var ms2 = tick2 * 16.62;
                  if (overlap(
                    position(plans[0], ease(ms2 / 1662)),
                    position(plans[1], ease((ms2 - trial2[1]) / (1662 - trial2[1])))
                  )) { safe = false; break; }
                }
                if (safe) { delays = trial2; break; }
              }
            }
            var groupMoves = plans.map(function (plan, i) {
              var delay = delays[i];
              /* Fotogramas intermedios calculados con la misma curva que
                 se utilizó para comprobar las colisiones. */
              var frames = [];
              for (var step = 0; step <= 60; step++) {
                var p = ease(step / 60);
                var k = 1 + (plan.k - 1) * p;
                frames.push({ offset: step / 60,
                  transform: "translate(" + (plan.tx * p) + "px," +
                    (plan.ty * p) + "px) scale(" + k + ")" });
              }
              return plan.word.animate(frames, {
                duration: 1662 - delay, delay: delay,
                easing: "linear", fill: "forwards"
              });
            });
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
