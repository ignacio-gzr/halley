/* ##################################################
   HALLEY UI — ÍNDICE GENERAL DE JAVASCRIPT

   01. FUENTE DE PRECIOS — GOOGLE SHEETS
   02. CONFIGURACIÓN INICIAL DE TABLA DE PLANES
   03. COPYRIGHT AUTOMÁTICO
   04. HEADER FIJO
   05. SISTEMA DE TOOLTIPS
   06. CONFIGURACIÓN DE PRECIOS Y FUNCIONES
   07. CARGA Y APLICACIÓN DE PRECIOS
   08. NORMALIZACIÓN ROBUSTA DE TABLA DE PLANES
################################################## */

var HALLEY_GOOGLE_SHEET_CSV =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vRV0-nqa9uYt6K_M_-yBEk6CgeCYeXAVtsA_kNvLkZ0gD9hsOlZBhUCoh53D8IfBZjBPPXp02Sb4NSv/pub?gid=1886434563&single=true&output=csv";

var halleyPrecios = {
    estado: "cargando",
    planes: {
        premium: { mensual: null, anual: null, ahorroAnual: null },
        plus: { mensual: null, anual: null, ahorroAnual: null },
        basico: { mensual: null, anual: null, ahorroAnual: null }
    },
    adicionales: {
        puestoAdicional: { mensual: null, anual: null },
        controladorSurtidores: { mensual: null, anual: null },
        onAxion: { mensual: null, anual: null },
        pumaPris: { mensual: null, anual: null }
    }
};

document.documentElement.classList.add("halley-precios-cargando");

(function () {
    var estilo = document.createElement("style");
    estilo.id = "halley-estilo-carga-precios";
    estilo.textContent = `
        html.halley-precios-cargando #planesHalley h3.tatsu-pricing-title,
        html.halley-precios-cargando #planesHalley .halley-precio-opcional,
        html.halley-precios-cargando #planesHalley .halley-precio-aclaracion,
        html.halley-precios-cargando #planesHalley .halley-ahorro-anual {
            visibility: hidden !important;
        }
    `;
    (document.head || document.documentElement).appendChild(estilo);
})();

/* ##################################################
   02. HALLEY UI — CONFIGURACIÓN INICIAL
   DE TABLA DE PLANES
################################################## */

(function () {
    var intervaloMensual = null;
    var observadorMensual = null;
    var cantidadIntentos = 0;
    var maximoIntentos = 120;
    var intervaloIntentos = 20;
    var inicializacionTerminada = false;

    function obtenerBotonMensual() {
        return document.querySelector('#planesHalley [data-interval="monthly"]');
    }

    function mensualEstaActivo() {
        var botonMensual = obtenerBotonMensual();
        return !!botonMensual && botonMensual.classList.contains("tatsu-pricing-table-tab-active");
    }

    function finalizarInicializacion() {
        if (inicializacionTerminada) return;
        inicializacionTerminada = true;
        if (intervaloMensual) {
            clearInterval(intervaloMensual);
            intervaloMensual = null;
        }
        if (observadorMensual) {
            observadorMensual.disconnect();
            observadorMensual = null;
        }
    }

    function activarBotonMensual() {
        if (inicializacionTerminada) return;
        var botonMensual = obtenerBotonMensual();
        if (!botonMensual) return;
        if (window.jQuery) window.jQuery(botonMensual).trigger("click");
        else botonMensual.click();
    }

    function intentarSeleccionarMensual() {
        if (inicializacionTerminada) return;
        if (mensualEstaActivo()) {
            finalizarInicializacion();
            return;
        }
        if (!obtenerBotonMensual()) return;
        cantidadIntentos++;
        activarBotonMensual();
        window.requestAnimationFrame(function () {
            if (mensualEstaActivo()) finalizarInicializacion();
        });
    }

    function iniciarIntentosMensual() {
        if (inicializacionTerminada) return;
        if (mensualEstaActivo()) {
            finalizarInicializacion();
            return;
        }
        if (intervaloMensual) return;
        intentarSeleccionarMensual();
        intervaloMensual = window.setInterval(function () {
            if (inicializacionTerminada) return;
            if (mensualEstaActivo()) {
                finalizarInicializacion();
                return;
            }
            if (cantidadIntentos >= maximoIntentos) {
                finalizarInicializacion();
                return;
            }
            intentarSeleccionarMensual();
        }, intervaloIntentos);
    }

    observadorMensual = new MutationObserver(function () {
        if (inicializacionTerminada) return;
        if (mensualEstaActivo()) {
            finalizarInicializacion();
            return;
        }
        iniciarIntentosMensual();
    });

    if (document.documentElement) {
        observadorMensual.observe(document.documentElement, { childList: true, subtree: true });
    }

    iniciarIntentosMensual();
    document.addEventListener("DOMContentLoaded", function () {
        if (!inicializacionTerminada) iniciarIntentosMensual();
    });
    window.addEventListener("load", function () {
        if (inicializacionTerminada) return;
        if (mensualEstaActivo()) {
            finalizarInicializacion();
            return;
        }
        iniciarIntentosMensual();
        window.setTimeout(function () { if (!inicializacionTerminada) intentarSeleccionarMensual(); }, 50);
        window.setTimeout(function () { if (!inicializacionTerminada) intentarSeleccionarMensual(); }, 150);
        window.setTimeout(function () { if (!inicializacionTerminada) intentarSeleccionarMensual(); }, 400);
    });
})();

/* ##################################################
   03. HALLEY UI — COPYRIGHT AUTOMÁTICO
################################################## */

(function () {
    function actualizarCopyright() {
        var texto = document.querySelector("#copyright-halley");
        if (!texto) return;
        texto.innerHTML = new Date().getFullYear() + " © Halley - Un producto de Komeet S.A. - Buenos Aires, Argentina";
    }
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", actualizarCopyright);
    else actualizarCopyright();
})();

/* ##################################################
   04. HALLEY UI — HEADER FIJO
################################################## */

(function () {
    function iniciarHeaderFijo() {
        var header = document.querySelector(".tatsu-header");
        if (!header) return;
        function menuEstaAbierto() {
            return !!document.querySelector(
                ".tatsu-mobile-menu-wrap.open, .tatsu-mobile-menu-wrap.active, .tatsu-mobile-menu.open, .tatsu-mobile-menu.active, .tatsu-mobile-navigation.open, .tatsu-mobile-navigation.active"
            );
        }
        function actualizarHeader() {
            if (window.scrollY > 30 || menuEstaAbierto()) header.classList.add("header-scrolled");
            else header.classList.remove("header-scrolled");
        }
        window.addEventListener("scroll", actualizarHeader, { passive: true });
        document.addEventListener("click", function () { window.setTimeout(actualizarHeader, 100); });
        window.setInterval(actualizarHeader, 300);
        actualizarHeader();
    }
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciarHeaderFijo);
    else iniciarHeaderFijo();
})();

/* ##################################################
   05. HALLEY UI — SISTEMA DE TOOLTIPS
################################################## */

var halleyTooltips = [
    { selector: ".tatsu-pricing-icard-text", buscar: "Instalación y configuración", tooltip: "Incluye la instalación inicial de Halley y la configuración necesaria para dejar el sistema preparado para operar." },
    { selector: ".tatsu-pricing-icard-text", buscar: "Facturación electrónica / Controlador fiscal / Comandera", tooltip: "Facturá directamente desde Halley, sin necesidad de operar fuera del sistema. Podés emitir comprobantes mediante facturación electrónica de ARCA, controlador o impresora fiscal, o facturación electrónica a través de una comandera" },
    { selector: ".tatsu-pricing-icard-text", buscar: "Contratación Protegida", tooltip: "Si dentro de los primeros 30 días decidís no continuar con Halley, te reintegraremos el 100% del importe abonado. Sin explicaciones ni trámites" },
    { selector: ".tatsu-pricing-icard-text.halley-opcional-disponible", buscar: "Puesto de trabajo adicional", tooltip: "En caso de que los 4 puestos incluidos en el plan no te alcancen podés añadir puestos adicionales de Playa / Mini / Backoffice. El precio es por cada puesto adicional. (El servidor no cuenta como puesto de trabajo)" },
    { selector: ".tatsu-pricing-icard-text.halley-opcional-disponible", buscar: "Integración con Controlador de Surtidores", tooltip: "Obtené y visualizá los despachos automáticamente en los puntos de venta, obtené los aforadores automáticamente y más. (El precio es por cada establecimiento)" },
    { selector: ".tatsu-pricing-icard-text.halley-opcional-disponible", buscar: "Integración con ON Axion", tooltip: "Aplicá los descuentos y promociones de ON Axion automáticamente. Registrá y vinculá automáticamente todos los descuentos, y más. (El precio es por cada establecimiento)" },
    { selector: ".tatsu-pricing-icard-text.halley-opcional-disponible", buscar: "Integración con Puma PRIS", tooltip: "Cobrá con Puma Pris dentro de Halley. Chequeá la acreditación de los pagos. Aplicá los descuentos y promociones de Pris automáticamente y más. (El precio es por cada establecimiento)" },
    { selector: ".tatsu-pricing-icard-text.halley-opcional-no-disponible", buscar: "Integración con Controlador de Surtidores", tooltip: "Función no disponible en el plan Básico" },
    { selector: ".tatsu-pricing-icard-text.halley-opcional-no-disponible", buscar: "Integración con ON Axion", tooltip: "Función no disponible en el plan Básico" },
    { selector: ".tatsu-pricing-icard-text.halley-opcional-no-disponible", buscar: "Integración con Puma PRIS", tooltip: "Función no disponible en el plan Básico" }
];

(function () {
    function iniciarSistemaDeTooltips() {
        var botonActivo = null;
        var tooltipActivo = null;
        var flechaGlobal = null;
        var tooltipFijadoPorClick = false;
        var aperturaHoverPendiente = null;
        var delayHoverTooltip = 100;
        var margenPantalla = 12;
        var separacionIcono = 10;
        var anchoFlechaHorizontal = 14;
        var altoFlechaHorizontal = 8;
        var anchoFlechaVertical = 8;
        var altoFlechaVertical = 14;
        var margenEsquinas = 18;

        function normalizarTexto(texto) {
            return String(texto || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, " ").trim().toLowerCase();
        }

        function crearIdentificador(indice, textoBuscado) {
            return "halley-tooltip-" + indice + "-" + textoBuscado.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
        }

        function dispositivoAdmiteHover() {
            return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
        }

        function aplicarEstiloImportante(elemento, propiedad, valor) {
            if (!elemento) return;
            elemento.style.setProperty(propiedad, valor, "important");
        }

        function eliminarEstiloInline(elemento, propiedad) {
            if (!elemento) return;
            elemento.style.removeProperty(propiedad);
        }

        function limitar(valor, minimo, maximo) {
            return Math.max(minimo, Math.min(valor, maximo));
        }

        function cancelarAperturaHover() {
            if (aperturaHoverPendiente) {
                window.clearTimeout(aperturaHoverPendiente);
                aperturaHoverPendiente = null;
            }
        }

        function obtenerFlechaGlobal() {
            var flecha = document.querySelector(".halley-tooltip-arrow-fixed");
            if (!flecha) {
                flecha = document.createElement("span");
                flecha.className = "halley-tooltip-arrow-fixed";
                flecha.setAttribute("aria-hidden", "true");
                document.body.appendChild(flecha);
            }
            return flecha;
        }

        function cerrarTooltip() {
            cancelarAperturaHover();
            if (botonActivo) {
                botonActivo.classList.remove("tooltip-activo");
                botonActivo.setAttribute("aria-expanded", "false");
            }
            if (tooltipActivo) {
                tooltipActivo.classList.remove("tooltip-visible", "halley-tooltip-posicion-arriba", "halley-tooltip-posicion-abajo", "halley-tooltip-posicion-izquierda", "halley-tooltip-posicion-derecha");
                aplicarEstiloImportante(tooltipActivo, "display", "none");
                aplicarEstiloImportante(tooltipActivo, "visibility", "hidden");
                eliminarEstiloInline(tooltipActivo, "opacity");
            }
            if (flechaGlobal) {
                flechaGlobal.classList.remove("tooltip-visible", "halley-tooltip-arrow-up", "halley-tooltip-arrow-down", "halley-tooltip-arrow-left", "halley-tooltip-arrow-right");
                aplicarEstiloImportante(flechaGlobal, "display", "none");
                aplicarEstiloImportante(flechaGlobal, "visibility", "hidden");
                aplicarEstiloImportante(flechaGlobal, "opacity", "0");
            }
            botonActivo = null;
            tooltipActivo = null;
            tooltipFijadoPorClick = false;
        }

        function calcularPosiciones(botonRect, anchoTooltip, altoTooltip) {
            var centroHorizontal = botonRect.left + botonRect.width / 2;
            var centroVertical = botonRect.top + botonRect.height / 2;
            return {
                arriba: { lado: "arriba", izquierda: centroHorizontal - anchoTooltip / 2, superior: botonRect.top - altoTooltip - separacionIcono },
                abajo: { lado: "abajo", izquierda: centroHorizontal - anchoTooltip / 2, superior: botonRect.bottom + separacionIcono },
                derecha: { lado: "derecha", izquierda: botonRect.right + separacionIcono, superior: centroVertical - altoTooltip / 2 },
                izquierda: { lado: "izquierda", izquierda: botonRect.left - anchoTooltip - separacionIcono, superior: centroVertical - altoTooltip / 2 }
            };
        }

        function posicionEntraCompleta(posicion, anchoTooltip, altoTooltip) {
            return posicion.izquierda >= margenPantalla && posicion.superior >= margenPantalla && posicion.izquierda + anchoTooltip <= window.innerWidth - margenPantalla && posicion.superior + altoTooltip <= window.innerHeight - margenPantalla;
        }

        function elegirPosicion(botonRect, anchoTooltip, altoTooltip) {
            var posiciones = calcularPosiciones(botonRect, anchoTooltip, altoTooltip);
            var orden = [posiciones.arriba, posiciones.abajo, posiciones.derecha, posiciones.izquierda];
            for (var i = 0; i < orden.length; i++) {
                if (posicionEntraCompleta(orden[i], anchoTooltip, altoTooltip)) return orden[i];
            }
            var espacios = { arriba: botonRect.top, abajo: window.innerHeight - botonRect.bottom, derecha: window.innerWidth - botonRect.right, izquierda: botonRect.left };
            var lado = Object.keys(espacios).sort(function (a, b) { return espacios[b] - espacios[a]; })[0];
            return posiciones[lado];
        }

        function ajustarPosicion(posicion, anchoTooltip, altoTooltip) {
            return {
                lado: posicion.lado,
                izquierda: limitar(posicion.izquierda, margenPantalla, window.innerWidth - anchoTooltip - margenPantalla),
                superior: limitar(posicion.superior, margenPantalla, window.innerHeight - altoTooltip - margenPantalla)
            };
        }

        function posicionarFlecha(botonRect, tooltipRect, lado) {
            var centroHorizontal = botonRect.left + botonRect.width / 2;
            var centroVertical = botonRect.top + botonRect.height / 2;
            var izquierda = 0;
            var superior = 0;
            flechaGlobal.classList.remove("halley-tooltip-arrow-up", "halley-tooltip-arrow-down", "halley-tooltip-arrow-left", "halley-tooltip-arrow-right");
            if (lado === "arriba") {
                var centroX = limitar(centroHorizontal, tooltipRect.left + margenEsquinas, tooltipRect.right - margenEsquinas);
                izquierda = centroX - anchoFlechaHorizontal / 2;
                superior = tooltipRect.bottom - 1;
                flechaGlobal.classList.add("halley-tooltip-arrow-down");
            } else if (lado === "abajo") {
                var centroXAbajo = limitar(centroHorizontal, tooltipRect.left + margenEsquinas, tooltipRect.right - margenEsquinas);
                izquierda = centroXAbajo - anchoFlechaHorizontal / 2;
                superior = tooltipRect.top - altoFlechaHorizontal + 1;
                flechaGlobal.classList.add("halley-tooltip-arrow-up");
            } else if (lado === "derecha") {
                var centroY = limitar(centroVertical, tooltipRect.top + margenEsquinas, tooltipRect.bottom - margenEsquinas);
                izquierda = tooltipRect.left - anchoFlechaVertical + 1;
                superior = centroY - altoFlechaVertical / 2;
                flechaGlobal.classList.add("halley-tooltip-arrow-left");
            } else if (lado === "izquierda") {
                var centroYIzquierda = limitar(centroVertical, tooltipRect.top + margenEsquinas, tooltipRect.bottom - margenEsquinas);
                izquierda = tooltipRect.right - 1;
                superior = centroYIzquierda - altoFlechaVertical / 2;
                flechaGlobal.classList.add("halley-tooltip-arrow-right");
            }
            aplicarEstiloImportante(flechaGlobal, "display", "block");
            aplicarEstiloImportante(flechaGlobal, "position", "fixed");
            aplicarEstiloImportante(flechaGlobal, "left", izquierda + "px");
            aplicarEstiloImportante(flechaGlobal, "top", superior + "px");
            aplicarEstiloImportante(flechaGlobal, "visibility", "visible");
            aplicarEstiloImportante(flechaGlobal, "opacity", "1");
            flechaGlobal.classList.add("tooltip-visible");
        }

        function posicionarTooltip() {
            if (!tooltipActivo || !botonActivo) return;
            var botonRect = botonActivo.getBoundingClientRect();
            aplicarEstiloImportante(tooltipActivo, "display", "block");
            aplicarEstiloImportante(tooltipActivo, "position", "fixed");
            aplicarEstiloImportante(tooltipActivo, "visibility", "hidden");
            aplicarEstiloImportante(tooltipActivo, "left", "0px");
            aplicarEstiloImportante(tooltipActivo, "top", "0px");
            eliminarEstiloInline(tooltipActivo, "opacity");
            var medicion = tooltipActivo.getBoundingClientRect();
            var posicion = elegirPosicion(botonRect, medicion.width, medicion.height);
            posicion = ajustarPosicion(posicion, medicion.width, medicion.height);
            aplicarEstiloImportante(tooltipActivo, "left", posicion.izquierda + "px");
            aplicarEstiloImportante(tooltipActivo, "top", posicion.superior + "px");
            var tooltipRect = tooltipActivo.getBoundingClientRect();
            posicionarFlecha(botonRect, tooltipRect, posicion.lado);
            aplicarEstiloImportante(tooltipActivo, "visibility", "visible");
            tooltipActivo.classList.remove("tooltip-visible");
            window.requestAnimationFrame(function () {
                if (tooltipActivo) tooltipActivo.classList.add("tooltip-visible");
            });
        }

        function abrirTooltip(boton, tooltip, fijado) {
            if (botonActivo === boton && tooltipFijadoPorClick && fijado) {
                cerrarTooltip();
                return;
            }
            cerrarTooltip();
            botonActivo = boton;
            tooltipActivo = tooltip;
            tooltipFijadoPorClick = fijado;
            flechaGlobal = obtenerFlechaGlobal();
            boton.classList.add("tooltip-activo");
            boton.setAttribute("aria-expanded", "true");
            document.body.appendChild(tooltip);
            document.body.appendChild(flechaGlobal);
            posicionarTooltip();
        }

        function crearTooltips() {
            halleyTooltips.forEach(function (configuracion, indice) {
                var elementos = document.querySelectorAll(configuracion.selector);
                var textoBuscado = normalizarTexto(configuracion.buscar);
                elementos.forEach(function (elemento) {
                    var textoElemento = normalizarTexto(elemento.textContent);
                    if (!textoElemento.includes(textoBuscado)) return;
                    var atributo = "data-halley-tooltip-" + indice;
                    if (elemento.getAttribute(atributo) === "true") return;
                    elemento.setAttribute(atributo, "true");
                    elemento.classList.add("halley-tooltip-item");
                    var identificador = crearIdentificador(indice, textoBuscado);
                    var boton = document.createElement("button");
                    boton.type = "button";
                    boton.className = "halley-tooltip-trigger";
                    boton.setAttribute("aria-expanded", "false");
                    boton.innerHTML = `<svg class="halley-tooltip-icon" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><circle class="halley-tooltip-icon-circle" cx="8" cy="8" r="6.5"></circle><line class="halley-tooltip-icon-line" x1="8" y1="7" x2="8" y2="11"></line><circle class="halley-tooltip-icon-dot" cx="8" cy="4.8" r="0.7"></circle></svg>`;
                    var tooltip = document.createElement("span");
                    tooltip.className = "halley-tooltip-box";
                    tooltip.id = identificador + "-contenido";
                    tooltip.setAttribute("role", "tooltip");
                    tooltip.textContent = configuracion.tooltip;
                    aplicarEstiloImportante(tooltip, "display", "none");
                    boton.appendChild(tooltip);
                    elemento.appendChild(boton);

                    boton.addEventListener("click", function (evento) {
                        evento.preventDefault();
                        evento.stopPropagation();
                        cancelarAperturaHover();
                        abrirTooltip(boton, tooltip, true);
                    });

                    boton.addEventListener("mouseenter", function () {
                        if (!dispositivoAdmiteHover()) return;
                        cancelarAperturaHover();
                        aperturaHoverPendiente = window.setTimeout(function () {
                            aperturaHoverPendiente = null;
                            if (boton.matches(":hover") && dispositivoAdmiteHover()) {
                                abrirTooltip(boton, tooltip, false);
                            }
                        }, delayHoverTooltip);
                    });

                    boton.addEventListener("mouseleave", function () {
                        cancelarAperturaHover();
                        if (!tooltipFijadoPorClick) cerrarTooltip();
                    });
                });
            });
        }

        crearTooltips();
        var creacionPendiente = false;
        var observador = new MutationObserver(function () {
            if (creacionPendiente) return;
            creacionPendiente = true;
            window.requestAnimationFrame(function () {
                creacionPendiente = false;
                crearTooltips();
            });
        });
        observador.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["class"] });
        document.addEventListener("scroll", function () { if (tooltipActivo) cerrarTooltip(); }, true);
        window.addEventListener("resize", cerrarTooltip);
        document.addEventListener("click", function (evento) {
            if (!tooltipActivo) return;
            if (botonActivo && botonActivo.contains(evento.target)) return;
            cerrarTooltip();
        });
        document.addEventListener("keydown", function (evento) { if (evento.key === "Escape") cerrarTooltip(); });
    }
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciarSistemaDeTooltips);
    else iniciarSistemaDeTooltips();
})();

/* ##################################################
   06. HALLEY UI — CONFIGURACIÓN
   DE PRECIOS Y FUNCIONES
################################################## */

var halleyConfiguracionPlanes = [
    { plan: "premium", buscarSheet: "V2 Premium" },
    { plan: "plus", buscarSheet: "V2 Plus" },
    { plan: "basico", buscarSheet: "V2 Básico" }
];

var halleyFuncionesOpcionales = [
    { buscar: "Puesto de trabajo adicional", buscarSheet: "Puesto adicional", precio: "puestoAdicional", disponibleEnBasico: true, aclaracionPrecio: "(Cada uno)" },
    { buscar: "Integración con Controlador de Surtidores", buscarSheet: "Interfaz c/contr. surt", precio: "controladorSurtidores", disponibleEnBasico: false, aclaracionPrecio: "" },
    { buscar: "Integración con ON Axion", buscarSheet: "App Axion", precio: "onAxion", disponibleEnBasico: false, aclaracionPrecio: "" },
    { buscar: "Integración con Puma PRIS", buscarSheet: "App Puma", precio: "pumaPris", disponibleEnBasico: false, aclaracionPrecio: "" }
];

/* ##################################################
   07. HALLEY UI — CARGA Y APLICACIÓN DE PRECIOS
################################################## */

(function () {
    var halleyConsultaPrecios = (function () {
        var controlador = new AbortController();
        var timeout = window.setTimeout(function () { controlador.abort(); }, 8000);
        return fetch(HALLEY_GOOGLE_SHEET_CSV, { method: "GET", cache: "no-store", signal: controlador.signal })
            .then(function (respuesta) {
                if (!respuesta.ok) throw new Error("Google Sheets respondió con estado " + respuesta.status);
                return respuesta.text();
            })
            .then(function (csv) {
                window.clearTimeout(timeout);
                return { correcto: true, csv: csv, error: null };
            })
            .catch(function (error) {
                window.clearTimeout(timeout);
                return { correcto: false, csv: null, error: error };
            });
    })();

    function iniciarSistemaDePrecios() {
        function normalizarTexto(texto) {
            return String(texto || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, " ").trim().toLowerCase();
        }
        function formatearPrecio(valor) { return new Intl.NumberFormat("es-AR").format(valor); }
        function convertirPrecio(valor) {
            var texto = String(valor || "").trim();
            if (!texto) return null;
            texto = texto.replace(/[^\d.,-]/g, "");
            if (!texto) return null;
            texto = texto.replace(/\./g, "");
            if (texto.includes(",")) texto = texto.split(",")[0];
            var numero = parseInt(texto, 10);
            if (!Number.isFinite(numero) || numero <= 0) return null;
            return numero;
        }
        function parsearCSV(csv) {
            var filas = [], filaActual = [], campoActual = "", dentroDeComillas = false;
            for (var i = 0; i < csv.length; i++) {
                var caracter = csv[i], siguiente = csv[i + 1];
                if (caracter === '"') {
                    if (dentroDeComillas && siguiente === '"') { campoActual += '"'; i++; }
                    else dentroDeComillas = !dentroDeComillas;
                    continue;
                }
                if (caracter === "," && !dentroDeComillas) { filaActual.push(campoActual); campoActual = ""; continue; }
                if ((caracter === "\n" || caracter === "\r") && !dentroDeComillas) {
                    if (caracter === "\r" && siguiente === "\n") i++;
                    filaActual.push(campoActual); campoActual = "";
                    if (filaActual.some(function (celda) { return String(celda).trim() !== ""; })) filas.push(filaActual);
                    filaActual = [];
                    continue;
                }
                campoActual += caracter;
            }
            if (campoActual !== "" || filaActual.length > 0) { filaActual.push(campoActual); filas.push(filaActual); }
            return filas;
        }
        function encontrarFila(filas, textoBuscado) {
            var objetivo = normalizarTexto(textoBuscado);
            for (var i = 0; i < filas.length; i++) for (var j = 0; j < filas[i].length; j++) if (normalizarTexto(filas[i][j]) === objetivo) return filas[i];
            return null;
        }
        function obtenerIndiceNombre(fila, textoBuscado) {
            var objetivo = normalizarTexto(textoBuscado);
            for (var i = 0; i < fila.length; i++) if (normalizarTexto(fila[i]) === objetivo) return i;
            return -1;
        }
        function extraerDatosPlanDeFila(fila, textoBuscado) {
            if (!fila) return null;
            var indiceNombre = obtenerIndiceNombre(fila, textoBuscado);
            if (indiceNombre === -1) return null;
            var mensual = convertirPrecio(fila[indiceNombre + 1]);
            var anual = convertirPrecio(fila[indiceNombre + 2]);
            var ahorroAnual = convertirPrecio(fila[indiceNombre + 3]);
            if (mensual === null || anual === null || ahorroAnual === null) return null;
            return { mensual: mensual, anual: anual, ahorroAnual: ahorroAnual };
        }
        function extraerDatosAdicionalDeFila(fila, textoBuscado) {
            if (!fila) return null;
            var indiceNombre = obtenerIndiceNombre(fila, textoBuscado);
            if (indiceNombre === -1) return null;
            var mensual = convertirPrecio(fila[indiceNombre + 1]);
            var anual = convertirPrecio(fila[indiceNombre + 2]);
            if (mensual === null || anual === null) return null;
            return { mensual: mensual, anual: anual };
        }
        function limpiarPrecios() {
            halleyPrecios.estado = "cargando";
            Object.keys(halleyPrecios.planes).forEach(function (clave) {
                halleyPrecios.planes[clave].mensual = null;
                halleyPrecios.planes[clave].anual = null;
                halleyPrecios.planes[clave].ahorroAnual = null;
            });
            Object.keys(halleyPrecios.adicionales).forEach(function (clave) {
                halleyPrecios.adicionales[clave].mensual = null;
                halleyPrecios.adicionales[clave].anual = null;
            });
        }
        function interpretarGoogleSheet(csv) {
            var filas = parsearCSV(csv);
            if (!filas || filas.length === 0) throw new Error("Google Sheets devolvió un CSV vacío.");
            halleyConfiguracionPlanes.forEach(function (configuracion) {
                var fila = encontrarFila(filas, configuracion.buscarSheet);
                var datos = extraerDatosPlanDeFila(fila, configuracion.buscarSheet);
                if (!datos) throw new Error("Faltan datos válidos para " + configuracion.buscarSheet);
                halleyPrecios.planes[configuracion.plan] = datos;
            });
            halleyFuncionesOpcionales.forEach(function (configuracion) {
                var fila = encontrarFila(filas, configuracion.buscarSheet);
                var datos = extraerDatosAdicionalDeFila(fila, configuracion.buscarSheet);
                if (!datos) throw new Error("Faltan datos válidos para " + configuracion.buscarSheet);
                halleyPrecios.adicionales[configuracion.precio] = datos;
            });
            halleyPrecios.estado = "listo";
        }
        function obtenerPlanDeColumna(columna) {
            var titulo = columna.querySelector("h4.tatsu-pricing-title");
            if (!titulo) return null;
            var nombre = normalizarTexto(titulo.textContent);
            if (nombre.includes("premium")) return "premium";
            if (nombre.includes("plus")) return "plus";
            if (nombre.includes("basico")) return "basico";
            return null;
        }
        function obtenerModalidadDeColumna(columna) {
            if (columna.classList.contains("tatsu-pricing-col-wrap-monthly")) return "mensual";
            if (columna.classList.contains("tatsu-pricing-col-wrap-yearly")) return "anual";
            return null;
        }
        function obtenerElementoAhorroAnual(columna) {
            var candidatos = columna.querySelectorAll("div, p, span"), coincidencias = [];
            candidatos.forEach(function (elemento) {
                var texto = normalizarTexto(elemento.textContent);
                if (texto.includes("ahorras desde") || elemento.classList.contains("halley-ahorro-anual")) coincidencias.push(elemento);
            });
            if (coincidencias.length === 0) return null;
            coincidencias.sort(function (a, b) { return a.querySelectorAll("*").length - b.querySelectorAll("*").length; });
            var elemento = coincidencias[0];
            elemento.classList.add("halley-ahorro-anual");
            return elemento;
        }
        function marcarElementosAhorro() {
            document.querySelectorAll("#planesHalley .tatsu-pricing-col-wrap-yearly").forEach(function (columna) { obtenerElementoAhorroAnual(columna); });
        }
        function aplicarAhorrosAnuales() {
            document.querySelectorAll("#planesHalley .tatsu-pricing-col-wrap-yearly").forEach(function (columna) {
                var plan = obtenerPlanDeColumna(columna); if (!plan) return;
                var elemento = obtenerElementoAhorroAnual(columna); if (!elemento || halleyPrecios.estado === "cargando") return;
                var ahorro = halleyPrecios.planes[plan].ahorroAnual;
                elemento.textContent = typeof ahorro === "number" ? "(Ahorrás desde $" + formatearPrecio(ahorro) + " netos al año)" : "(Ahorro anual: Sin datos)";
            });
        }
        function aplicarPreciosPlanes() {
            document.querySelectorAll("#planesHalley .tatsu-pricing-col-wrap").forEach(function (columna) {
                var plan = obtenerPlanDeColumna(columna), modalidad = obtenerModalidadDeColumna(columna);
                if (!plan || !modalidad) return;
                var elementoPrecio = columna.querySelector("h3.tatsu-pricing-title");
                if (!elementoPrecio || halleyPrecios.estado === "cargando") return;
                var valor = halleyPrecios.planes[plan][modalidad];
                elementoPrecio.textContent = typeof valor === "number" ? "$" + formatearPrecio(valor) + " + IVA" : "Sin datos";
            });
        }
        function obtenerConfiguracionFuncion(item) {
            var texto = normalizarTexto(item.textContent);
            for (var i = 0; i < halleyFuncionesOpcionales.length; i++) if (texto.includes(normalizarTexto(halleyFuncionesOpcionales[i].buscar))) return halleyFuncionesOpcionales[i];
            return null;
        }
        function obtenerFilaItem(item) { return item.closest(".tatsu-pricing-icard") || item.parentElement; }
        function aplicarAclaracionPrecio(item, precioExistente, configuracion) {
            var textoAclaracion = String(configuracion.aclaracionPrecio || "").trim();
            var aclaraciones = item.querySelectorAll(".halley-precio-aclaracion");
            var aclaracion = aclaraciones.length > 0 ? aclaraciones[0] : null;
            for (var i = 1; i < aclaraciones.length; i++) aclaraciones[i].remove();
            if (!textoAclaracion) { if (aclaracion) aclaracion.remove(); return; }
            if (!aclaracion) {
                aclaracion = document.createElement("span");
                aclaracion.className = "halley-precio-aclaracion";
                precioExistente.insertAdjacentElement("afterend", aclaracion);
            } else if (aclaracion.previousElementSibling !== precioExistente) precioExistente.insertAdjacentElement("afterend", aclaracion);
            var textoFinal = " " + textoAclaracion;
            if (aclaracion.textContent !== textoFinal) aclaracion.textContent = textoFinal;
            aclaracion.style.setProperty("font-weight", "300", "important");
            aclaracion.style.setProperty("font-variation-settings", '"wght" 300', "important");
            aclaracion.style.setProperty("font-size", "inherit", "important");
            aclaracion.style.setProperty("font-family", "inherit", "important");
            aclaracion.style.setProperty("font-style", "normal", "important");
            aclaracion.style.setProperty("line-height", "inherit", "important");
            aclaracion.style.setProperty("color", "inherit", "important");
            aclaracion.style.setProperty("white-space", "normal", "important");
        }
        function aplicarPreciosFuncionesOpcionales() {
            document.querySelectorAll("#planesHalley .tatsu-pricing-icard-text").forEach(function (item) {
                var configuracion = obtenerConfiguracionFuncion(item); if (!configuracion) return;
                var columna = item.closest(".tatsu-pricing-col-wrap"); if (!columna) return;
                var plan = obtenerPlanDeColumna(columna), modalidad = obtenerModalidadDeColumna(columna); if (!plan || !modalidad) return;
                var fila = obtenerFilaItem(item);
                var precios = item.querySelectorAll(".halley-precio-opcional");
                var precioExistente = precios.length > 0 ? precios[0] : null;
                for (var p = 1; p < precios.length; p++) precios[p].remove();
                if (!precioExistente) {
                    precioExistente = document.createElement("span");
                    precioExistente.className = "halley-precio-opcional";
                    item.appendChild(document.createTextNode(" "));
                    item.appendChild(precioExistente);
                }
                var valor = halleyPrecios.adicionales[configuracion.precio][modalidad];
                if (halleyPrecios.estado !== "cargando") precioExistente.textContent = typeof valor === "number" ? "$" + formatearPrecio(valor) + " + IVA Extra / MES" : "Sin datos";
                aplicarAclaracionPrecio(item, precioExistente, configuracion);
                var disponible = !(plan === "basico" && configuracion.disponibleEnBasico === false);
                if (!disponible) {
                    item.classList.remove("halley-opcional-disponible");
                    item.classList.add("halley-opcional-no-disponible");
                    if (fila) { fila.classList.remove("halley-fila-opcional-disponible"); fila.classList.add("halley-fila-opcional-no-disponible"); }
                    return;
                }
                item.classList.remove("halley-opcional-no-disponible");
                item.classList.add("halley-opcional-disponible");
                if (fila) { fila.classList.remove("halley-fila-opcional-no-disponible"); fila.classList.add("halley-fila-opcional-disponible"); }
            });
        }
        function aplicarTodosLosPrecios() { marcarElementosAhorro(); aplicarPreciosPlanes(); aplicarAhorrosAnuales(); aplicarPreciosFuncionesOpcionales(); }
        function prepararCargaVisual() { marcarElementosAhorro(); aplicarPreciosFuncionesOpcionales(); }
        function mostrarPrecios() { document.documentElement.classList.remove("halley-precios-cargando"); document.documentElement.classList.add("halley-precios-resueltos"); }
        function establecerErrorDePrecios() { limpiarPrecios(); halleyPrecios.estado = "error"; aplicarTodosLosPrecios(); mostrarPrecios(); }
        function cargarPreciosDesdeGoogleSheets() {
            limpiarPrecios();
            halleyConsultaPrecios.then(function (resultado) {
                if (!resultado.correcto) { establecerErrorDePrecios(); console.error("[Halley] No fue posible obtener los precios desde Google Sheets:", resultado.error); return; }
                try {
                    limpiarPrecios();
                    interpretarGoogleSheet(resultado.csv);
                    aplicarTodosLosPrecios();
                    window.requestAnimationFrame(function () { mostrarPrecios(); });
                } catch (error) {
                    establecerErrorDePrecios();
                    console.error("[Halley] No fue posible interpretar los precios desde Google Sheets:", error);
                }
            });
        }
        prepararCargaVisual();
        cargarPreciosDesdeGoogleSheets();
        var aplicacionPendiente = false;
        var observador = new MutationObserver(function (mutaciones) {
            var soloCambiosPropios = mutaciones.length > 0 && mutaciones.every(function (mutacion) {
                var agregados = Array.prototype.slice.call(mutacion.addedNodes);
                if (agregados.length === 0) return false;
                return agregados.every(function (nodo) {
                    if (nodo.nodeType !== 1) return false;
                    return nodo.classList.contains("halley-precio-opcional") || nodo.classList.contains("halley-precio-aclaracion");
                });
            });
            if (soloCambiosPropios || aplicacionPendiente) return;
            aplicacionPendiente = true;
            window.requestAnimationFrame(function () { aplicacionPendiente = false; aplicarTodosLosPrecios(); });
        });
        observador.observe(document.body, { childList: true, subtree: true });
        window.setTimeout(aplicarTodosLosPrecios, 150);
        window.setTimeout(aplicarTodosLosPrecios, 400);
        window.setTimeout(aplicarTodosLosPrecios, 900);
        window.setTimeout(aplicarTodosLosPrecios, 1500);
    }
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciarSistemaDePrecios);
    else iniciarSistemaDePrecios();
})();

/* ##################################################
   08. HALLEY UI — NORMALIZACIÓN ROBUSTA
   DE TABLA DE PLANES
################################################## */

(function () {
    function iniciarNormalizacionTablaPlanes() {
        function normalizarTexto(texto) { return String(texto || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, " ").trim().toLowerCase(); }
        function buscarElementoPorTexto(columna, textoObjetivo) {
            var objetivo = normalizarTexto(textoObjetivo);
            var selectoresPreferidos = ["a", "button", '[role="button"]', ".tatsu-pricing-button", ".tatsu-pricing-button-wrap", '[class*="button"]'];
            var candidatos = columna.querySelectorAll(selectoresPreferidos.join(","));
            for (var i = 0; i < candidatos.length; i++) if (normalizarTexto(candidatos[i].textContent) === objetivo) return candidatos[i];
            var todos = columna.querySelectorAll("*"), mejor = null, menorCantidadDescendientes = Infinity;
            for (var j = 0; j < todos.length; j++) {
                if (normalizarTexto(todos[j].textContent) !== objetivo) continue;
                var cantidad = todos[j].querySelectorAll("*").length;
                if (cantidad < menorCantidadDescendientes) { mejor = todos[j]; menorCantidadDescendientes = cantidad; }
            }
            return mejor;
        }
        function obtenerWrapperAccion(elemento, columna) {
            if (!elemento) return null;
            var wrapper = elemento.closest(".tatsu-pricing-button-wrap");
            if (wrapper && columna.contains(wrapper)) return wrapper;
            var actual = elemento, textoElemento = normalizarTexto(elemento.textContent);
            while (actual && actual.parentElement && actual.parentElement !== columna) {
                var padre = actual.parentElement;
                if (normalizarTexto(padre.textContent) === textoElemento) actual = padre; else break;
            }
            return actual;
        }
        function obtenerInteractivo(elemento, wrapper) {
            if (!elemento) return null;
            if (elemento.matches('a, button, [role="button"], .tatsu-pricing-button')) return elemento;
            if (wrapper) {
                var encontrado = wrapper.querySelector('a, button, [role="button"], .tatsu-pricing-button');
                if (encontrado) return encontrado;
            }
            return elemento;
        }
        function limpiarClasesAcciones(columna) {
            columna.querySelectorAll(".halley-wrap-contratar, .halley-boton-contratar, .halley-accion-requerimientos, .halley-accion-mas-funciones, .halley-accion-ayuda, .halley-accion-simulador, .halley-link-requerimientos, .halley-link-mas-funciones, .halley-link-ayuda, .halley-link-simulador").forEach(function (elemento) {
                elemento.classList.remove("halley-wrap-contratar", "halley-boton-contratar", "halley-accion-requerimientos", "halley-accion-mas-funciones", "halley-accion-ayuda", "halley-accion-simulador", "halley-link-requerimientos", "halley-link-mas-funciones", "halley-link-ayuda", "halley-link-simulador");
            });
        }
        function clasificarAccion(columna, texto, claseWrapper, claseInteractivo) {
            var encontrado = buscarElementoPorTexto(columna, texto); if (!encontrado) return null;
            var wrapper = obtenerWrapperAccion(encontrado, columna), interactivo = obtenerInteractivo(encontrado, wrapper);
            if (wrapper) wrapper.classList.add(claseWrapper);
            if (interactivo) interactivo.classList.add(claseInteractivo);
            return { elemento: encontrado, wrapper: wrapper, interactivo: interactivo };
        }
        function crearSeparadorAcciones(columna, accionRequerimientos) {
            columna.querySelectorAll(".halley-separador-acciones").forEach(function (separador) { separador.remove(); });
            if (!accionRequerimientos || !accionRequerimientos.wrapper || !accionRequerimientos.wrapper.parentNode) return;
            var separador = document.createElement("div");
            separador.className = "halley-separador-acciones";
            separador.setAttribute("aria-hidden", "true");
            accionRequerimientos.wrapper.parentNode.insertBefore(separador, accionRequerimientos.wrapper);
        }
        function clasificarContratar(columna) {
            var encontrado = buscarElementoPorTexto(columna, "Contratar"); if (!encontrado) return;
            var wrapper = obtenerWrapperAccion(encontrado, columna), interactivo = obtenerInteractivo(encontrado, wrapper);
            if (wrapper) wrapper.classList.add("halley-wrap-contratar");
            if (interactivo) interactivo.classList.add("halley-boton-contratar");
        }
        function clasificarBloqueInferior(columna) {
            var requerimientos = clasificarAccion(columna, "Requerimientos Técnicos", "halley-accion-requerimientos", "halley-link-requerimientos");
            clasificarAccion(columna, "Ver Más Funciones", "halley-accion-mas-funciones", "halley-link-mas-funciones");
            clasificarAccion(columna, "¿Necesitás Ayuda?", "halley-accion-ayuda", "halley-link-ayuda");
            clasificarAccion(columna, "Simulá El Precio De Tu Plan", "halley-accion-simulador", "halley-link-simulador");
            crearSeparadorAcciones(columna, requerimientos);
        }
        function normalizarPath(path) { return String(path || "").replace(/[\s,]+/g, "").toLowerCase(); }
        var pathIconoX = normalizarPath("M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z");
        function esIconoX(svg) {
            if (!svg) return false;
            var paths = svg.querySelectorAll("path");
            for (var i = 0; i < paths.length; i++) if (normalizarPath(paths[i].getAttribute("d")) === pathIconoX) return true;
            return false;
        }
        function esFuncionOpcional(texto) {
            var normalizado = normalizarTexto(texto);
            return ["puesto de trabajo adicional", "integracion con controlador de surtidores", "integracion con on axion", "integracion con puma pris"].some(function (opcional) { return normalizado.includes(opcional); });
        }
        function obtenerFilaFuncion(texto) {
            if (!texto) return null;
            var padre = texto.parentElement;
            if (padre && padre.querySelector("svg")) return padre;
            var actual = padre, niveles = 0;
            while (actual && niveles < 4) {
                if (actual.querySelector("svg") && actual.contains(texto)) return actual;
                actual = actual.parentElement; niveles++;
            }
            return null;
        }
        function filaTieneIconoX(fila) {
            if (!fila) return false;
            var svgs = fila.querySelectorAll("svg");
            for (var i = 0; i < svgs.length; i++) if (esIconoX(svgs[i])) return true;
            return false;
        }
        function limpiarFuncionesBase(columna) {
            columna.querySelectorAll(".halley-funcion-base-no-disponible").forEach(function (fila) { fila.classList.remove("halley-funcion-base-no-disponible"); });
            columna.querySelectorAll(".halley-funcion-base-no-disponible-texto").forEach(function (texto) { texto.classList.remove("halley-funcion-base-no-disponible-texto"); });
        }
        function clasificarFuncionesBase(columna) {
            limpiarFuncionesBase(columna);
            columna.querySelectorAll(".tatsu-pricing-icard-text").forEach(function (texto) {
                if (esFuncionOpcional(texto.textContent)) return;
                if (!normalizarTexto(texto.textContent)) return;
                var fila = obtenerFilaFuncion(texto);
                if (!fila || !filaTieneIconoX(fila)) return;
                fila.classList.add("halley-funcion-base-no-disponible");
                texto.classList.add("halley-funcion-base-no-disponible-texto");
            });
        }
        function normalizarColumna(columna) {
            limpiarClasesAcciones(columna);
            clasificarContratar(columna);
            clasificarBloqueInferior(columna);
            clasificarFuncionesBase(columna);
        }
        function normalizarTablaPlanes() {
            var tabla = document.querySelector("#planesHalley");
            if (!tabla) return;
            tabla.querySelectorAll(".tatsu-pricing-col-wrap").forEach(function (columna) { normalizarColumna(columna); });
        }
        normalizarTablaPlanes();
        var pendiente = false;
        var observador = new MutationObserver(function (mutaciones) {
            var soloCambiosHalley = mutaciones.length > 0 && mutaciones.every(function (mutacion) {
                if (mutacion.type !== "childList") return false;
                var nodos = Array.prototype.slice.call(mutacion.addedNodes);
                if (nodos.length === 0) return false;
                return nodos.every(function (nodo) { return nodo.nodeType === 1 && nodo.classList && nodo.classList.contains("halley-separador-acciones"); });
            });
            if (soloCambiosHalley || pendiente) return;
            pendiente = true;
            window.requestAnimationFrame(function () { pendiente = false; normalizarTablaPlanes(); });
        });
        var tabla = document.querySelector("#planesHalley");
        if (tabla) observador.observe(tabla, { childList: true, subtree: true });
        window.setTimeout(normalizarTablaPlanes, 150);
        window.setTimeout(normalizarTablaPlanes, 400);
        window.setTimeout(normalizarTablaPlanes, 800);
        window.setTimeout(normalizarTablaPlanes, 1400);
    }
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciarNormalizacionTablaPlanes);
    else iniciarNormalizacionTablaPlanes();
})();
